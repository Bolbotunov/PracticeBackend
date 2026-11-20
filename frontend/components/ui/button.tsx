"use client";
import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { useDebounce } from "use-debounce";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  minLoadingDelayMs?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-[12px] font-medium select-none transition-[background-color,color,border-color,outline-color] duration-200 ease-out cursor-pointer enabled:hover:cursor-pointer disabled:cursor-not-allowed";

const sizeStyles: Record<ButtonSize, string> = {
  lg: "min-h-12 px-6 text-base gap-3",
  md: "h-10 px-5 py-2.5 text-base gap-2",
  sm: "h-9 px-4 text-sm gap-2",
};

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--color-primary)]
    text-[var(--color-text-on-primary)]
    hover:bg-[var(--color-primary-hover)]
    disabled:bg-[var(--color-primary-disabled)]
    disabled:text-[var(--color-text-on-primary)]
  `,
  secondary: `
    bg-[var(--color-secondary)]
  text-[var(--color-surface)]
    hover:bg-[var(--color-secondary-hover)]
    disabled:bg-[var(--color-surface-disabled)]
  `,
  danger: `
    bg-[var(--color-danger)]
    text-[var(--color-surface)]
    border border-[var(--color-border)]
    hover:bg-[var(--color-danger-hover)]
    disabled:bg-[var(--color-surface-disabled)]
  `,
};

export function Button({
  variant = "primary",
  size = "lg",
  disabled,
  className,
  children,
  loading = false,
  loadingText = "",
  minLoadingDelayMs = 300,
  onClick,
  icon,
  ...props
}: ButtonProps) {
  const [debouncedLoading] = useDebounce(loading, minLoadingDelayMs);
  const shouldShowLoader = loading && debouncedLoading;
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      {...props}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variants[variant],
        "disabled:opacity-50",
        className,
      )}
    >
      {shouldShowLoader ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{loadingText}</span>
        </div>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
