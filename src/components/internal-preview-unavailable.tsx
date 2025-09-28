import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight } from "lucide-react"

export default function InternalPreviewNotice() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-border/50">
        <CardContent className="p-12 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-foreground text-balance">Client Preview Coming Soon</h1>
            <p className="text-lg text-muted-foreground text-balance max-w-md mx-auto">
              We're putting the finishing touches on the client preview experience.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-border"></div>

          

          {/* Footer note */}
          <p className="text-sm text-muted-foreground">
            Full client preview will be available soon. In the meantime, log in as a test client with an assigned company to preview.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
