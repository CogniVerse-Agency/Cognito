import { Prisma } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { projetoQuerySchema, projetoSchema } from "@/lib/schemas/projeto";

export async function GET(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = projetoQuerySchema.parse({
      status: searchParams.get("status") ?? undefined,
      prioridade: searchParams.get("prioridade") ?? undefined,
      clienteId: searchParams.get("clienteId") ?? undefined
    });

    const where: Prisma.ProjetoWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.prioridade ? { prioridade: query.prioridade } : {}),
      ...(query.clienteId ? { clienteId: query.clienteId } : {})
    };

    const projetos = await prisma.projeto.findMany({
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
        },
        responsavel: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return apiSuccess(projetos);
  } catch (error) {
    return apiError("Falha ao listar projetos", 400, getErrorDetails(error));
  }
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const body = await request.json();
    const parsed = projetoSchema.parse(body);

    const projeto = await prisma.projeto.create({
      data: {
        ...parsed,
        contratoId: parsed.contratoId ?? null,
        responsavelId: parsed.responsavelId ?? null,
        dataInicio: parsed.dataInicio ? new Date(parsed.dataInicio) : null,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null
      }
    });

    return apiSuccess(projeto, "Projeto criado com sucesso");
  } catch (error) {
    return apiError("Falha ao criar projeto", 400, getErrorDetails(error));
  }
}
