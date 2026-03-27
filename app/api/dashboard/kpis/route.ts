import { getServerAuthSession } from "@/lib/auth";
import { apiError, apiSuccess, getErrorDetails } from "@/lib/api";
import { getDashboardKpis } from "@/lib/dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session) {
    return apiError("Nao autenticado", 401);
  }

  try {
    const kpis = await getDashboardKpis();

    return apiSuccess(kpis);
  } catch (error) {
    return apiError("Falha ao carregar KPIs do dashboard", 500, getErrorDetails(error));
  }
}
