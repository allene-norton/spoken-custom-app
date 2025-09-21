import { Card } from '@/components/ui/card';
import { Programs, Program } from '@/app/types';

interface ProgramCardProps {
  program: Program;
  onClick?: (program: Program) => void;
}

export default function ProgramCard({ program, onClick }: ProgramCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
      onClick={() => onClick?.(program)}
    >
      <div className="aspect-square relative">
        <img
          src={
            program.Urls.ImagePublicUrl ||
            `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(program.Name + ' podcast cover') || '/placeholder.svg'}`
          }
          alt={`${program.Name} cover`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex-1">
        <h3 className="font-medium text-card-foreground text-pretty text-sm">
          {program.Name}
        </h3>
      </div>
      <div className="p-3 pt-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Total program downloads:</span>
          <span className="text-xs font-medium">{program.downloads}</span>
        </div>
      </div>
    </Card>
  );
}
