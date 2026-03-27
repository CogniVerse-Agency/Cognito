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
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Tarefas Criticas
          </h2>
          <p className="text-sm text-text-muted">
            Prioridades maximas em aberto com conclusao inline.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.length ? (
          items.map((tarefa) => (
            <label
              key={tarefa.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
            >
              <input
                className="mt-1 h-4 w-4 rounded border-border bg-bg-surface2 text-brand-purple"
                disabled={isPending}
                onChange={() => handleToggle(tarefa.id)}
                type="checkbox"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-text-primary">
                    {tarefa.titulo}
                  </p>
                  <Badge label="CRITICA" />
                </div>
                <p className="mt-1 text-sm text-text-muted">
                  {tarefa.projeto.nome}
                  {" | "}
                  {tarefa.responsavel?.name ?? "Sem responsavel"}
                </p>
                <p className="mt-2 text-xs text-text-muted">
                  {tarefa.deadline
                    ? `Deadline: ${formatDate(tarefa.deadline)}`
                    : "Sem deadline"}
                </p>
              </div>
            </label>
          ))
        ) : (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-8 text-sm text-green-200">
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
