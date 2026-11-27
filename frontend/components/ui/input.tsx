import { forwardRef, useId, useState } from "react";
import { cn } from "@/utils/cn";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/icons";
import { baseStyles, stateStyles } from "./input-styles";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  variant?: "text" | "email" | "password";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    variant = "text",
    error,
    disabled,
    label,
    id,
    onChange,
    value,
    placeholder,
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
  const showClear = variant !== "password" && hasValue && isFocused && !disabled;
  const type = variant === "password" ? (showPassword ? "text" : "password") : variant;

  const handleClear = () => {
    onChange?.({
      target: { value: "" },
      currentTarget: { value: "" },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const inputState = disabled
    ? stateStyles.disabled
    : error
      ? stateStyles.error
      : stateStyles.default;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-text-default)]">
          {label}
          {required && <span className="ml-0.5 text-[var(--color-danger)]">*</span>}
        </label>
      )}

      <div className="relative">
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
          className={cn(
            baseStyles,
            inputState,
            (showClear || (variant === "password" && isFocused)) && "pr-10",
            className,
          )}
        />

        {variant === "password" && isFocused && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}

        {showClear && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-default)]"
          >
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      <p
        className={cn(
          "min-h-[18px] text-xs leading-[18px] text-[var(--color-danger)]",
          !error && "invisible",
        )}
        aria-live="polite"
      >
        {error || "\u00A0"}
      </p>
    </div>
  );
});
