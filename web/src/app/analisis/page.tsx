'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import CurvePageLayout from '@/components/curves/CurvePageLayout';
import StatCard from '@/components/ui/StatCard';
import {
  generateCircle,
  generateEllipse,
  generateParabola,
  generateHyperbola,
  measureComputeTime,
  getQualityLevel,
} from '@/lib/curves';
import type { CurveAnalysis } from '@/types/curves';

const STEPS = [0.5, 0.1, 0.05, 0.01];

interface CurveResult {
  name: string;
  color: string;
  analyses: CurveAnalysis[];
}

function analyzeAllCurves(): CurveResult[] {
  const results: CurveResult[] = [];

  // Circle (r=5)
  const circleAnalyses: CurveAnalysis[] = STEPS.map((step) => {
    const { result, timeMs } = measureComputeTime(() =>
      generateCircle({ radius: 5, centerX: 0, centerY: 0, deltaLow: step, deltaHigh: step }, step)
    );
    const { points: pts } = result as ReturnType<typeof generateCircle>;
    return { step, pointCount: pts.length, computeTimeMs: timeMs, quality: getQualityLevel(step) };
  });
  results.push({ name: 'Circle', color: '#38BDF8', analyses: circleAnalyses });

  // Ellipse (a=6, b=4)
  const ellipseAnalyses: CurveAnalysis[] = STEPS.map((step) => {
    const { result, timeMs } = measureComputeTime(() =>
      generateEllipse({ a: 6, b: 4, centerX: 0, centerY: 0, deltaLow: step, deltaHigh: step }, step)
    );
    const { points: pts } = result as ReturnType<typeof generateEllipse>;
    return { step, pointCount: pts.length, computeTimeMs: timeMs, quality: getQualityLevel(step) };
  });
  results.push({ name: 'Ellipse', color: '#8B5CF6', analyses: ellipseAnalyses });

  // Parabola (a=1)
  const parabolaAnalyses: CurveAnalysis[] = STEPS.map((step) => {
    const { result, timeMs } = measureComputeTime(() =>
      generateParabola({ a: 1, vertexX: 0, vertexY: 0, tMin: -5, tMax: 5, deltaLow: step, deltaHigh: step }, step)
    );
    const { points: pts } = result as ReturnType<typeof generateParabola>;
    return { step, pointCount: pts.length, computeTimeMs: timeMs, quality: getQualityLevel(step) };
  });
  results.push({ name: 'Parabola', color: '#34D399', analyses: parabolaAnalyses });

  // Hyperbola (a=3, b=2)
  const hyperbolaAnalyses: CurveAnalysis[] = STEPS.map((step) => {
    const { result, timeMs } = measureComputeTime(() =>
      generateHyperbola({ a: 3, b: 2, centerX: 0, centerY: 0, deltaLow: step, deltaHigh: step }, step)
    );
    const branches = result as ReturnType<typeof generateHyperbola>;
    const totalPoints = branches.rightBranch.length + branches.leftBranch.length;
    return { step, pointCount: totalPoints, computeTimeMs: timeMs, quality: getQualityLevel(step) };
  });
  results.push({ name: 'Hyperbola', color: '#F472B6', analyses: hyperbolaAnalyses });

  return results;
}

