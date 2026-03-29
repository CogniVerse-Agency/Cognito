import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ContratoDetail } from "@/components/contratos/ContratoDetail";
import { ContratoForm } from "@/components/contratos/ContratoForm";
import { getClienteOptions, getContratoById } from "@/lib/contratos";

export default async function ContratoDetalhePage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [contrato, clientes] = await Promise.all([
    getContratoById(params.id),
    getClienteOptions()
  ]);

  if (!contrato) {
    notFound();
  }

  const editing = typeof searchParams.edit === "string" && searchParams.edit === "1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">{contrato.titulo}</h1>
            <Badge label={contrato.status} />
          </div>
          <p className="text-sm text-ink-secondary">
            {contrato.cliente.empresa ?? contrato.cliente.nome}
          </p>
        </div>

        {editing ? (
          <Link
            className="inline-flex items-center justify-center rounded-pill border border-border bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-ink-secondary transition-all duration-200 hover:border-border-hover hover:text-ink-primary"
            href={`/contratos/${contrato.id}`}
          >
            Cancelar Edicao
          </Link>
        ) : (
          <Link
            className="inline-flex items-center justify-center rounded-pill border border-border bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-ink-secondary transition-all duration-200 hover:border-border-hover hover:text-ink-primary"
            href={`/contratos/${contrato.id}?edit=1`}
          >
            Editar
          </Link>
        )}
      </div>

      {editing ? (
        <ContratoForm clientes={clientes} contrato={contrato} />
      ) : (
        <ContratoDetail contrato={contrato} />
      )}
    </div>
  );
}
