import { Card } from "@/components/ui/card"

interface Program {
  id: string
  title: string
  imageUrl: string
  date: string
}

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={
            program.imageUrl ||
            `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(program.title + " podcast cover") || "/placeholder.svg"}`
          }
          alt={`${program.title} cover`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-card-foreground text-pretty text-sm">{program.title}</h3>
      </div>
    </Card>
  )
}
