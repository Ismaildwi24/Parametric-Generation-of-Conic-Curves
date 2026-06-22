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
import { generateHyperbola } from '@/lib/curves';
import { useCurveAnimation } from '@/lib/useCurveAnimation';
import type { VisualizationOptions } from '@/types/curves';

export default function HiperbolaPage() {
  const [isGenerated, setIsGenerated] = useState(false);

  const [a, setA] = useState<number | ''>('');
  const [b, setB] = useState<number | ''>('');
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
    showAsymptotes: true,
    showAnimationPath: true,
  });

  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  const toggleOption = (key: keyof VisualizationOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    setIsGenerated(false);
    setA('');
    setB('');
    setCenterX('');
    setCenterY('');
    setDeltaThetaLow('');
    setDeltaThetaHigh('');
    setSelectedPointIndex(null);
  };

  const handleGenerate = () => {
    if (a === '' || b === '' || centerX === '' || centerY === '' || deltaThetaLow === '' || deltaThetaHigh === '') {
      alert('Semua parameter harus diisi.');
      return;
    }
    if (a <= 0 || b <= 0) {
      alert('Sumbu transversal dan konjugasi harus lebih besar dari 0.');
      return;
    }
    setIsGenerated(true);
    setSelectedPointIndex(null);
  };

  const { lowResData, highResData } = useMemo(() => {
    if (!isGenerated || a === '' || b === '' || centerX === '' || centerY === '' || deltaThetaLow === '' || deltaThetaHigh === '') {
      return { lowResData: null, highResData: null };
    }
    const params = { a, b, centerX, centerY, deltaLow: deltaThetaLow, deltaHigh: deltaThetaHigh };
    return { 
      lowResData: generateHyperbola(params, deltaThetaLow), 
      highResData: generateHyperbola(params, deltaThetaHigh), 
    };
  }, [isGenerated, a, b, centerX, centerY, deltaThetaLow, deltaThetaHigh]);

  const totalPoints = highResData ? highResData.steps.length : 0;
  const animation = useCurveAnimation({ totalPoints });

  const viewPadding = 5;
  const maxRange = isGenerated && a !== '' && b !== '' && centerX !== '' && centerY !== ''
    ? Math.max((a as number) * 2 + Math.abs(centerX as number), (b as number) * 2 + Math.abs(centerY as number)) + viewPadding
    : 10;
  const viewRange = { xMin: -maxRange, xMax: maxRange, yMin: -maxRange, yMax: maxRange };

  const currentStep = highResData && animation.drawnPointCount > 0 
    ? highResData.steps[Math.min(animation.drawnPointCount - 1, totalPoints - 1)] 
    : null;

  return (
    <CurvePageLayout
      title="Hiperbola"
      subtitle="Hyperbola — Kurva dengan dua cabang menggunakan fungsi trigonometri secan dan tangen."
      accentColor="#F472B6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 space-y-6">
          <ParameterCard title="Parameter Input" description="Atur parameter hiperbola.">
            <SliderControl label="Semi-transversal a" value={a} min={1} max={10} step={0.5} onChange={setA} />
            <SliderControl label="Semi-conjugate b" value={b} min={1} max={10} step={0.5} onChange={setB} />
            <SliderControl label="Center X (xc)" value={centerX} min={-5} max={5} step={0.5} onChange={setCenterX} />
            <SliderControl label="Center Y (yc)" value={centerY} min={-5} max={5} step={0.5} onChange={setCenterY} />
            <div className="h-px bg-border my-4" />
            <SliderControl label="Delta θ Besar (Res. Rendah)" value={deltaThetaLow} min={0.1} max={0.5} step={0.05} unit="rad" onChange={setDeltaThetaLow} />
            <SliderControl label="Delta θ Kecil (Res. Tinggi)" value={deltaThetaHigh} min={0.01} max={0.1} step={0.01} unit="rad" onChange={setDeltaThetaHigh} />
            
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
              curveType="hyperbola"
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

              <AnimationStatus currentStep={currentStep} currentIndex={animation.drawnPointCount} totalSteps={totalPoints} paramName="θ" />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="h-[500px]">
                  <ConicVisualization
                    points={highResData!.rightBranch}
                    secondaryPoints={highResData!.leftBranch}
                    steps={highResData!.steps}
                    drawnPointCount={animation.drawnPointCount}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#F472B6"
                    title="Visualisasi Interaktif (Res. Tinggi)"
                    options={options}
                    geometricInfo={highResData!.info}
                    curveType="hyperbola"
                  />
                </div>
                <div className="h-[500px]">
                  <ConicVisualization
                    points={lowResData!.rightBranch}
                    secondaryPoints={lowResData!.leftBranch}
                    steps={lowResData!.steps}
                    drawnPointCount={Math.max(1, Math.floor((animation.drawnPointCount / totalPoints) * lowResData!.steps.length))}
                    onPointClick={setSelectedPointIndex}
                    viewRange={viewRange}
                    curveColor="#F472B6"
                    title="Visualisasi Interaktif (Res. Rendah)"
                    options={options}
                    geometricInfo={lowResData!.info}
                    curveType="hyperbola"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isGenerated && highResData && lowResData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mt-6">
          <CurveSummaryCard
            curveType="Hiperbola"
            info={highResData.info}
            pointCount={totalPoints}
            resolution="High"
            eccentricity={Math.sqrt(Number(a)*Number(a) + Number(b)*Number(b)) / Number(a)}
          />

          <EndpointInfo firstStep={highResData.steps[0]} lastStep={highResData.steps[highResData.steps.length - 1]} paramName="θ" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CurveInfo info={highResData.info} pointCount={totalPoints} />
            <IterationPanel paramName="θ" paramRange="(-π/2, π/2) ∪ (π/2, 3π/2)" delta={deltaThetaHigh as number} totalIterations={totalPoints} values={highResData.steps.map(s => s.paramValue)} />
            <PointDetailPanel step={selectedPointIndex !== null ? highResData.steps[selectedPointIndex] : null} paramName="θ" />
          </div>

          <CalculationTable 
            paramName="θ" 
            highResSteps={highResData.steps} 
            lowResSteps={lowResData.steps} 
            deltaHigh={deltaThetaHigh as number}
            deltaLow={deltaThetaLow as number}
          />

          <ResolutionComparison 
            lowResPoints={lowResData.rightBranch} 
            lowResSecondary={lowResData.leftBranch}
            highResPoints={highResData.rightBranch} 
            highResSecondary={highResData.leftBranch}
            deltaLow={deltaThetaLow as number} 
            deltaHigh={deltaThetaHigh as number} 
            viewRange={viewRange} 
            curveColor="#F472B6" 
          />
          
          <ExportControls paramName="θ" steps={highResData.steps} curveName="Hiperbola" />

          <details className="group glass p-6 rounded-xl border border-border/50 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider flex items-center gap-3">
                <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-sm font-black">M</span>
                Teori Matematis & Analisis
              </h2>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <div className="mt-6 pt-6 border-t border-border/50 flex flex-col gap-6">
              <FormulaDisplay
                title="Persamaan Parametrik"
                formulas={[
                  { label: 'x(θ)', equation: `x = ${centerX} + ${a} · sec(θ)` },
                  { label: 'y(θ)', equation: `y = ${centerY} + ${b} · tan(θ)` },
                ]}
                parameterRange="θ ∈ (-π/2, π/2) ∪ (π/2, 3π/2)"
              />
              <EducationalVerification
                items={[
                  { label: 'Fokus dikalkulasi', isVerified: !!(highResData.info.foci && highResData.info.foci.length > 0) },
                  { label: 'Eksentrisitas dihitung', isVerified: true },
                  { label: 'Syarat e > 1 divalidasi', isVerified: true },
                  { label: 'Asimtot dikalkulasi', isVerified: !!(highResData.info.asymptoteLines && highResData.info.asymptoteLines.length > 0) }
                ]}
              />
              <TheoryExplanation curveType="hyperbola" />
              <MathematicalDerivation
                curveType="hyperbola"
                params={{ a, b, centerX, centerY }}
              />
            </div>
          </details>
        </motion.div>
      )}
    </CurvePageLayout>
  );
}
