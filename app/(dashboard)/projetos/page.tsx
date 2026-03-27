import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";
import { ProjetoFilters } from "@/components/projetos/ProjetoFilters";
import { ProjetoKanban } from "@/components/projetos/ProjetoKanban";
import { ProjetoTable } from "@/components/projetos/ProjetoTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { getProjetos } from "@/lib/projetos";

export default async function ProjetosPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { items, filters } = await getProjetos(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary">Projetos</h1>
          <p className="mt-2 text-sm text-text-muted">
            Gerencie projetos por lista ou kanban com status, prioridade e progresso.
          </p>
        </div>
        <Link className="primary-button sm:w-auto" href="/projetos/novo">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Link>
      </div>

      <ProjetoFilters prioridade={filters.prioridade} status={filters.status} />

      {items.length ? (
        <div className="space-y-6">
          <div className="hidden xl:block">
            <ProjetoTable projetos={items} />
          </div>
          <ProjetoKanban projetos={items} />
        </div>
      ) : (
        <EmptyState
          action={
            <Link className="primary-button" href="/projetos/novo">
              <Plus className="h-4 w-4" />
              Criar primeiro projeto
            </Link>
          }
          description="Nenhum projeto apareceu com os filtros atuais. Assim que voce criar um projeto, ele podera ser acompanhado em lista e kanban."
          icon={<ClipboardList className="h-8 w-8" />}
          title="Nenhum projeto encontrado"
        />
      )}
    </div>
  );
}
