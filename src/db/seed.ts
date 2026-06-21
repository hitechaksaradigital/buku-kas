import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { accounts, categories, transactions } from "./schema";

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  const db = drizzle(pool);

  console.log("Seeding database...");

  // Clear existing data
  await db.delete(transactions);
  await db.delete(categories);
  await db.delete(accounts);

  // Insert accounts
  const insertedAccounts = await db
    .insert(accounts)
    .values([
      { name: "BCA Business", balance: 45000000 },
      { name: "Kas Tunai", balance: 5000000 },
      { name: "Mandiri Syariah", balance: 12000000 },
    ])
    .returning();

  const bcaId = insertedAccounts[0]!.id;
  const tunaiId = insertedAccounts[1]!.id;
  const mandiriId = insertedAccounts[2]!.id;

  // Insert categories
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: "Penjualan", icon: "payments", type: "income" as const },
      { name: "Operasional", icon: "home_work", type: "expense" as const },
      { name: "Gaji Karyawan", icon: "badge", type: "expense" as const },
      { name: "Inventaris", icon: "inventory_2", type: "expense" as const },
      { name: "Entertainment", icon: "restaurant", type: "expense" as const },
      { name: "Jasa Konsultan", icon: "engineering", type: "income" as const },
      { name: "Utilitas", icon: "bolt", type: "expense" as const },
      { name: "Marketing", icon: "campaign", type: "expense" as const },
      { name: "Pendapatan Lain", icon: "account_balance", type: "income" as const },
    ])
    .returning();

  const penjualanId = insertedCategories[0]!.id;
  const operasionalId = insertedCategories[1]!.id;
  const gajiId = insertedCategories[2]!.id;
  const inventarisId = insertedCategories[3]!.id;
  const entertainmentId = insertedCategories[4]!.id;
  const jasaId = insertedCategories[5]!.id;
  const utilitasId = insertedCategories[6]!.id;
  const marketingId = insertedCategories[7]!.id;
  const pendapatanLainId = insertedCategories[8]!.id;

  // Insert transactions
  await db.insert(transactions).values([
    {
      date: new Date("2024-01-24T14:20:00"),
      description: "Invoice #INV-2024-001",
      amount: 12500000,
      type: "income" as const,
      categoryId: penjualanId,
      accountId: bcaId,
      isRecurring: 1,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-23T09:15:00"),
      description: "Sewa Kantor Bulan Januari",
      amount: 8000000,
      type: "expense" as const,
      categoryId: operasionalId,
      accountId: bcaId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-22T16:45:00"),
      description: "Tarik Tunai Operasional",
      amount: 2000000,
      type: "transfer" as const,
      fromAccountId: bcaId,
      toAccountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-21T12:30:00"),
      description: "Makan Siang Klien - J.W. Marriott",
      amount: 450000,
      type: "expense" as const,
      categoryId: entertainmentId,
      accountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-20T10:00:00"),
      description: "Pembayaran Jasa Konsultan IT",
      amount: 15000000,
      type: "income" as const,
      categoryId: jasaId,
      accountId: mandiriId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-19T08:30:00"),
      description: "Gaji Karyawan Januari - Batch 1",
      amount: 25000000,
      type: "expense" as const,
      categoryId: gajiId,
      accountId: bcaId,
      isRecurring: 1,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-18T15:00:00"),
      description: "Pembelian Laptop Kantor x2",
      amount: 18000000,
      type: "expense" as const,
      categoryId: inventarisId,
      accountId: bcaId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-17T11:20:00"),
      description: "Tagihan Listrik & Internet",
      amount: 1200000,
      type: "expense" as const,
      categoryId: utilitasId,
      accountId: bcaId,
      isRecurring: 1,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-16T09:45:00"),
      description: "Invoice #INV-2024-002 - Proyek Web",
      amount: 35000000,
      type: "income" as const,
      categoryId: penjualanId,
      accountId: mandiriId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-15T14:00:00"),
      description: "Transfer Dana Operasional Mingguan",
      amount: 5000000,
      type: "transfer" as const,
      fromAccountId: mandiriId,
      toAccountId: bcaId,
      isRecurring: 1,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-14T10:30:00"),
      description: "Iklan Google Ads - Januari",
      amount: 3500000,
      type: "expense" as const,
      categoryId: marketingId,
      accountId: bcaId,
      isRecurring: 1,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-13T16:15:00"),
      description: "Pendapatan Bunga Deposito",
      amount: 750000,
      type: "income" as const,
      categoryId: pendapatanLainId,
      accountId: mandiriId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-12T09:00:00"),
      description: "Makan Siang Tim - Restoran Padang",
      amount: 350000,
      type: "expense" as const,
      categoryId: entertainmentId,
      accountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-11T13:30:00"),
      description: "Invoice #INV-2024-003 - Maintenance",
      amount: 8500000,
      type: "income" as const,
      categoryId: jasaId,
      accountId: bcaId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-10T11:00:00"),
      description: "Pengisian Kas Kecil",
      amount: 1000000,
      type: "transfer" as const,
      fromAccountId: bcaId,
      toAccountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-09T08:45:00"),
      description: "Pembelian ATK Kantor",
      amount: 275000,
      type: "expense" as const,
      categoryId: operasionalId,
      accountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 1,
    },
    {
      date: new Date("2024-01-08T15:30:00"),
      description: "Invoice #INV-2024-004 - Design UI/UX",
      amount: 6000000,
      type: "income" as const,
      categoryId: penjualanId,
      accountId: bcaId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-07T10:15:00"),
      description: "Biaya Kirim Kurir & Logistik",
      amount: 180000,
      type: "expense" as const,
      categoryId: operasionalId,
      accountId: tunaiId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-06T12:00:00"),
      description: "Transfer ke Mandiri untuk Deposito",
      amount: 10000000,
      type: "transfer" as const,
      fromAccountId: bcaId,
      toAccountId: mandiriId,
      isRecurring: 0,
      hasAttachment: 0,
    },
    {
      date: new Date("2024-01-05T09:30:00"),
      description: "Gaji Karyawan Januari - Batch 2",
      amount: 15000000,
      type: "expense" as const,
      categoryId: gajiId,
      accountId: bcaId,
      isRecurring: 1,
      hasAttachment: 0,
    },
  ]);

  console.log("Seeding complete!");
  await pool.end();
}

seed().catch(console.error);
