'use client';

import { motion } from 'framer-motion';

interface IterationPanelProps {
  paramName: string;
  paramRange: string;
  delta: number;
  totalIterations: number;
  values: number[];
}

export default function IterationPanel({
  paramName,
  paramRange,
  delta,
  totalIterations,
  values,
}: IterationPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 h-full flex flex-col"
    >
      <h3 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">
        Hasil Iterasi Parameter
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-muted text-xs">Rentang Parameter</p>
          <p className="font-mono text-primary">{paramName} = {paramRange}</p>
        </div>
        <div>
          <p className="text-muted text-xs">Delta step</p>
          <p className="font-mono text-primary">Δ{paramName} = {delta}</p>
        </div>
        <div className="col-span-2">
          <p className="text-muted text-xs">Jumlah Iterasi</p>
          <p className="font-mono text-foreground font-semibold">{totalIterations} titik</p>
        </div>
      </div>

      <div className="flex-1 bg-background/50 rounded-lg p-3 border border-border">
        <p className="text-xs text-muted mb-2 font-medium">Array Parameter:</p>
        <div className="overflow-y-auto max-h-[150px] font-mono text-sm text-foreground space-y-1 custom-scrollbar pr-2">
          [
          {values.map((v, i) => (
            <div key={i} className="pl-4">
              {v.toFixed(4)}{i < values.length - 1 ? ',' : ''}
            </div>
          ))}
          ]
        </div>
      </div>
    </motion.div>
  );
}
