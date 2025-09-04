import { Card } from "@/components/ui/card"
import { Programs, Program } from "@/app/types"

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative">
        <img
          src={
            program.Urls.ImagePublicUrl ||
            `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(program.Name + " podcast cover") || "/placeholder.svg"}`
          }
          alt={`${program.Name} cover`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-card-foreground text-pretty text-sm">{program.Name}</h3>
      </div>
    </Card>
  )
}
