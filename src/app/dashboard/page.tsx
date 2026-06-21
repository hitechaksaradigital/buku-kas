"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID").format(amount);
}

export default function DashboardPage() {
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalTx, setTotalTx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [accRes, incomeRes, expenseRes, countRes] = await Promise.all([
        supabase.from("accounts").select("*").order("name"),
        supabase.from("transactions").select("amount").eq("type", "income"),
        supabase.from("transactions").select("amount").eq("type", "expense"),
        supabase.from("transactions").select("*", { count: "exact", head: true }),
      ]);

      setAllAccounts(accRes.data ?? []);
      setTotalIncome(incomeRes.data?.reduce((s: number, t: any) => s + t.amount, 0) ?? 0);
      setTotalExpense(expenseRes.data?.reduce((s: number, t: any) => s + t.amount, 0) ?? 0);
      setTotalTx(countRes.count ?? 0);
      setLoading(false);
    }
    fetchData();
  }, []);

  const totalBalance = allAccounts.reduce((sum, a) => sum + a.balance, 0);

  if (loading) {
    return (
      <>
        <Sidebar />
        <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
          <Header />
          <div className="p-6 max-w-[1280px] mx-auto w-full">
            <div className="text-center py-12 text-on-surface-variant">Memuat data...</div>
          </div>
        </main>
        <MobileNav />
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
        <Header />
        <div className="p-6 max-w-[1280px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-on-surface mb-1">
              Dashboard
            </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Ringkasan keuangan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Total Saldo
                </span>
              </div>
              <p className="text-[36px] leading-[44px] tracking-[-0.03em] font-bold text-on-surface">
                Rp {formatCurrency(totalBalance)}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-primary-fixed/30 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Total Pemasukan
                </span>
              </div>
              <p className="text-[36px] leading-[44px] tracking-[-0.03em] font-bold text-primary">
                Rp {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-error-container/20 text-error flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_down</span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Total Pengeluaran
                </span>
              </div>
              <p className="text-[36px] leading-[44px] tracking-[-0.03em] font-bold text-error">
                Rp {formatCurrency(totalExpense)}
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">receipt_long</span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Total Transaksi
                </span>
              </div>
              <p className="text-[36px] leading-[44px] tracking-[-0.03em] font-bold text-on-surface">
                {totalTx}
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface mb-4">
              Daftar Akun / Kas
            </h3>
            <div className="space-y-3">
              {allAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-4 bg-surface rounded-lg border border-outline-variant"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined">account_balance</span>
                    </span>
                    <span className="text-[16px] leading-[24px] font-semibold text-on-surface">
                      {acc.name}
                    </span>
                  </div>
                  <span className="text-[18px] leading-[24px] font-semibold text-on-surface">
                    Rp {formatCurrency(acc.balance)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-primary-container transition-all shadow-md"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              Lihat Semua Transaksi
            </Link>
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
