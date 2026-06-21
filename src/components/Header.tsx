"use client";

import { useState } from "react";

export default function Header({ onSearch }: { onSearch?: (q: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <header className="flex justify-between items-center w-full px-8 h-16 sticky top-0 z-50 bg-surface-container-lowest border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
          Buku Kas Digital
        </span>
        <div className="hidden lg:flex items-center bg-surface-container-low px-3 py-1.5 rounded-full border border-outline-variant">
          <span className="material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-[14px] leading-[20px] w-48 pl-2"
            placeholder="Cari transaksi..."
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-primary text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          Switch Kas
        </button>
        <div className="flex items-center gap-2 border-l border-outline-variant pl-4">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
            notifications
          </span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">
            help
          </span>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary ml-2 bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[20px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
