"use client";

import { useMemo, useState, useTransition } from "react";
import type { Tarefa } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";
import { TarefaEditModal } from "@/components/tarefas/TarefaEditModal";

type TarefaWithRelations = Tarefa & {
  projeto: {
    id: string;
    nome: string;
  };
  responsavel: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
};

export function TarefasBoard({
  tarefas,
  usuarios
}: {
  tarefas: TarefaWithRelations[];
  usuarios: Array<{ id: string; name: string }>;
}) {
  const [items, setItems] = useState(tarefas);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedTask = useMemo(
    () => items.find((item) => item.id === selectedTaskId) ?? null,
    [items, selectedTaskId]
  );

  function handleToggle(item: TarefaWithRelations) {
    const previousItems = items;
    const nextCompleted = !item.concluida;

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              concluida: nextCompleted,
              status: nextCompleted ? "CONCLUIDO" : currentItem.status
            }
          : currentItem
      )
    );

    startTransition(async () => {
      const response = await fetch(`/api/tarefas/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          concluida: nextCompleted,
          status: nextCompleted ? "CONCLUIDO" : item.status
        })
      });

      if (!response.ok) {
        setItems(previousItems);
      }
    });
  }

  return (
    <>
      <Table
        columns={[
          {
            key: "titulo",
            header: "Titulo",
            render: (item) => (
              <button
                className="text-left font-medium text-text-primary hover:text-brand-cyan"
                onClick={() => setSelectedTaskId(item.id)}
                type="button"
              >
                {item.titulo}
              </button>
            )
          },
          {
            key: "projeto",
            header: "Projeto",
            render: (item) => item.projeto.nome
          },
          {
            key: "responsavel",
            header: "Responsavel",
            render: (item) => item.responsavel?.name ?? "-"
          },
          {
            key: "prioridade",
            header: "Prioridade",
            render: (item) => <Badge label={item.prioridade} />
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <Badge label={item.status} />
          },
          {
            key: "deadline",
            header: "Deadline",
            render: (item) => (item.deadline ? formatDate(item.deadline) : "-")
          },
          {
            key: "concluida",
            header: "Concluida",
            render: (item) => (
              <input
                checked={item.concluida}
                disabled={isPending}
                onChange={() => handleToggle(item)}
                type="checkbox"
              />
            )
          }
        ]}
        data={items}
        emptyMessage="Nenhuma tarefa encontrada com os filtros atuais."
        getRowKey={(item) => item.id}
      />

      <TarefaEditModal
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTaskId(null)}
        onSaved={(nextTask) =>
          setItems((current) =>
            current.map((item) => (item.id === nextTask.id ? nextTask : item))
          )
        }
        tarefa={selectedTask}
        usuarios={usuarios}
      />
    </>
  );
}
