import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface VerificationItem {
  label: string;
  isVerified: boolean;
}

interface EducationalVerificationProps {
  items: VerificationItem[];
}

export default function EducationalVerification({ items }: EducationalVerificationProps) {
  return (
    <div className="glass p-6 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden h-full">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Verifikasi Matematis</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-surface/40 p-3 rounded-lg border border-border/30">
            {item.isVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${item.isVerified ? 'text-foreground' : 'text-muted-foreground'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
