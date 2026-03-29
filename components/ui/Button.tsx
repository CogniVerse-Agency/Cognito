import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "primary-button",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-pill border border-border bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-ink-secondary transition-all duration-200 hover:border-border-hover hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-60",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-pill border border-status-error/30 bg-transparent px-6 py-2.5 font-heading text-sm font-semibold text-status-error transition-all duration-200 hover:bg-status-error/10 disabled:cursor-not-allowed disabled:opacity-60"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
