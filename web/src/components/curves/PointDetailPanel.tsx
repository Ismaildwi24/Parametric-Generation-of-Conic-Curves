'use client';

import { MousePointerClick, ChevronRight } from 'lucide-react';
import type { CalculationStep } from '@/types/curves';

interface PointDetailPanelProps {
  step: CalculationStep | null;
  paramName: string;
}

export default function PointDetailPanel({ step, paramName }: PointDetailPanelProps) {
  if (!step) {
    return (
      <div className="glass p-6 h-full flex flex-col items-center justify-center text-center text-muted border-dashed border-2 border-border/50 rounded-xl">
        <MousePointerClick className="w-8 h-8 mb-3 opacity-50" />
        <p className="text-sm">Klik titik parametrik pada visualisasi untuk melihat detail perhitungan.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 h-full border border-primary/30 shadow-[0_0_20px_rgba(56,189,248,0.1)] rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <MousePointerClick className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Detail Titik Terpilih
        </h3>
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg border border-border/50">
          <span className="text-sm text-muted font-medium">Iterasi</span>
          <span className="text-sm font-mono font-bold text-foreground">Step #{step.no}</span>
        </div>
        
        <div className="flex justify-between items-center bg-primary/10 p-2 rounded-lg border border-primary/20">
          <span className="text-sm text-muted font-medium">Parameter</span>
          <span className="text-sm font-mono font-bold text-primary">{paramName} = {step.paramValue.toFixed(4)}</span>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">Perhitungan Substitusi X:</p>
          <div className="bg-background/80 p-3 rounded-lg font-mono text-sm space-y-2 border border-border/50">
            <div className="flex items-center gap-2 text-muted">
              <ChevronRight className="w-3 h-3 text-primary" />
              {step.xFormula}
            </div>
            <div className="flex items-center gap-2 text-foreground font-bold pl-5 border-l-2 border-primary/50 ml-[5px]">
              x = {step.xResult.toFixed(4)}
            </div>
          </div>
        </div>
        
        <div className="pt-1">
          <p className="text-xs text-muted mb-2 font-semibold uppercase tracking-wider">Perhitungan Substitusi Y:</p>
          <div className="bg-background/80 p-3 rounded-lg font-mono text-sm space-y-2 border border-border/50">
            <div className="flex items-center gap-2 text-muted">
              <ChevronRight className="w-3 h-3 text-secondary" />
              {step.yFormula}
            </div>
            <div className="flex items-center gap-2 text-foreground font-bold pl-5 border-l-2 border-secondary/50 ml-[5px]">
              y = {step.yResult.toFixed(4)}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 mt-4">
          <p className="text-xs text-muted mb-1 text-center font-medium">Koordinat Akhir</p>
          <div className="bg-white/5 py-2 rounded-lg text-center font-mono text-lg font-bold text-white tracking-wide border border-white/10 shadow-inner">
            P({step.xResult.toFixed(4)}, {step.yResult.toFixed(4)})
          </div>
        </div>
      </div>
    </div>
  );
}
