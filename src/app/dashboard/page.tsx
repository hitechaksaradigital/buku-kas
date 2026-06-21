import { db } from "@/db";
import { transactions, accounts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [allAccounts, incomeResult, expenseResult, txCount] = await Promise.all([
    db.select().from(accounts).orderBy(accounts.name),
    db
      .select({ total: sql<number>`coalesce(sum(amount), 0)::int` })
      .from(transactions)
      .where(eq(transactions.type, "income")),
    db
      .select({ total: sql<number>`coalesce(sum(amount), 0)::int` })
      .from(transactions)
      .where(eq(transactions.type, "expense")),
    db.select({ count: sql<number>`count(*)::int` }).from(transactions),
  ]);

  const totalIncome = incomeResult[0]?.total ?? 0;
  const totalExpense = expenseResult[0]?.total ?? 0;
  const totalBalance = allAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalTx = txCount[0]?.count ?? 0;

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID").format(amount);
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

          {/* Summary Cards */}
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
                <span className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </span>
                <span className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                  Total Pemasukan
                </span>
              </div>
              <p className="text-[36px] leading-[44px] tracking-[-0.03em] font-bold text-green-accent">
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

          {/* Accounts */}
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:opacity-90 transition-all shadow-md"
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
