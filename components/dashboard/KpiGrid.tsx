"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileBadge2,
  UsersRound
} from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";

type DashboardKpi = {
  id: string;
  titulo: string;
  valor: number;
  variacao: number;
  corBorda: string;
};

const iconMap: Record<string, ReactNode> = {
  "clientes-ativos": <UsersRound className="h-5 w-5" />,
  "projetos-andamento": <BriefcaseBusiness className="h-5 w-5" />,
  "tarefas-criticas": <CheckCircle2 className="h-5 w-5" />,
  "contratos-ativos": <FileBadge2 className="h-5 w-5" />
};

export function KpiGrid() {
  const [data, setData] = useState<DashboardKpi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadKpis() {
      try {
        const response = await fetch("/api/dashboard/kpis", {
          cache: "no-store"
        });
        const payload = (await response.json()) as { data?: DashboardKpi[] };

        if (active) {
          setData(payload.data ?? []);
        }
      } catch {
        if (active) {
          setData([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadKpis();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[166px] animate-pulse rounded-card border border-border bg-bg-surface"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {data.map((card) => (
        <KpiCard
          key={card.id}
          titulo={card.titulo}
          valor={card.valor}
          variacao={card.variacao}
          corBorda={card.corBorda}
          icone={iconMap[card.id]}
        />
      ))}
    </div>
  );
}
