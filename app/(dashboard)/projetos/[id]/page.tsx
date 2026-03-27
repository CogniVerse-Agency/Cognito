import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProjetoForm } from "@/components/projetos/ProjetoForm";
import { TarefaCard } from "@/components/projetos/TarefaCard";
import { getProjetoById, getProjetoFormOptions } from "@/lib/projetos";
import { formatDate } from "@/lib/utils";

const taskColumns = [
  { id: "BACKLOG", title: "Backlog" },
  { id: "A_FAZER", title: "A Fazer" },
  { id: "EM_ANDAMENTO", title: "Em Andamento" },
  { id: "EM_REVISAO", title: "Em Revisao" },
  { id: "CONCLUIDO", title: "Concluido" }
] as const;

export default async function ProjetoDetalhePage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const [projeto, options] = await Promise.all([
    getProjetoById(params.id),
    getProjetoFormOptions()
  ]);

  if (!projeto) {
    notFound();
  }

  const editing = typeof searchParams.edit === "string" && searchParams.edit === "1";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-text-primary">{projeto.nome}</h1>
            <Badge label={projeto.status} />
            <Badge label={projeto.prioridade} />
          </div>
          <p className="text-sm text-text-muted">
            {projeto.cliente.empresa ?? projeto.cliente.nome}
          </p>
        </div>

        {editing ? (
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
            href={`/projetos/${projeto.id}`}
          >
            Cancelar Edicao
          </Link>
        ) : (
          <Link
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10"
            href={`/projetos/${projeto.id}?edit=1`}
          >
            Editar
          </Link>
        )}
      </div>

      {editing ? (
        <ProjetoForm
          clientes={options.clientes}
          contratos={options.contratos}
          projeto={projeto}
          usuarios={options.usuarios}
        />
      ) : (
        <>
          <Card className="grid gap-4 p-6 md:grid-cols-2">
            <Field label="Cliente" value={projeto.cliente.empresa ?? projeto.cliente.nome} />
            <Field label="Contrato" value={projeto.contrato?.titulo ?? "-"} />
            <Field label="Responsavel" value={projeto.responsavel?.name ?? "-"} />
            <Field label="Status" value={<Badge label={projeto.status} />} />
            <Field label="Prioridade" value={<Badge label={projeto.prioridade} />} />
            <Field label="Progresso" value={`${projeto.progresso}%`} />
            <Field
              label="Data de Inicio"
              value={projeto.dataInicio ? formatDate(projeto.dataInicio) : "-"}
            />
            <Field
              label="Deadline"
              value={projeto.deadline ? formatDate(projeto.deadline) : "-"}
            />
            <div className="md:col-span-2">
              <Field label="Descricao" value={projeto.descricao ?? "Sem descricao cadastrada."} />
            </div>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">Mini Kanban de Tarefas</h2>
                <p className="text-sm text-text-muted">
                  Base inicial das tarefas do projeto. O CRUD completo entra na etapa seguinte.
                </p>
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-5">
              {taskColumns.map((column) => {
                const tarefas = projeto.tarefas.filter((tarefa) => tarefa.status === column.id);

                return (
                  <div key={column.id} className="rounded-xl border border-border bg-white/5 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-text-primary">{column.title}</h3>
                      <span className="text-xs text-text-muted">{tarefas.length}</span>
                    </div>
                    <div className="space-y-3">
                      {tarefas.length ? (
                        tarefas.map((tarefa) => <TarefaCard key={tarefa.id} tarefa={tarefa} />)
                      ) : (
                        <div className="rounded-xl border border-dashed border-white/10 px-3 py-6 text-center text-sm text-text-muted">
                          Sem tarefas nesta coluna.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <div className="mt-2 text-sm text-text-primary">{value}</div>
    </div>
  );
}
