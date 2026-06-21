'use client';

import { motion } from 'framer-motion';
import type { CurveGeometricInfo } from '@/types/curves';
import { formatNum } from '@/lib/curves';

interface CurveInfoProps {
  info: CurveGeometricInfo;
  pointCount: number;
}

export default function CurveInfo({ info, pointCount }: CurveInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 h-full flex flex-col"
    >
      <h3 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">
        Informasi Kurva
      </h3>
      <div className="flex-1 space-y-3">
        {info.center && (
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-sm text-muted">Pusat (Center)</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              ({formatNum(info.center.x)}, {formatNum(info.center.y)})
            </span>
          </div>
        )}
        {info.radius !== undefined && (
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-sm text-muted">Radius (r)</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {formatNum(info.radius)}
            </span>
          </div>
        )}
        {info.vertices && info.vertices.length > 0 && (
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-sm text-muted">Vertex {info.vertices.length > 1 ? '(V1, V2)' : '(V)'}</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {info.vertices.map(v => `(${formatNum(v.x)}, ${formatNum(v.y)})`).join(' & ')}
            </span>
          </div>
        )}
        {info.foci && info.foci.length > 0 && (
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-sm text-muted">Fokus {info.foci.length > 1 ? '(F1, F2)' : '(F)'}</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {info.foci.map(f => `(${formatNum(f.x)}, ${formatNum(f.y)})`).join(' & ')}
            </span>
          </div>
        )}
        {info.direction && (
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span className="text-sm text-muted">Arah Bukaan</span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {info.direction}
            </span>
          </div>
        )}
        {info.asymptotes && (
          <div className="flex flex-col border-b border-border/50 pb-2">
            <span className="text-sm text-muted mb-1">Persamaan Asimtot</span>
            {info.asymptotes.map((a, i) => (
              <span key={i} className="font-mono text-xs font-semibold text-secondary text-right">
                {a}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center pt-1">
          <span className="text-sm font-medium text-foreground">Jumlah Titik Total</span>
          <span className="font-mono text-lg font-bold text-primary">
            {pointCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
