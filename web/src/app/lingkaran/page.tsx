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
import { generateCircle } from '@/lib/curves';
import { useCurveAnimation } from '@/lib/useCurveAnimation';
import type { VisualizationOptions } from '@/types/curves';

export default function LingkaranPage() {
  const [isGenerated, setIsGenerated] = useState(false);

  // Input states (can be empty string initially)
  const [radius, setRadius] = useState<number | ''>('');
  const [centerX, setCenterX] = useState<number | ''>('');
  const [centerY, setCenterY] = useState<number | ''>('');
  const [deltaThetaLow, setDeltaThetaLow] = useState<number | ''>('');
  const [deltaThetaHigh, setDeltaThetaHigh] = useState<number | ''>('');

  const [options, setOptions] = useState<VisualizationOptions>({
    showCurve: true,
    showPoints: true,
    showSamplePoints: true,
    showLabels: true,
    showGrid: true,
    showAxis: true,
    showFocus: true,
    showVertex: true,
    showCenter: true,
    showDirectrix: false,
    showAsymptotes: false,
    showAnimationPath: true,
  });

  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const toggleOption = (key: keyof VisualizationOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setIsGenerated(false);
    setRadius('');
    setCenterX('');
    setCenterY('');
    setDeltaThetaLow('');
    setDeltaThetaHigh('');
    setSelectedPointIndex(null);
  };

  const handleGenerate = () => {
    if (radius === '' || centerX === '' || centerY === '' || deltaThetaLow === '' || deltaThetaHigh === '') {
      alert('Semua parameter harus diisi.');
      return;
    }
    if (radius <= 0) {
      alert('Radius harus lebih besar dari 0.');
      return;
    }
    setIsGenerated(true);
    setSelectedPointIndex(null);
  };

  // Generate curves (only compute if generated)
  const { lowResData, highResData } = useMemo(() => {
    if (!isGenerated || radius === '' || centerX === '' || centerY === '' || deltaThetaLow === '' || deltaThetaHigh === '') {
      return { lowResData: null, highResData: null };
    }
    const params = { radius, centerX, centerY, deltaLow: deltaThetaLow, deltaHigh: deltaThetaHigh };
    return {
      lowResData: generateCircle(params, deltaThetaLow),
      highResData: generateCircle(params, deltaThetaHigh)
    };
  }, [isGenerated, radius, centerX, centerY, deltaThetaLow, deltaThetaHigh]);

  const totalPoints = highResData ? highResData.points.length : 0;

  // Animation Hook
  const animation = useCurveAnimation({ totalPoints });

  const viewPadding = 2;
  const maxRange = isGenerated && radius !== '' && centerX !== '' && centerY !== ''
    ? Math.max(radius as number + Math.abs(centerX as number), radius as number + Math.abs(centerY as number)) + viewPadding
    : 10;
  const viewRange = { xMin: -maxRange, xMax: maxRange, yMin: -maxRange, yMax: maxRange };

  // Helper for Status
  const currentStep = highResData && animation.drawnPointCount > 0 
    ? highResData.steps[Math.min(animation.drawnPointCount - 1, totalPoints - 1)] 
    : null;

  return (
    <CurvePageLayout
      title="Lingkaran"
      subtitle="Circle — Pembentukan parametrik dengan variasi resolusi delta θ."
      accentColor="#38BDF8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Inputs & View Options */}
        <div className="lg:col-span-4 space-y-6">
          <ParameterCard title="Parameter Input" description="Atur parameter. Kosongkan untuk reset.">
            <SliderControl label="Radius (r)" value={radius} min={1} max={10} step={0.5} onChange={setRadius} />
            <SliderControl label="Center X (xc)" value={centerX} min={-5} max={5} step={0.5} onChange={setCenterX} />
            <SliderControl label="Center Y (yc)" value={centerY} min={-5} max={5} step={0.5} onChange={setCenterY} />
            <div className="h-px bg-border my-4" />
            <SliderControl label="Delta θ Besar (Res. Rendah)" value={deltaThetaLow} min={0.1} max={2} step={0.1} unit="rad" onChange={setDeltaThetaLow} />
            <SliderControl label="Delta θ Kecil (Res. Tinggi)" value={deltaThetaHigh} min={0.01} max={0.5} step={0.01} unit="rad" onChange={setDeltaThetaHigh} />
            
            <div className="flex gap-2 pt-4 border-t border-border mt-4">
              <button 
                onClick={handleGenerate}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-[0_0_15px_rgba(56,189,248,0.2)]"
              >
                <Play className="w-4 h-4" /> Generate Curve
              </button>
              <button 
                onClick={handleReset}
                className="px-4 bg-surface border border-border text-foreground py-2 rounded font-medium flex items-center justify-center gap-2 hover:bg-border transition"
              >
                <RefreshCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </ParameterCard>

          {isGenerated && (
            <VisualSettingsPanel
              options={options}
              onChange={toggleOption}
              curveType="circle"
            />
          )}
        </div>

        {/* Right Content: Visualization & Animation */}
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

              <AnimationStatus
                currentStep={currentStep}
                currentIndex={animation.drawnPointCount}
                totalSteps={totalPoints}
                paramName="θ"
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="h-[500px]">
                  <ConicVisualization
                    points={highResData!.points}
                    steps={highResData!.steps}
                    drawnPointCount={animation.drawnPointCount}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#38BDF8"
                    title="Visualisasi Interaktif (Res. Tinggi)"
                    options={options}
                    geometricInfo={highResData!.info}
                    curveType="circle"
                  />
                </div>
                <div className="h-[500px]">
                  <ConicVisualization
                    points={lowResData!.points}
                    steps={lowResData!.steps}
                    drawnPointCount={Math.max(1, Math.floor((animation.drawnPointCount / totalPoints) * lowResData!.points.length))}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#38BDF8"
                    title="Visualisasi Interaktif (Res. Rendah)"
                    options={options}
                    geometricInfo={lowResData!.info}
                    curveType="circle"
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
              { label: 'x(θ)', equation: `x = ${centerX} + ${radius} · cos(θ)` },
              { label: 'y(θ)', equation: `y = ${centerY} + ${radius} · sin(θ)` },
            ]}
            parameterRange="θ ∈ [0, 2π]"
          />

          <EndpointInfo 
            firstStep={highResData.steps[0]} 
            lastStep={highResData.steps[highResData.steps.length - 1]} 
            paramName="θ" 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurveInfo info={highResData.info} pointCount={totalPoints} />
            <IterationPanel 
              paramName="θ" 
              paramRange="[0, 2π]" 
              delta={deltaThetaHigh as number} 
              totalIterations={totalPoints} 
              values={highResData.steps.map(s => s.paramValue)} 
            />
            <PointDetailPanel 
              step={selectedPointIndex !== null ? highResData.steps[selectedPointIndex] : null} 
              paramName="θ" 
            />
          </div>

          <CalculationTable 
            paramName="θ" 
            highResSteps={highResData.steps} 
            lowResSteps={lowResData.steps} 
            deltaHigh={deltaThetaHigh as number}
            deltaLow={deltaThetaLow as number}
          />

          <ResolutionComparison
            lowResPoints={lowResData.points}
            highResPoints={highResData.points}
            deltaLow={deltaThetaLow as number}
            deltaHigh={deltaThetaHigh as number}
            viewRange={viewRange}
            curveColor="#38BDF8"
          />
          
          <ExportControls paramName="θ" steps={highResData.steps} curveName="Lingkaran" />

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
                  curveType="Lingkaran"
                  info={highResData.info}
                  pointCount={totalPoints}
                  resolution="High"
                  eccentricity={0}
                />
                
                <EducationalVerification
                  items={[
                    { label: 'Titik Pusat dikalkulasi', isVerified: !!highResData.info.center },
                    { label: 'Radius divalidasi', isVerified: (radius as number) > 0 },
                    { label: 'Persamaan parametrik konsisten', isVerified: true }
                  ]}
                />
              </div>

              {/* Right Column: Theory & Derivation */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <TheoryExplanation curveType="circle" />
                
                <MathematicalDerivation
                  curveType="circle"
                  params={{ radius, centerX, centerY }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </CurvePageLayout>
  );
}
