'use client';

import { motion } from 'framer-motion';
import type { StatCardProps } from '@/types/curves';

export default function StatCard({
  label,
  value,
  icon,
  description,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass p-4 flex items-start gap-3"
    >
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-foreground mt-0.5 font-mono">
          {value}
        </p>
        {description && (
          <p className="text-xs text-muted mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
