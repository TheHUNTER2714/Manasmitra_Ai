import React, { useState } from 'react';

export default function BrandLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showSubtitle = true,
  showBadge = true,
  interactive = true,
  onClick,
  className = ''
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Dimension scaling
  const sizeMap = {
    sm: { icon: 34, title: '1.05rem', sub: '0.72rem', gap: '0.6rem', badge: '0.68rem' },
    md: { icon: 44, title: '1.35rem', sub: '0.78rem', gap: '0.75rem', badge: '0.72rem' },
    lg: { icon: 56, title: '1.85rem', sub: '0.9rem', gap: '0.9rem', badge: '0.78rem' },
    xl: { icon: 84, title: '2.85rem', sub: '1.25rem', gap: '1.2rem', badge: '0.85rem' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`impressive-brand-logo size-${size} ${interactive ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: currentSize.gap,
        cursor: onClick || interactive ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      title="ManasMitra AI - Cognitive Senior Companion"
    >
      {/* Signature Animated SVG Emblem */}
      <div
        className="brand-emblem-container"
        style={{
          position: 'relative',
          width: currentSize.icon,
          height: currentSize.icon,
          flexShrink: 0
        }}
      >
        {/* Prismatic Outer Glow Aura */}
        <div
          className="emblem-aurora-glow"
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f43f5e, #fb7185, #38bdf8, #10b981, #bef226, #f43f5e)',
            filter: `blur(${size === 'xl' ? 14 : size === 'lg' ? 10 : 6}px)`,
            opacity: isHovered ? 0.95 : 0.65,
            transform: isHovered ? 'scale(1.15) rotate(180deg)' : 'scale(1) rotate(0deg)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'emblemSpinAura 6s linear infinite'
          }}
        />

        {/* 3D Glass Jewel Housing */}
        <div
          className="emblem-jewel-core"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: size === 'xl' ? '24px' : size === 'lg' ? '18px' : '14px',
            background: 'linear-gradient(135deg, #0b132b 0%, #172554 60%, #0f172a 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.35), 0 8px 24px rgba(11, 19, 43, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transform: isHovered ? 'translateY(-2px) scale(1.04)' : 'none',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Internal Shimmer Wave */}
          <div
            className="emblem-internal-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(105deg, transparent 20%, rgba(255, 255, 255, 0.15) 45%, rgba(56, 189, 248, 0.25) 50%, transparent 60%)',
              animation: 'emblemShimmerSweep 3s infinite ease-in-out'
            }}
          />

          {/* Core Multi-Layered SVG Mind-Heart Emblem */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '82%',
              height: '82%',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
            }}
          >
            <defs>
              <linearGradient id="brainHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="40%" stopColor="#ec4899" />
                <stop offset="70%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="orbitalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef226" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <filter id="glowEmblem" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Neural Synapse Constellation Lines */}
            <g opacity="0.45" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,3">
              <line x1="28" y1="36" x2="50" y2="48" />
              <line x1="72" y1="36" x2="50" y2="48" />
              <line x1="50" y1="48" x2="50" y2="76" />
              <line x1="38" y1="58" x2="62" y2="58" />
            </g>

            {/* Elliptical Quantum Orbital Ring */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="16"
              fill="none"
              stroke="url(#orbitalGrad)"
              strokeWidth="2.2"
              strokeDasharray="18 10"
              transform="rotate(-28 50 50)"
              className="emblem-orbital-ring"
            />

            {/* Orbiting Quantum Synapse Particle */}
            <circle
              cx="14"
              cy="50"
              r="3.2"
              fill="#bef226"
              className="emblem-quantum-dot"
            />

            {/* Dual Brain Lobes merging into Heart Silhouette */}
            <path
              d="M 50 28
                 C 40 16, 20 18, 18 36
                 C 16 48, 26 62, 50 82
                 C 74 62, 84 48, 82 36
                 C 80 18, 60 16, 50 28 Z"
              fill="url(#brainHeartGrad)"
              opacity="0.88"
              className="emblem-heartbeat"
            />

            {/* Neural Synapse Nodes (Pulsing Brain Lobes) */}
            <circle cx="34" cy="32" r="3.2" fill="#ffffff" filter="url(#glowEmblem)" />
            <circle cx="66" cy="32" r="3.2" fill="#ffffff" filter="url(#glowEmblem)" />
            <circle cx="50" cy="46" r="4.2" fill="#ffffff" filter="url(#glowEmblem)" />
            <circle cx="38" cy="56" r="2.8" fill="#bef226" />
            <circle cx="62" cy="56" r="2.8" fill="#bef226" />

            {/* ECG Pulse / Neural Signal Line */}
            <path
              d="M 24 50 L 38 50 L 44 38 L 50 62 L 56 42 L 62 50 L 76 50"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="emblem-ecg-trace"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      <div className="brand-text-column" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <div
          className="brand-title-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontFamily: 'var(--font-display, "Sora", sans-serif)'
          }}
        >
          <span
            style={{
              fontSize: currentSize.title,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary, #0f172a)',
              transition: 'color 0.2s ease'
            }}
          >
            ManasMitra
          </span>
          <span
            className="brand-ai-gradient"
            style={{
              fontSize: currentSize.title,
              fontWeight: 900,
              background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 40%, #0284c7 80%, #10b981 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'aiGradientMove 3s linear infinite'
            }}
          >
            AI
          </span>

          {showBadge && (
            <span
              style={{
                fontSize: currentSize.badge,
                fontWeight: 800,
                background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.12), rgba(16, 185, 129, 0.15))',
                color: '#be123c',
                border: '1px solid rgba(225, 29, 72, 0.28)',
                padding: '2px 7px',
                borderRadius: '9999px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              NER Care
            </span>
          )}
        </div>

        {showSubtitle && (
          <div
            style={{
              fontSize: currentSize.sub,
              fontWeight: 600,
              color: 'var(--text-secondary, #64748b)',
              fontFamily: 'var(--font-hindi, "Noto Sans Devanagari", sans-serif)',
              letterSpacing: '0.01em',
              marginTop: '2px'
            }}
          >
            मानस मित्र • संज्ञानात्मक व पारिवारिक साथी
          </div>
        )}
      </div>

      <style>{`
        @keyframes emblemSpinAura {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes emblemShimmerSweep {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes aiGradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .emblem-heartbeat {
          animation: emblemHeartbeatPulse 1.8s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
          transform-origin: 50% 50%;
        }
        @keyframes emblemHeartbeatPulse {
          0% { transform: scale(1); }
          14% { transform: scale(1.08); }
          28% { transform: scale(1); }
          42% { transform: scale(1.06); }
          70% { transform: scale(1); }
        }
        .emblem-orbital-ring {
          animation: orbitalRotate 8s linear infinite;
          transform-origin: 50% 50%;
        }
        @keyframes orbitalRotate {
          0% { transform: rotate(-28deg); }
          100% { transform: rotate(332deg); }
        }
        .emblem-ecg-trace {
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: ecgDraw 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes ecgDraw {
          0% { stroke-dashoffset: 80; opacity: 0.2; }
          40% { stroke-dashoffset: 0; opacity: 1; }
          80% { stroke-dashoffset: -80; opacity: 0.2; }
          100% { stroke-dashoffset: -80; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
