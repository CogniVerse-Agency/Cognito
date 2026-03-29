"use client";

import type { Cliente, Contrato } from "@prisma/client";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";

type ClienteOption = Pick<Cliente, "id" | "nome" | "empresa">;

interface ContratoFormProps {
  contrato?: Contrato;
  clientes: ClienteOption[];
  initialClienteId?: string;
}

interface FormErrors {
  titulo?: string;
  clienteId?: string;
  valor?: string;
  periodicidade?: string;
}

function toDateInputValue(value?: Date | string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

export function ContratoForm({
  contrato,
  clientes,
  initialClienteId
}: ContratoFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [recorrente, setRecorrente] = useState(contrato?.recorrente ?? false);
  const [isPending, startTransition] = useTransition();

  function validate(formData: FormData) {
    const nextErrors: FormErrors = {};
    const titulo = String(formData.get("titulo") ?? "").trim();
    const clienteId = String(formData.get("clienteId") ?? "").trim();
    const valor = Number(formData.get("valor"));
    const recorrenteAtual = String(formData.get("recorrente") ?? "") === "on";
    const periodicidade = String(formData.get("periodicidade") ?? "").trim();

    if (!titulo || titulo.length < 2) {
      nextErrors.titulo = "Informe um titulo valido.";
    }

    if (!clienteId) {
      nextErrors.clienteId = "Selecione um cliente.";
    }

    if (!Number.isFinite(valor) || valor <= 0) {
      nextErrors.valor = "Informe um valor maior que zero.";
    }

    if (recorrenteAtual && !periodicidade) {
      nextErrors.periodicidade = "Selecione a periodicidade.";
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
      titulo: String(formData.get("titulo") ?? "").trim(),
      clienteId: String(formData.get("clienteId") ?? "").trim(),
      tipo: String(formData.get("tipo") ?? "").trim(),
      valor: Number(formData.get("valor")),
      recorrente: String(formData.get("recorrente") ?? "") === "on",
      periodicidade: String(formData.get("periodicidade") ?? "").trim() || null,
      dataInicio: String(formData.get("dataInicio") ?? "").trim(),
      dataFim: String(formData.get("dataFim") ?? "").trim() || null,
      descricao: String(formData.get("descricao") ?? "").trim() || null,
      status: String(formData.get("status") ?? "").trim()
    };

    startTransition(async () => {
      const response = await fetch(contrato ? `/api/contratos/${contrato.id}` : "/api/contratos", {
        method: contrato ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; data?: Contrato };

      if (!response.ok) {
        showToast(result.error ?? "Nao foi possivel salvar o contrato.", "error");
        return;
      }

      showToast(contrato ? "Contrato atualizado com sucesso." : "Contrato criado com sucesso.");
      const targetId = result.data?.id ?? contrato?.id;
      router.push(targetId ? `/contratos/${targetId}` : "/contratos");
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Input defaultValue={contrato?.titulo ?? ""} label="Titulo*" name="titulo" placeholder="Nome do contrato" />
            {errors.titulo ? <p className="text-xs text-status-error">{errors.titulo}</p> : null}
          </div>

          <div className="space-y-2">
            <Select defaultValue={contrato?.clienteId ?? initialClienteId ?? ""} label="Cliente*" name="clienteId">
              <option value="">Selecione</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.empresa ? `${cliente.empresa} - ${cliente.nome}` : cliente.nome}
                </option>
              ))}
            </Select>
            {errors.clienteId ? <p className="text-xs text-status-error">{errors.clienteId}</p> : null}
          </div>

          <Select defaultValue={contrato?.tipo ?? "HIGH_TOUCH"} label="Tipo*" name="tipo">
            <option value="HIGH_TOUCH">High Touch</option>
            <option value="PRODUCTIZED">Productized</option>
            <option value="ATIVO_DIGITAL">Ativo Digital</option>
            <option value="CONSULTORIA">Consultoria</option>
          </Select>

          <div className="space-y-2">
            <Input defaultValue={contrato?.valor ?? ""} label="Valor*" min="0" name="valor" placeholder="0.00" step="0.01" type="number" />
            {errors.valor ? <p className="text-xs text-status-error">{errors.valor}</p> : null}
          </div>

          <label className="flex items-center gap-3 rounded-input border border-border bg-bg-surface2 px-4 py-3 text-sm text-ink-primary">
            <input
              className="h-4 w-4 rounded border-border bg-bg-surface2 text-accent focus:border-border-focus focus:ring-0"
              defaultChecked={contrato?.recorrente ?? false}
              name="recorrente"
              onChange={(event) => setRecorrente(event.target.checked)}
              type="checkbox"
            />
            Contrato recorrente
          </label>

          <div className="space-y-2">
            <Select
              defaultValue={contrato?.periodicidade ?? ""}
              disabled={!recorrente}
              label="Periodicidade"
              name="periodicidade"
            >
              <option value="">Selecione</option>
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </Select>
            {errors.periodicidade ? <p className="text-xs text-status-error">{errors.periodicidade}</p> : null}
          </div>

          <Input defaultValue={toDateInputValue(contrato?.dataInicio)} label="Data de Inicio*" name="dataInicio" type="date" />
          <Input defaultValue={toDateInputValue(contrato?.dataFim)} label="Data de Fim" name="dataFim" type="date" />

          <Select defaultValue={contrato?.status ?? "RASCUNHO"} label="Status*" name="status">
            <option value="RASCUNHO">Rascunho</option>
            <option value="ENVIADO">Enviado</option>
            <option value="ASSINADO">Assinado</option>
            <option value="ATIVO">Ativo</option>
            <option value="ENCERRADO">Encerrado</option>
            <option value="CANCELADO">Cancelado</option>
          </Select>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-ink-primary">Descricao</span>
          <textarea
            className="input-base min-h-[140px] resize-y"
            defaultValue={contrato?.descricao ?? ""}
            name="descricao"
            placeholder="Escopo do contrato, entregas e observacoes"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button disabled={isPending} type="submit">
            {isPending ? "Salvando..." : contrato ? "Salvar Alteracoes" : "Criar Contrato"}
          </Button>
          <Button disabled={isPending} onClick={() => router.back()} type="button" variant="ghost">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
