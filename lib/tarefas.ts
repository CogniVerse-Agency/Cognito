import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { tarefaQuerySchema } from "@/lib/schemas/tarefa";

export async function getTarefas(
  searchParams: Record<string, string | string[] | undefined>,
  userId: string
) {
  if (!process.env.DATABASE_URL) {
    return {
      items: [],
      filters: tarefaQuerySchema.parse({})
    };
  }

  const query = tarefaQuerySchema.parse({
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    prioridade:
      typeof searchParams.prioridade === "string" ? searchParams.prioridade : undefined,
    projetoId:
      typeof searchParams.projetoId === "string" ? searchParams.projetoId : undefined,
    responsavelId:
      typeof searchParams.responsavelId === "string" ? searchParams.responsavelId : undefined,
    scope: typeof searchParams.scope === "string" ? searchParams.scope : "mine"
  });

  const where: Prisma.TarefaWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.prioridade ? { prioridade: query.prioridade } : {}),
    ...(query.projetoId ? { projetoId: query.projetoId } : {}),
    ...(query.responsavelId ? { responsavelId: query.responsavelId } : {}),
    ...(query.scope === "mine" ? { responsavelId: userId } : {})
  };

  const items = await prisma.tarefa.findMany({
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

  return {
    items,
    filters: query
  };
}

export async function getTarefaFilterOptions() {
  if (!process.env.DATABASE_URL) {
    return {
      projetos: [],
      usuarios: []
    };
  }

  const [projetos, usuarios] = await Promise.all([
    prisma.projeto.findMany({
      orderBy: {
        nome: "asc"
      },
      select: {
        id: true,
        nome: true
      }
    }),
    prisma.user.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true
      }
    })
  ]);

  return {
    projetos,
    usuarios
  };
}
