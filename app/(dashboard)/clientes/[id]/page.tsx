import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ClienteForm } from "@/components/clientes/ClienteForm";
import { ClienteTabs } from "@/components/clientes/ClienteTabs";
import { getClienteById } from "@/lib/clientes";

export default async function ClienteDetalhePage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cliente = await getClienteById(params.id);

  if (!cliente) {
    notFound();
  }

  const editing = typeof searchParams.edit === "string" && searchParams.edit === "1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">{cliente.nome}</h1>
            <Badge label={cliente.status} />
          </div>
          <p className="text-sm text-ink-secondary">{cliente.empresa ?? "Sem empresa vinculada"}</p>
        </div>

        <div className="flex gap-3">
          {editing ? (
            <Link
              className="inline-flex items-center justify-center rounded-pill border border-border bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-ink-secondary transition-all duration-200 hover:border-border-hover hover:text-ink-primary"
              href={`/clientes/${cliente.id}`}
            >
              Cancelar Edicao
            </Link>
          ) : (
            <Link
              className="inline-flex items-center justify-center rounded-pill border border-border bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-ink-secondary transition-all duration-200 hover:border-border-hover hover:text-ink-primary"
              href={`/clientes/${cliente.id}?edit=1`}
            >
              Editar
            </Link>
          )}
        </div>
      </div>

      {editing ? <ClienteForm cliente={cliente} /> : <ClienteTabs cliente={cliente} />}
    </div>
  );
}
