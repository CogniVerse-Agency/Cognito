"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import type { Contrato, Projeto, Cliente } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";

type ClienteDetalhe = Cliente & {
  contratos: Contrato[];
  projetos: (Projeto & {
    responsavel: {
      id: string;
      name: string | null;
    } | null;
  })[];
};

const tabs = [
  { key: "geral", label: "Visao Geral" },
  { key: "contratos", label: "Contratos" },
  { key: "projetos", label: "Projetos" },
  { key: "historico", label: "Historico" }
] as const;

export function ClienteTabs({ cliente }: { cliente: ClienteDetalhe }) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["key"]>("geral");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-brand-purple/15 text-white shadow-glow"
                : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary"
            }`}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "geral" ? (
        <Card className="grid gap-4 p-6 md:grid-cols-2">
          <Field label="Nome" value={cliente.nome} />
          <Field label="Empresa" value={cliente.empresa ?? "-"} />
          <Field label="Email" value={cliente.email ?? "-"} />
          <Field label="Telefone" value={cliente.telefone ?? "-"} />
          <Field label="Status" value={<Badge label={cliente.status} />} />
          <Field
            label="Tipo de Servico"
            value={cliente.tipoServico?.replaceAll("_", " ") ?? "-"}
          />
          <Field label="Canal de Origem" value={cliente.canalOrigem ?? "-"} />
          <Field
            label="Valor do Contrato"
            value={
              typeof cliente.valorContrato === "number"
                ? formatCurrency(cliente.valorContrato)
                : "-"
            }
          />
          <Field label="NPS" value={cliente.nps ?? "-"} />
          <Field label="Criado em" value={formatDate(cliente.createdAt)} />
          <div className="md:col-span-2">
            <Field label="Notas" value={cliente.notas ?? "Sem notas cadastradas."} />
          </div>
        </Card>
      ) : null}

      {activeTab === "contratos" ? (
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Contratos</h2>
            <Link className="text-sm font-medium text-brand-cyan" href={`/contratos/novo?clienteId=${cliente.id}`}>
              Novo Contrato
            </Link>
          </div>
          {cliente.contratos.length ? (
            cliente.contratos.map((contrato) => (
              <div key={contrato.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-text-primary">{contrato.titulo}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {formatCurrency(contrato.valor)} · {contrato.tipo.replaceAll("_", " ")}
                    </p>
                  </div>
                  <Badge label={contrato.status} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted">Nenhum contrato vinculado ainda.</p>
          )}
        </Card>
      ) : null}

      {activeTab === "projetos" ? (
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Projetos</h2>
            <Link className="text-sm font-medium text-brand-cyan" href={`/projetos/novo?clienteId=${cliente.id}`}>
              Novo Projeto
            </Link>
          </div>
          {cliente.projetos.length ? (
            cliente.projetos.map((projeto) => (
              <div key={projeto.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-text-primary">{projeto.nome}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      {projeto.responsavel?.name ?? "Sem responsavel"} · {projeto.progresso}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge label={projeto.prioridade} />
                    <Badge label={projeto.status} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted">Nenhum projeto vinculado ainda.</p>
          )}
        </Card>
      ) : null}

      {activeTab === "historico" ? (
        <Card className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-text-primary">Historico</h2>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 text-sm text-text-muted">
            Cliente criado em {formatDate(cliente.createdAt)} e atualizado pela ultima vez em {formatDate(cliente.updatedAt)}.
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <div className="mt-2 text-sm text-text-primary">{value}</div>
    </div>
  );
}
