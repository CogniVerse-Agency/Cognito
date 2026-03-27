import Link from "next/link";
import type { Cliente } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

export function ClienteCard({ cliente }: { cliente: Cliente }) {
  return (
    <Card className="space-y-4 p-5 md:hidden">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link className="text-lg font-semibold text-text-primary" href={`/clientes/${cliente.id}`}>
            {cliente.nome}
          </Link>
          <p className="mt-1 text-sm text-text-muted">{cliente.empresa ?? "Sem empresa"}</p>
        </div>
        <Badge label={cliente.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-text-muted">Tipo</p>
          <p className="mt-1 text-text-primary">
            {cliente.tipoServico?.replaceAll("_", " ") ?? "-"}
          </p>
        </div>
        <div>
          <p className="text-text-muted">Valor</p>
          <p className="mt-1 text-text-primary">
            {typeof cliente.valorContrato === "number"
              ? formatCurrency(cliente.valorContrato)
              : "-"}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link className="text-sm font-medium text-brand-cyan" href={`/clientes/${cliente.id}`}>
          Abrir
        </Link>
        <Link className="text-sm text-text-muted hover:text-text-primary" href={`/clientes/${cliente.id}?edit=1`}>
          Editar
        </Link>
      </div>
    </Card>
  );
}
