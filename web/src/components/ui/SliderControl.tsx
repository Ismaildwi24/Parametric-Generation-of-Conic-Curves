'use client';

import type { SliderControlProps } from '@/types/curves';

export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  unit = '',
}: SliderControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-muted">{label}</label>
        <div className="flex items-center gap-2">
          <input 
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              if (e.target.value === '') {
                onChange('');
              } else {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onChange(val);
              }
            }}
            placeholder="-"
            className="w-20 bg-background/50 border border-border rounded px-2 py-1 text-sm font-mono font-semibold text-primary focus:outline-none focus:border-primary/50 text-right placeholder:text-muted/30"
          />
          {unit && <span className="text-sm text-muted">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value === '' ? min : value}
        disabled={value === ''}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted/60">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
