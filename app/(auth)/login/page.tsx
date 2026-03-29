import { redirect } from "next/navigation";
import { BrainCircuit } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";
import { getServerAuthSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-card border border-accent/20 bg-accent/10">
          <BrainCircuit className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="font-heading text-xl font-bold tracking-wide text-accent">CogniVerse</p>
          <p className="text-sm text-ink-tertiary">ERP interno da agencia</p>
        </div>
      </div>

      <Card className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink-primary">Entrar</h1>
          <p className="text-sm text-ink-secondary">
            A autenticacao sera conectada ao NextAuth na proxima etapa.
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
}
