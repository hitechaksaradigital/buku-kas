import { db } from "@/db";
import { transactions, categories, accounts } from "@/db/schema";
import { eq, desc, sql, and, SQL } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import TransactionFilters from "@/components/TransactionFilters";
import TransactionTable from "@/components/TransactionTable";
import PageActions from "@/components/PageActions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page || "1"));
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const categoryId = typeof params.categoryId === "string" ? params.categoryId : undefined;
  const accountId = typeof params.accountId === "string" ? params.accountId : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;

  const conditions: SQL[] = [];
  if (categoryId) {
    conditions.push(eq(transactions.categoryId, Number(categoryId)));
  }
  if (accountId) {
    conditions.push(eq(transactions.accountId, Number(accountId)));
  }
  if (type && (type === "income" || type === "expense" || type === "transfer")) {
    conditions.push(eq(transactions.type, type));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countResult, allAccounts, allCategories] = await Promise.all([
    db
      .select({
        id: transactions.id,
        date: transactions.date,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        categoryName: categories.name,
        categoryIcon: categories.icon,
        accountName: accounts.name,
        isRecurring: transactions.isRecurring,
        hasAttachment: transactions.hasAttachment,
        fromAccountId: transactions.fromAccountId,
        toAccountId: transactions.toAccountId,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(whereClause)
      .orderBy(desc(transactions.date))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(transactions)
      .where(whereClause),
    db.select().from(accounts).orderBy(accounts.name),
    db.select().from(categories).orderBy(categories.name),
  ]);

  // Enrich transfer rows with account names
  const enrichedRows = await Promise.all(
    rows.map(async (row) => {
      let fromAccountName: string | null = null;
      let toAccountName: string | null = null;

      if (row.type === "transfer") {
        if (row.fromAccountId) {
          const fromAcc = await db
            .select({ name: accounts.name })
            .from(accounts)
            .where(eq(accounts.id, row.fromAccountId))
            .limit(1);
          fromAccountName = fromAcc[0]?.name ?? null;
        }
        if (row.toAccountId) {
          const toAcc = await db
            .select({ name: accounts.name })
            .from(accounts)
            .where(eq(accounts.id, row.toAccountId))
            .limit(1);
          toAccountName = toAcc[0]?.name ?? null;
        }
      }

      return {
        id: row.id,
        date: row.date.toISOString(),
        description: row.description,
        amount: row.amount,
        type: row.type,
        categoryName: row.categoryName,
        categoryIcon: row.categoryIcon,
        accountName: row.accountName,
        isRecurring: row.isRecurring,
        hasAttachment: row.hasAttachment,
        fromAccountName,
        toAccountName,
      };
    })
  );

  const totalCount = countResult[0]?.count ?? 0;

  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
        <Header />
        <div className="p-6 max-w-[1280px] mx-auto w-full">
          {/* Page Header & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-on-surface mb-1">
                Riwayat Transaksi
              </h2>
              <p className="text-[16px] leading-[24px] text-on-surface-variant">
                Kelola dan pantau semua arus kas masuk dan keluar bisnis Anda.
              </p>
            </div>
            <PageActions
              accounts={allAccounts.map((a) => ({ id: a.id, name: a.name }))}
            />
          </div>

          {/* Filters */}
          <TransactionFilters
            accounts={allAccounts.map((a) => ({ id: a.id, name: a.name }))}
            categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
          />

          {/* Transaction Table */}
          <TransactionTable
            transactions={enrichedRows}
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
