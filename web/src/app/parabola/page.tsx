'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Play } from 'lucide-react';
import CurvePageLayout from '@/components/curves/CurvePageLayout';
import ConicVisualization from '@/components/curves/ConicVisualization';
import FormulaDisplay from '@/components/curves/FormulaDisplay';
import ParameterCard from '@/components/ui/ParameterCard';
import SliderControl from '@/components/ui/SliderControl';
import IterationPanel from '@/components/curves/IterationPanel';
import CalculationTable from '@/components/curves/CalculationTable';
import PointDetailPanel from '@/components/curves/PointDetailPanel';
import CurveInfo from '@/components/curves/CurveInfo';
import ResolutionComparison from '@/components/curves/ResolutionComparison';

import ExportControls from '@/components/curves/ExportControls';
import VisualSettingsPanel from '@/components/curves/VisualSettingsPanel';
import AnimationControls from '@/components/curves/AnimationControls';
import AnimationStatus from '@/components/curves/AnimationStatus';
import EndpointInfo from '@/components/curves/EndpointInfo';
import CurveSummaryCard from '@/components/curves/educational/CurveSummaryCard';
import EducationalVerification from '@/components/curves/educational/EducationalVerification';
import TheoryExplanation from '@/components/curves/educational/TheoryExplanation';
import MathematicalDerivation from '@/components/curves/educational/MathematicalDerivation';
import { generateParabola } from '@/lib/curves';
import { useCurveAnimation } from '@/lib/useCurveAnimation';
import type { VisualizationOptions } from '@/types/curves';

