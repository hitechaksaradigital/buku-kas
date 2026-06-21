"use client";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  categoryName: string | null;
  categoryIcon: string | null;
  accountName: string | null;
  fromAccountName: string | null;
  toAccountName: string | null;
  isRecurring: number;
  hasAttachment: number;
}

interface TransactionTableProps {
  transactions: Transaction[];
  page: number;
  totalCount: number;
  perPage: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID").format(amount);
}

function formatDate(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
  ];
  const day = d.getDate().toString().padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return {
    date: `${day} ${month} ${year}`,
    time: `${hours}:${minutes} WIB`,
  };
}

function getCategoryStyle(type: string) {
  switch (type) {
    case "income":
      return {
        bgClass: "bg-primary-fixed/30",
        textClass: "text-primary",
      };
    case "expense":
      return {
        bgClass: "bg-error-container/20",
        textClass: "text-error",
      };
    case "transfer":
      return {
        bgClass: "bg-surface-container-high",
        textClass: "text-on-surface",
      };
    default:
      return {
        bgClass: "bg-surface-container-high",
        textClass: "text-on-surface",
      };
  }
}

export default function TransactionTable({
  transactions,
  page,
  totalCount,
  perPage,
}: TransactionTableProps) {
  const totalPages = Math.ceil(totalCount / perPage);
  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, totalCount);

  function goToPage(p: number) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(p));
    window.location.href = url.toString();
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                Tanggal
              </th>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                Deskripsi
              </th>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                Kategori
              </th>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase">
                Akun
              </th>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase text-right">
                Nominal
              </th>
              <th className="px-6 py-4 text-[14px] leading-[20px] tracking-[0.05em] font-semibold text-on-surface-variant uppercase text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant block mb-2">
                    inbox
                  </span>
                  Belum ada transaksi
                </td>
              </tr>
            )}
            {transactions.map((tx) => {
              const { date, time } = formatDate(tx.date);
              const style = getCategoryStyle(tx.type);

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-surface-container-low transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="text-[16px] leading-[24px] text-on-surface">{date}</div>
                    <div className="text-[11px] text-outline uppercase font-bold">{time}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[16px] leading-[24px] text-on-surface font-semibold">
                        {tx.description}
                      </span>
                      {tx.isRecurring === 1 && (
                        <span className="text-[12px] bg-primary-fixed/40 text-primary px-2 py-0.5 rounded-full w-max flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">repeat</span>
                          Recurring
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 h-8 rounded-full ${style.bgClass} ${style.textClass} flex items-center justify-center`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {tx.categoryIcon || (tx.type === "transfer" ? "swap_horiz" : "category")}
                        </span>
                      </span>
                      <span className="text-[14px] leading-[20px]">
                        {tx.type === "transfer" ? "Transfer" : tx.categoryName || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {tx.type === "transfer" ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] leading-[20px] text-on-surface-variant">
                          Dari: {tx.fromAccountName || "—"}
                        </span>
                        <span className="text-[14px] leading-[20px] text-on-surface">
                          Ke: {tx.toAccountName || "—"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[14px] leading-[20px] px-2 py-1 bg-surface-container-high rounded border border-outline-variant">
                        {tx.accountName || "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span
                      className={`text-[18px] leading-[24px] font-semibold ${
                        tx.type === "income"
                          ? "text-primary"
                          : tx.type === "expense"
                          ? "text-error"
                          : "text-on-surface"
                      }`}
                    >
                      {tx.type === "income"
                        ? `+ Rp ${formatCurrency(tx.amount)}`
                        : tx.type === "expense"
                        ? `- Rp ${formatCurrency(tx.amount)}`
                        : `Rp ${formatCurrency(tx.amount)}`}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="text-outline hover:text-primary transition-colors"
                        title={tx.hasAttachment ? "Lihat Lampiran" : "Tambah Lampiran"}
                      >
                        <span
                          className={`material-symbols-outlined ${
                            tx.hasAttachment ? "filled" : ""
                          }`}
                        >
                          {tx.hasAttachment ? "attachment" : "add_a_photo"}
                        </span>
                      </button>
                      <button className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
        <span className="text-[14px] leading-[20px] text-on-surface-variant">
          Menampilkan {startItem}-{endItem} dari {totalCount} transaksi
        </span>
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-4 py-2 rounded-lg text-[14px] leading-[20px] tracking-[0.05em] font-semibold ${
                  p === page
                    ? "bg-primary text-white"
                    : "border border-outline-variant hover:bg-surface-container-high"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
