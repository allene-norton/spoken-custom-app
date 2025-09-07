"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
// import PlaylistCard from "./playlist-card"
// import ProgramAnalytics from "./program-analytics"
import ClipItem from "./clip-item"
import type { Program, Playlist, Playlists, Clips, Clip, Network } from "@/app/types"

interface ProgramDetailProps {
  program: Program
  playlists: Playlists
  programClips?: Clips
  network: Network
  onBack: () => void
}

export default function ProgramDetail({ program, playlists, programClips, network, onBack }: ProgramDetailProps) {
  return (
    <div className="h-screen bg-background p-6 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <header className="mb-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground text-balance">{program.Name}</h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex gap-8 min-h-0">
          {/* Left Column: Program Details */}
          <div className="w-1/2 flex flex-col gap-6">
            {/* Program Artwork */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48">
                <img
                  src={
                    program.Urls.ImagePublicUrl ||
                    `/placeholder.svg?height=192&width=192&query=${encodeURIComponent(program.Name + " podcast cover") || "/placeholder.svg"}`
                  }
                  alt={`${program.Name} cover`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-muted-foreground text-center w-full">
                {program.Description || "No description available"}
              </p>
            </div>

            {/* Playlists Section */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {playlists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              </CardContent>
            </Card> */}

            {/* Program Analytics */}
            {/* <ProgramAnalytics network={network} programId={program.id} /> */}
          </div>

          {/* Right Column: Latest Clips */}
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Latest Clips</h2>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2">
                {programClips?.slice(0, 10).map((clip) => (
                  <ClipItem key={clip.Id} clip={clip} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
