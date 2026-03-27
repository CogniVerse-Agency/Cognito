"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Bell, Menu, Search } from "lucide-react";
import { getPageTitle } from "@/components/layout/navigation";

interface HeaderProps {
  mobileOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Header({ mobileOpen, onOpenChange }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border bg-bg-primary/80 backdrop-blur-xl lg:left-60">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            aria-expanded={mobileOpen}
            aria-label="Abrir menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/5 text-text-primary lg:hidden"
            onClick={() => onOpenChange(true)}
            type="button"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block">
            <p className="text-lg font-semibold text-text-primary">{pageTitle}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
              Centro operacional CogniVerse
            </p>
          </div>
          <div className="hidden items-center gap-3 rounded-xl border border-border bg-bg-surface2 px-4 py-3 text-text-muted xl:flex">
            <Search className="h-4 w-4" />
            <span className="text-sm">
              Buscar clientes, contratos e projetos...
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/5 text-text-primary"
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="hidden rounded-xl border border-border bg-white/5 px-4 py-2.5 md:block">
            <p className="text-sm font-medium text-text-primary">
              {session?.user?.name ?? "CogniVerse Agency"}
            </p>
            <p className="text-xs text-text-muted">
              {session?.user?.role ?? "Operations hub"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
