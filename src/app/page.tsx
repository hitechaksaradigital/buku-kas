"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TransactionFilters from "@/components/TransactionFilters";
import TransactionTable from "@/components/TransactionTable";
import PageActions from "@/components/PageActions";

interface EnrichedTransaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  categoryName: string | null;
  categoryIcon: string | null;
  accountName: string | null;
  isRecurring: number;
  hasAttachment: number;
  fromAccountName: string | null;
  toAccountName: string | null;
}

function TransactionsContent() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const categoryId = searchParams.get("categoryId") || undefined;
  const accountId = searchParams.get("accountId") || undefined;
  const type = searchParams.get("type") || undefined;

  const [transactions, setTransactions] = useState<EnrichedTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [allAccounts, setAllAccounts] = useState<{ id: number; name: string }[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const [accRes, catRes] = await Promise.all([
        supabase.from("accounts").select("id, name").order("name"),
        supabase.from("categories").select("id, name, icon").order("name"),
      ]);

      if (accRes.error) {
        console.error("Error fetching accounts:", accRes.error);
        setLoading(false);
        return;
      }
      if (catRes.error) {
        console.error("Error fetching categories:", catRes.error);
        setLoading(false);
        return;
      }

      const accs = accRes.data ?? [];
      const cats = catRes.data ?? [];
      setAllAccounts(accs.map((a) => ({ id: a.id, name: a.name })));
      setAllCategories(cats.map((c) => ({ id: c.id, name: c.name })));

      let query = supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .order("date", { ascending: false })
        .range(offset, offset + perPage - 1);

      if (categoryId) query = query.eq("category_id", Number(categoryId));
      if (accountId) query = query.eq("account_id", Number(accountId));
      if (type && ["income", "expense", "transfer"].includes(type))
        query = query.eq("type", type);

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false);
        return;
      }

      const enriched: EnrichedTransaction[] = (data ?? []).map((tx: any) => {
        const cat = cats.find((c) => c.id === tx.category_id);
        const acc = accs.find((a) => a.id === tx.account_id);
        const fromAcc = tx.type === "transfer"
          ? accs.find((a) => a.id === tx.from_account_id)
          : null;
        const toAcc = tx.type === "transfer"
          ? accs.find((a) => a.id === tx.to_account_id)
          : null;

        return {
          id: tx.id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          categoryName: cat?.name ?? null,
          categoryIcon: cat?.icon ?? null,
          accountName: acc?.name ?? null,
          isRecurring: tx.is_recurring,
          hasAttachment: tx.has_attachment,
          fromAccountName: fromAcc?.name ?? null,
          toAccountName: toAcc?.name ?? null,
        };
      });

      setTransactions(enriched);
      setTotalCount(count ?? 0);
      setLoading(false);
    }

    fetchData();
  }, [page, categoryId, accountId, type]);

  if (loading) {
    return (
      <>
        <Sidebar />
        <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
          <Header />
          <div className="p-6 max-w-[1280px] mx-auto w-full">
            <div className="text-center py-12 text-on-surface-variant">
              Memuat data...
            </div>
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-on-surface mb-1">
                Riwayat Transaksi
              </h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant">
                Kelola dan pantau semua arus kas masuk dan keluar bisnis Anda.
              </p>
            </div>
            <PageActions accounts={allAccounts} />
          </div>

          <TransactionFilters accounts={allAccounts} categories={allCategories} />

          <TransactionTable
            transactions={transactions}
            page={page}
            totalCount={totalCount}
            perPage={perPage}
          />
        </div>
      </main>
      <MobileNav />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <TransactionsContent />
    </Suspense>
  );
}
