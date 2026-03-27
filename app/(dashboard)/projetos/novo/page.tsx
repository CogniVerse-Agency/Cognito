import { ProjetoForm } from "@/components/projetos/ProjetoForm";
import { getProjetoFormOptions } from "@/lib/projetos";

export default async function NovoProjetoPage({
  searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { clientes, contratos, usuarios } = await getProjetoFormOptions();
  const initialClienteId =
    typeof searchParams.clienteId === "string" ? searchParams.clienteId : undefined;
  const initialContratoId =
    typeof searchParams.contratoId === "string" ? searchParams.contratoId : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary">Novo Projeto</h1>
        <p className="mt-2 text-sm text-text-muted">
          Relacione cliente, contrato e responsavel para iniciar um novo projeto.
        </p>
      </div>

      <ProjetoForm
        clientes={clientes}
        contratos={contratos}
        initialClienteId={initialClienteId}
        initialContratoId={initialContratoId}
        usuarios={usuarios}
      />
    </div>
  );
}
