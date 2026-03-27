import Link from "next/link";
import type { Contrato, Cliente } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatCurrency, formatDate } from "@/lib/utils";

type ContratoListItem = Contrato & {
  cliente: Pick<Cliente, "id" | "nome" | "empresa">;
};

export function ContratoTable({ contratos }: { contratos: ContratoListItem[] }) {
  return (
    <Table
      columns={[
        {
          key: "titulo",
          header: "Titulo",
          render: (item) => (
            <Link className="font-medium text-text-primary hover:text-brand-cyan" href={`/contratos/${item.id}`}>
              {item.titulo}
            </Link>
          )
        },
        {
          key: "cliente",
          header: "Cliente",
          render: (item) => item.cliente.empresa ?? item.cliente.nome
        },
        {
          key: "tipo",
          header: "Tipo",
          render: (item) => item.tipo.replaceAll("_", " ")
        },
        {
          key: "valor",
          header: "Valor",
          render: (item) => formatCurrency(item.valor)
        },
        {
          key: "recorrente",
          header: "Recorrente",
          render: (item) => (item.recorrente ? "Sim" : "Nao")
        },
        {
          key: "status",
          header: "Status",
          render: (item) => <Badge label={item.status} />
        },
        {
          key: "dataInicio",
          header: "Data Inicio",
          render: (item) => formatDate(item.dataInicio)
        }
      ]}
      data={contratos}
      emptyMessage="Nenhum contrato encontrado com os filtros atuais."
      getRowKey={(item) => item.id}
    />
  );
}
