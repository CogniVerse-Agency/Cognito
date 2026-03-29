import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { ContratoFilters } from "@/components/contratos/ContratoFilters";
import { ContratoTable } from "@/components/contratos/ContratoTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { getContratos } from "@/lib/contratos";

export default async function ContratosPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { items, filters } = await getContratos(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Contratos</h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Acompanhe status, tipo de servico e vigencia dos contratos ativos.
          </p>
        </div>
        <Link className="primary-button sm:w-auto" href="/contratos/novo">
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Link>
      </div>

      <ContratoFilters
        recorrente={filters.recorrente}
        status={filters.status}
        tipo={filters.tipo}
      />

      {items.length ? (
        <ContratoTable contratos={items} />
      ) : (
        <EmptyState
          action={
            <Link className="primary-button" href="/contratos/novo">
              <Plus className="h-4 w-4" />
              Criar primeiro contrato
            </Link>
          }
          description="Ainda nao ha contratos visiveis com os filtros atuais. Voce pode limpar os filtros ou cadastrar um novo contrato."
          icon={<FileText className="h-8 w-8" />}
          title="Nenhum contrato encontrado"
        />
      )}
    </div>
  );
}
