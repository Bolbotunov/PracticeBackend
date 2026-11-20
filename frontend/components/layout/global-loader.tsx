"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Spinner } from "@/components/ui/spinner";

interface GlobalLoaderProps {
  loading?: boolean;
  children?: ReactNode;
  message?: string;
  className?: string;
}

export function GlobalLoader({
  loading = true,
  children,
  message = "Загрузка",
  className,
}: GlobalLoaderProps) {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[50vh] w-full items-center justify-center py-16",
        className,
      )}
    >
      {children ? (
        <>
          <div className="w-full opacity-30 pointer-events-none">{children}</div>
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-lg backdrop-blur-sm"
            style={{ backgroundColor: "var(--loader-overlay-bg)" }}
          >
            <Spinner message={message} />
          </div>
        </>
      ) : (
        <Spinner message={message} />
      )}
    </div>
  );
}
