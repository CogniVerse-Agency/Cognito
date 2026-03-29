"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-bg-primary text-ink-primary">
      <Sidebar mobileOpen={mobileOpen} onOpenChange={setMobileOpen} />
      <div className="min-h-screen lg:pl-60">
        <Header mobileOpen={mobileOpen} onOpenChange={setMobileOpen} />
        <main className="px-4 pb-8 pt-24 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
