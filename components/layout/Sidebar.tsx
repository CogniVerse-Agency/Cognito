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
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-bg-surface transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:z-40 lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-card border border-accent/20 bg-accent/10">
              <BrainCircuit className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold tracking-wide text-accent">
                CogniVerse
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-ink-tertiary">
                ERP interno
              </p>
            </div>
          </div>
          <button
            aria-label="Fechar menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-input border border-border bg-bg-surface2 text-ink-primary transition-colors hover:border-border-hover lg:hidden"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-5">
          <p className="px-4 text-xs font-heading font-bold uppercase tracking-[0.24em] text-ink-tertiary">
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
                    "mx-2 flex items-center gap-3 rounded-card border-l-2 px-4 py-3 text-sm transition-colors",
                    active
                      ? "mx-0 rounded-l-none rounded-r-card border-accent bg-accent/10 pl-[calc(1rem-2px)] font-medium text-ink-primary"
                      : "border-transparent text-ink-secondary hover:bg-bg-surface2 hover:text-ink-primary"
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

        <div className="border-t border-border p-3">
          <p className="px-3 font-heading text-xs font-bold uppercase tracking-[0.24em] text-ink-tertiary">
            Conta
          </p>
          <div className="mt-3 rounded-card border border-border bg-bg-surface2 p-4">
            <p className="text-sm font-medium text-ink-primary">
              {session?.user?.name ?? "Usuario"}
            </p>
            <p className="text-xs text-ink-secondary">
              {session?.user?.email ?? "sem-email@cogniverse.com"}
            </p>
          </div>
          <div className="mt-3 space-y-1">
            <button
              className="flex w-full items-center gap-3 rounded-card px-3 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-bg-surface2 hover:text-ink-primary"
              type="button"
            >
              <Settings className="h-4 w-4" />
              Configuracoes
            </button>
            <button
              className="flex w-full items-center gap-3 rounded-card px-3 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-bg-surface2 hover:text-ink-primary"
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
