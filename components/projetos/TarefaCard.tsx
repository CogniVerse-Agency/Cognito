import type { Tarefa, User } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

type TarefaItem = Tarefa & {
  responsavel: Pick<User, "name" | "avatar"> | null;
};

export function TarefaCard({ tarefa }: { tarefa: TarefaItem }) {
  return (
    <Card className="space-y-3 p-4">
      <div>
        <p className="font-medium text-text-primary">{tarefa.titulo}</p>
        {tarefa.descricao ? (
          <p className="mt-1 text-sm text-text-muted">{tarefa.descricao}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge label={tarefa.prioridade} />
        <Badge label={tarefa.status} />
      </div>
      <div className="text-xs text-text-muted">
        <p>{tarefa.responsavel?.name ?? "Sem responsavel"}</p>
        <p>{tarefa.deadline ? `Deadline: ${formatDate(tarefa.deadline)}` : "Sem deadline"}</p>
      </div>
    </Card>
  );
}
