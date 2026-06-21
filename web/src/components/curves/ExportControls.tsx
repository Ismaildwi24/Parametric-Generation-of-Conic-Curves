'use client';

import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, FileCode } from 'lucide-react';
import type { CalculationStep } from '@/types/curves';

interface ExportControlsProps {
  paramName: string;
  steps: CalculationStep[];
  curveName: string;
}

export default function ExportControls({ paramName, steps, curveName }: ExportControlsProps) {
  
  const handleExportCSV = () => {
    const header = `No,${paramName},Rumus X,Hasil X,Rumus Y,Hasil Y\n`;
    const rows = steps.map(s => 
      `${s.no},${s.paramValue},"${s.xFormula}",${s.xResult},"${s.yFormula}",${s.yResult}`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${curveName}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportSVG = () => {
    const svgs = document.querySelectorAll('svg');
    if (svgs.length > 0) {
      const svgData = new XMLSerializer().serializeToString(svgs[0]);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${curveName}_plot.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert("No SVG found to export.");
    }
  };

  const handleExportPNG = () => {
    const svgs = document.querySelectorAll('svg');
    if (svgs.length > 0) {
      const svg = svgs[0];
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = function() {
        canvas.width = svg.clientWidth || 500;
        canvas.height = svg.clientHeight || 500;
        if(ctx) {
          ctx.fillStyle = "#0B1020"; // background
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const a = document.createElement('a');
          a.download = `${curveName}_plot.png`;
          a.href = pngFile;
          a.click();
        }
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } else {
      alert("No SVG found to export.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-1">
            Export Data & Visualisasi
          </h3>
          <p className="text-xs text-muted">
            Unduh hasil perhitungan dan grafik untuk keperluan laporan akademik.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportPNG}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-primary/50 text-foreground transition-all text-sm font-medium"
          >
            <ImageIcon className="w-4 h-4 text-primary" />
            Export PNG
          </button>
          <button
            onClick={handleExportSVG}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-primary/50 text-foreground transition-all text-sm font-medium"
          >
            <FileCode className="w-4 h-4 text-primary" />
            Export SVG
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </motion.div>
  );
}
