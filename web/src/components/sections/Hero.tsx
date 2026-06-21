'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-96px)] flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary orb */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full animate-float animate-glow"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary orb */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full animate-float-delayed animate-glow"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Computer Graphics — Semester 4
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight"
        >
          <span className="text-foreground">Parametric Generation</span>
          <br />
          <span className="gradient-text">of Conic Curves</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Interactive visualization of Circle, Ellipse, Parabola and Hyperbola
          using Parametric Equations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/lingkaran"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary text-background font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Explore Curves
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/analisis"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-border text-muted font-semibold text-sm transition-all duration-300 hover:text-foreground hover:border-border-strong hover:bg-white/5"
          >
            View Analysis
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
