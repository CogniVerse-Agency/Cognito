"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BrainCircuit, LogOut, Settings, X } from "lucide-react";
import { navigationItems } from "@/components/layout/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <div
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-bg-surface transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:z-40 lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/5 px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-cyan shadow-glow">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">CogniVerse</p>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                ERP interno
              </p>
            </div>
          </div>
          <button
            aria-label="Fechar menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/5 text-text-primary lg:hidden"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
            Menu principal
          </p>
          <nav className="mt-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-r-xl border-l-4 px-3 py-3 text-sm font-medium transition-all",
                    active
                      ? "border-brand-purple bg-brand-purple/15 text-white"
                      : "border-transparent text-text-muted hover:bg-white/5 hover:text-text-primary"
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/5 p-3">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
            Conta
          </p>
          <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <p className="text-sm font-medium text-text-primary">
              {session?.user?.name ?? "Usuario"}
            </p>
            <p className="text-xs text-text-muted">
              {session?.user?.email ?? "sem-email@cogniverse.com"}
            </p>
          </div>
          <div className="mt-3 space-y-1">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-primary"
              type="button"
            >
              <Settings className="h-4 w-4" />
              Configuracoes
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted hover:bg-white/5 hover:text-text-primary"
              onClick={() => signOut({ callbackUrl: "/login" })}
              type="button"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
