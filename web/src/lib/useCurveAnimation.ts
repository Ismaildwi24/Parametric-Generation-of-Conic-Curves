import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseCurveAnimationProps {
  totalPoints: number;
}

export function useCurveAnimation({ totalPoints }: UseCurveAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawnPointCount, setDrawnPointCount] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  const requestRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number | undefined>(undefined);

  const animate = useCallback(function loop(time: number) {
    if (lastUpdateRef.current === undefined) {
      lastUpdateRef.current = time;
    }
    
    // Base speed: 10 points per second at 1x
    // Speed modifiers: 1x, 2x, 5x, etc.
    const intervalMs = 1000 / (10 * speedMultiplier);

    if (time - lastUpdateRef.current > intervalMs) {
      setDrawnPointCount(prev => {
        if (prev >= totalPoints) {
          if (isLooping) {
            return 0; // loop back to 0
          } else {
            setIsPlaying(false);
            return prev;
          }
        }
        return prev + 1;
      });
      lastUpdateRef.current = time;
    }

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [isPlaying, totalPoints, speedMultiplier, isLooping]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, animate]);

  useEffect(() => {
    if (autoPlay && totalPoints > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(true);
      setDrawnPointCount(0);
    } else if (totalPoints > 0 && !isPlaying) {
      // Reset when a new curve is generated and autoPlay is off
      setDrawnPointCount(0);
    }
  }, [autoPlay, totalPoints]);

  const handleStart = () => {
    if (drawnPointCount >= totalPoints && !isLooping) {
      setDrawnPointCount(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setDrawnPointCount(0);
  };

  const jumpToStart = () => {
    setIsPlaying(false);
    setDrawnPointCount(0);
  };

  const jumpToEnd = () => {
    setIsPlaying(false);
    setDrawnPointCount(totalPoints);
  };

  const activePointIndex = drawnPointCount > 0 ? drawnPointCount - 1 : null;
  const progress = totalPoints > 0 ? (drawnPointCount / totalPoints) * 100 : 0;

  return {
    isPlaying,
    drawnPointCount,
    speedMultiplier,
    autoPlay,
    isLooping,
    handleStart,
    handlePause,
    handleReset,
    setSpeedMultiplier,
    setAutoPlay,
    setIsLooping,
    jumpToStart,
    jumpToEnd,
    activePointIndex,
    progress,
  };
}
