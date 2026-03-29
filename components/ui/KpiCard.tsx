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
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">{titulo}</p>
            <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-ink-primary">{valor}</p>
          </div>
          <div className="rounded-card border border-accent/20 bg-accent/10 p-3 text-accent">
            {icone}
          </div>
        </div>
        <div
          className={cn(
            "inline-flex items-center gap-1 rounded-pill border px-2.5 py-1 text-xs font-medium",
            positiva
              ? "border-status-success/20 bg-status-success/10 text-status-success"
              : "border-status-error/20 bg-status-error/10 text-status-error"
          )}
        >
          {positiva ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{variacao ? `${variacao > 0 ? "+" : ""}${variacao}` : "0"} vs mês anterior</span>
        </div>
      </div>
    </Card>
  );
}
