import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional();

export const clienteSchema = z.object({
  nome: z.string().trim().min(2, "Nome e obrigatorio"),
  empresa: optionalText,
  email: z
    .string()
    .trim()
    .email("Email invalido")
    .transform((value) => value.toLowerCase())
    .or(z.literal(""))
    .transform((value) => (value ? value : null))
    .optional(),
  telefone: optionalText,
  status: z.enum(["LEAD", "PROSPECT", "ATIVO", "PAUSADO", "ENCERRADO"]),
  tipoServico: z
    .enum(["HIGH_TOUCH", "PRODUCTIZED", "ATIVO_DIGITAL", "CONSULTORIA"])
    .nullable()
    .optional(),
  canalOrigem: optionalText,
  valorContrato: z
    .union([z.number(), z.nan(), z.null(), z.undefined()])
    .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : null)),
  nps: z.enum(["PROMOTOR", "NEUTRO", "DETRATOR"]).nullable().optional(),
  notas: optionalText
});

export const clienteQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["LEAD", "PROSPECT", "ATIVO", "PAUSADO", "ENCERRADO"]).optional(),
  tipoServico: z
    .enum(["HIGH_TOUCH", "PRODUCTIZED", "ATIVO_DIGITAL", "CONSULTORIA"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export type ClienteInput = z.infer<typeof clienteSchema>;
export type ClienteQueryInput = z.infer<typeof clienteQuerySchema>;