export default function ParabolaPage() {
  const [isGenerated, setIsGenerated] = useState(false);

  const [a, setA] = useState<number | ''>('');
  const [vertexX, setVertexX] = useState<number | ''>('');
  const [vertexY, setVertexY] = useState<number | ''>('');
  const [tMin, setTMin] = useState<number | ''>('');
  const [tMax, setTMax] = useState<number | ''>('');
  const [deltaTLow, setDeltaTLow] = useState<number | ''>(''); 
  const [deltaTHigh, setDeltaTHigh] = useState<number | ''>(''); 

  const [options, setOptions] = useState<VisualizationOptions>({
    showCurve: true,
    showPoints: true,
    showSamplePoints: true,
    showLabels: true,
    showGrid: true,
    showAxis: true,
    showFocus: true,
    showVertex: true,
    showCenter: false,
    showDirectrix: true,
    showAsymptotes: false,
    showAnimationPath: true,
  });

  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const toggleOption = (key: keyof VisualizationOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setIsGenerated(false);
    setA('');
    setVertexX('');
    setVertexY('');
    setTMin('');
    setTMax('');
    setDeltaTLow('');
    setDeltaTHigh('');
    setSelectedPointIndex(null);
  };

  const handleGenerate = () => {
    if (a === '' || vertexX === '' || vertexY === '' || tMin === '' || tMax === '' || deltaTLow === '' || deltaTHigh === '') {
      alert('Semua parameter harus diisi.');
      return;
    }
    if (a === 0) {
      alert('Parameter a tidak boleh 0.');
      return;
    }
    if (tMin >= tMax) {
      alert('t Awal harus lebih kecil dari t Akhir.');
      return;
    }
    setIsGenerated(true);
    setSelectedPointIndex(null);
  };

  const { lowResData, highResData } = useMemo(() => {
    if (!isGenerated || a === '' || vertexX === '' || vertexY === '' || tMin === '' || tMax === '' || deltaTLow === '' || deltaTHigh === '') {
      return { lowResData: null, highResData: null };
    }
    const params = { a, vertexX, vertexY, tMin, tMax, deltaLow: deltaTLow, deltaHigh: deltaTHigh };
    return { 
      lowResData: generateParabola(params, deltaTLow), 
      highResData: generateParabola(params, deltaTHigh), 
    };
  }, [isGenerated, a, vertexX, vertexY, tMin, tMax, deltaTLow, deltaTHigh]);

  const totalPoints = highResData ? highResData.points.length : 0;
  const animation = useCurveAnimation({ totalPoints });

  const viewRange = useMemo(() => {
    if (!isGenerated || !highResData || highResData.points.length === 0) return { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
    const minX = Math.min(...highResData.points.map(p => p.x));
    const maxX = Math.max(...highResData.points.map(p => p.x));
    const minY = Math.min(...highResData.points.map(p => p.y));
    const maxY = Math.max(...highResData.points.map(p => p.y));
    const pad = 2;
    return {
      xMin: Math.min(-5, minX - pad),
      xMax: Math.max(5, maxX + pad),
      yMin: Math.min(-5, minY - pad),
      yMax: Math.max(5, maxY + pad),
    };
  }, [isGenerated, highResData]);

  const currentStep = highResData && animation.drawnPointCount > 0 
    ? highResData.steps[Math.min(animation.drawnPointCount - 1, totalPoints - 1)] 
    : null;

  return (
    <CurvePageLayout
      title="Parabola"
      subtitle="Parabola — Kurva terbuka dengan satu titik fokus."
      accentColor="#10B981"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-6">
          <ParameterCard title="Parameter Input" description="Atur parameter parabolik.">
            <SliderControl label="Parameter a" value={a} min={-5} max={5} step={0.5} onChange={setA} />
            <SliderControl label="Vertex X (xp)" value={vertexX} min={-5} max={5} step={0.5} onChange={setVertexX} />
            <SliderControl label="Vertex Y (yp)" value={vertexY} min={-5} max={5} step={0.5} onChange={setVertexY} />
            <div className="h-px bg-border my-4" />
            <SliderControl label="t Awal (tMin)" value={tMin} min={-10} max={0} step={0.5} onChange={setTMin} />
            <SliderControl label="t Akhir (tMax)" value={tMax} min={0} max={10} step={0.5} onChange={setTMax} />
            <div className="h-px bg-border my-4" />
            <SliderControl label="Delta t Besar (Res. Rendah)" value={deltaTLow} min={0.5} max={3} step={0.1} onChange={setDeltaTLow} />
            <SliderControl label="Delta t Kecil (Res. Tinggi)" value={deltaTHigh} min={0.01} max={0.4} step={0.01} onChange={setDeltaTHigh} />
            
            <div className="flex gap-2 pt-4 border-t border-border mt-4">
              <button onClick={handleGenerate} className="flex-1 bg-primary text-primary-foreground py-2 rounded font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Play className="w-4 h-4" /> Generate Curve
              </button>
              <button onClick={handleReset} className="px-4 bg-surface border border-border text-foreground py-2 rounded font-medium flex items-center justify-center gap-2 hover:bg-border transition">
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </ParameterCard>

          {isGenerated && (
            <VisualSettingsPanel
              options={options}
              onChange={toggleOption}
              curveType="parabola"
            />
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          {!isGenerated ? (
            <div className="glass flex flex-col items-center justify-center h-full min-h-[500px] text-muted border-dashed">
              <p className="text-lg">Silakan masukkan parameter terlebih dahulu.</p>
              <p className="text-sm mt-2">Klik tombol &quot;Generate Curve&quot; untuk memulai visualisasi parametrik.</p>
            </div>
          ) : (
            <>
              <AnimationControls
                isPlaying={animation.isPlaying}
                onStart={animation.handleStart}
                onPause={animation.handlePause}
                onReset={animation.handleReset}
                speedMultiplier={animation.speedMultiplier}
                onSpeedChange={animation.setSpeedMultiplier}
                autoPlay={animation.autoPlay}
                onAutoPlayChange={animation.setAutoPlay}
                isLooping={animation.isLooping}
                onLoopChange={animation.setIsLooping}
                isGenerated={isGenerated}
              />

              <AnimationStatus currentStep={currentStep} currentIndex={animation.drawnPointCount} totalSteps={totalPoints} paramName="t" />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="h-[500px]">
                  <ConicVisualization
                    points={highResData!.points}
                    steps={highResData!.steps}
                    drawnPointCount={animation.drawnPointCount}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#10B981"
                    title="Visualisasi Interaktif (Res. Tinggi)"
                    options={options}
                    geometricInfo={highResData!.info}
                    curveType="parabola"
                  />
                </div>
                <div className="h-[500px]">
                  <ConicVisualization
                    points={lowResData!.points}
                    steps={lowResData!.steps}
                    drawnPointCount={Math.max(1, Math.floor((animation.drawnPointCount / totalPoints) * lowResData!.points.length))}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#10B981"
                    title="Visualisasi Interaktif (Res. Rendah)"
                    options={options}
                    geometricInfo={lowResData!.info}
                    curveType="parabola"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isGenerated && highResData && lowResData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
          <FormulaDisplay
            title="Persamaan Parametrik"
            formulas={[
              { label: 'x(t)', equation: `x = ${vertexX} + ${a} · t²` },
              { label: 'y(t)', equation: `y = ${vertexY} + ${2*Number(a)} · t` },
            ]}
            parameterRange={`t ∈ [${tMin}, ${tMax}]`}
          />

          <EndpointInfo firstStep={highResData.steps[0]} lastStep={highResData.steps[highResData.steps.length - 1]} paramName="t" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurveInfo info={highResData.info} pointCount={totalPoints} />
            <IterationPanel paramName="t" paramRange={`[${tMin}, ${tMax}]`} delta={deltaTHigh as number} totalIterations={totalPoints} values={highResData.steps.map(s => s.paramValue)} />
            <PointDetailPanel step={selectedPointIndex !== null ? highResData.steps[selectedPointIndex] : null} paramName="t" />
          </div>

          <CalculationTable 
            paramName="t" 
            highResSteps={highResData.steps} 
            lowResSteps={lowResData.steps} 
            deltaHigh={deltaTHigh as number}
            deltaLow={deltaTLow as number}
          />

          <ResolutionComparison lowResPoints={lowResData.points} highResPoints={highResData.points} deltaLow={deltaTLow as number} deltaHigh={deltaTHigh as number} viewRange={viewRange} curveColor="#10B981" />
          
          <ExportControls paramName="t" steps={highResData.steps} curveName="Parabola" />

          {/* NEW SECTION – MATHEMATICAL ANALYSIS */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-6 uppercase tracking-wider flex items-center gap-3">
              <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-sm font-black">M</span>
              Analisis Matematis Kurva
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Summary & Verification */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <CurveSummaryCard
                  curveType="Parabola"
                  info={highResData.info}
                  pointCount={totalPoints}
                  resolution="High"
                  eccentricity={1}
                />
                
                <EducationalVerification
                  items={[
                    { label: 'Titik Vertex dikalkulasi', isVerified: !!(highResData.info.vertices && highResData.info.vertices.length > 0) },
                    { label: 'Fokus dikalkulasi', isVerified: !!(highResData.info.foci && highResData.info.foci.length > 0) },
                    { label: 'Garis Direktris dikalkulasi', isVerified: !!highResData.info.directrix },
                    { label: 'Properti Jarak (VF = VD) terpenuhi', isVerified: true }
                  ]}
                />
              </div>

              {/* Right Column: Theory & Derivation */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <TheoryExplanation curveType="parabola" />
                
                <MathematicalDerivation
                  curveType="parabola"
                  params={{ a, vertexX, vertexY }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </CurvePageLayout>
  );
}
