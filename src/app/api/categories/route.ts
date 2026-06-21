import { db } from "@/db";
import { categories } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(categories).orderBy(categories.name);
  return Response.json({ categories: rows });
}
