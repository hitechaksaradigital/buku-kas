"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface TransactionFiltersProps {
  accounts: Account[];
  categories: Category[];
}

export default function TransactionFilters({ accounts, categories }: TransactionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState(searchParams.get("dateRange") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [accountId, setAccountId] = useState(searchParams.get("accountId") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  function applyFilters() {
    const params = new URLSearchParams();
    if (dateRange) params.set("dateRange", dateRange);
    if (categoryId) params.set("categoryId", categoryId);
    if (accountId) params.set("accountId", accountId);
    if (type) params.set("type", type);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-sm mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
            Rentang Tanggal
          </label>
          <div className="flex items-center gap-2 bg-surface p-2 rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-outline text-[20px]">
              calendar_today
            </span>
            <input
              className="bg-transparent border-none focus:ring-0 focus:outline-none text-[14px] leading-[20px] w-full"
              type="text"
              placeholder="01 Jan 2024 - 31 Jan 2024"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
            Kategori
          </label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-lg text-[14px] leading-[20px] p-2 focus:border-primary focus:ring-1 focus:ring-primary"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
            Akun / Kas
          </label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-lg text-[14px] leading-[20px] p-2 focus:border-primary focus:ring-1 focus:ring-primary"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            <option value="">Semua Akun</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
            Tipe Transaksi
          </label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-lg text-[14px] leading-[20px] p-2 focus:border-primary focus:ring-1 focus:ring-primary"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Semua Tipe</option>
            <option value="income">Pemasukan (Income)</option>
            <option value="expense">Pengeluaran (Expense)</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={applyFilters}
            className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[14px] leading-[20px] tracking-[0.05em] font-semibold py-2.5 rounded-lg transition-colors border border-outline-variant flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">filter_list</span>
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}
