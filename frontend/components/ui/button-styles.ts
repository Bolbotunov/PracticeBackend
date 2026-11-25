export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "lg" | "md" | "sm";

export const baseStyles =
  "inline-flex items-center justify-center rounded-[12px] font-medium select-none transition-[background-color,color,border-color,outline-color] duration-200 ease-out cursor-pointer enabled:hover:cursor-pointer disabled:cursor-not-allowed";

export const sizeStyles: Record<ButtonSize, string> = {
  lg: "min-h-12 px-6 text-base gap-3",
  md: "h-10 px-5 py-2.5 text-base gap-2",
  sm: "h-9 px-4 text-sm gap-2",
};

export const variants: Record<ButtonVariant, string> = {
  primary: `bg-[var(--color-primary)] text-[var(--color-text-on-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-[var(--color-primary-disabled)]`,
  secondary: `bg-[var(--color-secondary)] text-[var(--color-surface)] hover:bg-[var(--color-secondary-hover)] disabled:bg-[var(--color-surface-disabled)]`,
  danger: `bg-[var(--color-danger)] text-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-danger-hover)] disabled:bg-[var(--color-surface-disabled)]`,
};
