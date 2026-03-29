"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult
} from "@hello-pangea/dnd";
import Link from "next/link";
import type { Projeto, Cliente, User } from "@prisma/client";
import { LayoutGrid, List } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

type ProjetoListItem = Projeto & {
  cliente: Pick<Cliente, "nome" | "empresa">;
  responsavel: Pick<User, "name"> | null;
};

type ViewMode = "kanban" | "lista";

const columns = [
  { id: "PLANEJAMENTO", title: "Planejamento" },
  { id: "EM_ANDAMENTO", title: "Em Andamento" },
  { id: "EM_REVISAO", title: "Em Revisao" },
  { id: "CONCLUIDO", title: "Concluido" }
] as const;

export function ProjetoKanban({ projetos }: { projetos: ProjetoListItem[] }) {
  const [items, setItems] = useState(projetos);
  const [view, setView] = useState<ViewMode>("kanban");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const savedView = window.localStorage.getItem("cogniverse-projetos-view");
    if (savedView === "kanban" || savedView === "lista") {
      setView(savedView);
    }
  }, []);

  function changeView(nextView: ViewMode) {
    setView(nextView);
    window.localStorage.setItem("cogniverse-projetos-view", nextView);
  }

  const itemsByColumn = useMemo(
    () =>
      columns.reduce<Record<string, ProjetoListItem[]>>((accumulator, column) => {
        accumulator[column.id] = items.filter((item) => item.status === column.id);
        return accumulator;
      }, {}),
    [items]
  );

  function handleDragEnd(result: DropResult) {
    const destination = result.destination;

    if (!destination) {
      return;
    }

    if (destination.droppableId === result.source.droppableId) {
      return;
    }

    const projetoId = result.draggableId;
    const nextStatus = destination.droppableId as Projeto["status"];
    const previousItems = items;

    setItems((current) =>
      current.map((item) => (item.id === projetoId ? { ...item, status: nextStatus } : item))
    );

    startTransition(async () => {
      const response = await fetch(`/api/projetos/${projetoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      });

      if (!response.ok) {
        setItems(previousItems);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold tracking-tight text-ink-primary">Visualizacao</h2>
          <p className="text-sm text-ink-secondary">Alterne entre kanban e lista.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => changeView("kanban")}
            type="button"
            variant={view === "kanban" ? "primary" : "secondary"}
          >
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </Button>
          <Button
            onClick={() => changeView("lista")}
            type="button"
            variant={view === "lista" ? "primary" : "secondary"}
          >
            <List className="h-4 w-4" />
            Lista
          </Button>
        </div>
      </div>

      {view === "kanban" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid gap-4 xl:grid-cols-4">
            {columns.map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex w-72 flex-col gap-3 rounded-card border border-border bg-bg-surface p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-ink-primary">{column.title}</h3>
                      <span className="font-heading text-xs font-bold text-ink-tertiary">
                        {itemsByColumn[column.id]?.length ?? 0}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {itemsByColumn[column.id]?.map((projeto, index) => (
                        <Draggable draggableId={projeto.id} index={index} key={projeto.id}>
                          {(dragProvided, snapshot) => (
                            <Link
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`block rounded-[10px] border border-border bg-bg-surface2 p-4 transition-all duration-200 hover:border-accent-border ${
                                snapshot.isDragging ? "border-accent-border shadow-lg" : ""
                              }`}
                              href={`/projetos/${projeto.id}`}
                            >
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium text-ink-primary">{projeto.nome}</p>
                                  <p className="mt-1 text-sm text-ink-secondary">
                                    {projeto.cliente.empresa ?? projeto.cliente.nome}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge label={projeto.prioridade} />
                                  <Badge label={projeto.status} />
                                </div>
                                <div className="text-xs text-ink-tertiary">
                                  <p>Deadline: {projeto.deadline ? formatDate(projeto.deadline) : "-"}</p>
                                  <p>Progresso: {projeto.progresso}%</p>
                                </div>
                              </div>
                            </Link>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <Card className="p-0">
          <div className="p-4 text-sm text-ink-secondary">
            A visualizacao em lista esta disponivel acima na tabela principal da pagina.
            {isPending ? " Atualizando status..." : ""}
          </div>
        </Card>
      )}
    </div>
  );
}
