import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface ClienteFiltersProps {
  search?: string;
  status?: string;
  tipoServico?: string;
}

export function ClienteFilters({ search, status, tipoServico }: ClienteFiltersProps) {
  return (
    <form className="grid gap-4 rounded-card border border-border bg-bg-surface p-4 md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
      <Input defaultValue={search} icon={<Search className="h-4 w-4" />} label="Busca" name="search" placeholder="Buscar por nome ou empresa" />
      <Select defaultValue={status ?? ""} label="Status" name="status">
        <option value="">Todos</option>
        <option value="LEAD">Lead</option>
        <option value="PROSPECT">Prospect</option>
        <option value="ATIVO">Ativo</option>
        <option value="PAUSADO">Pausado</option>
        <option value="ENCERRADO">Encerrado</option>
      </Select>
      <Select defaultValue={tipoServico ?? ""} label="Tipo de Servico" name="tipoServico">
        <option value="">Todos</option>
        <option value="HIGH_TOUCH">High Touch</option>
        <option value="PRODUCTIZED">Productized</option>
        <option value="ATIVO_DIGITAL">Ativo Digital</option>
        <option value="CONSULTORIA">Consultoria</option>
      </Select>
      <div className="flex items-end">
        <Button className="w-full" type="submit" variant="secondary">
          Filtrar
        </Button>
      </div>
      <div className="flex items-end">
        <Link className="inline-flex w-full items-center justify-center rounded-pill border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary transition-colors hover:border-border-hover hover:text-ink-primary" href="/clientes">
          Limpar
        </Link>
      </div>
    </form>
  );
}
