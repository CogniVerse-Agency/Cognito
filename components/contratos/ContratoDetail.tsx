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
          <h2 className="text-lg font-semibold text-text-primary">Projetos Vinculados</h2>
          <Link className="text-sm font-medium text-brand-cyan" href={`/projetos/novo?clienteId=${contrato.clienteId}&contratoId=${contrato.id}`}>
            Novo Projeto
          </Link>
        </div>
        {contrato.projetos.length ? (
          contrato.projetos.map((projeto) => (
            <div key={projeto.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-text-primary">{projeto.nome}</p>
                  <p className="mt-1 text-sm text-text-muted">{projeto.progresso}% de progresso</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={projeto.prioridade} />
                  <Badge label={projeto.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-muted">Nenhum projeto vinculado a este contrato ainda.</p>
        )}
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <div className="mt-2 text-sm text-text-primary">{value}</div>
    </div>
  );
}
