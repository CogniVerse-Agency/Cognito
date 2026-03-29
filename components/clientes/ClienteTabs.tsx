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
            className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-accent bg-accent/10 text-ink-primary"
                : "border-border bg-bg-surface text-ink-secondary hover:border-border-hover hover:text-ink-primary"
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
            <h2 className="font-heading text-lg font-bold tracking-tight text-ink-primary">Contratos</h2>
            <Link
              className="text-sm font-medium text-accent transition-colors hover:text-accent-dim"
              href={`/contratos/novo?clienteId=${cliente.id}`}
            >
              Novo Contrato
            </Link>
          </div>
          {cliente.contratos.length ? (
            cliente.contratos.map((contrato) => (
              <div
                key={contrato.id}
                className="rounded-card border border-border bg-bg-surface2 p-4 transition-colors hover:border-accent-border hover:bg-accent-muted"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-primary">{contrato.titulo}</p>
                    <p className="mt-1 text-sm text-ink-secondary">
                      {formatCurrency(contrato.valor)} · {contrato.tipo.replaceAll("_", " ")}
                    </p>
                  </div>
                  <Badge label={contrato.status} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-ink-secondary">Nenhum contrato vinculado ainda.</p>
          )}
        </Card>
      ) : null}

      {activeTab === "projetos" ? (
        <Card className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold tracking-tight text-ink-primary">Projetos</h2>
            <Link
              className="text-sm font-medium text-accent transition-colors hover:text-accent-dim"
              href={`/projetos/novo?clienteId=${cliente.id}`}
            >
              Novo Projeto
            </Link>
          </div>
          {cliente.projetos.length ? (
            cliente.projetos.map((projeto) => (
              <div
                key={projeto.id}
                className="rounded-card border border-border bg-bg-surface2 p-4 transition-colors hover:border-accent-border hover:bg-accent-muted"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink-primary">{projeto.nome}</p>
                    <p className="mt-1 text-sm text-ink-secondary">
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
            <p className="text-sm text-ink-secondary">Nenhum projeto vinculado ainda.</p>
          )}
        </Card>
      ) : null}

      {activeTab === "historico" ? (
        <Card className="space-y-4 p-6">
          <h2 className="font-heading text-lg font-bold tracking-tight text-ink-primary">Historico</h2>
          <div className="rounded-card border border-border bg-bg-surface2 p-4 text-sm text-ink-secondary">
            Cliente criado em {formatDate(cliente.createdAt)} e atualizado pela ultima vez em{" "}
            {formatDate(cliente.updatedAt)}.
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-bg-surface2 p-4">
      <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">{label}</p>
      <div className="mt-2 text-sm text-ink-primary">{value}</div>
    </div>
  );
}
