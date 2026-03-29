import Link from "next/link";
import type { Cliente } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils";

interface ClienteTableProps {
  clientes: Cliente[];
}

export function ClienteTable({ clientes }: ClienteTableProps) {
  return (
    <Table
      columns={[
        {
          key: "nome",
          header: "Nome",
          render: (item) => (
            <Link className="font-medium text-ink-primary transition-colors hover:text-accent" href={`/clientes/${item.id}`}>
              {item.nome}
            </Link>
          )
        },
        {
          key: "empresa",
          header: "Empresa",
          render: (item) => item.empresa ?? "-"
        },
        {
          key: "status",
          header: "Status",
          render: (item) => <Badge label={item.status} />
        },
        {
          key: "tipoServico",
          header: "Tipo",
          render: (item) => item.tipoServico?.replaceAll("_", " ") ?? "-"
        },
        {
          key: "valorContrato",
          header: "Valor Contrato",
          render: (item) =>
            typeof item.valorContrato === "number"
              ? formatCurrency(item.valorContrato)
              : "-"
        },
        {
          key: "acoes",
          header: "Acoes",
          render: (item) => (
            <div className="flex gap-3">
              <Link className="font-medium text-accent transition-colors hover:text-accent-dim" href={`/clientes/${item.id}`}>
                Abrir
              </Link>
              <Link className="text-ink-secondary transition-colors hover:text-ink-primary" href={`/clientes/${item.id}?edit=1`}>
                Editar
              </Link>
            </div>
          )
        }
      ]}
      data={clientes}
      emptyMessage="Nenhum cliente encontrado com os filtros atuais."
      getRowKey={(item) => item.id}
    />
  );
}
