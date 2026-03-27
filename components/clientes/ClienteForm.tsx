"use client";

import type { Cliente, NPS, TipoServico, ClienteStatus } from "@prisma/client";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";

interface ClienteFormProps {
  cliente?: Cliente;
}

interface FormErrors {
  nome?: string;
  email?: string;
  status?: string;
}

export function ClienteForm({ cliente }: ClienteFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  function validate(formData: FormData) {
    const nextErrors: FormErrors = {};

    const nome = String(formData.get("nome") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const status = String(formData.get("status") ?? "").trim();

    if (!nome || nome.length < 2) {
      nextErrors.nome = "Informe um nome valido.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Informe um email valido.";
    }

    if (!status) {
      nextErrors.status = "Selecione um status.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!validate(formData)) {
      return;
    }

    const payload = {
      nome: String(formData.get("nome") ?? "").trim(),
      empresa: String(formData.get("empresa") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      telefone: String(formData.get("telefone") ?? "").trim() || null,
      status: String(formData.get("status") ?? "").trim() as ClienteStatus,
      tipoServico:
        (String(formData.get("tipoServico") ?? "").trim() || null) as TipoServico | null,
      canalOrigem: String(formData.get("canalOrigem") ?? "").trim() || null,
      valorContrato:
        String(formData.get("valorContrato") ?? "").trim().length > 0
          ? Number(formData.get("valorContrato"))
          : null,
      nps: (String(formData.get("nps") ?? "").trim() || null) as NPS | null,
      notas: String(formData.get("notas") ?? "").trim() || null
    };

    startTransition(async () => {
      const response = await fetch(cliente ? `/api/clientes/${cliente.id}` : "/api/clientes", {
        method: cliente ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; data?: Cliente };

      if (!response.ok) {
        showToast(result.error ?? "Nao foi possivel salvar o cliente.", "error");
        return;
      }

      showToast(cliente ? "Cliente atualizado com sucesso." : "Cliente criado com sucesso.");

      const targetId = result.data?.id ?? cliente?.id;
      router.push(targetId ? `/clientes/${targetId}` : "/clientes");
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Input defaultValue={cliente?.nome ?? ""} label="Nome*" name="nome" placeholder="Nome do contato" />
            {errors.nome ? <p className="text-sm text-red-300">{errors.nome}</p> : null}
          </div>
          <Input defaultValue={cliente?.empresa ?? ""} label="Empresa" name="empresa" placeholder="Nome da empresa" />
          <div className="space-y-2">
            <Input defaultValue={cliente?.email ?? ""} label="Email" name="email" placeholder="email@empresa.com" type="email" />
            {errors.email ? <p className="text-sm text-red-300">{errors.email}</p> : null}
          </div>
          <Input defaultValue={cliente?.telefone ?? ""} label="Telefone" name="telefone" placeholder="+55 11 99999-9999" />
          <div className="space-y-2">
            <Select defaultValue={cliente?.status ?? "LEAD"} label="Status*" name="status">
              <option value="LEAD">Lead</option>
              <option value="PROSPECT">Prospect</option>
              <option value="ATIVO">Ativo</option>
              <option value="PAUSADO">Pausado</option>
              <option value="ENCERRADO">Encerrado</option>
            </Select>
            {errors.status ? <p className="text-sm text-red-300">{errors.status}</p> : null}
          </div>
          <Select defaultValue={cliente?.tipoServico ?? ""} label="Tipo de Servico" name="tipoServico">
            <option value="">Selecione</option>
            <option value="HIGH_TOUCH">High Touch</option>
            <option value="PRODUCTIZED">Productized</option>
            <option value="ATIVO_DIGITAL">Ativo Digital</option>
            <option value="CONSULTORIA">Consultoria</option>
          </Select>
          <Input defaultValue={cliente?.canalOrigem ?? ""} label="Canal de Origem" name="canalOrigem" placeholder="Inbound, referral, outbound..." />
          <Input defaultValue={cliente?.valorContrato ?? ""} label="Valor do Contrato" min="0" name="valorContrato" placeholder="0.00" step="0.01" type="number" />
          <Select defaultValue={cliente?.nps ?? ""} label="NPS" name="nps">
            <option value="">Selecione</option>
            <option value="PROMOTOR">Promotor</option>
            <option value="NEUTRO">Neutro</option>
            <option value="DETRATOR">Detrator</option>
          </Select>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-primary">Notas</span>
          <textarea
            className="input-base min-h-[140px] resize-y"
            defaultValue={cliente?.notas ?? ""}
            name="notas"
            placeholder="Contexto comercial, observacoes e proximos passos"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} type="submit">
            {isPending ? "Salvando..." : cliente ? "Salvar Alteracoes" : "Criar Cliente"}
          </Button>
          <Button disabled={isPending} onClick={() => router.back()} type="button" variant="ghost">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
