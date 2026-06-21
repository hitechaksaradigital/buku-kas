"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", filled: false },
  { href: "/", icon: "receipt_long", label: "Transactions", filled: true },
  { href: "/debts", icon: "account_balance", label: "Debts/Receivables", filled: false },
  { href: "/reports", icon: "analytics", label: "Reports/Analytics", filled: false },
  { href: "/settings", icon: "settings", label: "Settings/Team", filled: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full flex-col py-8 z-40 bg-surface border-r border-outline-variant w-64 hidden md:flex">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined filled text-white">
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="text-[20px] leading-[28px] font-bold text-primary">
            Main Cash Book
          </h1>
          <p className="text-[14px] leading-[20px] text-on-surface-variant">
            Business Account
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "text-primary font-bold bg-primary-container/10"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "filled" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        <Link
          href="/add"
          className="w-full bg-primary-container hover:bg-primary text-white py-3 rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold flex items-center justify-center gap-2 mb-6 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Transaction
        </Link>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold">
            Support
          </span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold">
            Log Out
          </span>
        </a>
      </div>
    </aside>
  );
}
