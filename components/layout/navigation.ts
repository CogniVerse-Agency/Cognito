import type { Route } from "next";
import {
  CheckSquare,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Users2
} from "lucide-react";

export const navigationItems: Array<{
  href: Route;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clientes", label: "Clientes", icon: Users2 },
  { href: "/contratos", label: "Contratos", icon: FileText },
  { href: "/projetos", label: "Projetos", icon: ClipboardList },
  { href: "/tarefas", label: "Tarefas", icon: CheckSquare }
];

export function getPageTitle(pathname: string) {
  const item = navigationItems.find(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`)
  );

  return item?.label ?? "CogniVerse ERP";
}
