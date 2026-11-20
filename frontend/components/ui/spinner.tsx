import { cn } from "@/utils/cn";

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Spinner = ({ message = "", fullScreen = false, className }: LoaderProps) => {
  const content = (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <div
        className={cn(
          fullScreen ? "w-12 h-12" : "w-10 h-10",
          "rounded-full border-4 border-[var(--color-neutral-200)] border-t-[var(--color-orange-500)] animate-spin",
          "shadow-[0_0_12px_rgba(242,126,26,0.3)]",
        )}
      />
      <span className="text-[var(--color-neutral-800)] text-sm font-medium">{message}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
      {content}
    </div>
  );
};
