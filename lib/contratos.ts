import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { contratoQuerySchema } from "@/lib/schemas/contrato";

export async function getContratos(searchParams: Record<string, string | string[] | undefined>) {
  if (!process.env.DATABASE_URL) {
    return {
      items: [],
      filters: contratoQuerySchema.parse({})
    };
  }

  const query = contratoQuerySchema.parse({
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    tipo: typeof searchParams.tipo === "string" ? searchParams.tipo : undefined,
    recorrente:
      typeof searchParams.recorrente === "string" ? searchParams.recorrente : undefined
  });

  const where: Prisma.ContratoWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.tipo ? { tipo: query.tipo } : {}),
    ...(query.recorrente ? { recorrente: query.recorrente === "true" } : {})
  };

  const items = await prisma.contrato.findMany({
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

  return {
    items,
    filters: query
  };
}

export async function getContratoById(id: string) {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  return prisma.contrato.findUnique({
    where: {
      id
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
}

export async function getClienteOptions() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  return prisma.cliente.findMany({
    orderBy: {
      nome: "asc"
    },
    select: {
      id: true,
      nome: true,
      empresa: true
    }
  });
}
