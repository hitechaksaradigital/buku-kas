import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

export default function DebtsPage() {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col pb-20 md:pb-0">
        <Header />
        <div className="p-6 max-w-[1280px] mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-[32px] leading-[40px] tracking-[-0.02em] font-bold text-on-surface mb-1">
              Hutang / Piutang
            </h2>
            <p className="text-[16px] leading-[24px] text-on-surface-variant">
              Kelola catatan hutang dan piutang bisnis Anda.
            </p>
          </div>
          <div className="bg-surface-container-lowest p-12 rounded-xl border border-outline-variant shadow-sm text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4 block">
              account_balance
            </span>
            <p className="text-[18px] leading-[28px] text-on-surface-variant">
              Fitur ini akan segera hadir.
            </p>
          </div>
        </div>
      </main>
      <MobileNav />
    </>
  );
}
