import { Prisma } from "@prisma/client";
import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { clienteQuerySchema, clienteSchema } from "@/lib/schemas/cliente";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = clienteQuerySchema.parse({
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      tipoServico: searchParams.get("tipoServico") ?? undefined,
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20"
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

    const [clientes, total] = await Promise.all([
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

    return apiSuccess({
      items: clientes,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    });
  } catch (error) {
    return apiError("Falha ao listar clientes", 400, getErrorDetails(error));
  }
}

export async function POST(request: Request) {
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
          email: parsed.email
        }
      });

      if (existingClient) {
        return apiError("Ja existe um cliente com este email", 409);
      }
    }

    const cliente = await prisma.cliente.create({
      data: parsed
    });

    return apiSuccess(cliente, "Cliente criado com sucesso");
  } catch (error) {
    return apiError("Falha ao criar cliente", 400, getErrorDetails(error));
  }
}
