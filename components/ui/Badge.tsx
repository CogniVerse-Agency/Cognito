import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  LEAD: "border border-ink-secondary/20 bg-ink-secondary/10 text-ink-secondary",
  PROSPECT: "border border-status-info/20 bg-status-info/10 text-status-info",
  ATIVO: "border border-status-success/20 bg-status-success/10 text-status-success",
  PAUSADO: "border border-status-warning/20 bg-status-warning/10 text-status-warning",
  ENCERRADO: "border border-status-error/20 bg-status-error/10 text-status-error",
  RASCUNHO: "border border-ink-secondary/20 bg-ink-secondary/10 text-ink-secondary",
  ENVIADO: "border border-status-info/20 bg-status-info/10 text-status-info",
  ASSINADO: "border border-status-success/20 bg-status-success/10 text-status-success",
  ATIVO_CONTRATO: "border border-status-success/20 bg-status-success/10 text-status-success",
  CANCELADO: "border border-status-error/20 bg-status-error/10 text-status-error",
  PLANEJAMENTO: "border border-ink-secondary/20 bg-ink-secondary/10 text-ink-secondary",
  EM_ANDAMENTO: "border border-status-info/20 bg-status-info/10 text-status-info",
  EM_REVISAO: "border border-status-warning/20 bg-status-warning/10 text-status-warning",
  CONCLUIDO: "border border-status-success/20 bg-status-success/10 text-status-success",
  BACKLOG: "border border-ink-secondary/20 bg-ink-secondary/10 text-ink-secondary",
  A_FAZER: "border border-status-info/20 bg-status-info/10 text-status-info",
  CRITICA: "border border-status-error/20 bg-status-error/10 text-status-error",
  ALTA: "border border-status-warning/20 bg-status-warning/10 text-status-warning",
  MEDIA: "border border-status-warning/20 bg-status-warning/10 text-status-warning",
  BAIXA: "border border-status-success/20 bg-status-success/10 text-status-success"
};

interface BadgeProps {
  label: string;
  tone?: string;
}

export function Badge({ label, tone }: BadgeProps) {
  const resolvedTone = tone ?? (label === "ATIVO" ? "ATIVO_CONTRATO" : label);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider",
        toneMap[resolvedTone] ?? "border border-border bg-bg-surface2 text-ink-primary"
      )}
    >
      {label.replaceAll("_", " ")}
    </span>
  );
}
