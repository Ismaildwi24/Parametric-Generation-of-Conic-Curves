import { Diamond } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="mt-auto py-8 text-center"
      style={{ borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Diamond className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold gradient-text">
              ConicCurves Explorer
            </span>
          </div>
          <p className="text-xs text-muted max-w-md">
            Parametric Generation of Conic Curves — Computer Graphics 2025
          </p>
          <a
            href="https://github.com/Ismaildwi24/Parametric-Generation-of-Conic-Curves"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-primary transition-colors duration-200"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
}
