"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import AddTransactionForm from "@/components/AddTransactionForm";

export default function AddTransactionPage() {
  const [accounts, setAccounts] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [accRes, catRes] = await Promise.all([
        supabase.from("accounts").select("id, name").order("name"),
        supabase.from("categories").select("id, name, type").order("name"),
      ]);
      setAccounts(accRes.data ?? []);
      setCategories(catRes.data ?? []);
      setLoading(false);
    }
    fetchData();
  }, []);

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
              Tambah Transaksi
            </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Catat transaksi baru ke dalam buku kas Anda.
            </p>
          </div>
          <AddTransactionForm accounts={accounts} categories={categories} />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
