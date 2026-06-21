"use client";

import { useState } from "react";
import TransferModal from "./TransferModal";

interface Account {
  id: number;
  name: string;
}

export default function PageActions({ accounts }: { accounts: Account[] }) {
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setTransferOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-lowest border border-primary text-primary text-[14px] leading-[20px] tracking-[0.05em] font-semibold rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <span className="material-symbols-outlined">sync_alt</span>
          Transfer Antar Kas
        </button>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-[14px] leading-[20px] tracking-[0.05em] font-semibold rounded-xl hover:bg-primary-container transition-all shadow-md">
          <span className="material-symbols-outlined">download</span>
          Ekspor Laporan
        </button>
      </div>

      <TransferModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        accounts={accounts}
      />
    </>
  );
}
