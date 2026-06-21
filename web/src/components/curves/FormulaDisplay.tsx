'use client';

import { motion } from 'framer-motion';

interface FormulaDisplayProps {
  title: string;
  formulas: { label: string; equation: string }[];
  parameterRange?: string;
}

export default function FormulaDisplay({
  title,
  formulas,
  parameterRange,
}: FormulaDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass p-6"
    >
      <h3 className="text-sm font-medium text-muted mb-4">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {formulas.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-background/50 rounded-xl px-4 py-3"
          >
            <span className="text-xs font-medium text-muted">{f.label}</span>
            <span className="text-sm font-mono font-semibold text-primary">
              {f.equation}
            </span>
          </div>
        ))}
        {parameterRange && (
          <div className="flex items-center gap-3 bg-secondary/10 rounded-xl px-4 py-3">
            <span className="text-xs font-medium text-muted">Range</span>
            <span className="text-sm font-mono font-semibold text-secondary">
              {parameterRange}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
