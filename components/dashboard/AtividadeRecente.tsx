import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock3 } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface AtividadeRecenteProps {
  atividades: Array<{
    id: string;
    titulo: string;
    descricao: string;
    timestamp: Date;
  }>;
}

export function AtividadeRecente({ atividades }: AtividadeRecenteProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-card border border-accent/20 bg-accent/10 p-2 text-accent">
          <Clock3 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-ink-primary">
            Atividade Recente
          </h2>
          <p className="text-sm text-ink-secondary">
            Ultimos registros criados e atualizados em clientes, projetos e tarefas.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {atividades.length ? (
          atividades.map((atividade) => (
            <div
              key={atividade.id}
              className="rounded-card border border-border bg-bg-surface2 px-4 py-3 transition-colors hover:border-accent-border hover:bg-accent-muted"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink-primary">
                    {atividade.titulo}
                  </p>
                  <p className="mt-1 text-sm text-ink-secondary">
                    {atividade.descricao}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-ink-tertiary">
                  {formatDistanceToNow(new Date(atividade.timestamp), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-card border border-border bg-bg-surface2 px-4 py-8 text-sm text-ink-secondary">
            Sem atividade recente ainda.
          </div>
        )}
      </div>
    </Card>
  );
}
