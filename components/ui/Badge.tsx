import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  LEAD: "bg-slate-500/15 text-slate-200",
  PROSPECT: "bg-cyan-500/15 text-cyan-300",
  ATIVO: "bg-green-500/15 text-green-300",
  PAUSADO: "bg-amber-500/15 text-amber-300",
  ENCERRADO: "bg-red-500/15 text-red-300",
  EM_ANDAMENTO: "bg-cyan-500/15 text-cyan-300",
  CONCLUIDO: "bg-green-500/15 text-green-300",
  CANCELADO: "bg-red-500/15 text-red-300",
  CRITICA: "bg-red-500/15 text-red-300",
  ALTA: "bg-orange-500/15 text-orange-300",
  MEDIA: "bg-amber-500/15 text-amber-300",
  BAIXA: "bg-green-500/15 text-green-300"
};

interface BadgeProps {
  label: string;
  tone?: string;
}

export function Badge({ label, tone }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        toneMap[tone ?? label] ?? "bg-white/10 text-text-primary"
      )}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}
