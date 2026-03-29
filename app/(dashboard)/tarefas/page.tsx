import { getServerAuthSession } from "@/lib/auth";
import { getTarefaFilterOptions, getTarefas } from "@/lib/tarefas";
import { EmptyState } from "@/components/ui/EmptyState";
import { TarefaFilters } from "@/components/tarefas/TarefaFilters";
import { TarefasBoard } from "@/components/tarefas/TarefasBoard";
import { CheckSquare } from "lucide-react";

export default async function TarefasPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  const [{ items, filters }, { projetos, usuarios }] = await Promise.all([
    getTarefas(searchParams, session.user.id),
    getTarefaFilterOptions()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Tarefas</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Visao global das tarefas com filtros, conclusao inline e edicao rapida.
        </p>
      </div>

      <TarefaFilters
        prioridade={filters.prioridade}
        projetoId={filters.projetoId}
        projetos={projetos}
        responsavelId={filters.responsavelId}
        scope={filters.scope}
        status={filters.status}
        usuarios={usuarios}
      />

      {items.length ? (
        <TarefasBoard tarefas={items} usuarios={usuarios} />
      ) : (
        <EmptyState
          description="Nenhuma tarefa corresponde aos filtros atuais. Ajuste o escopo, os filtros ou crie tarefas dentro dos projetos para preencher esta visao."
          icon={<CheckSquare className="h-8 w-8" />}
          title="Nenhuma tarefa encontrada"
        />
      )}
    </div>
  );
}
