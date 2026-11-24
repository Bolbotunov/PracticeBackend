interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-16 3xl:p-20 ${className}`}
    >
      {children}
    </div>
  );
}
