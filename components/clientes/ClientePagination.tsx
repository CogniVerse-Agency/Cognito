import Link from "next/link";
interface ClientePaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildQuery(searchParams: Record<string, string | string[] | undefined>, page: number) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string" && value.length && key !== "page") {
      params.set(key, value);
    }
  });

  params.set("page", String(page));

  return {
    pathname: "/clientes",
    query: Object.fromEntries(params.entries())
  } as const;
}

export function ClientePagination({
  page,
  totalPages,
  searchParams
}: ClientePaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-text-muted">
        Pagina {page} de {totalPages}
      </p>
      <div className="flex gap-3">
        <span
          className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            page <= 1
              ? "cursor-not-allowed border-border bg-white/5 text-text-muted/50"
              : "border-border bg-white/5 text-text-primary hover:bg-white/10"
          }`}
        >
          {page > 1 ? (
            <Link href={buildQuery(searchParams, page - 1)}>Anterior</Link>
          ) : (
            <span>Anterior</span>
          )}
        </span>
        <span
          className={`inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold ${
            page >= totalPages
              ? "cursor-not-allowed border-border bg-white/5 text-text-muted/50"
              : "border-border bg-white/5 text-text-primary hover:bg-white/10"
          }`}
        >
          {page < totalPages ? (
            <Link href={buildQuery(searchParams, page + 1)}>Proxima</Link>
          ) : (
            <span>Proxima</span>
          )}
        </span>
      </div>
    </div>
  );
}
