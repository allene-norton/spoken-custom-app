import { type NextRequest, NextResponse } from "next/server"
import { getClipDownloadsByTimeGrouping } from "@/actions/omny"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const interval = searchParams.get("interval")
  const timezone = searchParams.get("timezone")
  const clipId = searchParams.get("clipId")
  const stringParams = searchParams.toString()

  // console.log(`PARAMS: ${searchParams}`)

  const analyticsData = await getClipDownloadsByTimeGrouping(clipId,startDate,endDate,interval, timezone)
  // console.log(analyticsData)

  // Mock data for demonstration - replace with actual API call
  const mockData = {
    Items: [
      {
        Downloads: 141,
        From: "2025-01-01T00:00:00+00:00",
        To: "2025-01-02T00:00:00+00:00",
      },
      {
        Downloads: 124,
        From: "2025-01-02T00:00:00+00:00",
        To: "2025-01-03T00:00:00+00:00",
      },
      {
        Downloads: 156,
        From: "2025-01-03T00:00:00+00:00",
        To: "2025-01-04T00:00:00+00:00",
      },
      {
        Downloads: 189,
        From: "2025-01-04T00:00:00+00:00",
        To: "2025-01-05T00:00:00+00:00",
      },
      {
        Downloads: 203,
        From: "2025-01-05T00:00:00+00:00",
        To: "2025-01-06T00:00:00+00:00",
      },
    ],
  }

  return NextResponse.json(mockData)
}
