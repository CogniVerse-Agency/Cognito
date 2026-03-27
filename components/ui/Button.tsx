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
    "inline-flex items-center justify-center rounded-xl border border-border bg-white/5 px-4 py-2.5 text-sm font-semibold text-text-primary hover:bg-white/10 hover:shadow-glow",
  ghost:
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-text-muted hover:bg-white/5 hover:text-text-primary"
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
