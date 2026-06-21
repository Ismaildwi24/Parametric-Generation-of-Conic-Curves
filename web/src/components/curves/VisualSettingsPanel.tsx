'use client';

import { Settings } from 'lucide-react';
import type { VisualizationOptions, CurveType } from '@/types/curves';

interface VisualSettingsPanelProps {
  options: VisualizationOptions;
  onChange: (key: keyof VisualizationOptions) => void;
  curveType: CurveType;
}

export default function VisualSettingsPanel({ options, onChange, curveType }: VisualSettingsPanelProps) {
  const toggleControls = [
    { key: 'showCurve', label: 'Smooth Curve', color: 'bg-primary' },
    { key: 'showSamplePoints', label: 'Sample Points', color: 'bg-white' },
    { key: 'showLabels', label: 'Grid Labels', color: 'bg-muted' },
    { key: 'showGrid', label: 'Grid Lines', color: 'bg-background/20 border border-border' },
    { key: 'showAxis', label: 'Axis Lines', color: 'bg-background/40 border border-border-strong' },
    { key: 'showCenter', label: 'Center Point (C)', color: 'bg-yellow-400', hidden: curveType === 'parabola' },
    { key: 'showVertex', label: 'Vertex (V)', color: 'bg-emerald-500' },
    { key: 'showFocus', label: 'Focus (F)', color: 'bg-emerald-500' },
    { key: 'showDirectrix', label: 'Directrix', color: 'bg-pink-500', hidden: curveType !== 'parabola' },
    { key: 'showAsymptotes', label: 'Asymptotes', color: 'bg-purple-500', hidden: curveType !== 'hyperbola' },
    { key: 'showAnimationPath', label: 'Active Point', color: 'bg-blue-500' },
  ];

  return (
    <div className="glass p-4 rounded-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Visual Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {toggleControls.filter(ctrl => !ctrl.hidden).map(ctrl => {
          const isActive = options[ctrl.key as keyof VisualizationOptions];
          return (
            <div 
              key={ctrl.key} 
              className="flex items-center justify-between cursor-pointer group p-2 hover:bg-background/50 rounded-lg transition-colors" 
              onClick={() => onChange(ctrl.key as keyof VisualizationOptions)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ctrl.color} shadow-sm opacity-80`} />
                <span className="text-sm text-foreground">{ctrl.label}</span>
              </div>
              <div className={`toggle-switch ${isActive ? 'active' : ''}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
