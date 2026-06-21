import { db } from "@/db";
import { transactions, categories, accounts } from "@/db/schema";
import { eq, desc, sql, and, SQL } from "drizzle-orm";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, Number(searchParams.get("page") || "1"));
  const perPage = 10;
  const offset = (page - 1) * perPage;

  const categoryId = searchParams.get("categoryId");
  const accountId = searchParams.get("accountId");
  const type = searchParams.get("type");

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

  const [rows, countResult] = await Promise.all([
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
  ]);

  // For transfer transactions, fetch account names for from/to
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
        ...row,
        date: row.date.toISOString(),
        fromAccountName,
        toAccountName,
      };
    })
  );

  return Response.json({
    transactions: enrichedRows,
    totalCount: countResult[0]?.count ?? 0,
    page,
    perPage,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, amount, description, date, categoryId, accountId, fromAccountId, toAccountId } = body;

    if (!type || !amount || !description) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(transactions)
      .values({
        type,
        amount: Number(amount),
        description,
        date: new Date(date || Date.now()),
        categoryId: categoryId ? Number(categoryId) : null,
        accountId: accountId ? Number(accountId) : null,
        fromAccountId: type === "transfer" ? Number(fromAccountId) : null,
        toAccountId: type === "transfer" ? Number(toAccountId) : null,
        isRecurring: body.isRecurring ? 1 : 0,
        hasAttachment: body.hasAttachment ? 1 : 0,
        notes: body.notes || null,
      })
      .returning();

    return Response.json({ transaction: inserted }, { status: 201 });
  } catch (err) {
    console.error("Error creating transaction:", err);
    return Response.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
