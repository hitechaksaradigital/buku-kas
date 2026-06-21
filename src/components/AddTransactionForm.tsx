"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Account {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  type: string;
}

interface AddTransactionFormProps {
  accounts: Account[];
  categories: Category[];
}

export default function AddTransactionForm({ accounts, categories }: AddTransactionFormProps) {
  const router = useRouter();
  const [type, setType] = useState<"income" | "expense" | "transfer">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id?.toString() ?? "");
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id?.toString() ?? "");
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id?.toString() ?? accounts[0]?.id?.toString() ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [loading, setLoading] = useState(false);

  const filteredCategories = categories.filter(
    (c) => c.type === type || type === "transfer"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    try {
      const insertData: any = {
        type,
        amount: Number(amount),
        description,
        date: new Date(date).toISOString(),
        category_id: type !== "transfer" && categoryId ? Number(categoryId) : null,
        account_id: type !== "transfer" ? Number(accountId) : null,
        from_account_id: type === "transfer" ? Number(fromAccountId) : null,
        to_account_id: type === "transfer" ? Number(toAccountId) : null,
        is_recurring: 0,
        has_attachment: 0,
        notes: null,
      };

      const { error } = await supabase.from("transactions").insert(insertData);

      if (!error) {
        router.push("/");
      } else {
        console.error("Error creating transaction:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm max-w-2xl">
      <div className="mb-6">
        <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-2">
          Tipe Transaksi
        </label>
        <div className="flex gap-2">
          {(["income", "expense", "transfer"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-3 rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold transition-all ${
                type === t
                  ? t === "income"
                    ? "bg-primary text-white"
                    : t === "expense"
                    ? "bg-error text-white"
                    : "bg-tertiary text-white"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {t === "income" ? "Pemasukan" : t === "expense" ? "Pengeluaran" : "Transfer"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
          Deskripsi
        </label>
        <input
          type="text"
          required
          className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Contoh: Pembayaran Invoice #001"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
          Nominal
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">
            Rp
          </span>
          <input
            type="number"
            required
            className="w-full bg-surface border border-outline-variant rounded-xl text-[18px] leading-[24px] font-semibold p-3 pl-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
          Tanggal & Waktu
        </label>
        <input
          type="datetime-local"
          className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {type !== "transfer" && (
        <div className="mb-4">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
            Kategori
          </label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Pilih Kategori</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {type !== "transfer" && (
        <div className="mb-4">
          <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
            Akun / Kas
          </label>
          <select
            className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === "transfer" && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
              Dari Akun
            </label>
            <select
              className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant block mb-1">
              Ke Akun
            </label>
            <select
              className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-outline-variant flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 px-4 py-3 border border-outline-variant rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-surface-container-high transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold shadow-md hover:bg-primary-container transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">save</span>
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
      </div>
    </form>
  );
}
