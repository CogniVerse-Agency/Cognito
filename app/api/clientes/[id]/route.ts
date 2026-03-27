import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { clienteSchema } from "@/lib/schemas/cliente";

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
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: params.id
      },
      include: {
        contratos: {
          orderBy: {
            createdAt: "desc"
          }
        },
        projetos: {
          orderBy: {
            createdAt: "desc"
          },
          include: {
            responsavel: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!cliente) {
      return apiError("Cliente nao encontrado", 404);
    }

    return apiSuccess(cliente);
  } catch (error) {
    return apiError("Falha ao buscar cliente", 400, getErrorDetails(error));
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
    const parsed = clienteSchema.parse(body);

    if (parsed.email) {
      const existingClient = await prisma.cliente.findFirst({
        where: {
          email: parsed.email,
          NOT: {
            id: params.id
          }
        }
      });

      if (existingClient) {
        return apiError("Ja existe um cliente com este email", 409);
      }
    }

    const cliente = await prisma.cliente.update({
      where: {
        id: params.id
      },
      data: parsed
    });

    return apiSuccess(cliente, "Cliente atualizado com sucesso");
  } catch (error) {
    return apiError("Falha ao atualizar cliente", 400, getErrorDetails(error));
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
    await prisma.cliente.delete({
      where: {
        id: params.id
      }
    });

    return apiSuccess({ id: params.id }, "Cliente removido com sucesso");
  } catch (error) {
    return apiError("Falha ao remover cliente", 400, getErrorDetails(error));
  }
}
