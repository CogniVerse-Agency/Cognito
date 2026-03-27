import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface ProjetoFiltersProps {
  status?: string;
  prioridade?: string;
}

export function ProjetoFilters({ status, prioridade }: ProjetoFiltersProps) {
  return (
    <form className="grid gap-4 rounded-xl border border-border bg-white/5 p-4 md:grid-cols-[1fr_1fr_auto_auto]">
      <Select defaultValue={status ?? ""} label="Status" name="status">
        <option value="">Todos</option>
        <option value="PLANEJAMENTO">Planejamento</option>
        <option value="EM_ANDAMENTO">Em Andamento</option>
        <option value="EM_REVISAO">Em Revisao</option>
        <option value="CONCLUIDO">Concluido</option>
        <option value="PAUSADO">Pausado</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>
      <Select defaultValue={prioridade ?? ""} label="Prioridade" name="prioridade">
        <option value="">Todas</option>
        <option value="BAIXA">Baixa</option>
        <option value="MEDIA">Media</option>
        <option value="ALTA">Alta</option>
        <option value="CRITICA">Critica</option>
      </Select>
      <div className="flex items-end">
        <Button className="w-full" type="submit" variant="secondary">
          Filtrar
        </Button>
      </div>
      <div className="flex items-end">
        <Link className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-text-muted hover:bg-white/5 hover:text-text-primary" href="/projetos">
          Limpar
        </Link>
      </div>
    </form>
  );
}
