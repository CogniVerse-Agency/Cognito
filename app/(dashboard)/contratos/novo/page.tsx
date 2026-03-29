import { ContratoForm } from "@/components/contratos/ContratoForm";
import { getClienteOptions } from "@/lib/contratos";

export default async function NovoContratoPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const clientes = await getClienteOptions();
  const initialClienteId =
    typeof searchParams.clienteId === "string" ? searchParams.clienteId : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-ink-primary">Novo Contrato</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          Crie um novo contrato vinculado a um cliente da operacao.
        </p>
      </div>

      <ContratoForm clientes={clientes} initialClienteId={initialClienteId} />
    </div>
  );
}
