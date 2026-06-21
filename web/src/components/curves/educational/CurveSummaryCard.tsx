import React from 'react';
import { Info, Activity, Target, Minimize2, Crosshair } from 'lucide-react';
import type { CurveGeometricInfo } from '@/types/curves';

interface CurveSummaryCardProps {
  curveType: string;
  info: CurveGeometricInfo;
  pointCount: number;
  resolution: 'High' | 'Low';
  eccentricity?: number;
}

function formatCoord(val: number): string {
  if (Math.abs(val) < 0.0001) return '0';
  return Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.00$/, '');
}

export default function CurveSummaryCard({ curveType, info, pointCount, resolution, eccentricity }: CurveSummaryCardProps) {
  return (
    <div className="glass p-6 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.05)] relative overflow-hidden h-full">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
        <div className="p-2 rounded-lg bg-primary/20 text-primary">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Ringkasan Kurva</h3>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center bg-surface/40 p-2 rounded">
          <span className="text-muted flex items-center gap-2"><Info className="w-4 h-4" /> Jenis Kurva</span>
          <span className="font-semibold text-primary capitalize">{curveType}</span>
        </div>

        {info.center && (
          <div className="flex justify-between items-center bg-surface/40 p-2 rounded">
            <span className="text-muted flex items-center gap-2"><Crosshair className="w-4 h-4" /> Titik Pusat</span>
            <span className="font-mono text-foreground font-medium">({formatCoord(info.center.x)}, {formatCoord(info.center.y)})</span>
          </div>
        )}

        {info.foci && info.foci.length > 0 && (
          <div className="flex justify-between items-start bg-surface/40 p-2 rounded">
            <span className="text-muted flex items-center gap-2"><Target className="w-4 h-4" /> Fokus</span>
            <div className="text-right font-mono text-foreground font-medium flex flex-col">
              {info.foci.map((f, i) => (
                <span key={i}>({formatCoord(f.x)}, {formatCoord(f.y)})</span>
              ))}
            </div>
          </div>
        )}

        {info.vertices && info.vertices.length > 0 && (
          <div className="flex justify-between items-start bg-surface/40 p-2 rounded">
            <span className="text-muted flex items-center gap-2"><Minimize2 className="w-4 h-4" /> Vertex</span>
            <div className="text-right font-mono text-foreground font-medium flex flex-col">
              {info.vertices.map((v, i) => (
                <span key={i}>({formatCoord(v.x)}, {formatCoord(v.y)})</span>
              ))}
            </div>
          </div>
        )}

        {eccentricity !== undefined && (
          <div className="flex justify-between items-center bg-surface/40 p-2 rounded">
            <span className="text-muted flex items-center gap-2">Eksentrisitas (e)</span>
            <span className="font-mono text-foreground font-medium">{formatCoord(eccentricity)}</span>
          </div>
        )}

        <div className="h-px bg-border/50 my-2" />

        <div className="flex justify-between items-center bg-surface/40 p-2 rounded">
          <span className="text-muted">Total Titik Sampel</span>
          <span className="font-mono text-foreground font-medium">{pointCount}</span>
        </div>

        <div className="flex justify-between items-center bg-surface/40 p-2 rounded">
          <span className="text-muted">Kualitas Resolusi</span>
          <span className={`font-medium px-2 py-0.5 rounded text-xs ${resolution === 'High' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {resolution === 'High' ? 'Tinggi (Halus)' : 'Rendah (Diskrit)'}
          </span>
        </div>

      </div>
    </div>
  );
}
