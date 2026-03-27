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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-brand-cyan">
        {icon}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-text-muted">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  );
}
