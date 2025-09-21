"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Program } from "@/app/types"

interface ProgramCardProps {
  program: Program
  onClick?: (program: Program) => void
}

function formatDownloads(downloads: number): string {
  if (downloads >= 1000000) {
    return (downloads / 1000000).toFixed(1) + "M"
  } else if (downloads >= 1000) {
    return (downloads / 1000).toFixed(1) + "K"
  }
  return downloads.toLocaleString()
}

export default function ProgramCard({ program, onClick }: ProgramCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onClick?.(program)}>
      <CardContent className="p-3 flex flex-col h-full">
        <div className="aspect-square relative mb-2">
          <img
            src={
              program.Urls?.ImagePublicUrl ||
              `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(program.Name + " podcast cover") || "/placeholder.svg"}`
            }
            alt={`${program.Name} cover`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <h3 className="font-medium text-sm mb-1 text-pretty">{program.Name}</h3>

        <div className="border-t pt-2 mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Program Downloads</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-foreground">{formatDownloads(program.downloads || 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
