import { ClienteForm } from "@/components/clientes/ClienteForm";

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Novo Cliente</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Cadastre um novo cliente com status, tipo de servico e contexto comercial.
        </p>
      </div>

      <ClienteForm />
    </div>
  );
}
