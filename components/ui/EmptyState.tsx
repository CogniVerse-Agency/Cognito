import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action
}: EmptyStateProps) {
  return (
    <Card className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-card border border-accent/20 bg-accent/10 p-4 text-accent">
        {icon}
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-xl font-bold tracking-tight text-ink-primary">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-ink-secondary">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  );
}
