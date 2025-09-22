'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { Program } from '@/app/types';
import { memo } from 'react';

interface ProgramHeaderProps {
  program: Program;
  onBack: () => void;
}

const ProgramHeader = memo(({ program, onBack }: ProgramHeaderProps) => {
  return (
    <header className="mb-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-balance line-clamp-2 min-w-0">
          {program.Name}
        </h1>
      </div>
    </header>
  );
});

ProgramHeader.displayName = 'ProgramHeader';

export default ProgramHeader;