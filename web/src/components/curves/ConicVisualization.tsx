'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import type { ConicVisualizationProps, Point, ImportantPoint } from '@/types/curves';

const SVG_SIZE = 500;
const PADDING = 50;
const DRAW_SIZE = SVG_SIZE - 2 * PADDING;

function toSVG(
  point: Point,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): { sx: number; sy: number } {
  const sx = PADDING + ((point.x - xMin) / (xMax - xMin)) * DRAW_SIZE;
  const sy = PADDING + ((yMax - point.y) / (yMax - yMin)) * DRAW_SIZE;
  return { sx, sy };
}

function formatCoord(val: number): string {
  if (Math.abs(val) < 0.0001) return '0';
  return Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.00$/, '');
}

export default function ConicVisualization({
  points,
  steps,
  secondaryPoints,
  drawnPointCount,
  onPointClick,
  viewRange,
  gridStep = 1,
  curveColor = '#38BDF8',
  secondaryCurveColor = '#8B5CF6',
  title,
  options,
  geometricInfo,
  hoveredIndex: externalHoveredIndex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  curveType
}: ConicVisualizationProps) {
  const range = viewRange ?? { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
  const { xMin, xMax, yMin, yMax } = range;

  // Animation slicing
  const visiblePoints = drawnPointCount !== undefined ? points.slice(0, drawnPointCount) : points;
  const visibleSecondaryPoints = drawnPointCount !== undefined && secondaryPoints ? secondaryPoints.slice(0, drawnPointCount) : secondaryPoints;

  // Zoom & Pan state
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Internal Hover & Tooltip State
  const [localHoveredIndex, setLocalHoveredIndex] = useState<number | null>(null);
  const hoveredIndex = externalHoveredIndex !== undefined ? externalHoveredIndex : localHoveredIndex;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.max(0.5, Math.min(s * zoomFactor, 10)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const svg = svgRef.current;
    const preventDefaultWheel = (e: WheelEvent) => e.preventDefault();
    if (svg) {
      svg.addEventListener('wheel', preventDefaultWheel, { passive: false });
    }
    return () => {
      if (svg) {
        svg.removeEventListener('wheel', preventDefaultWheel);
      }
    };
  }, []);

  const gridLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; isAxis: boolean }[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += gridStep) {
      const { sx: sx1, sy: sy1 } = toSVG({ x, y: yMin }, xMin, xMax, yMin, yMax);
      const { sx: sx2, sy: sy2 } = toSVG({ x, y: yMax }, xMin, xMax, yMin, yMax);
      lines.push({ x1: sx1, y1: sy1, x2: sx2, y2: sy2, isAxis: x === 0 });
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += gridStep) {
      const { sx: sx1, sy: sy1 } = toSVG({ x: xMin, y }, xMin, xMax, yMin, yMax);
      const { sx: sx2, sy: sy2 } = toSVG({ x: xMax, y }, xMin, xMax, yMin, yMax);
      lines.push({ x1: sx1, y1: sy1, x2: sx2, y2: sy2, isAxis: y === 0 });
    }
    return lines;
  }, [xMin, xMax, yMin, yMax, gridStep]);

  const tickLabels = useMemo(() => {
    const labels: { x: number; y: number; text: string; anchor: 'start' | 'middle' | 'end' }[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x += gridStep) {
      if (x === 0) continue;
      const { sx, sy } = toSVG({ x, y: 0 }, xMin, xMax, yMin, yMax);
      labels.push({ x: sx, y: sy + 16, text: String(x), anchor: 'middle' });
    }
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += gridStep) {
      if (y === 0) continue;
      const { sx, sy } = toSVG({ x: 0, y }, xMin, xMax, yMin, yMax);
      labels.push({ x: sx - 8, y: sy + 4, text: String(y), anchor: 'end' });
    }
    return labels;
  }, [xMin, xMax, yMin, yMax, gridStep]);

  // TRACE 1: Smooth Curve
  const primaryPath = useMemo(() => {
    return visiblePoints
      .filter((p) => isFinite(p.x) && isFinite(p.y))
      .map((p) => {
        const { sx, sy } = toSVG(p, xMin, xMax, yMin, yMax);
        return `${sx},${sy}`;
      })
      .join(' ');
  }, [visiblePoints, xMin, xMax, yMin, yMax]);

  const secondaryPath = useMemo(() => {
    if (!visibleSecondaryPoints) return '';
    return visibleSecondaryPoints
      .filter((p) => isFinite(p.x) && isFinite(p.y))
      .map((p) => {
        const { sx, sy } = toSVG(p, xMin, xMax, yMin, yMax);
        return `${sx},${sy}`;
      })
      .join(' ');
  }, [visibleSecondaryPoints, xMin, xMax, yMin, yMax]);

  // TRACE 2: Sampled Parametric Points (Adaptive for low/high res)
  const sampledIndices = useMemo(() => {
    const indices: number[] = [];
    const total = visiblePoints.length;
    if (total === 0) return indices;
    
    // Low resolution mode (large delta t) -> show all points to emphasize discreteness
    const isLowRes = points.length <= 60;
    const sampleInterval = isLowRes ? 1 : Math.max(1, Math.floor(points.length / 25));
    
    for (let i = 0; i < total; i++) {
      if (i % sampleInterval === 0 || i === total - 1) {
        indices.push(i);
      }
    }
    return indices;
  }, [visiblePoints.length, points.length]);

  // TRACES 3-5: Important Mathematical Points
  const importantPoints = useMemo(() => {
    const ips: ImportantPoint[] = [];
    if (!geometricInfo) return ips;

    if (options.showCenter && geometricInfo.center) {
      ips.push({ point: geometricInfo.center, label: `C (${formatCoord(geometricInfo.center.x)}, ${formatCoord(geometricInfo.center.y)})`, color: '#FBBF24', type: 'center' }); // Yellow
    }
    if (options.showVertex && geometricInfo.radiusPoint) {
      ips.push({ point: geometricInfo.radiusPoint, label: `R (${formatCoord(geometricInfo.radiusPoint.x)}, ${formatCoord(geometricInfo.radiusPoint.y)})`, color: '#22D3EE', type: 'radius' }); // Cyan
    }
    if (options.showFocus && geometricInfo.foci) {
      geometricInfo.foci.forEach((f, i) => {
        ips.push({ point: f, label: `F${geometricInfo.foci!.length > 1 ? i+1 : ''} (${formatCoord(f.x)}, ${formatCoord(f.y)})`, color: '#10B981', type: 'focus' }); // Green
      });
    }
    if (options.showVertex && geometricInfo.vertices) {
      geometricInfo.vertices.forEach((v, i) => {
        ips.push({ point: v, label: `V${geometricInfo.vertices!.length > 1 ? i+1 : ''} (${formatCoord(v.x)}, ${formatCoord(v.y)})`, color: '#EF4444', type: 'vertex' }); // Red
      });
    }
    if (options.showVertex && geometricInfo.majorVertices && geometricInfo.majorVertices.length > 0) {
      geometricInfo.majorVertices.forEach((v, i) => {
        ips.push({ point: v, label: `V${i+1} (${formatCoord(v.x)}, ${formatCoord(v.y)})`, color: '#EF4444', type: 'majorVertex' });
      });
    }
    if (options.showVertex && geometricInfo.minorVertices && geometricInfo.minorVertices.length > 0) {
      geometricInfo.minorVertices.forEach((v, i) => {
        ips.push({ point: v, label: `W${i+1} (${formatCoord(v.x)}, ${formatCoord(v.y)})`, color: '#F97316', type: 'minorVertex' }); // Orange
      });
    }

    // Filter duplicates by coordinate
    const uniqueIps: ImportantPoint[] = [];
    const seen = new Set<string>();
    for (const ip of ips) {
      const key = `${ip.point.x.toFixed(4)},${ip.point.y.toFixed(4)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueIps.push(ip);
      }
    }

    return uniqueIps;
  }, [geometricInfo, options]);

  // TRACE 6 & 7: Directrix and Asymptotes
  const directrixSVG = useMemo(() => {
    if (!options.showDirectrix || !geometricInfo?.directrix) return null;
    const { axis, value } = geometricInfo.directrix;
    let x1, y1, x2, y2, labelX, labelY;
    if (axis === 'x') {
      const pt1 = toSVG({ x: value, y: yMin }, xMin, xMax, yMin, yMax);
      const pt2 = toSVG({ x: value, y: yMax }, xMin, xMax, yMin, yMax);
      x1 = pt1.sx; y1 = pt1.sy; x2 = pt2.sx; y2 = pt2.sy;
      labelX = pt1.sx + 8/scale;
      labelY = pt2.sy + 20/scale;
    } else {
      const pt1 = toSVG({ x: xMin, y: value }, xMin, xMax, yMin, yMax);
      const pt2 = toSVG({ x: xMax, y: value }, xMin, xMax, yMin, yMax);
      x1 = pt1.sx; y1 = pt1.sy; x2 = pt2.sx; y2 = pt2.sy;
      labelX = pt2.sx - 60/scale;
      labelY = pt1.sy - 8/scale;
    }
    return (
      <g className="directrix-group">
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#EC4899" strokeWidth={1.5 / scale} className="directrix-line" />
        <text x={labelX} y={labelY} fill="#EC4899" fontSize={11 / scale} fontWeight="bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          Directrix {axis}={formatCoord(value)}
        </text>
      </g>
    );
  }, [geometricInfo, options.showDirectrix, xMin, xMax, yMin, yMax, scale]);

  const asymptotesSVG = useMemo(() => {
    if (!options.showAsymptotes || !geometricInfo?.asymptoteLines) return null;
    return geometricInfo.asymptoteLines.map((line, i) => {
      const yAtXmin = line.slope * (xMin - line.centerX) + line.centerY;
      const yAtXmax = line.slope * (xMax - line.centerX) + line.centerY;
      const pt1 = toSVG({ x: xMin, y: yAtXmin }, xMin, xMax, yMin, yMax);
      const pt2 = toSVG({ x: xMax, y: yAtXmax }, xMin, xMax, yMin, yMax);
      return <line key={i} x1={pt1.sx} y1={pt1.sy} x2={pt2.sx} y2={pt2.sy} stroke="#A855F7" strokeWidth={1.5 / scale} className="asymptote-line" />;
    });
  }, [geometricInfo, options.showAsymptotes, xMin, xMax, yMin, yMax, scale]);

  // TRACE 8: Annotation Lines (e.g. Vertex to Focus for Parabola)
  const relationshipLines = useMemo(() => {
    if (curveType !== 'parabola' || !geometricInfo?.vertices?.[0] || !geometricInfo?.foci?.[0]) return null;
    if (!options.showVertex || !options.showFocus) return null;
    
    const v = geometricInfo.vertices[0];
    const f = geometricInfo.foci[0];
    const ptV = toSVG(v, xMin, xMax, yMin, yMax);
    const ptF = toSVG(f, xMin, xMax, yMin, yMax);
    
    const distance = Math.sqrt(Math.pow(v.x - f.x, 2) + Math.pow(v.y - f.y, 2));
    const midX = (ptV.sx + ptF.sx) / 2;
    const midY = (ptV.sy + ptF.sy) / 2;

    return (
      <g className="relationship-line pointer-events-none">
        <line x1={ptV.sx} y1={ptV.sy} x2={ptF.sx} y2={ptF.sy} stroke="#60A5FA" strokeWidth={2 / scale} strokeDasharray="4 2" opacity="0.8" />
        <text x={midX} y={midY - 8/scale} fill="#60A5FA" fontSize={11 / scale} textAnchor="middle" fontWeight="bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          p = {formatCoord(distance)}
        </text>
      </g>
    );
  }, [curveType, geometricInfo, options.showVertex, options.showFocus, xMin, xMax, yMin, yMax, scale]);


  const hoveredStep = hoveredIndex !== null && steps ? steps[hoveredIndex] : null;

  // Active point for animation
  const activePointIndex = options.showAnimationPath && drawnPointCount && drawnPointCount > 0 ? drawnPointCount - 1 : null;
  const activePoint = activePointIndex !== null ? visiblePoints[activePointIndex] : null;
  const activePointSecondary = activePointIndex !== null && visibleSecondaryPoints ? visibleSecondaryPoints[activePointIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass p-4 sm:p-6 flex flex-col relative h-full"
    >
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-sm font-medium text-muted">{title}</h3>}
        <div className="flex gap-2">
          <button onClick={() => setScale(s => Math.min(s * 1.2, 10))} className="p-1.5 rounded bg-background/50 text-muted hover:text-primary transition" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => setScale(s => Math.max(s / 1.2, 0.5))} className="p-1.5 rounded bg-background/50 text-muted hover:text-primary transition" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={resetView} className="p-1.5 rounded bg-background/50 text-muted hover:text-primary transition" title="Reset View"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div 
        className="w-full aspect-square max-w-[500px] mx-auto overflow-hidden bg-[rgba(11,16,32,0.5)] rounded-lg relative cursor-grab active:cursor-grabbing group border border-white/5"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setLocalHoveredIndex(null);
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`} style={{ transformOrigin: `${SVG_SIZE/2}px ${SVG_SIZE/2}px` }}>
            
            {/* Grid & Axis */}
            <g className="trace-grid">
              {(options.showGrid || options.showAxis) && gridLines.map((line, i) => (
                <line
                  key={i}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={line.isAxis 
                    ? (options.showAxis ? 'rgba(255,255,255,0.4)' : 'transparent') 
                    : (options.showGrid ? 'rgba(255,255,255,0.08)' : 'transparent')}
                  strokeWidth={line.isAxis ? 1.5 / scale : 0.5 / scale}
                />
              ))}

              {/* Labels */}
              {options.showLabels && tickLabels.map((label, i) => (
                <text
                  key={i}
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor}
                  fill="#94A3B8"
                  fontSize={9 / scale}
                  fontFamily="monospace"
                >
                  {label.text}
                </text>
              ))}

              {options.showLabels && options.showAxis && (
                <>
                  <text x={SVG_SIZE - PADDING + 8} y={toSVG({ x: 0, y: 0 }, xMin, xMax, yMin, yMax).sy + 4} fill="#94A3B8" fontSize={11 / scale} fontWeight="600">x</text>
                  <text x={toSVG({ x: 0, y: 0 }, xMin, xMax, yMin, yMax).sx - 4} y={PADDING - 8} fill="#94A3B8" fontSize={11 / scale} fontWeight="600" textAnchor="end">y</text>
                </>
              )}
            </g>

            {/* TRACE 6 & 7: Directrix & Asymptotes */}
            {directrixSVG}
            {asymptotesSVG}

            {/* TRACE 8: Annotation Lines */}
            {relationshipLines}

            {/* TRACE 1: Smooth Curves / Polyline */}
            <g className="trace-curve">
              {options.showCurve && secondaryPath && (
                <polyline points={secondaryPath} fill="none" stroke={secondaryCurveColor} strokeWidth={2 / scale} strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              )}

              {options.showCurve && (
                <polyline points={primaryPath} fill="none" stroke={curveColor} strokeWidth={2.5 / scale} strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
              )}
            </g>

            {/* TRACE 2: Sampled Parametric Points */}
            <g className="trace-samples">
              {options.showSamplePoints !== false && options.showPoints && sampledIndices.map(i => {
                const p = visiblePoints[i];
                if (!isFinite(p.x) || !isFinite(p.y)) return null;
                const { sx, sy } = toSVG(p, xMin, xMax, yMin, yMax);
                const isHovered = hoveredIndex === i;
                return (
                  <circle 
                    key={`sample-${i}`} 
                    cx={sx} 
                    cy={sy} 
                    r={(isHovered ? 5 : 3) / scale} 
                    fill={isHovered ? '#ffffff' : '#f8fafc'} 
                    opacity={isHovered ? 1 : 0.9}
                    stroke={curveColor}
                    strokeWidth={1.5 / scale}
                    onMouseEnter={() => setLocalHoveredIndex(i)}
                    onMouseLeave={() => setLocalHoveredIndex(null)}
                    onClick={() => onPointClick && onPointClick(i)}
                    className="cursor-pointer transition-all duration-200"
                  />
                );
              })}

              {options.showSamplePoints !== false && options.showPoints && visibleSecondaryPoints && sampledIndices.map(i => {
                const p = visibleSecondaryPoints[i];
                if (!isFinite(p.x) || !isFinite(p.y)) return null;
                const { sx, sy } = toSVG(p, xMin, xMax, yMin, yMax);
                const isHovered = hoveredIndex === i;
                return (
                  <circle 
                    key={`sample-sec-${i}`} 
                    cx={sx} 
                    cy={sy} 
                    r={(isHovered ? 5 : 3) / scale} 
                    fill={isHovered ? '#ffffff' : '#f8fafc'} 
                    opacity={isHovered ? 1 : 0.9}
                    stroke={secondaryCurveColor}
                    strokeWidth={1.5 / scale}
                    onMouseEnter={() => setLocalHoveredIndex(i)}
                    onMouseLeave={() => setLocalHoveredIndex(null)}
                    onClick={() => onPointClick && onPointClick(i)}
                    className="cursor-pointer transition-all duration-200"
                  />
                );
              })}
            </g>

            {/* TRACE 5 (Animation): Active Animation Point */}
            <g className="trace-animation">
              {activePoint && (
                <circle
                  cx={toSVG(activePoint, xMin, xMax, yMin, yMax).sx}
                  cy={toSVG(activePoint, xMin, xMax, yMin, yMax).sy}
                  r={6 / scale}
                  fill="#3B82F6"
                  stroke="#ffffff"
                  strokeWidth={2 / scale}
                  className="active-point-pulse pointer-events-none"
                />
              )}
              {activePointSecondary && (
                <circle
                  cx={toSVG(activePointSecondary, xMin, xMax, yMin, yMax).sx}
                  cy={toSVG(activePointSecondary, xMin, xMax, yMin, yMax).sy}
                  r={6 / scale}
                  fill="#3B82F6"
                  stroke="#ffffff"
                  strokeWidth={2 / scale}
                  className="active-point-pulse pointer-events-none"
                />
              )}
            </g>

            {/* TRACES 3-5: Important Mathematical Points (Foreground) */}
            <g className="trace-important-points">
              {importantPoints.map((ip, i) => {
                const { sx, sy } = toSVG(ip.point, xMin, xMax, yMin, yMax);
                return (
                  <g key={`ip-${i}`} className="pointer-events-none">
                    <circle cx={sx} cy={sy} r={5 / scale} fill={ip.color} className="animate-glow" />
                    <circle cx={sx} cy={sy} r={3.5 / scale} fill="#ffffff" />
                    <text 
                      x={sx + 8/scale} 
                      y={sy - 8/scale} 
                      fill={ip.color} 
                      fontSize={11 / scale} 
                      fontWeight="bold"
                      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                    >
                      {ip.label}
                    </text>
                  </g>
                );
              })}
            </g>

          </g>
          
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Tooltip Overlay */}
        <AnimatePresence>
          {hoveredStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-4 left-4 bg-[#111827]/90 backdrop-blur-md border border-[#38BDF8]/30 p-3 rounded-lg shadow-xl pointer-events-none z-10"
            >
              <div className="text-xs text-muted mb-2 font-semibold border-b border-border/50 pb-1">
                Titik Iterasi #{hoveredStep.no}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
                <span className="text-muted">Param t:</span>
                <span className="text-primary text-right">{hoveredStep.paramValue.toFixed(4)}</span>
                <span className="text-muted">Koordinat x:</span>
                <span className="text-foreground text-right">{hoveredStep.xResult.toFixed(4)}</span>
                <span className="text-muted">Koordinat y:</span>
                <span className="text-foreground text-right">{hoveredStep.yResult.toFixed(4)}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="absolute bottom-6 right-6 text-[10px] text-muted flex items-center gap-1 bg-surface/80 px-2 py-1 rounded backdrop-blur border border-border">
        <Move className="w-3 h-3" /> Scroll to Zoom, Drag to Pan
      </div>
    </motion.div>
  );
}
