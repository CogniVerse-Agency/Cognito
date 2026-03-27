import Link from "next/link";
import type { Projeto, Cliente, User } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";

type ProjetoListItem = Projeto & {
  cliente: Pick<Cliente, "nome" | "empresa">;
  responsavel: Pick<User, "name"> | null;
};

export function ProjetoTable({ projetos }: { projetos: ProjetoListItem[] }) {
  return (
    <Table
      columns={[
        {
          key: "nome",
          header: "Nome",
          render: (item) => (
            <Link className="font-medium text-text-primary hover:text-brand-cyan" href={`/projetos/${item.id}`}>
              {item.nome}
            </Link>
          )
        },
        {
          key: "cliente",
          header: "Cliente",
          render: (item) => item.cliente.empresa ?? item.cliente.nome
        },
        {
          key: "responsavel",
          header: "Responsavel",
          render: (item) => item.responsavel?.name ?? "-"
        },
        {
          key: "status",
          header: "Status",
          render: (item) => <Badge label={item.status} />
        },
        {
          key: "prioridade",
          header: "Prioridade",
          render: (item) => <Badge label={item.prioridade} />
        },
        {
          key: "progresso",
          header: "Progresso",
          render: (item) => `${item.progresso}%`
        },
        {
          key: "deadline",
          header: "Deadline",
          render: (item) => (item.deadline ? formatDate(item.deadline) : "-")
        }
      ]}
      data={projetos}
      emptyMessage="Nenhum projeto encontrado com os filtros atuais."
      getRowKey={(item) => item.id}
    />
  );
}
