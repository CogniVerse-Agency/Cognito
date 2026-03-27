export function PageSkeleton({
  title = "Carregando modulo..."
}: {
  title?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-border bg-white/5"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-72 animate-pulse rounded-xl border border-border bg-white/5" />
        <div className="h-72 animate-pulse rounded-xl border border-border bg-white/5" />
      </div>
      <p className="text-sm text-text-muted">{title}</p>
    </div>
  );
}
