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
        <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 p-2 text-brand-cyan">
          <Clock3 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Atividade Recente
          </h2>
          <p className="text-sm text-text-muted">
            Ultimos registros criados e atualizados em clientes, projetos e tarefas.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {atividades.length ? (
          atividades.map((atividade) => (
            <div
              key={atividade.id}
              className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {atividade.titulo}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {atividade.descricao}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {formatDistanceToNow(new Date(atividade.timestamp), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-8 text-sm text-text-muted">
            Sem atividade recente ainda.
          </div>
        )}
      </div>
    </Card>
  );
}
