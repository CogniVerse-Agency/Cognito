"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

interface CriticalTask {
  id: string;
  titulo: string;
  deadline: Date | null;
  projeto: {
    nome: string;
  };
  responsavel: {
    name: string | null;
    avatar: string | null;
  } | null;
}

interface TarefasCriticasProps {
  tarefas: CriticalTask[];
}

export function TarefasCriticas({ tarefas }: TarefasCriticasProps) {
  const [items, setItems] = useState(tarefas);
  const [isPending, startTransition] = useTransition();

  function handleToggle(id: string) {
    const previousItems = items;
    setItems((current) => current.filter((item) => item.id !== id));

    startTransition(async () => {
      const response = await fetch(`/api/tarefas/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          concluida: true,
          status: "CONCLUIDO"
        })
      });

      if (!response.ok) {
        setItems(previousItems);
      }
    });
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-card border border-status-error/20 bg-status-error/10 p-2 text-status-error">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-ink-primary">
            Tarefas Criticas
          </h2>
          <p className="text-sm text-ink-secondary">
            Prioridades maximas em aberto com conclusao inline.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length ? (
          items.map((tarefa) => (
            <label
              key={tarefa.id}
              className="flex cursor-pointer items-start gap-3 rounded-card border border-border bg-bg-surface2 px-4 py-3 transition-colors hover:border-accent-border hover:bg-accent-muted"
            >
              <input
                className="mt-1 h-4 w-4 rounded border-border bg-bg-surface2 text-accent focus:border-border-focus focus:ring-0"
                disabled={isPending}
                onChange={() => handleToggle(tarefa.id)}
                type="checkbox"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-ink-primary">
                    {tarefa.titulo}
                  </p>
                  <Badge label="CRITICA" />
                </div>
                <p className="mt-1 text-sm text-ink-secondary">
                  {tarefa.projeto.nome}
                  {" | "}
                  {tarefa.responsavel?.name ?? "Sem responsavel"}
                </p>
                <p className="mt-2 text-xs text-ink-tertiary">
                  {tarefa.deadline
                    ? `Deadline: ${formatDate(tarefa.deadline)}`
                    : "Sem deadline"}
                </p>
              </div>
            </label>
          ))
        ) : (
          <div className="rounded-card border border-status-success/20 bg-status-success/10 px-4 py-8 text-sm text-status-success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Nenhuma tarefa critica em aberto.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
