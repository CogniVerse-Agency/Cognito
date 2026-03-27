import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { contratoSchema } from "@/lib/schemas/contrato";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const contrato = await prisma.contrato.findUnique({
      where: {
        id: params.id
      },
      include: {
        cliente: true,
        projetos: {
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!contrato) {
      return apiError("Contrato nao encontrado", 404);
    }

    return apiSuccess(contrato);
  } catch (error) {
    return apiError("Falha ao buscar contrato", 400, getErrorDetails(error));
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
    const parsed = contratoSchema.parse(body);

    const contrato = await prisma.contrato.update({
      where: {
        id: params.id
      },
      data: {
        ...parsed,
        valor: parsed.valor,
        dataInicio: new Date(parsed.dataInicio),
        dataFim: parsed.dataFim ? new Date(parsed.dataFim) : null
      }
    });

    return apiSuccess(contrato, "Contrato atualizado com sucesso");
  } catch (error) {
    return apiError("Falha ao atualizar contrato", 400, getErrorDetails(error));
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
    await prisma.contrato.delete({
      where: {
        id: params.id
      }
    });

    return apiSuccess({ id: params.id }, "Contrato removido com sucesso");
  } catch (error) {
    return apiError("Falha ao remover contrato", 400, getErrorDetails(error));
  }
}
