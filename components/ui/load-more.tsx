import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadMoreProps {
  onClick: () => void
  loading?: boolean
  // Optional progress caption ("{loaded} of {total}") shown under the button.
  loaded?: number
  total?: number
  className?: string
}

// A subtle, theme-aware "Load more" control for the dashboard lists. Uses the
// dashboard CSS tokens (card / border / muted) so it sits quietly under a list
// instead of shouting like the marketing buttons.
export function LoadMore({
  onClick,
  loading = false,
  loaded,
  total,
  className,
}: LoadMoreProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 pt-1", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-busy={loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[var(--border)]",
          "bg-[var(--card)] px-5 py-2 text-sm font-medium text-[var(--foreground)]",
          "shadow-sm transition-all duration-200",
          "hover:border-[var(--muted-foreground)]/40 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30",
          "active:scale-[0.98]",
          "disabled:cursor-default disabled:opacity-60 disabled:shadow-sm disabled:active:scale-100"
        )}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" />
            <span>Loading…</span>
          </>
        ) : (
          <span>Load more</span>
        )}
      </button>
      {loaded !== undefined && total !== undefined ? (
        <p className="text-xs tabular-nums text-[var(--muted-foreground)]">
          {loaded} of {total}
        </p>
      ) : null}
    </div>
  )
}
