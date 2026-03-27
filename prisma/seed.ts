import bcrypt from "bcryptjs";
import {
  ClienteStatus,
  ContratoStatus,
  PrismaClient,
  Prioridade,
  ProjetoStatus,
  Role,
  TarefaStatus,
  TipoServico
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("CogniVerse@2026", 12);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@cogniverse.com"
    },
    update: {
      name: "CogniVerse Admin",
      password,
      role: Role.ADMIN
    },
    create: {
      name: "CogniVerse Admin",
      email: "admin@cogniverse.com",
      password,
      role: Role.ADMIN
    }
  });

  const operator = await prisma.user.upsert({
    where: {
      email: "operacoes@cogniverse.com"
    },
    update: {
      name: "Time de Operacoes",
      password,
      role: Role.MEMBER
    },
    create: {
      name: "Time de Operacoes",
      email: "operacoes@cogniverse.com",
      password,
      role: Role.MEMBER
    }
  });

  const clientesBase = [
    {
      nome: "Marina Costa",
      empresa: "Atlas Growth",
      email: "marina@atlasgrowth.com",
      telefone: "+55 11 99999-1001",
      status: ClienteStatus.ATIVO,
      tipoServico: TipoServico.HIGH_TOUCH,
      canalOrigem: "Inbound",
      valorContrato: 18000
    },
    {
      nome: "Bruno Lima",
      empresa: "NovaOps",
      email: "bruno@novaops.ai",
      telefone: "+55 11 99999-1002",
      status: ClienteStatus.ATIVO,
      tipoServico: TipoServico.CONSULTORIA,
      canalOrigem: "Referral",
      valorContrato: 12000
    },
    {
      nome: "Lia Martins",
      empresa: "Flux Digital",
      email: "lia@fluxdigital.com",
      telefone: "+55 11 99999-1003",
      status: ClienteStatus.PROSPECT,
      tipoServico: TipoServico.PRODUCTIZED,
      canalOrigem: "Outbound",
      valorContrato: 6500
    }
  ];

  const clientes = [];

  for (const cliente of clientesBase) {
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        email: cliente.email ?? undefined
      },
    });

    const savedCliente = existingCliente
      ? await prisma.cliente.update({
          where: {
            id: existingCliente.id
          },
          data: cliente
        })
      : await prisma.cliente.create({
          data: cliente
        });

    clientes.push(savedCliente);
  }

  const contratoAtlas = await prisma.contrato.upsert({
    where: {
      id: "ctr-atlas-growth"
    },
    update: {
      titulo: "Retainer de Automacao Comercial",
      clienteId: clientes[0].id,
      status: ContratoStatus.ATIVO,
      tipo: TipoServico.HIGH_TOUCH,
      valor: 18000,
      recorrente: true,
      periodicidade: "mensal",
      dataInicio: new Date("2026-02-01T00:00:00.000Z"),
      descricao: "Squad de automacao e IA para vendas."
    },
    create: {
      id: "ctr-atlas-growth",
      titulo: "Retainer de Automacao Comercial",
      clienteId: clientes[0].id,
      status: ContratoStatus.ATIVO,
      tipo: TipoServico.HIGH_TOUCH,
      valor: 18000,
      recorrente: true,
      periodicidade: "mensal",
      dataInicio: new Date("2026-02-01T00:00:00.000Z"),
      descricao: "Squad de automacao e IA para vendas."
    }
  });

  const contratoNovaOps = await prisma.contrato.upsert({
    where: {
      id: "ctr-novaops-consultoria"
    },
    update: {
      titulo: "Consultoria de IA Operacional",
      clienteId: clientes[1].id,
      status: ContratoStatus.ATIVO,
      tipo: TipoServico.CONSULTORIA,
      valor: 12000,
      recorrente: false,
      dataInicio: new Date("2026-03-05T00:00:00.000Z"),
      dataFim: new Date("2026-06-05T00:00:00.000Z"),
      descricao: "Mapeamento de processos e plano de automacao."
    },
    create: {
      id: "ctr-novaops-consultoria",
      titulo: "Consultoria de IA Operacional",
      clienteId: clientes[1].id,
      status: ContratoStatus.ATIVO,
      tipo: TipoServico.CONSULTORIA,
      valor: 12000,
      recorrente: false,
      dataInicio: new Date("2026-03-05T00:00:00.000Z"),
      dataFim: new Date("2026-06-05T00:00:00.000Z"),
      descricao: "Mapeamento de processos e plano de automacao."
    }
  });

  const projetoAtlas = await prisma.projeto.upsert({
    where: {
      id: "prj-atlas-automacao"
    },
    update: {
      nome: "Automacao Comercial",
      descricao: "Agentes para prospeccao e qualificacao de leads.",
      clienteId: clientes[0].id,
      contratoId: contratoAtlas.id,
      responsavelId: admin.id,
      status: ProjetoStatus.EM_ANDAMENTO,
      prioridade: Prioridade.CRITICA,
      progresso: 72,
      dataInicio: new Date("2026-03-02T00:00:00.000Z"),
      deadline: new Date("2026-04-15T00:00:00.000Z")
    },
    create: {
      id: "prj-atlas-automacao",
      nome: "Automacao Comercial",
      descricao: "Agentes para prospeccao e qualificacao de leads.",
      clienteId: clientes[0].id,
      contratoId: contratoAtlas.id,
      responsavelId: admin.id,
      status: ProjetoStatus.EM_ANDAMENTO,
      prioridade: Prioridade.CRITICA,
      progresso: 72,
      dataInicio: new Date("2026-03-02T00:00:00.000Z"),
      deadline: new Date("2026-04-15T00:00:00.000Z")
    }
  });

  const projetoNovaOps = await prisma.projeto.upsert({
    where: {
      id: "prj-novaops-portal"
    },
    update: {
      nome: "Portal IA Interno",
      descricao: "Portal com copilotos internos para o time.",
      clienteId: clientes[1].id,
      contratoId: contratoNovaOps.id,
      responsavelId: operator.id,
      status: ProjetoStatus.EM_ANDAMENTO,
      prioridade: Prioridade.ALTA,
      progresso: 48,
      dataInicio: new Date("2026-03-10T00:00:00.000Z"),
      deadline: new Date("2026-04-28T00:00:00.000Z")
    },
    create: {
      id: "prj-novaops-portal",
      nome: "Portal IA Interno",
      descricao: "Portal com copilotos internos para o time.",
      clienteId: clientes[1].id,
      contratoId: contratoNovaOps.id,
      responsavelId: operator.id,
      status: ProjetoStatus.EM_ANDAMENTO,
      prioridade: Prioridade.ALTA,
      progresso: 48,
      dataInicio: new Date("2026-03-10T00:00:00.000Z"),
      deadline: new Date("2026-04-28T00:00:00.000Z")
    }
  });

  const projetoFlux = await prisma.projeto.upsert({
    where: {
      id: "prj-flux-onboarding"
    },
    update: {
      nome: "Onboarding Assistido",
      descricao: "Fluxo de onboarding automatizado para novos clientes.",
      clienteId: clientes[2].id,
      responsavelId: admin.id,
      status: ProjetoStatus.PLANEJAMENTO,
      prioridade: Prioridade.MEDIA,
      progresso: 18,
      dataInicio: new Date("2026-03-18T00:00:00.000Z"),
      deadline: new Date("2026-05-05T00:00:00.000Z")
    },
    create: {
      id: "prj-flux-onboarding",
      nome: "Onboarding Assistido",
      descricao: "Fluxo de onboarding automatizado para novos clientes.",
      clienteId: clientes[2].id,
      responsavelId: admin.id,
      status: ProjetoStatus.PLANEJAMENTO,
      prioridade: Prioridade.MEDIA,
      progresso: 18,
      dataInicio: new Date("2026-03-18T00:00:00.000Z"),
      deadline: new Date("2026-05-05T00:00:00.000Z")
    }
  });

  const tarefasBase = [
    {
      id: "tsk-atlas-workflow",
      titulo: "Subir workflow de qualificacao",
      projetoId: projetoAtlas.id,
      responsavelId: admin.id,
      status: TarefaStatus.EM_ANDAMENTO,
      prioridade: Prioridade.CRITICA,
      deadline: new Date("2026-03-29T00:00:00.000Z"),
      concluida: false,
      ordem: 1
    },
    {
      id: "tsk-atlas-crm",
      titulo: "Integrar CRM ao agente SDR",
      projetoId: projetoAtlas.id,
      responsavelId: operator.id,
      status: TarefaStatus.A_FAZER,
      prioridade: Prioridade.CRITICA,
      deadline: new Date("2026-03-31T00:00:00.000Z"),
      concluida: false,
      ordem: 2
    },
    {
      id: "tsk-novaops-auth",
      titulo: "Definir escopo de autenticacao do portal",
      projetoId: projetoNovaOps.id,
      responsavelId: operator.id,
      status: TarefaStatus.EM_REVISAO,
      prioridade: Prioridade.ALTA,
      deadline: new Date("2026-04-02T00:00:00.000Z"),
      concluida: false,
      ordem: 1
    },
    {
      id: "tsk-flux-discovery",
      titulo: "Mapear jornada atual de onboarding",
      projetoId: projetoFlux.id,
      responsavelId: admin.id,
      status: TarefaStatus.BACKLOG,
      prioridade: Prioridade.MEDIA,
      deadline: new Date("2026-04-08T00:00:00.000Z"),
      concluida: false,
      ordem: 1
    }
  ];

  for (const tarefa of tarefasBase) {
    await prisma.tarefa.upsert({
      where: {
        id: tarefa.id
      },
      update: tarefa,
      create: tarefa
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
