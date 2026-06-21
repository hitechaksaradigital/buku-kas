-- ============================================
-- Buku Kas Digital - Supabase Schema + Seed
-- ============================================
-- Jalankan di Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================

-- Drop existing (urutan penting: transactions duluan karena ada FK)
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TYPE IF EXISTS transaction_type CASCADE;

-- 1. Buat enum untuk tipe transaksi
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');

-- 2. Tabel accounts (akun/kas)
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  balance INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabel categories (kategori)
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'category',
  type transaction_type NOT NULL DEFAULT 'expense'
);

-- 4. Tabel transactions (transaksi)
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMPTZ NOT NULL,
  description TEXT NOT NULL,
  amount INTEGER NOT NULL,
  type transaction_type NOT NULL,
  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
  from_account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
  to_account_id BIGINT REFERENCES accounts(id) ON DELETE SET NULL,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  has_attachment INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. RLS policies (anon key bisa read/write semua data)
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access accounts" ON accounts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

INSERT INTO accounts (name, balance) VALUES
  ('BCA Business', 45000000),
  ('Kas Tunai', 5000000),
  ('Mandiri Syariah', 12000000);

INSERT INTO categories (name, icon, type) VALUES
  ('Penjualan', 'payments', 'income'),
  ('Operasional', 'home_work', 'expense'),
  ('Gaji Karyawan', 'badge', 'expense'),
  ('Inventaris', 'inventory_2', 'expense'),
  ('Entertainment', 'restaurant', 'expense'),
  ('Jasa Konsultan', 'engineering', 'income'),
  ('Utilitas', 'bolt', 'expense'),
  ('Marketing', 'campaign', 'expense'),
  ('Pendapatan Lain', 'account_balance', 'income');

-- accounts: 1=BCA Business, 2=Kas Tunai, 3=Mandiri Syariah
-- categories: 1=Penjualan, 2=Operasional, 3=Gaji, 4=Inventaris, 5=Entertainment, 6=Jasa Konsultan, 7=Utilitas, 8=Marketing, 9=Pendapatan Lain

INSERT INTO transactions (date, description, amount, type, category_id, account_id, from_account_id, to_account_id, is_recurring, has_attachment) VALUES
  ('2024-01-24T14:20:00+07:00', 'Invoice #INV-2024-001', 12500000, 'income', 1, 1, NULL, NULL, 1, 1),
  ('2024-01-23T09:15:00+07:00', 'Sewa Kantor Bulan Januari', 8000000, 'expense', 2, 1, NULL, NULL, 0, 0),
  ('2024-01-22T16:45:00+07:00', 'Tarik Tunai Operasional', 2000000, 'transfer', NULL, NULL, 1, 2, 0, 0),
  ('2024-01-21T12:30:00+07:00', 'Makan Siang Klien - J.W. Marriott', 450000, 'expense', 5, 2, NULL, NULL, 0, 1),
  ('2024-01-20T10:00:00+07:00', 'Pembayaran Jasa Konsultan IT', 15000000, 'income', 6, 3, NULL, NULL, 0, 1),
  ('2024-01-19T08:30:00+07:00', 'Gaji Karyawan Januari - Batch 1', 25000000, 'expense', 3, 1, NULL, NULL, 1, 0),
  ('2024-01-18T15:00:00+07:00', 'Pembelian Laptop Kantor x2', 18000000, 'expense', 4, 1, NULL, NULL, 0, 1),
  ('2024-01-17T11:20:00+07:00', 'Tagihan Listrik & Internet', 1200000, 'expense', 7, 1, NULL, NULL, 1, 0),
  ('2024-01-16T09:45:00+07:00', 'Invoice #INV-2024-002 - Proyek Web', 35000000, 'income', 1, 3, NULL, NULL, 0, 1),
  ('2024-01-15T14:00:00+07:00', 'Transfer Dana Operasional Mingguan', 5000000, 'transfer', NULL, NULL, 3, 1, 1, 0),
  ('2024-01-14T10:30:00+07:00', 'Iklan Google Ads - Januari', 3500000, 'expense', 8, 1, NULL, NULL, 1, 0),
  ('2024-01-13T16:15:00+07:00', 'Pendapatan Bunga Deposito', 750000, 'income', 9, 3, NULL, NULL, 0, 0),
  ('2024-01-12T09:00:00+07:00', 'Makan Siang Tim - Restoran Padang', 350000, 'expense', 5, 2, NULL, NULL, 0, 0),
  ('2024-01-11T13:30:00+07:00', 'Invoice #INV-2024-003 - Maintenance', 8500000, 'income', 6, 1, NULL, NULL, 0, 1),
  ('2024-01-10T11:00:00+07:00', 'Pengisian Kas Kecil', 1000000, 'transfer', NULL, NULL, 1, 2, 0, 0),
  ('2024-01-09T08:45:00+07:00', 'Pembelian ATK Kantor', 275000, 'expense', 2, 2, NULL, NULL, 0, 1),
  ('2024-01-08T15:30:00+07:00', 'Invoice #INV-2024-004 - Design UI/UX', 6000000, 'income', 1, 1, NULL, NULL, 0, 0),
  ('2024-01-07T10:15:00+07:00', 'Biaya Kirim Kurir & Logistik', 180000, 'expense', 2, 2, NULL, NULL, 0, 0),
  ('2024-01-06T12:00:00+07:00', 'Transfer ke Mandiri untuk Deposito', 10000000, 'transfer', NULL, NULL, 1, 3, 0, 0),
  ('2024-01-05T09:30:00+07:00', 'Gaji Karyawan Januari - Batch 2', 15000000, 'expense', 3, 1, NULL, NULL, 1, 0);

-- ============================================
-- VERIFIKASI (jalankan untuk cek data)
-- ============================================
-- SELECT * FROM accounts;
-- SELECT * FROM categories;
-- SELECT * FROM transactions;
-- SELECT count(*) FROM transactions;
