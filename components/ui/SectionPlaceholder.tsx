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
      <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/10 p-4 text-brand-purple">
        <Construction className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">{titulo}</h1>
        <p className="max-w-xl text-sm leading-6 text-text-muted">{descricao}</p>
      </div>
    </Card>
  );
}
