"use client";
import Link, { LinkProps } from "next/link";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";
import { baseStyles, sizeStyles, variants, ButtonVariant, ButtonSize } from "./button-styles";

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link {...props} className={cn(baseStyles, sizeStyles[size], variants[variant], className)}>
      {children}
    </Link>
  );
}
