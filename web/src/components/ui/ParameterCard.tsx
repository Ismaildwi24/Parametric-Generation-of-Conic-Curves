'use client';

import { motion } from 'framer-motion';

interface ParameterCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function ParameterCard({
  title,
  description,
  children,
}: ParameterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 space-y-5"
    >
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
