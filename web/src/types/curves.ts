// ============================================================
// ConicCurves Explorer — Type Definitions
// ============================================================

/** A single 2D point in the Cartesian plane. */
export interface Point {
  x: number;
  y: number;
}

/** Represents a single calculation step in the parametric generation. */
export interface CalculationStep {
  no: number;
  paramValue: number;
  xFormula: string;
  xResult: number;
  yFormula: string;
  yResult: number;
}

/** Common geometric information for a curve. */
export interface CurveGeometricInfo {
  center?: Point;
  radius?: number;
  vertices?: Point[];
  foci?: Point[];
  asymptotes?: string[];
  direction?: string;
  directrix?: { axis: 'x' | 'y'; value: number };
  radiusPoint?: Point;
  majorVertices?: Point[];
  minorVertices?: Point[];
  asymptoteLines?: { slope: number; centerX: number; centerY: number }[];
}

/** Represents an important mathematical point on a curve */
export interface ImportantPoint {
  point: Point;
  label: string;
  color: string;
  type: 'vertex' | 'focus' | 'center' | 'radius' | 'majorVertex' | 'minorVertex';
}

/** Supported curve types */
export type CurveType = 'circle' | 'ellipse' | 'parabola' | 'hyperbola';

// ─── Curve Parameters ────────────────────────────────────────

export interface CircleParams {
  radius: number;
  centerX: number;
  centerY: number;
  deltaLow: number;
  deltaHigh: number;
}

export interface EllipseParams {
  a: number;
  b: number;
  centerX: number;
  centerY: number;
  deltaLow: number;
  deltaHigh: number;
}

export interface ParabolaParams {
  a: number;
  vertexX: number;
  vertexY: number;
  tMin: number;
  tMax: number;
  deltaLow: number;
  deltaHigh: number;
}

export interface HyperbolaParams {
  a: number;
  b: number;
  centerX: number;
  centerY: number;
  deltaLow: number;
  deltaHigh: number;
}

// ─── Analysis Types ──────────────────────────────────────────

export type QualityLevel = 'Low' | 'Medium' | 'High' | 'Ultra';

export interface CurveAnalysis {
  step: number;
  pointCount: number;
  computeTimeMs: number;
  quality: QualityLevel;
}

export interface StepComparison {
  curveType: string;
  analyses: CurveAnalysis[];
}

// ─── Component Props ─────────────────────────────────────────

export interface SliderControlProps {
  label: string;
  value: number | '';
  min: number;
  max: number;
  step: number;
  onChange: (value: number | '') => void;
  unit?: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export interface VisualizationOptions {
  showCurve: boolean;
  showPoints: boolean;
  showSamplePoints: boolean;
  showLabels: boolean;
  showGrid: boolean;
  showAxis: boolean;
  showFocus: boolean;
  showVertex: boolean;
  showCenter: boolean;
  showDirectrix: boolean;
  showAsymptotes: boolean;
  showAnimationPath: boolean;
}

export interface ConicVisualizationProps {
  points: Point[];
  steps?: CalculationStep[];
  secondaryPoints?: Point[];
  drawnPointCount?: number; // For animation
  onPointClick?: (index: number) => void;
  viewRange?: { xMin: number; xMax: number; yMin: number; yMax: number };
  gridStep?: number;
  curveColor?: string;
  secondaryCurveColor?: string;
  title?: string;
  options: VisualizationOptions;
  geometricInfo?: CurveGeometricInfo;
  hoveredIndex?: number | null;
  curveType?: CurveType;
}
