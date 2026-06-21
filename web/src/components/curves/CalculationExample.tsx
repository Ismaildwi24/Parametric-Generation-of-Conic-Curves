'use client';

import { motion } from 'framer-motion';
import type { CalculationStep } from '@/types/curves';

interface CalculationExampleProps {
  paramName: string;
  step: CalculationStep;
}

export default function CalculationExample({ paramName, step }: CalculationExampleProps) {
  if (!step) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 h-full flex flex-col"
    >
      <h3 className="text-sm font-medium text-muted mb-4 uppercase tracking-wider">
        Contoh Perhitungan
      </h3>
      <div className="bg-background/50 rounded-xl p-4 flex-1 border border-border">
        <p className="text-sm font-semibold text-primary mb-3">
          Saat {paramName} = {step.paramValue.toFixed(4)}
        </p>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted mb-1 font-medium">Substitusi X:</p>
            <p className="font-mono text-sm text-foreground bg-black/20 p-2 rounded">
              {step.xFormula}
            </p>
            <p className="font-mono text-sm text-primary font-bold mt-1 px-2">
              x = {step.xResult.toFixed(4)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-muted mb-1 font-medium">Substitusi Y:</p>
            <p className="font-mono text-sm text-foreground bg-black/20 p-2 rounded">
              {step.yFormula}
            </p>
            <p className="font-mono text-sm text-primary font-bold mt-1 px-2">
              y = {step.yResult.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-xs text-muted">Koordinat Titik:</p>
          <p className="font-mono text-base text-foreground font-semibold">
            P({step.xResult.toFixed(4)}, {step.yResult.toFixed(4)})
          </p>
        </div>
      </div>
    </motion.div>
  );
}
