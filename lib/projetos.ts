import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { projetoQuerySchema } from "@/lib/schemas/projeto";

export async function getProjetos(searchParams: Record<string, string | string[] | undefined>) {
  if (!process.env.DATABASE_URL) {
    return {
      items: [],
      filters: projetoQuerySchema.parse({})
    };
  }

  const query = projetoQuerySchema.parse({
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    prioridade:
      typeof searchParams.prioridade === "string" ? searchParams.prioridade : undefined,
    clienteId:
      typeof searchParams.clienteId === "string" ? searchParams.clienteId : undefined
  });

  const where: Prisma.ProjetoWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.prioridade ? { prioridade: query.prioridade } : {}),
    ...(query.clienteId ? { clienteId: query.clienteId } : {})
  };

  const items = await prisma.projeto.findMany({
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

  return {
    items,
    filters: query
  };
}

export async function getProjetoById(id: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return prisma.projeto.findUnique({
    where: {
      id
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
        orderBy: [
          { status: "asc" },
          { ordem: "asc" },
          { createdAt: "desc" }
        ],
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
}

export async function getProjetoFormOptions() {
  if (!process.env.DATABASE_URL) {
    return {
      clientes: [],
      contratos: [],
      usuarios: []
    };
  }

  const [clientes, contratos, usuarios] = await Promise.all([
    prisma.cliente.findMany({
      orderBy: {
        nome: "asc"
      },
      select: {
        id: true,
        nome: true,
        empresa: true
      }
    }),
    prisma.contrato.findMany({
      orderBy: {
        titulo: "asc"
      },
      select: {
        id: true,
        titulo: true,
        clienteId: true
      }
    }),
    prisma.user.findMany({
      orderBy: {
        name: "asc"
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })
  ]);

  return {
    clientes,
    contratos,
    usuarios
  };
}
