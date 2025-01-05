export function LoadingSpinner() {
    return (
      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }