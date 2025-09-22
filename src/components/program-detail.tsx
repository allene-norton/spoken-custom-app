'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProgramHeader from './program-header';
import ProgramInfo from './program-info';
import PlaylistsSection from './playlists-section';
import ClipsSection from './clips-section';
import ClipDetail from '@/components/clip-detail';
import ProgramAnalytics from '@/components/programAnalytics';
import type { Program, Network, Clip } from '@/app/types';
import { useState, useCallback } from 'react';

interface ProgramDetailProps {
  program: Program;
  network?: Network;
  onBack: () => void;
}

export default function ProgramDetail({
  program,
  network,
  onBack,
}: ProgramDetailProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedPlaylistTitle, setSelectedPlaylistTitle] = useState<string>('');
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  const handlePlaylistSelect = useCallback((playlistId: string, title: string) => {
    setSelectedPlaylistId(playlistId);
    setSelectedPlaylistTitle(title);
  }, []);

  const handleClipClick = useCallback((clip: Clip) => {
    setSelectedClip(clip);
  }, []);

  const handleClipBack = useCallback(() => {
    setSelectedClip(null);
  }, []);

  // Show clip detail if selected
  if (selectedClip) {
    return (
      <ClipDetail
        clip={selectedClip}
        onBack={handleClipBack}
        onClipUpdated={() => {}} // Remove refresh for now - clips don't change that often
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl w-full mx-auto">
        <ProgramHeader program={program} onBack={onBack} />
        <ProgramInfo program={program} />
        <ProgramAnalytics program={program} />
        
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <PlaylistsSection
            program={program}
            network={network}
            onPlaylistSelect={handlePlaylistSelect}
          />
          
          <ClipsSection
            selectedPlaylistId={selectedPlaylistId}
            selectedPlaylistTitle={selectedPlaylistTitle}
            onClipClick={handleClipClick}
          />
        </div>
      </div>
    </div>
  );
}