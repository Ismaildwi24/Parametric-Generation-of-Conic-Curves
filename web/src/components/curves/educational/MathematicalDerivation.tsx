import React from 'react';
import { Calculator } from 'lucide-react';

interface MathematicalDerivationProps {
  curveType: 'circle' | 'ellipse' | 'parabola' | 'hyperbola';
  params: Record<string, any>;
}

function formatVal(val: number): string {
  if (Math.abs(val) < 0.0001) return '0';
  return Number.isInteger(val) ? val.toString() : val.toFixed(2);
}

export default function MathematicalDerivation({ curveType, params }: MathematicalDerivationProps) {
  
  const renderCircle = () => {
    const { radius, centerX, centerY } = params;
    const r = Number(radius);
    const xc = Number(centerX);
    const yc = Number(centerY);
    
    return (
      <div className="space-y-6">
        <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
          <h4 className="font-semibold text-primary mb-2">Parameter Dasar</h4>
          <div className="font-mono text-sm space-y-1">
            <div>Center (xc, yc) = ({xc}, {yc})</div>
            <div>Radius (r) = {r}</div>
            <div>Diameter (d) = 2 × {r} = {2 * r}</div>
            <div>Keliling (K) = 2πr = {(2 * Math.PI * r).toFixed(2)}</div>
            <div>Luas (A) = πr² = {(Math.PI * r * r).toFixed(2)}</div>
          </div>
        </div>
        
        <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
          <h4 className="font-semibold text-primary mb-2">Persamaan Baku Lingkaran</h4>
          <div className="font-mono text-sm space-y-2">
            <div>(x - xc)² + (y - yc)² = r²</div>
            <div className="text-muted-foreground mt-2">Substitusi nilai:</div>
            <div className="bg-background/50 p-2 rounded">
              (x - {xc < 0 ? `(${xc})` : xc})² + (y - {yc < 0 ? `(${yc})` : yc})² = {r}²
            </div>
            <div className="font-bold text-foreground mt-1">
              (x {xc <= 0 ? '+' : '-'} {Math.abs(xc)})² + (y {yc <= 0 ? '+' : '-'} {Math.abs(yc)})² = {r*r}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEllipse = () => {
    const { a, b, centerX, centerY } = params;
    const aVal = Number(a);
    const bVal = Number(b);
    const xc = Number(centerX);
    const yc = Number(centerY);
    
    const isHorizontal = aVal >= bVal;
    const major = isHorizontal ? aVal : bVal;
    const minor = isHorizontal ? bVal : aVal;
    
    const c2 = major * major - minor * minor;
    const c = Math.sqrt(Math.max(0, c2));
    const e = c / major;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Jarak Fokus (c)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">c = √(a² - b²)</div>
              <div>c = √({major}² - {minor}²)</div>
              <div>c = √({major*major} - {minor*minor})</div>
              <div>c = √{formatVal(c2)}</div>
              <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">c = {formatVal(c)}</div>
            </div>
          </div>
          
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Eksentrisitas (e)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">e = c / {isHorizontal ? 'a' : 'b'}</div>
              <div>e = {formatVal(c)} / {formatVal(major)}</div>
              <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">e = {formatVal(e)}</div>
            </div>
          </div>
        </div>

        <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
          <h4 className="font-semibold text-primary mb-2">Koordinat Fokus (F)</h4>
          <div className="font-mono text-sm space-y-2">
            <div className="text-muted-foreground">
              {isHorizontal ? 'F1 = (xc - c, yc)' : 'F1 = (xc, yc - c)'}
            </div>
            <div>
              {isHorizontal ? `F1 = (${xc} - ${formatVal(c)}, ${yc})` : `F1 = (${xc}, ${yc} - ${formatVal(c)})`}
            </div>
            <div className="font-bold">
              {isHorizontal ? `F1 = (${formatVal(xc - c)}, ${yc})` : `F1 = (${xc}, ${formatVal(yc - c)})`}
            </div>
            
            <div className="text-muted-foreground mt-4">
              {isHorizontal ? 'F2 = (xc + c, yc)' : 'F2 = (xc, yc + c)'}
            </div>
            <div>
              {isHorizontal ? `F2 = (${xc} + ${formatVal(c)}, ${yc})` : `F2 = (${xc}, ${yc} + ${formatVal(c)})`}
            </div>
            <div className="font-bold">
              {isHorizontal ? `F2 = (${formatVal(xc + c)}, ${yc})` : `F2 = (${xc}, ${formatVal(yc + c)})`}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHyperbola = () => {
    const { a, b, centerX, centerY } = params;
    const aVal = Number(a);
    const bVal = Number(b);
    const xc = Number(centerX);
    const yc = Number(centerY);
    
    const c2 = aVal * aVal + bVal * bVal;
    const c = Math.sqrt(c2);
    const e = c / aVal;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Jarak Fokus (c)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">c = √(a² + b²)</div>
              <div>c = √({aVal}² + {bVal}²)</div>
              <div>c = √({aVal*aVal} + {bVal*bVal})</div>
              <div>c = √{formatVal(c2)}</div>
              <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">c = {formatVal(c)}</div>
            </div>
          </div>
          
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Eksentrisitas (e)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">e = c / a</div>
              <div>e = {formatVal(c)} / {formatVal(aVal)}</div>
              <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">e = {formatVal(e)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Koordinat Fokus (F)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">F1,2 = (xc ± c, yc)</div>
              <div>F1 = ({xc} - {formatVal(c)}, {yc})</div>
              <div className="font-bold">F1 = ({formatVal(xc - c)}, {yc})</div>
              <div className="mt-2">F2 = ({xc} + {formatVal(c)}, {yc})</div>
              <div className="font-bold">F2 = ({formatVal(xc + c)}, {yc})</div>
            </div>
          </div>

          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Persamaan Asimtot</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">y - yc = ±(b/a)(x - xc)</div>
              <div>y - {yc} = ±({bVal}/{aVal})(x - {xc})</div>
              <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">
                y - {yc} = ±{formatVal(bVal/aVal)}(x - {xc})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderParabola = () => {
    const { a, vertexX, vertexY } = params;
    const aVal = Number(a);
    const xp = Number(vertexX);
    const yp = Number(vertexY);
    
    // a = 1 / (4p) => p = 1 / (4a)
    const p = 1 / (4 * aVal);

    return (
      <div className="space-y-6">
        <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
          <h4 className="font-semibold text-primary mb-2">Jarak Fokal (p)</h4>
          <div className="font-mono text-sm space-y-2">
            <div className="text-muted-foreground">Persamaan: y = a(x - xp)² + yp</div>
            <div className="text-muted-foreground">Kaitan a dan p: a = 1 / (4p)  ⇒  p = 1 / (4a)</div>
            <div>p = 1 / (4 × {aVal})</div>
            <div>p = 1 / {formatVal(4 * aVal)}</div>
            <div className="text-emerald-400 font-bold bg-background/50 p-2 rounded mt-2">p = {formatVal(p)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Fokus (F)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">F = (xp, yp + p)</div>
              <div>F = ({xp}, {yp} + {formatVal(p)})</div>
              <div className="font-bold text-foreground mt-2">
                F = ({xp}, {formatVal(yp + p)})
              </div>
            </div>
          </div>

          <div className="bg-surface/30 p-4 rounded-lg border border-border/50">
            <h4 className="font-semibold text-primary mb-2">Garis Direktris (y)</h4>
            <div className="font-mono text-sm space-y-2">
              <div className="text-muted-foreground">y = yp - p</div>
              <div>y = {yp} - {formatVal(p)}</div>
              <div className="font-bold text-foreground mt-2">
                y = {formatVal(yp - p)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="glass p-6 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.05)]">
      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
        <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
          <Calculator className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Kalkulasi Elemen Geometri</h3>
      </div>
      
      {curveType === 'circle' && renderCircle()}
      {curveType === 'ellipse' && renderEllipse()}
      {curveType === 'hyperbola' && renderHyperbola()}
      {curveType === 'parabola' && renderParabola()}
    </div>
  );
}
