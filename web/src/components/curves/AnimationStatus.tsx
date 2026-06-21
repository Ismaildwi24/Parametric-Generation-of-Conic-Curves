'use client';

import { Activity } from 'lucide-react';
import type { CalculationStep } from '@/types/curves';

interface AnimationStatusProps {
  currentStep: CalculationStep | null;
  currentIndex: number;
  totalSteps: number;
  paramName: string;
}

export default function AnimationStatus({ currentStep, currentIndex, totalSteps, paramName }: AnimationStatusProps) {
  const progress = totalSteps > 0 ? ((currentIndex / totalSteps) * 100).toFixed(1) : '0.0';

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Status Animasi
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted mb-1">Iterasi Saat Ini</p>
          <p className="text-lg font-mono font-semibold text-foreground">
            {currentIndex} <span className="text-xs text-muted font-sans font-normal">/ {totalSteps}</span>
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted mb-1">Parameter ({paramName})</p>
          <p className="text-lg font-mono font-semibold text-primary">
            {currentStep ? currentStep.paramValue.toFixed(4) : '-'}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted mb-1">X Saat Ini</p>
          <p className="text-lg font-mono font-semibold text-foreground">
            {currentStep ? currentStep.xResult.toFixed(4) : '-'}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted mb-1">Y Saat Ini</p>
          <p className="text-lg font-mono font-semibold text-foreground">
            {currentStep ? currentStep.yResult.toFixed(4) : '-'}
          </p>
        </div>
        <div className="bg-background/50 p-3 rounded-lg border border-border/50">
          <p className="text-xs text-muted mb-1">Progress</p>
          <p className="text-lg font-mono font-semibold text-secondary">
            {progress}%
          </p>
          <div className="w-full bg-border h-1 mt-2 rounded-full overflow-hidden">
            <div className="h-full bg-secondary transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
