import { Card } from "@/components/ui/card"
import type { Playlists, Playlist, Program, Network } from "@/app/types"
import { useState } from "react";

interface PlaylistCardProps {
  playlist: Playlist;
  program: Program;
  network: Network
  onClick?: (playlist: Playlist) => void
}

export default function PlaylistCard({ playlist, program, network, onClick }: PlaylistCardProps) {



  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" onClick={() => onClick?.(playlist)}>
      <div className="flex items-center gap-3 p-3">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src={
              playlist.Urls.ImagePublicUrl ||
              `/placeholder.svg?height=48&width=48&query=${encodeURIComponent(playlist.Title + " playlist thumbnail") || "/placeholder.svg"}`
            }
            alt={`${playlist.Title} thumbnail`}
            className="w-full h-full object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-card-foreground text-sm truncate">{playlist.Title}</h4>
          <p className="text-xs text-muted-foreground">{playlist.NumberOfClips} clips</p>
        </div>
      </div>
    </Card>
  )
}
