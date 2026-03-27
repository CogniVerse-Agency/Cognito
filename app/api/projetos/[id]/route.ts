import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { projetoPatchSchema, projetoSchema } from "@/lib/schemas/projeto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const projeto = await prisma.projeto.findUnique({
      where: {
        id: params.id
      },
      include: {
        cliente: true,
        contrato: true,
        responsavel: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tarefas: {
          include: {
            responsavel: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!projeto) {
      return apiError("Projeto nao encontrado", 404);
    }

    return apiSuccess(projeto);
  } catch (error) {
    return apiError("Falha ao buscar projeto", 400, getErrorDetails(error));
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const body = await request.json();
    const parsed = projetoSchema.parse(body);

    const projeto = await prisma.projeto.update({
      where: {
        id: params.id
      },
      data: {
        ...parsed,
        contratoId: parsed.contratoId ?? null,
        responsavelId: parsed.responsavelId ?? null,
        dataInicio: parsed.dataInicio ? new Date(parsed.dataInicio) : null,
        deadline: parsed.deadline ? new Date(parsed.deadline) : null
      }
    });

    return apiSuccess(projeto, "Projeto atualizado com sucesso");
  } catch (error) {
    return apiError("Falha ao atualizar projeto", 400, getErrorDetails(error));
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const body = await request.json();
    const parsed = projetoPatchSchema.parse(body);

    const projeto = await prisma.projeto.update({
      where: {
        id: params.id
      },
      data: parsed
    });

    return apiSuccess(projeto, "Projeto atualizado com sucesso");
  } catch (error) {
    return apiError("Falha ao atualizar projeto", 400, getErrorDetails(error));
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    await prisma.projeto.delete({
      where: {
        id: params.id
      }
    });

    return apiSuccess({ id: params.id }, "Projeto removido com sucesso");
  } catch (error) {
    return apiError("Falha ao remover projeto", 400, getErrorDetails(error));
  }
}
