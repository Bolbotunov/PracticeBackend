import { forwardRef, useId, useState } from "react";
import { cn } from "@/utils/cn";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/icons";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  error?: string;
  variant?: "text" | "email" | "password";
  showError?: boolean;
  withClearBtn?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    variant = "text",
    error,
    disabled,
    label,
    labelClassName,
    id,
    onChange,
    value,
    placeholder,
    showError = true,
    withClearBtn = true,
    required,
    ...props
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = String(value ?? "").length > 0;
  const showClearButton =
    variant !== "password" && hasValue && isFocused && !disabled && withClearBtn;

  const type = variant === "password" ? (showPassword ? "text" : "password") : variant;

  const handleClear = () => {
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const base =
    "h-[44px] w-full rounded-xl border bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-colors outline-none flex items-center gap-2 self-stretch";
  const padding = "px-[14px] py-0";

  const state = disabled
    ? "bg-[var(--input-bg-disabled)] border-[var(--input-border-disabled)] text-[var(--input-text-disabled)] cursor-not-allowed"
    : error
      ? "border-[var(--input-border-error)]"
      : "border-[var(--input-border)]";

  const focus = !disabled
    ? "focus:border-[var(--input-border-focus)] focus:ring-1 focus:ring-[var(--input-border-focus)]"
    : "";

  const hover = !disabled
    ? "hover:border-[var(--input-border-hover)] hover:bg-[var(--input-bg-hover)]"
    : "";

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "font-[family-name:var(--typography-family-body)] text-base font-normal leading-6 text-[var(--input-label-color,var(--color-neutral-700))]",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-[var(--input-helper-error)]">*</span>}
        </label>
      )}

      <div className="group/input relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholder={placeholder}
          data-input-error={!!error || undefined}
          className={cn(
            base,
            padding,
            state,
            focus,
            hover,
            showClearButton && "pr-10",
            variant === "password" && "group-focus-within/input:pr-10",
            className,
          )}
        />

        <div className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {variant === "password" && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              className="hidden text-[var(--input-icon)] hover:text-[var(--input-icon-hover)] group-focus-within/input:inline-flex"
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          )}

          {showClearButton && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              className="text-[var(--input-icon)] hover:text-[var(--input-icon-hover)]"
              onClick={handleClear}
              aria-label="Clear"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {showError && (
        <p
          className={cn(
            "mb-[10px] min-h-[18px] text-xs leading-[18px] text-[var(--input-helper-error)]",
            !error && "invisible",
          )}
        >
          {error || "placeholder"}
        </p>
      )}
    </div>
  );
});
