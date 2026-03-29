import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Table } from "@/components/ui/Table";
import { formatDate } from "@/lib/utils";

interface ProjetosRecentesProps {
  projetos: Array<{
    id: string;
    nome: string;
    status: string;
    progresso: number;
    deadline: Date | null;
    cliente: {
      nome: string;
      empresa: string | null;
    };
  }>;
}

export function ProjetosRecentes({ projetos }: ProjetosRecentesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-ink-primary">
            Projetos Recentes
          </h2>
          <p className="text-sm text-ink-secondary">
            Os 5 projetos mais recentes cadastrados no ERP.
          </p>
        </div>
        <Link className="text-sm font-medium text-accent transition-colors hover:text-accent-dim" href="/projetos">
          Ver todos -&gt;
        </Link>
      </div>

      <Table
        columns={[
          { key: "nome", header: "Nome" },
          {
            key: "cliente",
            header: "Cliente",
            render: (item) => item.cliente.empresa ?? item.cliente.nome
          },
          {
            key: "status",
            header: "Status",
            render: (item) => <Badge label={item.status} />
          },
          {
            key: "progresso",
            header: "Progresso",
            render: (item) => (
              <div className="min-w-[140px] space-y-2">
                <div className="h-2 overflow-hidden rounded-pill bg-bg-surface2">
                  <div
                    className="h-full rounded-pill bg-accent"
                    style={{ width: `${item.progresso}%` }}
                  />
                </div>
                <span className="text-xs text-ink-secondary">{item.progresso}%</span>
              </div>
            )
          },
          {
            key: "deadline",
            header: "Deadline",
            render: (item) =>
              item.deadline ? formatDate(item.deadline) : "Sem deadline"
          }
        ]}
        data={projetos}
        emptyMessage="Nenhum projeto recente cadastrado."
        getRowKey={(item) => item.id}
      />
    </div>
  );
}
