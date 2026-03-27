import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { tarefaUpdateSchema } from "@/lib/schemas/tarefa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    const parsed = tarefaUpdateSchema.parse(body);

    const tarefa = await prisma.tarefa.findUnique({
      where: {
        id: params.id
      }
    });

    if (!tarefa) {
      return apiError("Tarefa nao encontrada", 404);
    }

    const concluida =
      typeof parsed.concluida === "boolean" ? parsed.concluida : tarefa.concluida;
    const status = parsed.status ?? (concluida ? "CONCLUIDO" : tarefa.status);

    const updatedTask = await prisma.tarefa.update({
      where: {
        id: params.id
      },
      data: {
        titulo: parsed.titulo ?? undefined,
        descricao: parsed.descricao ?? undefined,
        concluida,
        status,
        prioridade: parsed.prioridade ?? undefined,
        responsavelId: parsed.responsavelId ?? undefined,
        deadline: parsed.deadline ? new Date(parsed.deadline) : parsed.deadline === null ? null : undefined,
        concluidaEm: concluida ? new Date() : null
      },
      include: {
        projeto: {
          select: {
            nome: true
          }
        },
        responsavel: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return apiSuccess(updatedTask, "Tarefa atualizada com sucesso");
  } catch (error) {
    return apiError("Falha ao atualizar tarefa", 400, getErrorDetails(error));
  }
}
