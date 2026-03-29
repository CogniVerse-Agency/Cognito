import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  className?: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "Nenhum registro encontrado."
}: TableProps<T>) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-bg-surface2">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left font-heading text-xs font-bold uppercase tracking-[0.18em] text-ink-tertiary"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={getRowKey(item)}
                  className={cn("border-b border-border transition-colors hover:bg-bg-surface2")}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn("px-4 py-4 text-sm text-ink-secondary", column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-ink-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
