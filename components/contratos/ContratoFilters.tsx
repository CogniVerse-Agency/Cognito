import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

interface ContratoFiltersProps {
  status?: string;
  tipo?: string;
  recorrente?: string;
}

export function ContratoFilters({ status, tipo, recorrente }: ContratoFiltersProps) {
  return (
    <form className="grid gap-4 rounded-card border border-border bg-bg-surface p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
      <Select defaultValue={status ?? ""} label="Status" name="status">
        <option value="">Todos</option>
        <option value="RASCUNHO">Rascunho</option>
        <option value="ENVIADO">Enviado</option>
        <option value="ASSINADO">Assinado</option>
        <option value="ATIVO">Ativo</option>
        <option value="ENCERRADO">Encerrado</option>
        <option value="CANCELADO">Cancelado</option>
      </Select>
      <Select defaultValue={tipo ?? ""} label="Tipo" name="tipo">
        <option value="">Todos</option>
        <option value="HIGH_TOUCH">High Touch</option>
        <option value="PRODUCTIZED">Productized</option>
        <option value="ATIVO_DIGITAL">Ativo Digital</option>
        <option value="CONSULTORIA">Consultoria</option>
      </Select>
      <Select defaultValue={recorrente ?? ""} label="Recorrente" name="recorrente">
        <option value="">Todos</option>
        <option value="true">Sim</option>
        <option value="false">Nao</option>
      </Select>
      <div className="flex items-end">
        <Button className="w-full" type="submit" variant="secondary">
          Filtrar
        </Button>
      </div>
      <div className="flex items-end">
        <Link className="inline-flex w-full items-center justify-center rounded-pill border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:border-border-hover hover:text-ink-primary" href="/contratos">
          Limpar
        </Link>
      </div>
    </form>
  );
}
