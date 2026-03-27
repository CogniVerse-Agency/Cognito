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
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
          <BrainCircuit className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-lg font-semibold text-text-primary">CogniVerse</p>
          <p className="text-sm text-text-muted">ERP interno da agência</p>
        </div>
      </div>

      <Card className="space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary">Entrar</h1>
          <p className="text-sm text-text-muted">
            A autenticação será conectada ao NextAuth na próxima etapa.
          </p>
        </div>

        <LoginForm />
      </Card>
    </div>
  );
}
