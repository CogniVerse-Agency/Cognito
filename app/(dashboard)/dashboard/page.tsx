import { AtividadeRecente } from "@/components/dashboard/AtividadeRecente";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { ProjetosRecentes } from "@/components/dashboard/ProjetosRecentes";
import { TarefasCriticas } from "@/components/dashboard/TarefasCriticas";
import {
  getCriticalTasks,
  getRecentActivity,
  getRecentProjects
} from "@/lib/dashboard";

export default async function DashboardPage() {
  const [projetos, atividades, tarefasCriticas] = await Promise.all([
    getRecentProjects(),
    getRecentActivity(),
    getCriticalTasks()
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Visao geral operacional da CogniVerse com dados em tempo real.
        </p>
      </div>

      <KpiGrid />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ProjetosRecentes projetos={projetos} />
        <AtividadeRecente atividades={atividades} />
      </div>

      <TarefasCriticas tarefas={tarefasCriticas} />
    </div>
  );
}
