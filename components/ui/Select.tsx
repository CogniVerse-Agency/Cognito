import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: ReactNode;
}

export function Select({ className, label, icon, children, ...props }: SelectProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-medium text-text-primary">{label}</span>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        ) : null}
        <select
          className={cn("input-base appearance-none", icon ? "pl-11" : "", className)}
          {...props}
        >
          {children}
        </select>
      </div>
    </label>
  );
}
