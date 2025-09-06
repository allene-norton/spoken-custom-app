"use client"

import { useState, useEffect } from "react"
import type { Network, Download, DownloadsResponse } from "@/app/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface AnalyticsProps {
  network: Network
}

const timezones = [
  "UTC",
  // US Timezones
  "America/New_York",      // Eastern
  "America/Chicago",       // Central  
  "America/Denver",        // Mountain
  "America/Los_Angeles",   // Pacific
  "America/Anchorage",     // Alaska
  "Pacific/Honolulu",      // Hawaii
  // Major International (US to Australia route)
  "Europe/London",         // GMT/BST
  "Europe/Berlin",         // Central Europe
  "Asia/Dubai",            // Middle East hub
  "Asia/Mumbai",           // India
  "Asia/Singapore",        // Southeast Asia hub
  "Asia/Tokyo",            // Japan
  "Asia/Shanghai",         // China
  "Asia/Seoul",            // South Korea
  // Australian Timezones
  "Australia/Perth",       // Western Australia
  "Australia/Adelaide",    // Central Australia  
  "Australia/Darwin",      // Northern Territory
  "Australia/Sydney",      // Eastern Australia (NSW/VIC/TAS)
  "Australia/Brisbane",    // Queensland (no DST)
];



export default function Analytics({ network }: AnalyticsProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [interval, setInterval] = useState("Daily")
  const [timezone, setTimezone] = useState("UTC")
  const [data, setData] = useState<Download[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  // Set default dates (last 7 days)
  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 7)

    setEndDate(end.toISOString().split("T")[0])
    setStartDate(start.toISOString().split("T")[0])
  }, [])

  const fetchData = async () => {
    if (!startDate || !endDate) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        interval,
        timezone,
        networkId: network.Id,
      })

      const response = await fetch(`/api/downloads?${params}`)
      if (!response.ok) throw new Error("Failed to fetch data")

      const result: DownloadsResponse = await response.json()
      setData(result.Items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      fetchData()
    }
  }, [startDate, endDate, interval, timezone, network.Id])

  const totalDownloads = data.reduce((sum, item) => sum + item.Downloads, 0)

  const chartData = data.map((item) => ({
    ...item,
    period: new Date(item.From).toLocaleDateString(),
  }))

 

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Analytics</h2>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-lg border">
        <div className="flex gap-2 items-center">
          <Label htmlFor="start-date">Start Date:</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-auto"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label htmlFor="end-date">End Date:</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-auto"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Label>Interval:</Label>
          <Select value={interval} onValueChange={setInterval}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hourly">Hourly</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Label>Timezone:</Label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4">
        <p className="text-lg text-foreground">
          Total clip downloads during period: <span className="font-semibold">{totalDownloads.toLocaleString()}</span>
        </p>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-lg border p-4">
        {loading && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        )}

        {error && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Downloads" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No data available for the selected period</p>
          </div>
        )}
      </div>
    </div>
  )
}

