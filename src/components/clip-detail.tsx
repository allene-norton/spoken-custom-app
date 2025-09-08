"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import type { Clip, PublishState } from "@/app/types"

interface ClipDetailProps {
  clip: Clip
  onBack: () => void
}

export default function ClipDetail({ clip, onBack }: ClipDetailProps) {
  const [title, setTitle] = useState(clip.Title)
  const [descriptionHtml, setDescriptionHtml] = useState(clip.DescriptionHtml || "")
  const [isSaving, setIsSaving] = useState(false)

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not published"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: PublishState) => {
    switch (status) {
      case 'Published':
        return 'bg-[var(--status-published)] text-white';
      case 'Scheduled':
        return 'bg-[var(--status-scheduled)] text-white';
      case 'Draft':
        return 'bg-[var(--status-draft)] text-white';
    }
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Implement API call to update clip
      const response = await fetch(`/api/clips/${clip.Id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          descriptionHtml,
        }),
      })

      if (response.ok) {
        // Handle success
        console.log("Clip updated successfully")
      }
    } catch (error) {
      console.error("Error updating clip:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-screen bg-background p-6 flex flex-col">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <header className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground text-balance">Clip Details</h1>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
          {/* Left Column: Clip Info & Editing */}
          <div className="flex flex-col gap-6 overflow-y-auto">
            {/* Clip Image */}
            <div className="flex justify-center">
              <img
                src={
                  clip.Urls?.ImagePublicUrl ||
                  `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(clip.Title + " clip artwork") || "/placeholder.svg"}`
                }
                alt={`${clip.Title} artwork`}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Editable Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Edit Clip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="description">Description (HTML)</Label>
                  <Textarea
                    id="description"
                    value={descriptionHtml}
                    onChange={(e) => setDescriptionHtml(e.target.value)}
                    rows={8}
                    className="mt-1 font-mono text-sm"
                    placeholder="Enter HTML description..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">HTML tags are supported for rich formatting</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Clip Details */}
          <div className="flex flex-col gap-6 overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle>Clip Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(clip.PublishState as PublishState)}>{clip.PublishState}</Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Visibility</Label>
                    <p className="mt-1 text-sm">{clip.Visibility || "Not set"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Season</Label>
                    <p className="mt-1 text-sm">{clip.Season || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Episode</Label>
                    <p className="mt-1 text-sm">{clip.Episode || "Not set"}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Episode Type</Label>
                  <p className="mt-1 text-sm">{clip.EpisodeType || "Not set"}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                  <p className="mt-1 text-sm font-mono">{formatDuration(clip.DurationSeconds)}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Published Date</Label>
                  <p className="mt-1 text-sm">{formatDate(clip.PublishedUtc)}</p>
                </div>

                {/* <div>
                  <Label className="text-sm font-medium text-muted-foreground">Downloads</Label>
                  <p className="mt-1 text-sm font-semibold">{clip.Downloads.toLocaleString()}</p>
                </div> */}
              </CardContent>
            </Card>

            {/* Description Display */}
            {clip.Description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{clip.Description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
