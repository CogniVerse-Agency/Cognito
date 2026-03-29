import Link from "next/link";
import type { Cliente, Contrato, Projeto } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";

type ContratoDetalhe = Contrato & {
  cliente: Cliente;
  projetos: Projeto[];
};

export function ContratoDetail({ contrato }: { contrato: ContratoDetalhe }) {
  return (
    <div className="space-y-6">
      <Card className="grid gap-4 p-6 md:grid-cols-2">
        <Field label="Cliente" value={contrato.cliente.empresa ?? contrato.cliente.nome} />
        <Field label="Status" value={<Badge label={contrato.status} />} />
        <Field label="Tipo" value={contrato.tipo.replaceAll("_", " ")} />
        <Field label="Valor" value={formatCurrency(contrato.valor)} />
        <Field label="Recorrente" value={contrato.recorrente ? "Sim" : "Nao"} />
        <Field label="Periodicidade" value={contrato.periodicidade ?? "-"} />
        <Field label="Data de Inicio" value={formatDate(contrato.dataInicio)} />
        <Field label="Data de Fim" value={contrato.dataFim ? formatDate(contrato.dataFim) : "-"} />
        <div className="md:col-span-2">
          <Field label="Descricao" value={contrato.descricao ?? "Sem descricao cadastrada."} />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold tracking-tight text-ink-primary">Projetos Vinculados</h2>
          <Link
            className="text-sm font-medium text-accent transition-colors hover:text-accent-dim"
            href={`/projetos/novo?clienteId=${contrato.clienteId}&contratoId=${contrato.id}`}
          >
            Novo Projeto
          </Link>
        </div>
        {contrato.projetos.length ? (
          contrato.projetos.map((projeto) => (
            <div
              key={projeto.id}
              className="rounded-card border border-border bg-bg-surface2 p-4 transition-colors hover:border-accent-border hover:bg-accent-muted"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-primary">{projeto.nome}</p>
                  <p className="mt-1 text-sm text-ink-secondary">{projeto.progresso}% de progresso</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={projeto.prioridade} />
                  <Badge label={projeto.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-ink-secondary">Nenhum projeto vinculado a este contrato ainda.</p>
        )}
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-bg-surface2 p-4">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">{label}</p>
      <div className="mt-2 text-sm text-ink-primary">{value}</div>
    </div>
  );
}
