import Link from "next/link";
import { Plus, Users2 } from "lucide-react";
import { ClienteCard } from "@/components/clientes/ClienteCard";
import { ClienteFilters } from "@/components/clientes/ClienteFilters";
import { ClientePagination } from "@/components/clientes/ClientePagination";
import { ClienteTable } from "@/components/clientes/ClienteTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { getClientes } from "@/lib/clientes";

export default async function ClientesPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { items, meta, filters } = await getClientes(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Clientes</h1>
          <p className="mt-2 text-sm text-ink-secondary">
            Gestao de clientes, status comerciais e contratos vinculados.
          </p>
        </div>
        <Link className="primary-button sm:w-auto" href="/clientes/novo">
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Link>
      </div>

      <ClienteFilters
        search={filters.search}
        status={filters.status}
        tipoServico={filters.tipoServico}
      />

      {items.length ? (
        <>
          <div className="hidden md:block">
            <ClienteTable clientes={items} />
          </div>

          <div className="grid gap-4 md:hidden">
            {items.map((cliente) => (
              <ClienteCard key={cliente.id} cliente={cliente} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          action={
            <Link className="primary-button" href="/clientes/novo">
              <Plus className="h-4 w-4" />
              Criar primeiro cliente
            </Link>
          }
          description="Nenhum cliente apareceu com os filtros atuais. Ajuste os filtros ou cadastre um novo cliente para iniciar a base comercial."
          icon={<Users2 className="h-8 w-8" />}
          title="Nenhum cliente encontrado"
        />
      )}

      <ClientePagination page={meta.page} searchParams={searchParams} totalPages={meta.totalPages} />
    </div>
  );
}
