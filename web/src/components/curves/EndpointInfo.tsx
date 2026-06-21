'use client';

import { MapPin } from 'lucide-react';
import type { CalculationStep } from '@/types/curves';

interface EndpointInfoProps {
  firstStep?: CalculationStep;
  lastStep?: CalculationStep;
  paramName: string;
}

export default function EndpointInfo({ firstStep, lastStep, paramName }: EndpointInfoProps) {
  if (!firstStep || !lastStep) return null;

  return (
    <div className="glass p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">
          Titik Awal dan Akhir
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-background/50 p-4 rounded-lg border border-border/50">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Titik Awal</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">Parameter Awal</span>
              <span className="text-sm font-mono text-primary">{paramName} = {firstStep.paramValue.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Koordinat Awal</span>
              <span className="text-sm font-mono text-foreground">
                ({firstStep.xResult.toFixed(4)}, {firstStep.yResult.toFixed(4)})
              </span>
            </div>
          </div>
        </div>
        <div className="bg-background/50 p-4 rounded-lg border border-border/50">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Titik Akhir</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted">Parameter Akhir</span>
              <span className="text-sm font-mono text-primary">{paramName} = {lastStep.paramValue.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted">Koordinat Akhir</span>
              <span className="text-sm font-mono text-foreground">
                ({lastStep.xResult.toFixed(4)}, {lastStep.yResult.toFixed(4)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
