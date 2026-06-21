'use client';

import { motion } from 'framer-motion';
import ConicVisualization from './ConicVisualization';
import type { Point, VisualizationOptions } from '@/types/curves';

interface ResolutionComparisonProps {
  lowResPoints: Point[];
  lowResSecondary?: Point[];
  highResPoints: Point[];
  highResSecondary?: Point[];
  deltaLow: number;
  deltaHigh: number;
  viewRange: { xMin: number; xMax: number; yMin: number; yMax: number };
  curveColor: string;
}

export default function ResolutionComparison({
  lowResPoints,
  lowResSecondary,
  highResPoints,
  highResSecondary,
  deltaLow,
  deltaHigh,
  viewRange,
  curveColor,
}: ResolutionComparisonProps) {
  
  const totalLow = lowResPoints.length + (lowResSecondary?.length ?? 0);
  const totalHigh = highResPoints.length + (highResSecondary?.length ?? 0);
  const ratio = totalLow > 0 ? (totalHigh / totalLow).toFixed(2) : '0';

  const baseOptions: VisualizationOptions = {
    showCurve: true,
    showPoints: true,
    showSamplePoints: true,
    showLabels: true,
    showGrid: true,
    showAxis: true,
    showFocus: false,
    showVertex: false,
    showCenter: false,
    showDirectrix: false,
    showAsymptotes: false,
    showAnimationPath: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Perbandingan Resolusi Visual</h3>
          <p className="text-sm text-muted mt-1">
            Bandingkan pengaruh nilai step/delta terhadap jumlah titik (resolusi) dan kualitas rendering kurva.
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-right">
          <p className="text-xs text-muted font-medium mb-1">Rasio Jumlah Titik</p>
          <p className="font-mono text-sm font-semibold text-primary">
            {totalHigh} / {totalLow} = {ratio}x
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Res (Delta Tinggi/Besar -> Low resolution) */}
        {/* Note: Delta refers to the step size. A larger step size means lower resolution. */}
        <div className="flex flex-col h-full border border-border/50 rounded-xl bg-surface/30 overflow-hidden">
          <div className="bg-background/80 px-4 py-3 border-b border-border/50 flex justify-between items-center">
            <span className="font-semibold text-sm text-foreground">Resolusi Rendah</span>
            <span className="text-xs font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              Δ = {Math.max(deltaLow, deltaHigh)} (Besar)
            </span>
          </div>
          <div className="p-4 flex-1">
            <ConicVisualization
              points={deltaLow > deltaHigh ? lowResPoints : highResPoints}
              secondaryPoints={deltaLow > deltaHigh ? lowResSecondary : highResSecondary}
              viewRange={viewRange}
              curveColor={curveColor}
              secondaryCurveColor={curveColor}
              options={baseOptions}
            />
          </div>
          <div className="px-4 py-3 bg-background/50 border-t border-border/50 flex justify-between">
            <span className="text-xs text-muted">Jumlah Titik Iterasi</span>
            <span className="font-mono text-sm font-bold text-foreground">
              {deltaLow > deltaHigh ? totalLow : totalHigh}
            </span>
          </div>
          <div className="px-4 py-3 bg-red-500/5 border-t border-border/50">
            <span className="text-xs text-muted block mb-1">Curve Quality</span>
            <span className="font-semibold text-sm text-red-400">Discrete / Polygonal</span>
          </div>
        </div>

        {/* High Res (Delta Rendah/Kecil -> High resolution) */}
        <div className="flex flex-col h-full border border-border/50 rounded-xl bg-surface/30 overflow-hidden">
          <div className="bg-background/80 px-4 py-3 border-b border-border/50 flex justify-between items-center">
            <span className="font-semibold text-sm text-foreground">Resolusi Tinggi</span>
            <span className="text-xs font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Δ = {Math.min(deltaLow, deltaHigh)} (Kecil)
            </span>
          </div>
          <div className="p-4 flex-1">
            <ConicVisualization
              points={deltaLow < deltaHigh ? lowResPoints : highResPoints}
              secondaryPoints={deltaLow < deltaHigh ? lowResSecondary : highResSecondary}
              viewRange={viewRange}
              curveColor={curveColor}
              secondaryCurveColor={curveColor}
              options={baseOptions}
            />
          </div>
          <div className="px-4 py-3 bg-background/50 border-t border-border/50 flex justify-between">
            <span className="text-xs text-muted">Jumlah Titik Iterasi</span>
            <span className="font-mono text-sm font-bold text-foreground">
              {deltaLow < deltaHigh ? totalLow : totalHigh}
            </span>
          </div>
          <div className="px-4 py-3 bg-green-500/5 border-t border-border/50">
            <span className="text-xs text-muted block mb-1">Curve Quality</span>
            <span className="font-semibold text-sm text-green-400">Smooth / Continuous</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-surface/50 border border-border rounded-xl">
        <h4 className="text-sm font-bold text-foreground mb-2">Analisis Dampak Visualisasi</h4>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <p className="text-sm text-muted-foreground">
            Perbedaan resolusi menghasilkan selisih <strong className="text-primary">{Math.abs(totalHigh - totalLow)} titik</strong> kalkulasi.
            Resolusi rendah (Δ besar) menghasilkan lebih sedikit titik sampel sehingga membentuk pendekatan poligonal (garis patah-patah).
            Sedangkan resolusi tinggi (Δ kecil) memberikan titik yang rapat sehingga kurva tampak mulus melengkung secara presisi.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
