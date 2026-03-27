"use client";

import type { Contrato, Projeto } from "@prisma/client";
import type { FormEvent } from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";

type ClienteOption = {
  id: string;
  nome: string;
  empresa: string | null;
};

type ContratoOption = Pick<Contrato, "id" | "clienteId" | "titulo">;
type UserOption = {
  id: string;
  name: string;
  email: string;
};

interface ProjetoFormProps {
  projeto?: Projeto;
  clientes: ClienteOption[];
  contratos: ContratoOption[];
  usuarios: UserOption[];
  initialClienteId?: string;
  initialContratoId?: string;
}

export function ProjetoForm({
  projeto,
  clientes,
  contratos,
  usuarios,
  initialClienteId,
  initialContratoId
}: ProjetoFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [clienteId, setClienteId] = useState(projeto?.clienteId ?? initialClienteId ?? "");

  const contratosFiltrados = useMemo(
    () => contratos.filter((contrato) => !clienteId || contrato.clienteId === clienteId),
    [clienteId, contratos]
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      clienteId: String(formData.get("clienteId") ?? "").trim(),
      contratoId: String(formData.get("contratoId") ?? "").trim() || null,
      responsavelId: String(formData.get("responsavelId") ?? "").trim() || null,
      status: String(formData.get("status") ?? "").trim(),
      prioridade: String(formData.get("prioridade") ?? "").trim(),
      dataInicio: String(formData.get("dataInicio") ?? "").trim() || null,
      deadline: String(formData.get("deadline") ?? "").trim() || null,
      descricao: String(formData.get("descricao") ?? "").trim() || null
    };

    startTransition(async () => {
      const response = await fetch(projeto ? `/api/projetos/${projeto.id}` : "/api/projetos", {
        method: projeto ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; data?: Projeto };

      if (!response.ok) {
        showToast(result.error ?? "Nao foi possivel salvar o projeto.", "error");
        return;
      }

      showToast(projeto ? "Projeto atualizado com sucesso." : "Projeto criado com sucesso.");

      const targetId = result.data?.id ?? projeto?.id;
      router.push(targetId ? `/projetos/${targetId}` : "/projetos");
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input defaultValue={projeto?.nome ?? ""} label="Nome*" name="nome" placeholder="Nome do projeto" />

          <Select
            defaultValue={projeto?.clienteId ?? initialClienteId ?? ""}
            label="Cliente*"
            name="clienteId"
            onChange={(event) => setClienteId(event.target.value)}
          >
            <option value="">Selecione</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.empresa ? `${cliente.empresa} - ${cliente.nome}` : cliente.nome}
              </option>
            ))}
          </Select>

          <Select defaultValue={projeto?.contratoId ?? initialContratoId ?? ""} label="Contrato" name="contratoId">
            <option value="">Selecione</option>
            {contratosFiltrados.map((contrato) => (
              <option key={contrato.id} value={contrato.id}>
                {contrato.titulo}
              </option>
            ))}
          </Select>

          <Select defaultValue={projeto?.responsavelId ?? ""} label="Responsavel" name="responsavelId">
            <option value="">Selecione</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.name}
              </option>
            ))}
          </Select>

          <Select defaultValue={projeto?.status ?? "PLANEJAMENTO"} label="Status" name="status">
            <option value="PLANEJAMENTO">Planejamento</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="EM_REVISAO">Em Revisao</option>
            <option value="CONCLUIDO">Concluido</option>
            <option value="PAUSADO">Pausado</option>
            <option value="CANCELADO">Cancelado</option>
          </Select>

          <Select defaultValue={projeto?.prioridade ?? "MEDIA"} label="Prioridade" name="prioridade">
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Critica</option>
          </Select>

          <Input
            defaultValue={projeto?.dataInicio ? new Date(projeto.dataInicio).toISOString().slice(0, 10) : ""}
            label="Data de Inicio"
            name="dataInicio"
            type="date"
          />
          <Input
            defaultValue={projeto?.deadline ? new Date(projeto.deadline).toISOString().slice(0, 10) : ""}
            label="Deadline"
            name="deadline"
            type="date"
          />
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-primary">Descricao</span>
          <textarea
            className="input-base min-h-[140px] resize-y"
            defaultValue={projeto?.descricao ?? ""}
            name="descricao"
            placeholder="Objetivo, escopo e entregas do projeto"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} type="submit">
            {isPending ? "Salvando..." : projeto ? "Salvar Alteracoes" : "Criar Projeto"}
          </Button>
          <Button disabled={isPending} onClick={() => router.back()} type="button" variant="ghost">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
