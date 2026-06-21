// ============================================================
// ConicCurves Explorer — Parametric Curve Generation Library
// ============================================================
// Pure mathematical functions for generating conic curve points
// using parametric equations.

import type {
  Point,
  CircleParams,
  EllipseParams,
  ParabolaParams,
  HyperbolaParams,
  CalculationStep,
  CurveGeometricInfo,
} from '@/types/curves';

export function formatNum(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Generate circle points and calculation steps.
 */
export function generateCircle(
  params: CircleParams,
  stepDelta: number
): { points: Point[]; steps: CalculationStep[]; info: CurveGeometricInfo } {
  const { radius, centerX, centerY } = params;
  const points: Point[] = [];
  const steps: CalculationStep[] = [];
  const twoPI = 2 * Math.PI;

  let no = 1;
  for (let theta = 0; theta <= twoPI + 1e-9; theta += stepDelta) {
    const x = formatNum(centerX + radius * Math.cos(theta));
    const y = formatNum(centerY + radius * Math.sin(theta));
    
    points.push({ x, y });
    steps.push({
      no: no++,
      paramValue: formatNum(theta),
      xFormula: `x = ${centerX} + ${radius} × cos(${formatNum(theta)})`,
      xResult: x,
      yFormula: `y = ${centerY} + ${radius} × sin(${formatNum(theta)})`,
      yResult: y,
    });
  }

  const info: CurveGeometricInfo = {
    center: { x: centerX, y: centerY },
    radius: radius,
    radiusPoint: { x: centerX + radius, y: centerY },
  };

  return { points, steps, info };
}

/**
 * Generate ellipse points and calculation steps.
 */
export function generateEllipse(
  params: EllipseParams,
  stepDelta: number
): { points: Point[]; steps: CalculationStep[]; info: CurveGeometricInfo } {
  const { a, b, centerX, centerY } = params;
  const points: Point[] = [];
  const steps: CalculationStep[] = [];
  const twoPI = 2 * Math.PI;

  let no = 1;
  for (let theta = 0; theta <= twoPI + 1e-9; theta += stepDelta) {
    const x = formatNum(centerX + a * Math.cos(theta));
    const y = formatNum(centerY + b * Math.sin(theta));
    
    points.push({ x, y });
    steps.push({
      no: no++,
      paramValue: formatNum(theta),
      xFormula: `x = ${centerX} + ${a} × cos(${formatNum(theta)})`,
      xResult: x,
      yFormula: `y = ${centerY} + ${b} × sin(${formatNum(theta)})`,
      yResult: y,
    });
  }

  const c = Math.sqrt(Math.abs(a * a - b * b));
  const foci = a > b 
    ? [{ x: centerX - c, y: centerY }, { x: centerX + c, y: centerY }]
    : [{ x: centerX, y: centerY - c }, { x: centerX, y: centerY + c }];

  const majorVertices = a > b
    ? [{ x: centerX - a, y: centerY }, { x: centerX + a, y: centerY }]
    : [{ x: centerX, y: centerY - b }, { x: centerX, y: centerY + b }];
  const minorVertices = a > b
    ? [{ x: centerX, y: centerY - b }, { x: centerX, y: centerY + b }]
    : [{ x: centerX - a, y: centerY }, { x: centerX + a, y: centerY }];

  const info: CurveGeometricInfo = {
    center: { x: centerX, y: centerY },
    foci,
    majorVertices,
    minorVertices,
  };

  return { points, steps, info };
}

/**
 * Generate parabola points and calculation steps.
 */
export function generateParabola(
  params: ParabolaParams,
  stepDelta: number
): { points: Point[]; steps: CalculationStep[]; info: CurveGeometricInfo } {
  const { a, vertexX, vertexY, tMin, tMax } = params;
  const points: Point[] = [];
  const steps: CalculationStep[] = [];

  let no = 1;
  for (let t = tMin; t <= tMax + 1e-9; t += stepDelta) {
    const x = formatNum(vertexX + a * t * t);
    const y = formatNum(vertexY + 2 * a * t);
    
    points.push({ x, y });
    steps.push({
      no: no++,
      paramValue: formatNum(t),
      xFormula: `x = ${vertexX} + ${a} × (${formatNum(t)})²`,
      xResult: x,
      yFormula: `y = ${vertexY} + 2 × ${a} × ${formatNum(t)}`,
      yResult: y,
    });
  }

  // Parameter is a. The standard parametric form x = at^2, y = 2at represents a parabola
  // opening along positive X-axis if a > 0, vertex at origin.
  // Wait, if it's x = a t^2, then y = 2at -> t = y/(2a) -> x = a(y/2a)^2 = a y^2/(4a^2) = y^2/(4a)
  // So y^2 = 4ax. The focus is at (a, 0) relative to vertex.
  const focus = { x: vertexX + a, y: vertexY };

  const info: CurveGeometricInfo = {
    vertices: [{ x: vertexX, y: vertexY }],
    foci: [focus],
    direction: a > 0 ? "Right (X+)" : "Left (X-)",
    directrix: { axis: 'x', value: vertexX - a },
  };

  return { points, steps, info };
}

/**
 * Generate hyperbola points and calculation steps.
 */
export function generateHyperbola(
  params: HyperbolaParams,
  stepDelta: number
): { rightBranch: Point[]; leftBranch: Point[]; steps: CalculationStep[]; info: CurveGeometricInfo } {
  const { a, b, centerX, centerY } = params;
  const rightBranch: Point[] = [];
  const leftBranch: Point[] = [];
  const steps: CalculationStep[] = [];

  const limit = Math.PI / 2 - 0.01;

  let no = 1;
  // Right branch: θ ∈ (-π/2, π/2)
  for (let theta = -limit; theta <= limit + 1e-9; theta += stepDelta) {
    const cosTheta = Math.cos(theta);
    if (Math.abs(cosTheta) < 1e-10) continue;
    const x = formatNum(centerX + a / cosTheta);
    const y = formatNum(centerY + b * Math.tan(theta));
    rightBranch.push({ x, y });
    steps.push({
      no: no++,
      paramValue: formatNum(theta),
      xFormula: `x = ${centerX} + ${a} × sec(${formatNum(theta)})`,
      xResult: x,
      yFormula: `y = ${centerY} + ${b} × tan(${formatNum(theta)})`,
      yResult: y,
    });
  }

  // Left branch: θ ∈ (π/2, 3π/2)
  for (let theta = Math.PI / 2 + 0.01; theta <= (3 * Math.PI) / 2 - 0.01 + 1e-9; theta += stepDelta) {
    const cosTheta = Math.cos(theta);
    if (Math.abs(cosTheta) < 1e-10) continue;
    const x = formatNum(centerX + a / cosTheta);
    const y = formatNum(centerY + b * Math.tan(theta));
    leftBranch.push({ x, y });
    steps.push({
      no: no++,
      paramValue: formatNum(theta),
      xFormula: `x = ${centerX} + ${a} × sec(${formatNum(theta)})`,
      xResult: x,
      yFormula: `y = ${centerY} + ${b} × tan(${formatNum(theta)})`,
      yResult: y,
    });
  }

  const c = Math.sqrt(a * a + b * b);
  const info: CurveGeometricInfo = {
    vertices: [{ x: centerX - a, y: centerY }, { x: centerX + a, y: centerY }],
    foci: [{ x: centerX - c, y: centerY }, { x: centerX + c, y: centerY }],
    center: { x: centerX, y: centerY },
    asymptotes: [
      `y - ${centerY} = ${formatNum(b/a)}(x - ${centerX})`,
      `y - ${centerY} = -${formatNum(b/a)}(x - ${centerX})`
    ],
    asymptoteLines: [
      { slope: b / a, centerX, centerY },
      { slope: -(b / a), centerX, centerY },
    ],
  };

  return { rightBranch, leftBranch, steps, info };
}

/**
 * Measure the computation time for generating curve points.
 */
export function measureComputeTime(fn: () => unknown): { result: unknown; timeMs: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, timeMs: end - start };
}

/**
 * Determine visual quality based on step size.
 */
export function getQualityLevel(step: number): 'Low' | 'Medium' | 'High' | 'Ultra' {
  if (step >= 0.5) return 'Low';
  if (step >= 0.1) return 'Medium';
  if (step >= 0.05) return 'High';
  return 'Ultra';
}
