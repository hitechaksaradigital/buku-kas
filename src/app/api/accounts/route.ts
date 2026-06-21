import { db } from "@/db";
import { accounts } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(accounts).orderBy(accounts.name);
  return Response.json({ accounts: rows });
}
