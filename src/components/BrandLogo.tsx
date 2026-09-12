import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'badge-only';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  variant = 'dark',
  className = '',
}) => {
  const sizeClasses = {
    sm: { icon: 'w-9 h-9', title: 'text-sm', subtitle: 'text-[10px]' },
    md: { icon: 'w-12 h-12', title: 'text-base sm:text-lg', subtitle: 'text-[11px]' },
    lg: { icon: 'w-16 h-16', title: 'text-xl sm:text-2xl', subtitle: 'text-xs' },
    xl: { icon: 'w-24 h-24', title: 'text-2xl sm:text-3xl', subtitle: 'text-sm' },
  };

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Official C&F Crest Icon Badge */}
      <div
        className={`${sizeClasses[size].icon} relative shrink-0 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/25 flex items-center justify-center`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle golden radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25),transparent_70%)]" />
          
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1 relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Outer Hexagonal Crest Border */}
            <polygon
              points="50,6 88,27 88,73 50,94 12,73 12,27"
              stroke="url(#goldGrad)"
              strokeWidth="2.5"
              fill="url(#shieldGrad)"
              strokeLinejoin="round"
            />

            {/* Inner Maritime Anchor & Wings Motif */}
            {/* Air Cargo Wings */}
            <path
              d="M22 42 C 34 32, 44 38, 50 48 C 56 38, 66 32, 78 42 C 68 47, 58 46, 50 54 C 42 46, 32 47, 22 42 Z"
              fill="url(#goldGrad)"
              opacity="0.85"
            />

            {/* Customs Scales / Maritime Anchor */}
            <circle cx="50" cy="30" r="4.5" stroke="url(#goldGrad)" strokeWidth="2" fill="#0F172A" />
            <path
              d="M50 34.5 L50 68 M36 60 C 36 74, 64 74, 64 60"
              stroke="url(#goldGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Horizontal Crossbar */}
            <line x1="38" y1="42" x2="62" y2="42" stroke="url(#goldGrad)" strokeWidth="2" strokeLinecap="round" />

            {/* Stylized C&F Monogram */}
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fill="url(#goldGrad)"
              fontSize="13"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-0.5"
            >
              C&amp;F
            </text>

            {/* Bottom Official Stars */}
            <circle cx="43" cy="81" r="1.5" fill="#F59E0B" />
            <circle cx="50" cy="83" r="2.2" fill="#FDE68A" />
            <circle cx="57" cy="81" r="1.5" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {variant !== 'badge-only' && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span
              className={`${sizeClasses[size].title} font-black uppercase tracking-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              C&amp;F AGENT
            </span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`${sizeClasses[size].subtitle} font-bold text-amber-500 uppercase tracking-wider`}
              >
                Customs Clearing &amp; Forwarding
              </span>
              <span className="text-slate-500 text-[10px]">•</span>
              <span
                className={`${sizeClasses[size].subtitle} font-medium ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Air &amp; Sea D2D Cargo
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
