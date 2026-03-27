import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length ? value : null))
  .nullable()
  .optional();

export const contratoSchema = z
  .object({
    titulo: z.string().trim().min(2, "Titulo e obrigatorio"),
    clienteId: z.string().trim().min(1, "Cliente e obrigatorio"),
    tipo: z.enum(["HIGH_TOUCH", "PRODUCTIZED", "ATIVO_DIGITAL", "CONSULTORIA"]),
    valor: z.number().positive("Valor precisa ser maior que zero"),
    recorrente: z.boolean(),
    periodicidade: optionalText,
    dataInicio: z.string().trim().min(1, "Data de inicio e obrigatoria"),
    dataFim: optionalText,
    descricao: optionalText,
    status: z.enum(["RASCUNHO", "ENVIADO", "ASSINADO", "ATIVO", "ENCERRADO", "CANCELADO"])
  })
  .superRefine((value, ctx) => {
    if (value.recorrente && !value.periodicidade) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["periodicidade"],
        message: "Periodicidade e obrigatoria quando o contrato e recorrente"
      });
    }
  });

export const contratoQuerySchema = z.object({
  status: z
    .enum(["RASCUNHO", "ENVIADO", "ASSINADO", "ATIVO", "ENCERRADO", "CANCELADO"])
    .optional(),
  tipo: z.enum(["HIGH_TOUCH", "PRODUCTIZED", "ATIVO_DIGITAL", "CONSULTORIA"]).optional(),
  recorrente: z.enum(["true", "false"]).optional()
});

export type ContratoInput = z.infer<typeof contratoSchema>;
