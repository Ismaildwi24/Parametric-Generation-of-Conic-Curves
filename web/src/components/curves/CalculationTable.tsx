'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalculationStep } from '@/types/curves';

interface CalculationTableProps {
  paramName: string;
  highResSteps: CalculationStep[];
  lowResSteps: CalculationStep[];
  deltaHigh: number;
  deltaLow: number;
}

export default function CalculationTable({ paramName, highResSteps, lowResSteps, deltaHigh, deltaLow }: CalculationTableProps) {
  const [activeTab, setActiveTab] = useState<'high' | 'low'>('high');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const currentSteps = activeTab === 'high' ? highResSteps : lowResSteps;
  const currentDelta = activeTab === 'high' ? deltaHigh : deltaLow;

  const filteredSteps = currentSteps.filter(step => 
    step.no.toString().includes(searchTerm) ||
    step.paramValue.toString().includes(searchTerm) ||
    step.xResult.toString().includes(searchTerm) ||
    step.yResult.toString().includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredSteps.length / rowsPerPage);
  const paginatedSteps = filteredSteps.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const handleExportCSV = () => {
    const header = `No,${paramName},Rumus X,Hasil X,Rumus Y,Hasil Y\n`;
    const rows = currentSteps.map(s => 
      `${s.no},${s.paramValue},"${s.xFormula}",${s.xResult},"${s.yFormula}",${s.yResult}`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iterasi_kurva_${activeTab}_res.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl overflow-hidden flex flex-col border border-border"
    >
      <div className="bg-surface/50 border-b border-border">
        <div className="flex px-4 py-2 gap-4">
          <button 
            onClick={() => { setActiveTab('high'); setPage(0); }}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${activeTab === 'high' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted hover:text-foreground'}`}
          >
            High Resolution
          </button>
          <button 
            onClick={() => { setActiveTab('low'); setPage(0); }}
            className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors border-b-2 ${activeTab === 'low' ? 'border-red-400 text-red-400 bg-red-400/5' : 'border-transparent text-muted hover:text-foreground'}`}
          >
            Low Resolution
          </button>
        </div>
      </div>

      <div className="p-4 bg-background/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Nilai Δ{paramName}</span>
            <span className="font-mono font-bold text-foreground">{currentDelta}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Total Titik</span>
            <span className="font-mono font-bold text-foreground">{currentSteps.length}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Cari nilai..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full bg-background/50 border border-border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 text-foreground"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-background/80 text-muted sticky top-0 backdrop-blur-md">
            <tr>
              <th className="px-4 py-3 font-semibold w-12">No</th>
              <th className="px-4 py-3 font-semibold w-24">{paramName}</th>
              <th className="px-4 py-3 font-semibold min-w-[200px]">Rumus X</th>
              <th className="px-4 py-3 font-semibold w-28 text-primary">Hasil X</th>
              <th className="px-4 py-3 font-semibold min-w-[200px]">Rumus Y</th>
              <th className="px-4 py-3 font-semibold w-28 text-primary">Hasil Y</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedSteps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Tidak ada data yang sesuai pencarian
                </td>
              </tr>
            ) : (
              paginatedSteps.map((step) => (
                <tr key={step.no} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-muted">{step.no}</td>
                  <td className="px-4 py-3 font-mono text-foreground font-semibold">{step.paramValue.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{step.xFormula}</td>
                  <td className="px-4 py-3 font-mono text-primary font-medium">{step.xResult.toFixed(4)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{step.yFormula}</td>
                  <td className="px-4 py-3 font-mono text-primary font-medium">{step.yResult.toFixed(4)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 border-t border-border flex items-center justify-between bg-surface/50">
        <span className="text-xs text-muted">
          Menampilkan {filteredSteps.length > 0 ? page * rowsPerPage + 1 : 0} - {Math.min((page + 1) * rowsPerPage, filteredSteps.length)} dari {filteredSteps.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-50 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
