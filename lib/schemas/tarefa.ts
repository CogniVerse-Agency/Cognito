import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional();

export const tarefaQuerySchema = z.object({
  status: z
    .enum(["BACKLOG", "A_FAZER", "EM_ANDAMENTO", "EM_REVISAO", "CONCLUIDO"])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  projetoId: z.string().trim().optional(),
  responsavelId: z.string().trim().optional(),
  scope: z.enum(["mine", "all"]).default("mine")
});

export const tarefaUpdateSchema = z.object({
  titulo: z.string().trim().min(2).optional(),
  descricao: optionalText,
  status: z
    .enum(["BACKLOG", "A_FAZER", "EM_ANDAMENTO", "EM_REVISAO", "CONCLUIDO"])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  responsavelId: optionalText,
  deadline: optionalText,
  concluida: z.boolean().optional()
});
