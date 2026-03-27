import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { prisma } from "@/lib/prisma";

const now = new Date();
const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

function getMonthRange(date: Date) {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  };
}

async function getMonthlyCount(
  countCurrent: (range: { start: Date; end: Date }) => Promise<number>,
  countPrevious: (range: { start: Date; end: Date }) => Promise<number>
) {
  const currentMonth = getMonthRange(now);
  const previousMonth = getMonthRange(subMonths(now, 1));

  const [current, previous] = await Promise.all([
    countCurrent(currentMonth),
    countPrevious(previousMonth)
  ]);

  return {
    current,
    previous,
    delta: current - previous
  };
}

export async function getDashboardKpis() {
  if (!hasDatabaseUrl) {
    return [
      {
        id: "clientes-ativos",
        titulo: "Clientes Ativos",
        valor: 0,
        variacao: 0,
        corBorda: "#8b5cf6"
      },
      {
        id: "projetos-andamento",
        titulo: "Projetos em Andamento",
        valor: 0,
        variacao: 0,
        corBorda: "#06b6d4"
      },
      {
        id: "tarefas-criticas",
        titulo: "Tarefas Criticas",
        valor: 0,
        variacao: 0,
        corBorda: "#d946ef"
      },
      {
        id: "contratos-ativos",
        titulo: "Contratos Ativos",
        valor: 0,
        variacao: 0,
        corBorda: "#22c55e"
      }
    ];
  }

  const [
    totalClientesAtivos,
    totalProjetosEmAndamento,
    totalTarefasCriticasAbertas,
    totalContratosAtivos,
    clientesMes,
    projetosMes,
    tarefasMes,
    contratosMes
  ] = await Promise.all([
    prisma.cliente.count({
      where: {
        status: "ATIVO"
      }
    }),
    prisma.projeto.count({
      where: {
        status: "EM_ANDAMENTO"
      }
    }),
    prisma.tarefa.count({
      where: {
        prioridade: "CRITICA",
        concluida: false
      }
    }),
    prisma.contrato.count({
      where: {
        status: "ATIVO"
      }
    }),
    getMonthlyCount(
      (range) =>
        prisma.cliente.count({
          where: {
            status: "ATIVO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        }),
      (range) =>
        prisma.cliente.count({
          where: {
            status: "ATIVO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        })
    ),
    getMonthlyCount(
      (range) =>
        prisma.projeto.count({
          where: {
            status: "EM_ANDAMENTO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        }),
      (range) =>
        prisma.projeto.count({
          where: {
            status: "EM_ANDAMENTO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        })
    ),
    getMonthlyCount(
      (range) =>
        prisma.tarefa.count({
          where: {
            prioridade: "CRITICA",
            concluida: false,
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        }),
      (range) =>
        prisma.tarefa.count({
          where: {
            prioridade: "CRITICA",
            concluida: false,
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        })
    ),
    getMonthlyCount(
      (range) =>
        prisma.contrato.count({
          where: {
            status: "ATIVO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        }),
      (range) =>
        prisma.contrato.count({
          where: {
            status: "ATIVO",
            createdAt: {
              gte: range.start,
              lte: range.end
            }
          }
        })
    )
  ]);

  return [
    {
      id: "clientes-ativos",
      titulo: "Clientes Ativos",
      valor: totalClientesAtivos,
      variacao: clientesMes.delta,
      corBorda: "#8b5cf6"
    },
    {
      id: "projetos-andamento",
      titulo: "Projetos em Andamento",
      valor: totalProjetosEmAndamento,
      variacao: projetosMes.delta,
      corBorda: "#06b6d4"
    },
    {
      id: "tarefas-criticas",
      titulo: "Tarefas Criticas",
      valor: totalTarefasCriticasAbertas,
      variacao: tarefasMes.delta,
      corBorda: "#d946ef"
    },
    {
      id: "contratos-ativos",
      titulo: "Contratos Ativos",
      valor: totalContratosAtivos,
      variacao: contratosMes.delta,
      corBorda: "#22c55e"
    }
  ];
}

export async function getRecentProjects() {
  if (!hasDatabaseUrl) {
    return [];
  }

  return prisma.projeto.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      cliente: {
        select: {
          nome: true,
          empresa: true
        }
      }
    }
  });
}

export async function getCriticalTasks() {
  if (!hasDatabaseUrl) {
    return [];
  }

  return prisma.tarefa.findMany({
    where: {
      prioridade: "CRITICA",
      concluida: false
    },
    take: 10,
    orderBy: [
      {
        deadline: "asc"
      },
      {
        updatedAt: "desc"
      }
    ],
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
}

type ActivityItem = {
  id: string;
  tipo: "cliente" | "projeto" | "tarefa";
  titulo: string;
  descricao: string;
  timestamp: Date;
};

function isCreatedRecently(createdAt: Date, updatedAt: Date) {
  return Math.abs(updatedAt.getTime() - createdAt.getTime()) < 60_000;
}

export async function getRecentActivity() {
  if (!hasDatabaseUrl) {
    return [];
  }

  const [clientes, projetos, tarefas] = await Promise.all([
    prisma.cliente.findMany({
      take: 10,
      orderBy: {
        updatedAt: "desc"
      },
      select: {
        id: true,
        nome: true,
        empresa: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.projeto.findMany({
      take: 10,
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        cliente: {
          select: {
            nome: true
          }
        }
      }
    }),
    prisma.tarefa.findMany({
      take: 10,
      orderBy: {
        updatedAt: "desc"
      },
      include: {
        projeto: {
          select: {
            nome: true
          }
        }
      }
    })
  ]);

  const activity: ActivityItem[] = [
    ...clientes.map((cliente) => ({
      id: `cliente-${cliente.id}`,
      tipo: "cliente" as const,
      titulo: cliente.nome,
      descricao: isCreatedRecently(cliente.createdAt, cliente.updatedAt)
        ? `Cliente criado${cliente.empresa ? ` para ${cliente.empresa}` : ""}`
        : `Cliente atualizado${cliente.empresa ? ` para ${cliente.empresa}` : ""}`,
      timestamp: cliente.updatedAt
    })),
    ...projetos.map((projeto) => ({
      id: `projeto-${projeto.id}`,
      tipo: "projeto" as const,
      titulo: projeto.nome,
      descricao: isCreatedRecently(projeto.createdAt, projeto.updatedAt)
        ? `Projeto criado para ${projeto.cliente.nome}`
        : `Projeto atualizado para ${projeto.cliente.nome}`,
      timestamp: projeto.updatedAt
    })),
    ...tarefas.map((tarefa) => ({
      id: `tarefa-${tarefa.id}`,
      tipo: "tarefa" as const,
      titulo: tarefa.titulo,
      descricao: tarefa.concluida
        ? `Tarefa concluida em ${tarefa.projeto.nome}`
        : isCreatedRecently(tarefa.createdAt, tarefa.updatedAt)
          ? `Tarefa criada em ${tarefa.projeto.nome}`
          : `Tarefa atualizada em ${tarefa.projeto.nome}`,
      timestamp: tarefa.updatedAt
    }))
  ];

  return activity
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);
}
