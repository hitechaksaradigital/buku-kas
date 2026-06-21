"use client";

import { useState } from "react";

interface Account {
  id: number;
  name: string;
}

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  accounts: Account[];
}

export default function TransferModal({ open, onClose, accounts }: TransferModalProps) {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id ?? 0);
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id ?? accounts[0]?.id ?? 0);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit() {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "transfer",
          amount: Number(amount),
          fromAccountId,
          toAccountId,
          description: notes || "Transfer Antar Kas",
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setAmount("");
        setNotes("");
        onClose();
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-outline-variant">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <h3 className="text-[20px] leading-[28px] font-semibold text-on-surface">
            Transfer Antar Kas
          </h3>
          <button
            className="text-on-surface-variant hover:text-error transition-colors"
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                Dari Akun
              </label>
              <select
                className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
                value={fromAccountId}
                onChange={(e) => setFromAccountId(Number(e.target.value))}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
                Ke Akun
              </label>
              <select
                className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
                value={toAccountId}
                onChange={(e) => setToAccountId(Number(e.target.value))}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
              Nominal Transfer
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">
                Rp
              </span>
              <input
                className="w-full bg-surface border border-outline-variant rounded-xl text-[18px] leading-[24px] font-semibold p-3 pl-12 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="0"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant">
              Catatan / Keterangan
            </label>
            <textarea
              className="w-full bg-surface border border-outline-variant rounded-xl text-[16px] leading-[24px] p-3 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Contoh: Pengisian kas kecil kantor..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="pt-4 border-t border-outline-variant flex gap-3">
            <button
              className="flex-1 px-4 py-3 border border-outline-variant rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold hover:bg-surface-container-high transition-colors"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-[14px] leading-[20px] tracking-[0.05em] font-semibold shadow-md hover:bg-primary-container transition-all disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Konfirmasi Transfer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
