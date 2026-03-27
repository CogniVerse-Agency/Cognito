import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  titulo: string;
  valor: number | string;
  variacao?: number;
  icone: ReactNode;
  corBorda: string;
}

export function KpiCard({
  titulo,
  valor,
  variacao,
  icone,
  corBorda
}: KpiCardProps) {
  const positiva = (variacao ?? 0) >= 0;

  return (
    <Card className="overflow-hidden p-0">
      <div className="h-1 w-full" style={{ backgroundColor: corBorda }} />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-text-muted">{titulo}</p>
            <p className="mt-2 text-3xl font-semibold text-text-primary">{valor}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-text-primary">
            {icone}
          </div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            positiva ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"
          )}
        >
          {positiva ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{variacao ? `${variacao > 0 ? "+" : ""}${variacao}` : "0"} vs mês anterior</span>
        </div>
      </div>
    </Card>
  );
}
