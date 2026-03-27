import { Prisma } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { contratoQuerySchema, contratoSchema } from "@/lib/schemas/contrato";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = contratoQuerySchema.parse({
      status: searchParams.get("status") ?? undefined,
      tipo: searchParams.get("tipo") ?? undefined,
      recorrente: searchParams.get("recorrente") ?? undefined
    });

    const where: Prisma.ContratoWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.tipo ? { tipo: query.tipo } : {}),
      ...(query.recorrente ? { recorrente: query.recorrente === "true" } : {})
    };

    const contratos = await prisma.contrato.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        cliente: {
          select: {
            id: true,
            nome: true,
            empresa: true
          }
        }
      }
    });

    return apiSuccess(contratos);
  } catch (error) {
    return apiError("Falha ao listar contratos", 400, getErrorDetails(error));
  }
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const body = await request.json();
    const parsed = contratoSchema.parse(body);

    const contrato = await prisma.contrato.create({
      data: {
        ...parsed,
        valor: parsed.valor,
        dataInicio: new Date(parsed.dataInicio),
        dataFim: parsed.dataFim ? new Date(parsed.dataFim) : null
      }
    });

    return apiSuccess(contrato, "Contrato criado com sucesso");
  } catch (error) {
    return apiError("Falha ao criar contrato", 400, getErrorDetails(error));
  }
}
