import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { clienteQuerySchema } from "@/lib/schemas/cliente";

export async function getClientes(searchParams: Record<string, string | string[] | undefined>) {
  if (!process.env.DATABASE_URL) {
    return {
      items: [],
      meta: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1
      },
      filters: clienteQuerySchema.parse({
        page: "1",
        limit: "20"
      })
    };
  }

  const query = clienteQuerySchema.parse({
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    tipoServico:
      typeof searchParams.tipoServico === "string" ? searchParams.tipoServico : undefined,
    page: typeof searchParams.page === "string" ? searchParams.page : "1",
    limit: typeof searchParams.limit === "string" ? searchParams.limit : "20"
  });

  const where: Prisma.ClienteWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.tipoServico ? { tipoServico: query.tipoServico } : {}),
    ...(query.search
      ? {
          OR: [
            {
              nome: {
                contains: query.search,
                mode: "insensitive"
              }
            },
            {
              empresa: {
                contains: query.search,
                mode: "insensitive"
              }
            }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit
    }),
    prisma.cliente.count({ where })
  ]);

  return {
    items,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit))
    },
    filters: query
  };
}

export async function getClienteById(id: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return prisma.cliente.findUnique({
    where: {
      id
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
}
