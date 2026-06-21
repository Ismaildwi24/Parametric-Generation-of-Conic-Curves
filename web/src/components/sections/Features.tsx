'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Circle, Sparkles, TrendingUp, Infinity, Zap, Shield, SlidersHorizontal } from 'lucide-react';

const curves = [
  {
    title: 'Lingkaran',
    subtitle: 'Circle',
    description: 'Perfect symmetrical curve generated using radius and angular parameter θ.',
    href: '/lingkaran',
    icon: Circle,
    color: '#38BDF8',
    formula: 'x = r·cos(θ)',
  },
  {
    title: 'Elips',
    subtitle: 'Ellipse',
    description: 'Elongated circle defined by two semi-axes a (horizontal) and b (vertical).',
    href: '/elips',
    icon: Sparkles,
    color: '#8B5CF6',
    formula: 'x = a·cos(θ)',
  },
  {
    title: 'Parabola',
    subtitle: 'Parabola',
    description: 'Open curve generated from vertex point using quadratic parameter t.',
    href: '/parabola',
    icon: TrendingUp,
    color: '#34D399',
    formula: 'x = a·t²',
  },
  {
    title: 'Hiperbola',
    subtitle: 'Hyperbola',
    description: 'Dual-branch curve using secant and tangent trigonometric functions.',
    href: '/hiperbola',
    icon: Infinity,
    color: '#F472B6',
    formula: 'x = a·sec(θ)',
  },
];

const benefits = [
  {
    title: 'Loop Efficiency',
    description: 'Rendering process executed step-by-step by changing only a single parameter variable.',
    icon: Zap,
  },
  {
    title: 'Error-Free',
    description: 'Avoids division-by-zero errors and imaginary values common in implicit Cartesian equations.',
    icon: Shield,
  },
  {
    title: 'Smooth Control',
    description: 'Point density (resolution) can be easily adjusted by modifying the delta step.',
    icon: SlidersHorizontal,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <>
      {/* Curve Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Explore <span className="gradient-text">Conic Sections</span>
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Four fundamental curves generated from the intersection of a plane and a double cone.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {curves.map((curve) => (
              <motion.div key={curve.title} variants={itemVariants}>
                <Link
                  href={curve.href}
                  className="group block glass p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20"
                  style={{
                    borderColor: 'transparent',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${curve.color}15` }}
                  >
                    <curve.icon
                      className="w-5 h-5"
                      style={{ color: curve.color }}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {curve.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5 font-medium">
                    {curve.subtitle}
                  </p>
                  <p className="text-sm text-muted mt-3 leading-relaxed">
                    {curve.description}
                  </p>
                  <div className="mt-4 inline-block px-3 py-1 rounded-lg bg-background/50 text-xs font-mono text-muted">
                    {curve.formula}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Parametric */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Why <span className="gradient-text">Parametric</span>?
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Parametric representation offers significant advantages over
              implicit Cartesian functions for curve rendering.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={itemVariants}
                className="glass p-6 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
