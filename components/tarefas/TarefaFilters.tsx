import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface TarefaFiltersProps {
  status?: string;
  prioridade?: string;
  projetoId?: string;
  responsavelId?: string;
  scope: "mine" | "all";
  projetos: Array<{ id: string; nome: string }>;
  usuarios: Array<{ id: string; name: string }>;
}

export function TarefaFilters({
  status,
  prioridade,
  projetoId,
  responsavelId,
  scope,
  projetos,
  usuarios
}: TarefaFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Link
          className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
            scope === "mine"
              ? "border-accent bg-accent/10 text-ink-primary"
              : "border-border bg-bg-surface text-ink-secondary hover:border-border-hover hover:text-ink-primary"
          }`}
          href="/tarefas?scope=mine"
        >
          Minhas tarefas
        </Link>
        <Link
          className={`rounded-pill border px-4 py-2 text-sm font-medium transition-colors ${
            scope === "all"
              ? "border-accent bg-accent/10 text-ink-primary"
              : "border-border bg-bg-surface text-ink-secondary hover:border-border-hover hover:text-ink-primary"
          }`}
          href="/tarefas?scope=all"
        >
          Todas
        </Link>
      </div>

      <form className="grid gap-4 rounded-card border border-border bg-bg-surface p-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
        <input name="scope" type="hidden" value={scope} />
        <Select defaultValue={status ?? ""} label="Status" name="status">
          <option value="">Todos</option>
          <option value="BACKLOG">Backlog</option>
          <option value="A_FAZER">A Fazer</option>
          <option value="EM_ANDAMENTO">Em Andamento</option>
          <option value="EM_REVISAO">Em Revisao</option>
          <option value="CONCLUIDO">Concluido</option>
        </Select>
        <Select defaultValue={prioridade ?? ""} label="Prioridade" name="prioridade">
          <option value="">Todas</option>
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Media</option>
          <option value="ALTA">Alta</option>
          <option value="CRITICA">Critica</option>
        </Select>
        <Select defaultValue={projetoId ?? ""} label="Projeto" name="projetoId">
          <option value="">Todos</option>
          {projetos.map((projeto) => (
            <option key={projeto.id} value={projeto.id}>
              {projeto.nome}
            </option>
          ))}
        </Select>
        <Select defaultValue={responsavelId ?? ""} label="Responsavel" name="responsavelId">
          <option value="">Todos</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.name}
            </option>
          ))}
        </Select>
        <div className="flex items-end">
          <Button className="w-full" type="submit" variant="secondary">
            Filtrar
          </Button>
        </div>
        <div className="flex items-end">
          <Link className="inline-flex w-full items-center justify-center rounded-pill border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:border-border-hover hover:text-ink-primary" href={`/tarefas?scope=${scope}`}>
            Limpar
          </Link>
        </div>
      </form>
    </div>
  );
}
