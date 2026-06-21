"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", icon: "dashboard", label: "Home" },
    { href: "/", icon: "receipt_long", label: "Trans" },
    { href: "/reports", icon: "analytics", label: "Reports" },
    { href: "/settings", icon: "settings", label: "Set" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant px-4 h-16 flex items-center justify-around z-50">
      {items[0] && (
        <NavLink href={items[0].href} icon={items[0].icon} label={items[0].label} active={pathname === items[0].href} />
      )}
      {items[1] && (
        <NavLink href={items[1].href} icon={items[1].icon} label={items[1].label} active={pathname === items[1].href} />
      )}
      <div className="relative -top-6">
        <Link
          href="/add"
          className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center text-white shadow-lg border-4 border-surface"
        >
          <span className="material-symbols-outlined text-[32px]">add</span>
        </Link>
      </div>
      {items[2] && (
        <NavLink href={items[2].href} icon={items[2].icon} label={items[2].label} active={pathname === items[2].href} />
      )}
      {items[3] && (
        <NavLink href={items[3].href} icon={items[3].icon} label={items[3].label} active={pathname === items[3].href} />
      )}
    </nav>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 ${active ? "text-primary" : "text-on-surface-variant"}`}
    >
      <span className={`material-symbols-outlined ${active ? "filled" : ""}`}>{icon}</span>
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
