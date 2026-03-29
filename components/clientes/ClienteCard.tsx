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
          <Link className="font-heading text-lg font-bold tracking-tight text-ink-primary transition-colors hover:text-accent" href={`/clientes/${cliente.id}`}>
            {cliente.nome}
          </Link>
          <p className="mt-1 text-sm text-ink-secondary">{cliente.empresa ?? "Sem empresa"}</p>
        </div>
        <Badge label={cliente.status} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">Tipo</p>
          <p className="mt-1 text-ink-primary">
            {cliente.tipoServico?.replaceAll("_", " ") ?? "-"}
          </p>
        </div>
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">Valor</p>
          <p className="mt-1 text-ink-primary">
            {typeof cliente.valorContrato === "number"
              ? formatCurrency(cliente.valorContrato)
              : "-"}
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link className="text-sm font-medium text-accent transition-colors hover:text-accent-dim" href={`/clientes/${cliente.id}`}>
          Abrir
        </Link>
        <Link className="text-sm text-ink-secondary transition-colors hover:text-ink-primary" href={`/clientes/${cliente.id}?edit=1`}>
          Editar
        </Link>
      </div>
    </Card>
  );
}