const qualityColorMap: Record<string, string> = {
  Low: '#EF4444',
  Medium: '#F59E0B',
  High: '#34D399',
  Ultra: '#38BDF8',
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalisisPage() {
  const curveResults = useMemo(() => analyzeAllCurves(), []);

  // Prepare data for charts
  const pointCountData = STEPS.map((step) => {
    const entry: Record<string, string | number> = { step: `Δ = ${step}` };
    curveResults.forEach((c) => {
      const analysis = c.analyses.find((a) => a.step === step);
      if (analysis) entry[c.name] = analysis.pointCount;
    });
    return entry;
  });

  const renderTimeData = STEPS.map((step) => {
    const entry: Record<string, string | number> = { step: `Δ = ${step}` };
    curveResults.forEach((c) => {
      const analysis = c.analyses.find((a) => a.step === step);
      if (analysis) entry[c.name] = parseFloat(analysis.computeTimeMs.toFixed(4));
    });
    return entry;
  });

  // Total stats
  const totalPointsUltra = curveResults.reduce((sum, c) => {
    const ultra = c.analyses.find((a) => a.step === 0.01);
    return sum + (ultra?.pointCount ?? 0);
  }, 0);

  const avgTimeUltra =
    curveResults.reduce((sum, c) => {
      const ultra = c.analyses.find((a) => a.step === 0.01);
      return sum + (ultra?.computeTimeMs ?? 0);
    }, 0) / curveResults.length;

  return (
    <CurvePageLayout
      title="Analisis"
      subtitle="Comparative analysis of step sizes and their impact on visual quality and computational performance."
      accentColor="#F59E0B"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Step Values Compared"
          value={STEPS.length}
          icon={<Layers className="w-5 h-5" />}
          description="0.5, 0.1, 0.05, 0.01"
        />
        <StatCard
          label="Total Points (Ultra)"
          value={totalPointsUltra.toLocaleString()}
          icon={<BarChart3 className="w-5 h-5" />}
          description="All curves at Δ = 0.01"
        />
        <StatCard
          label="Avg Compute (Ultra)"
          value={`${avgTimeUltra.toFixed(3)} ms`}
          icon={<TrendingUp className="w-5 h-5" />}
          description="Average across all curves"
        />
      </div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass p-6 overflow-x-auto"
      >
        <h3 className="text-sm font-medium text-muted mb-4">
          Comparison Table
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 text-muted font-medium">
                Curve
              </th>
              {STEPS.map((step) => (
                <th
                  key={step}
                  className="text-center py-3 px-3 text-muted font-medium"
                >
                  Δ = {step}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {curveResults.map((curve) => (
              <React.Fragment key={curve.name}>
                {/* Point count row */}
                <tr key={`${curve.name}-points`} className="border-b border-border/50">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: curve.color }}
                      />
                      <span className="font-medium text-foreground">
                        {curve.name}
                      </span>
                      <span className="text-xs text-muted">points</span>
                    </div>
                  </td>
                  {curve.analyses.map((a) => (
                    <td
                      key={a.step}
                      className="text-center py-3 px-3 font-mono text-foreground"
                    >
                      {a.pointCount}
                    </td>
                  ))}
                </tr>
                {/* Quality row */}
                <tr key={`${curve.name}-quality`} className="border-b border-border/50">
                  <td className="py-2 px-3">
                    <span className="text-xs text-muted ml-4">quality</span>
                  </td>
                  {curve.analyses.map((a) => (
                    <td key={a.step} className="text-center py-2 px-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${qualityColorMap[a.quality]}20`,
                          color: qualityColorMap[a.quality],
                        }}
                      >
                        {a.quality}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* Time row */}
                <tr key={`${curve.name}-time`} className="border-b border-border/30">
                  <td className="py-2 px-3">
                    <span className="text-xs text-muted ml-4">time (ms)</span>
                  </td>
                  {curve.analyses.map((a) => (
                    <td
                      key={a.step}
                      className="text-center py-2 px-3 text-xs font-mono text-muted"
                    >
                      {a.computeTimeMs.toFixed(4)}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Bar Chart — Points Generated */}
        <motion.div variants={itemVariants} className="glass p-6">
          <h3 className="text-sm font-medium text-muted mb-4">
            Points Generated by Step Size
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pointCountData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="step"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
                />
                {curveResults.map((c) => (
                  <Bar
                    key={c.name}
                    dataKey={c.name}
                    fill={c.color}
                    radius={[4, 4, 0, 0]}
                    opacity={0.85}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Line Chart — Render Time */}
        <motion.div variants={itemVariants} className="glass p-6">
          <h3 className="text-sm font-medium text-muted mb-4">
            Compute Time by Step Size
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={renderTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="step"
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  label={{
                    value: 'ms',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#94A3B8',
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }}
                />
                {curveResults.map((c) => (
                  <Line
                    key={c.name}
                    type="monotone"
                    dataKey={c.name}
                    stroke={c.color}
                    strokeWidth={2}
                    dot={{ fill: c.color, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Quality Comparison Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass p-6"
      >
        <h3 className="text-sm font-medium text-muted mb-4">
          Visual Quality Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((step) => {
            const quality = getQualityLevel(step);
            return (
              <div
                key={step}
                className="bg-background/50 rounded-xl p-4 text-center"
              >
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
                  style={{
                    backgroundColor: `${qualityColorMap[quality]}20`,
                    color: qualityColorMap[quality],
                  }}
                >
                  {quality}
                </div>
                <p className="text-lg font-bold font-mono text-foreground">
                  Δ = {step}
                </p>
                <p className="text-xs text-muted mt-2">
                  {step >= 0.5
                    ? 'Coarse resolution. Visible polygonal edges. Fast rendering.'
                    : step >= 0.1
                    ? 'Moderate resolution. Slight edges visible. Good balance.'
                    : step >= 0.05
                    ? 'High resolution. Smooth curves. Minor performance cost.'
                    : 'Ultra resolution. Near-perfect curves. Maximum fidelity.'}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </CurvePageLayout>
  );
}
