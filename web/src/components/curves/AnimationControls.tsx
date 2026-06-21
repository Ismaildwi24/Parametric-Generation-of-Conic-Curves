'use client';

import { Play, Pause, Square, FastForward, Repeat, PlayCircle, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  speedMultiplier: number;
  onSpeedChange: (speed: number) => void;
  autoPlay: boolean;
  onAutoPlayChange: (autoPlay: boolean) => void;
  isLooping: boolean;
  onLoopChange: (loop: boolean) => void;
  isGenerated: boolean;
}

export default function AnimationControls({
  isPlaying,
  onStart,
  onPause,
  onReset,
  speedMultiplier,
  onSpeedChange,
  autoPlay,
  onAutoPlayChange,
  isLooping,
  onLoopChange,
  isGenerated,
}: AnimationControlsProps) {
  if (!isGenerated) return null;

  return (
    <div className="glass p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <button onClick={onPause} className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors">
            <Pause className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onStart} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Play className="w-5 h-5" />
          </button>
        )}
        <button onClick={onReset} className="p-2 bg-surface border border-border text-foreground rounded-lg hover:bg-border transition-colors">
          <Square className="w-5 h-5" />
        </button>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-1 bg-background/50 rounded-lg p-1 border border-border">
        <FastForward className="w-4 h-4 text-muted ml-2 mr-1" />
        {[1, 2, 5, 10].map(speed => (
          <button
            key={speed}
            onClick={() => onSpeedChange(speed)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              speedMultiplier === speed 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted hover:text-foreground hover:bg-white/5'
            }`}
          >
            x{speed}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input 
            type="checkbox" 
            checked={autoPlay} 
            onChange={(e) => onAutoPlayChange(e.target.checked)}
            className="rounded border-border bg-background/50 text-primary focus:ring-primary/50"
          />
          <PlayCircle className="w-4 h-4 text-muted" />
          Auto Play
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
          <input 
            type="checkbox" 
            checked={isLooping} 
            onChange={(e) => onLoopChange(e.target.checked)}
            className="rounded border-border bg-background/50 text-primary focus:ring-primary/50"
          />
          <Repeat className="w-4 h-4 text-muted" />
          Loop Animation
        </label>
      </div>
    </div>
  );
}
