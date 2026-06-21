'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';

interface TheoryExplanationProps {
  curveType: 'circle' | 'ellipse' | 'parabola' | 'hyperbola';
}

export default function TheoryExplanation({ curveType }: TheoryExplanationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderContent = () => {
    switch (curveType) {
      case 'circle':
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Lingkaran (Circle)</strong> adalah himpunan semua titik pada bidang datar yang memiliki jarak yang sama (jari-jari) dari suatu titik tetap (pusat).</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Titik Pusat (Center):</strong> Titik acuan utama lingkaran, direpresentasikan dengan <code className="text-primary">(xc, yc)</code>.</li>
              <li><strong>Jari-jari (Radius):</strong> Jarak konstan dari pusat ke semua titik pada kurva. Dinotasikan dengan <code className="text-primary">r</code>.</li>
              <li><strong>Persamaan:</strong> Pada generasi parametrik, koordinat setiap titik didapat dengan proyeksi fungsi sinus dan kosinus pada sumbu kartesius.</li>
            </ul>
          </div>
        );
      case 'ellipse':
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Elips</strong> adalah kurva tertutup yang merupakan kedudukan titik-titik yang jumlah jaraknya terhadap dua titik tertentu (Fokus) selalu konstan.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Fokus (Focus):</strong> Dua titik referensi internal. Semakin jauh jarak kedua fokus, kurva elips akan semakin lonjong.</li>
              <li><strong>Sumbu Mayor & Minor:</strong> Sumbu mayor (<code className="text-primary">a</code>) adalah diameter terpanjang, dan sumbu minor (<code className="text-primary">b</code>) adalah diameter terpendek.</li>
              <li><strong>Eksentrisitas (e):</strong> Mengukur &quot;kelonjongan&quot; elips. Untuk elips, nilainya berada antara 0 dan 1 (<code className="text-primary">0 {'<'} e {'<'} 1</code>).</li>
            </ul>
          </div>
        );
      case 'parabola':
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Parabola</strong> adalah kedudukan titik-titik yang memiliki jarak yang sama terhadap suatu titik tertentu (Fokus) dan suatu garis lurus tertentu (Direktris).</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Vertex (Puncak):</strong> Titik balik kurva, tempat parabola memotong sumbu simetrinya.</li>
              <li><strong>Fokus (Focus):</strong> Titik acuan internal kurva.</li>
              <li><strong>Direktris (Directrix):</strong> Garis acuan eksternal. Jarak dari titik mana pun di parabola ke Fokus akan sama dengan jarak titik tersebut tegak lurus ke Direktris.</li>
              <li><strong>Jarak Fokal (p):</strong> Jarak terpendek dari Vertex ke Fokus, yang juga sama dengan jarak dari Vertex ke Direktris.</li>
            </ul>
          </div>
        );
      case 'hyperbola':
        return (
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Hiperbola</strong> adalah kurva dengan dua cabang yang merupakan kedudukan titik-titik yang selisih jaraknya terhadap dua titik tertentu (Fokus) selalu konstan.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Fokus (Focus):</strong> Dua titik eksternal kurva yang mendefinisikan bentuk cabang hiperbola.</li>
              <li><strong>Vertex (Puncak):</strong> Titik terdekat di antara dua cabang hiperbola.</li>
              <li><strong>Asimtot (Asymptotes):</strong> Garis maya yang didekati oleh cabang hiperbola hingga ke tak terhingga, namun tidak pernah bersentuhan.</li>
              <li><strong>Eksentrisitas (e):</strong> Untuk hiperbola, nilai eksentrisitas selalu lebih besar dari 1 (<code className="text-primary">e {'>'} 1</code>).</li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className="glass rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.05)] overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 bg-surface/50 hover:bg-surface transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-bold text-foreground">TAMPILKAN TEORI MATEMATIS</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-border/50 bg-background/30">
              {renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
