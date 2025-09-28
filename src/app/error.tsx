"use client"

import { AlertCircle, RefreshCw, Home, Mail } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-accent" />
          </div>

          {/* Friendly Heading */}
          <h1 className="text-2xl font-semibold text-foreground mb-3">Oops! Something went wrong</h1>

          {/* Friendly Message */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            We encountered an unexpected issue. Don't worry though - these things happen! You can try refreshing the
            page or contact your administrator for help.
          </p>

          {/* Error Details (Collapsible) */}
          <details className="mb-6 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Technical details
            </summary>
            <div className="mt-3 p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground break-all">
              {error.message}
              {error.digest && <div className="mt-2 pt-2 border-t border-border">Error ID: {error.digest}</div>}
            </div>
          </details>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
