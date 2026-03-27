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
            <h1 className="text-3xl font-semibold text-text-primary">{contrato.titulo}</h1>
            <Badge label={contrato.status} />
          </div>
          <p className="text-sm text-text-muted">
            {contrato.cliente.empresa ?? contrato.cliente.nome}
          </p>
        </div>

        {editing ? (
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
            href={`/contratos/${contrato.id}`}
          >
            Cancelar Edicao
          </Link>
        ) : (
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
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
