'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

interface AutomaticAnalysisProps {
  lowResCount: number;
  highResCount: number;
  curveType: string;
}

export default function AutomaticAnalysis({ lowResCount, highResCount, curveType }: AutomaticAnalysisProps) {
  const ratio = lowResCount > 0 ? (highResCount / lowResCount).toFixed(1) : '0';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/20 rounded-full text-primary shrink-0">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-2">
            Analisis Hasil Otomatis
          </h3>
          <div className="text-sm text-muted space-y-2 leading-relaxed">
            <p>
              Pada pembentukan {curveType}, penggunaan parameter <strong>Delta kecil</strong> menghasilkan 
              {' '}<strong className="text-foreground">{highResCount} titik</strong>, yang membuat kurva terlihat lebih halus dan mendekati bentuk kontinu aslinya. Namun, hal ini membutuhkan proses iterasi (komputasi) yang lebih besar.
            </p>
            <p>
              Sebaliknya, penggunaan <strong>Delta besar</strong> hanya menghasilkan 
              {' '}<strong className="text-foreground">{lowResCount} titik</strong>. Proses rendering terjadi jauh lebih cepat, tetapi bentuk visual kurva menjadi kurang halus dan batas poligon (garis lurus antar titik) menjadi terlihat jelas.
            </p>
            <p className="text-primary font-medium mt-2">
              Kesimpulan: Delta kecil menaikkan beban komputasi sebesar {ratio} kali lipat, namun meningkatkan kualitas visual secara drastis. Pemilihan delta yang tepat bergantung pada keseimbangan antara performa (FPS) dan estetika (smoothness) pada aplikasi grafika komputer.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
