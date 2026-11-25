"use client";
import { cn } from "@/utils/cn";
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { useDebounce } from "use-debounce";
import { baseStyles, ButtonSize, ButtonVariant, sizeStyles, variants } from "./button-styles";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  minLoadingDelayMs?: number;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
}

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
