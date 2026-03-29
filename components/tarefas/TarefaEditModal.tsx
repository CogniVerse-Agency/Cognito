"use client";

import type { Tarefa } from "@prisma/client";
import type { FormEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";

type TarefaWithRelations = Tarefa & {
  projeto: {
    id: string;
    nome: string;
  };
  responsavel: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
};

export function TarefaEditModal({
  tarefa,
  isOpen,
  onClose,
  onSaved,
  usuarios
}: {
  tarefa: TarefaWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (next: TarefaWithRelations) => void;
  usuarios: Array<{ id: string; name: string }>;
}) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !tarefa) {
    return null;
  }

  const currentTask = tarefa;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload = {
      titulo: String(formData.get("titulo") ?? "").trim(),
      descricao: String(formData.get("descricao") ?? "").trim() || null,
      status: String(formData.get("status") ?? "").trim(),
      prioridade: String(formData.get("prioridade") ?? "").trim(),
      responsavelId: String(formData.get("responsavelId") ?? "").trim() || null,
      deadline: String(formData.get("deadline") ?? "").trim() || null,
      concluida: String(formData.get("concluida") ?? "") === "on"
    };

    startTransition(async () => {
      const response = await fetch(`/api/tarefas/${currentTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { error?: string; data?: TarefaWithRelations };

      if (!response.ok || !result.data) {
        showToast(result.error ?? "Nao foi possivel atualizar a tarefa.", "error");
        return;
      }

      showToast("Tarefa atualizada com sucesso.");
      onSaved(result.data);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-card border border-border bg-bg-surface p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary">
              {currentTask.projeto.nome}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-tight text-ink-primary">
              Editar Tarefa
            </h2>
          </div>
          <button
            className="rounded-input border border-border bg-bg-surface2 p-2 text-ink-secondary transition-colors hover:border-border-hover hover:text-ink-primary"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input defaultValue={currentTask.titulo} label="Titulo" name="titulo" />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink-primary">Descricao</span>
            <textarea
              className="input-base min-h-[120px] resize-y"
              defaultValue={currentTask.descricao ?? ""}
              name="descricao"
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <Select defaultValue={currentTask.status} label="Status" name="status">
              <option value="BACKLOG">Backlog</option>
              <option value="A_FAZER">A Fazer</option>
              <option value="EM_ANDAMENTO">Em Andamento</option>
              <option value="EM_REVISAO">Em Revisao</option>
              <option value="CONCLUIDO">Concluido</option>
            </Select>
            <Select defaultValue={currentTask.prioridade} label="Prioridade" name="prioridade">
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Critica</option>
            </Select>
            <Select defaultValue={currentTask.responsavel?.id ?? ""} label="Responsavel" name="responsavelId">
              <option value="">Sem responsavel</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.name}
                </option>
              ))}
            </Select>
            <Input
              defaultValue={
                currentTask.deadline ? new Date(currentTask.deadline).toISOString().slice(0, 10) : ""
              }
              label="Deadline"
              name="deadline"
              type="date"
            />
          </div>
          <label className="flex items-center gap-3 rounded-input border border-border bg-bg-surface2 px-4 py-3 text-sm text-ink-primary">
            <input className="h-4 w-4 rounded border-border bg-bg-surface2 text-accent focus:border-border-focus focus:ring-0" defaultChecked={currentTask.concluida} name="concluida" type="checkbox" />
            Marcar como concluida
          </label>
          <div className="flex gap-3">
            <Button disabled={isPending} type="submit">
              {isPending ? "Salvando..." : "Salvar Alteracoes"}
            </Button>
            <Button onClick={onClose} type="button" variant="ghost">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
