import { Prisma } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { tarefaQuerySchema } from "@/lib/schemas/tarefa";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = tarefaQuerySchema.parse({
      status: searchParams.get("status") ?? undefined,
      prioridade: searchParams.get("prioridade") ?? undefined,
      projetoId: searchParams.get("projetoId") ?? undefined,
      responsavelId: searchParams.get("responsavelId") ?? undefined,
      scope: searchParams.get("scope") ?? "mine"
    });

    const where: Prisma.TarefaWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.prioridade ? { prioridade: query.prioridade } : {}),
      ...(query.projetoId ? { projetoId: query.projetoId } : {}),
      ...(query.responsavelId ? { responsavelId: query.responsavelId } : {}),
      ...(query.scope === "mine" ? { responsavelId: session.user.id } : {})
    };

    const tarefas = await prisma.tarefa.findMany({
      where,
      orderBy: [
        { concluida: "asc" },
        { deadline: "asc" },
        { updatedAt: "desc" }
      ],
      include: {
        projeto: {
          select: {
            id: true,
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

    return apiSuccess(tarefas);
  } catch (error) {
    return apiError("Falha ao listar tarefas", 400, getErrorDetails(error));
  }
}
