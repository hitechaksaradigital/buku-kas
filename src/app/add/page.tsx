import { db } from "@/db";
import { accounts, categories } from "@/db/schema";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import AddTransactionForm from "@/components/AddTransactionForm";

export const dynamic = "force-dynamic";

export default async function AddTransactionPage() {
  const [allAccounts, allCategories] = await Promise.all([
    db.select().from(accounts).orderBy(accounts.name),
    db.select().from(categories).orderBy(categories.name),
  ]);

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
          <AddTransactionForm
            accounts={allAccounts.map((a) => ({ id: a.id, name: a.name }))}
            categories={allCategories.map((c) => ({
              id: c.id,
              name: c.name,
              type: c.type,
            }))}
          />
        </div>
      </main>
      <MobileNav />
    </>
  );
}
