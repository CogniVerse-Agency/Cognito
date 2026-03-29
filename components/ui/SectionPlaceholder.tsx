import { Construction } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SectionPlaceholderProps {
  titulo: string;
  descricao: string;
}

export function SectionPlaceholder({
  titulo,
  descricao
}: SectionPlaceholderProps) {
  return (
    <Card className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-card border border-accent/20 bg-accent/10 p-4 text-accent">
        <Construction className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink-primary">{titulo}</h1>
        <p className="max-w-xl text-sm leading-6 text-ink-secondary">{descricao}</p>
      </div>
    </Card>
  );
}
