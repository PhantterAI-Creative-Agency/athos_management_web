export function PageLoader() {
  return (
    <div className="page-loader flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div
        className="page-loader-ring h-9 w-9 rounded-full border-2 border-divider border-t-accent"
        aria-hidden
      />
      <div className="flex items-center gap-1.5" role="status" aria-live="polite">
        <span className="sr-only">Carregando</span>
        <span className="page-loader-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
        <span
          className="page-loader-dot h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animationDelay: "0.15s" }}
          aria-hidden
        />
        <span
          className="page-loader-dot h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animationDelay: "0.3s" }}
          aria-hidden
        />
      </div>
    </div>
  );
}
