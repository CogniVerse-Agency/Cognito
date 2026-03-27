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
            <h1 className="text-3xl font-semibold text-text-primary">{cliente.nome}</h1>
            <Badge label={cliente.status} />
          </div>
          <p className="text-sm text-text-muted">{cliente.empresa ?? "Sem empresa vinculada"}</p>
        </div>

        <div className="flex gap-3">
          {editing ? (
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
              href={`/clientes/${cliente.id}`}
            >
              Cancelar Edicao
            </Link>
          ) : (
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
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
