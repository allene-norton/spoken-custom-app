'use client';

import { Button } from '@/components/ui/button';
import type { Program } from '@/app/types';
import { useState, memo } from 'react';

interface ProgramInfoProps {
  program: Program;
}

const ProgramArtwork = memo(({ 
  program, 
  size = 'large' 
}: { 
  program: Program; 
  size?: 'small' | 'large';
}) => {
  const sizeClasses = {
    small: 'w-20 h-20 sm:w-24 sm:h-24',
    large: 'w-48 h-48',
  };

  const fallbackUrl = `/placeholder.svg?height=${size === 'large' ? '192' : '96'}&width=${size === 'large' ? '192' : '96'}&query=${encodeURIComponent(program.Name + ' podcast cover')}`;

  return (
    <div className={`${sizeClasses[size]} flex-shrink-0`}>
      <img
        src={program.Urls.ImagePublicUrl || fallbackUrl}
        alt={`${program.Name} cover`}
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );
});

ProgramArtwork.displayName = 'ProgramArtwork';

const ProgramInfo = memo(({ program }: ProgramInfoProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const shouldTruncate = program.Description && program.Description.length > 200;
  const truncatedDescription = shouldTruncate
    ? program.Description.substring(0, 200) + '...'
    : program.Description;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center gap-6 pb-6 w-full">
        <ProgramArtwork program={program} size="large" />

        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Program Description
          </h3>
          {showFullDescription ? (
            <div
              className="text-muted-foreground prose prose-gray dark:prose-invert prose-sm mx-auto prose-p:text-sm prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline text-center"
              dangerouslySetInnerHTML={{
                __html: program.DescriptionHtml || 'No description available',
              }}
            />
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed text-center">
              {truncatedDescription || 'No description available'}
            </p>
          )}
          {shouldTruncate && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="bg-primary text-white text-sm hover:bg-primary/90 px-3 py-1 rounded"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 w-full">
        <div className="flex items-start gap-4 p-4">
          <ProgramArtwork program={program} size="small" />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg mb-1 line-clamp-2">
              {program.Name}
            </h2>
            <p className="text-sm text-muted-foreground">Program Details</p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold mb-3">About</h3>
          {showFullDescription ? (
            <div
              className="text-sm text-muted-foreground prose prose-gray dark:prose-invert prose-sm max-w-none prose-p:text-sm prose-p:leading-relaxed prose-p:mb-2 prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: program.DescriptionHtml || 'No description available',
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncatedDescription || 'No description available'}
            </p>
          )}
          {shouldTruncate && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="bg-primary text-white text-sm hover:bg-primary/90 px-3 py-1 rounded"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

ProgramInfo.displayName = 'ProgramInfo';

export default ProgramInfo;