'use client';

import { motion } from 'framer-motion';

interface CurvePageLayoutProps {
  title: string;
  subtitle: string;
  accentColor?: string;
  children: React.ReactNode;
}

export default function CurvePageLayout({
  title,
  subtitle,
  accentColor = '#38BDF8',
  children,
}: CurvePageLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-8 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              {title}
            </h1>
          </div>
          <p className="text-muted ml-5">{subtitle}</p>
        </motion.div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
