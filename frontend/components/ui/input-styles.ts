export type InputVariant = "text" | "email" | "password";

export const baseStyles =
  "h-11 w-full rounded-xl border bg-[var(--color-surface)] px-3.5 text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors";

export const stateStyles = {
  default:
    "border-[var(--color-border)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]",
  error:
    "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-1 focus:ring-[var(--color-danger)]",
  disabled:
    "bg-[var(--color-surface-disabled)] text-[var(--color-text-disabled)] cursor-not-allowed",
} as const;