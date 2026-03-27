import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional();

export const projetoSchema = z.object({
  nome: z.string().trim().min(2, "Nome e obrigatorio"),
  clienteId: z.string().trim().min(1, "Cliente e obrigatorio"),
  contratoId: optionalText,
  responsavelId: optionalText,
  status: z.enum([
    "PLANEJAMENTO",
    "EM_ANDAMENTO",
    "EM_REVISAO",
    "CONCLUIDO",
    "PAUSADO",
    "CANCELADO"
  ]),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]),
  dataInicio: optionalText,
  deadline: optionalText,
  descricao: optionalText
});

export const projetoQuerySchema = z.object({
  status: z
    .enum([
      "PLANEJAMENTO",
      "EM_ANDAMENTO",
      "EM_REVISAO",
      "CONCLUIDO",
      "PAUSADO",
      "CANCELADO"
    ])
    .optional(),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  clienteId: z.string().trim().optional()
});

export const projetoPatchSchema = z.object({
  status: z
    .enum([
      "PLANEJAMENTO",
      "EM_ANDAMENTO",
      "EM_REVISAO",
      "CONCLUIDO",
      "PAUSADO",
      "CANCELADO"
    ])
    .optional(),
  progresso: z.number().int().min(0).max(100).optional()
});
