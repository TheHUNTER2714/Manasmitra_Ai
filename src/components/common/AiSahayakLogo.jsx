import React, { useState } from 'react';

/**
 * AiSahayakLogo - The official emblem of ManasMitra AI Sahayak
 * Combines:
 * 1. Neural Brain Cognitive Grid (Elder Memory & AI Intelligence)
 * 2. Gentle Lotus Petals (North Eastern botanical heritage & compassionate care)
 * 3. Audio Voice Waveforms & Central Pulse (Voice assistance)
 * 4. Electric Lime (#bef226) & Deep Forest Emerald (#052e26) brand aesthetic
 */
export default function AiSahayakLogo({
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero'
  isSpeaking = false,
  gender = 'female', // 'female' | 'male'
  animated = true,
  showLabel = false,
  labelText = '',
  className = '',
  style = {},
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Size specifications (in pixels)
  const sizeMap = {
    xs: { px: 20, badgeRadius: 6, stroke: 1.8, fontSize: '0.72rem' },
    sm: { px: 28, badgeRadius: 9, stroke: 2.0, fontSize: '0.82rem' },
    md: { px: 42, badgeRadius: 14, stroke: 2.2, fontSize: '0.95rem' },
    lg: { px: 56, badgeRadius: 18, stroke: 2.5, fontSize: '1.15rem' },
    xl: { px: 76, badgeRadius: 24, stroke: 2.8, fontSize: '1.35rem' },
    hero: { px: 96, badgeRadius: 30, stroke: 3.0, fontSize: '1.6rem' }
  };

  const dim = sizeMap[size] || sizeMap.md;
  const isMale = gender === 'male';

  // Accent gradient colors based on persona
  const accentPrimary = isMale ? '#38bdf8' : '#bef226'; // Cyan vs Electric Lime
  const accentGlow = isMale ? 'rgba(56, 189, 248, 0.45)' : 'rgba(190, 242, 38, 0.45)';

  return (
    <div
      className={`ai-sahayak-emblem-wrap ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: onClick ? 'pointer' : 'inherit',
        userSelect: 'none',
        ...style
      }}
      title={`ManasMitra AI Sahayak (${gender === 'female' ? 'महिला' : 'पुरुष'} आवाज़)`}
    >
      <div
        style={{
          position: 'relative',
          width: `${dim.px}px`,
          height: `${dim.px}px`,
          flexShrink: 0
        }}
      >
        {/* Ambient Outer Halo Pulse */}
        <div
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            background: isSpeaking
              ? `radial-gradient(circle, ${accentPrimary} 0%, transparent 70%)`
              : `conic-gradient(from 180deg, #052e26, ${accentPrimary}, #10b981, #052e26)`,
            opacity: isSpeaking ? 0.9 : isHovered ? 0.75 : 0.45,
            filter: `blur(${dim.px > 40 ? '6px' : '3px'})`,
            transform: isHovered || isSpeaking ? 'scale(1.15)' : 'scale(1)',
            transition: 'all 0.3s ease',
            animation: animated && (isSpeaking || isHovered) ? 'spinSahayakAura 4s linear infinite' : 'none'
          }}
        />

        {/* 3D Glass Badge Housing */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: `${dim.badgeRadius}px`,
            background: 'linear-gradient(135deg, #052e26 0%, #064e3b 60%, #022c22 100%)',
            border: `1.5px solid ${isSpeaking ? accentPrimary : 'rgba(190, 242, 38, 0.45)'}`,
            boxShadow: `0 4px 14px ${accentGlow}, inset 0 1px 2px rgba(255, 255, 255, 0.25)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            transform: isHovered ? 'translateY(-1px) scale(1.04)' : 'none',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
          }}
        >
          {/* Subtle Dynamic Scanline / Energy Sweep */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%)',
              animation: animated ? 'sweepSahayak 3.5s infinite ease-in-out' : 'none',
              pointerEvents: 'none'
            }}
          />

          {/* Core Master SVG Emblem */}
          <svg
            viewBox="0 0 100 100"
            style={{
              width: '85%',
              height: '85%',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
            }}
          >
            <defs>
              <linearGradient id={`gradSahayakLime-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bef226" />
                <stop offset="60%" stopColor="#84cc16" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id={`gradSahayakCyan-${gender}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <filter id="aiCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* 1. Concentric Audio Voice Wave Arcs (Active on speech) */}
            <g
              opacity={isSpeaking ? 0.95 : 0.35}
              stroke={accentPrimary}
              strokeWidth={dim.stroke}
              fill="none"
              strokeLinecap="round"
            >
              {/* Left Voice Arc */}
              <path
                d="M 22 34 A 32 32 0 0 0 22 66"
                className={isSpeaking ? 'voice-wave-left' : ''}
              />
              <path
                d="M 14 26 A 44 44 0 0 0 14 74"
                opacity={isSpeaking ? 0.8 : 0.2}
                className={isSpeaking ? 'voice-wave-left-outer' : ''}
              />

              {/* Right Voice Arc */}
              <path
                d="M 78 34 A 32 32 0 0 1 78 66"
                className={isSpeaking ? 'voice-wave-right' : ''}
              />
              <path
                d="M 86 26 A 44 44 0 0 1 86 74"
                opacity={isSpeaking ? 0.8 : 0.2}
                className={isSpeaking ? 'voice-wave-right-outer' : ''}
              />
            </g>

            {/* 2. Caring Lotus Petal Base (Embracing Care) */}
            <path
              d="M 28 68 C 34 82, 66 82, 72 68 C 65 76, 35 76, 28 68 Z"
              fill={isMale ? 'url(#gradSahayakCyan-male)' : 'url(#gradSahayakLime-female)'}
              opacity="0.8"
            />

            {/* 3. Central Stylized Cognitive Brain / Visor Mesh */}
            {/* Left Brain Lobe */}
            <path
              d="M 48 30
                 C 38 22, 28 32, 32 46
                 C 26 54, 34 66, 48 64 Z"
              fill="none"
              stroke={isMale ? '#38bdf8' : '#bef226'}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Right Brain Lobe */}
            <path
              d="M 52 30
                 C 62 22, 72 32, 68 46
                 C 74 54, 66 66, 52 64 Z"
              fill="none"
              stroke={isMale ? '#38bdf8' : '#bef226'}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* 4. Synapse Interconnect Nodes */}
            <line x1="38" y1="38" x2="48" y2="44" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="62" y1="38" x2="52" y2="44" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
            <line x1="48" y1="44" x2="52" y2="44" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <line x1="50" y1="44" x2="50" y2="58" stroke={accentPrimary} strokeWidth="1.5" opacity="0.85" />

            <circle cx="38" cy="38" r="2.4" fill="#ffffff" filter="url(#aiCoreGlow)" />
            <circle cx="62" cy="38" r="2.4" fill="#ffffff" filter="url(#aiCoreGlow)" />
            <circle cx="34" cy="52" r="2" fill={accentPrimary} />
            <circle cx="66" cy="52" r="2" fill={accentPrimary} />

            {/* 5. Central AI Heart Pulse / Glowing Core */}
            <circle
              cx="50"
              cy="48"
              r={isSpeaking ? '4.8' : '3.8'}
              fill="#ffffff"
              filter="url(#aiCoreGlow)"
              className={isSpeaking ? 'ai-pulse-core' : ''}
            />

            {/* 6. Friendly Visor Eye Line (Audio Visualizer Bars) */}
            <rect x="42" y="56" width="3" height={isSpeaking ? '9' : '4'} rx="1.5" fill="#bef226" className={isSpeaking ? 'bar-eq-1' : ''} />
            <rect x="48.5" y="54" width="3" height={isSpeaking ? '13' : '7'} rx="1.5" fill="#ffffff" className={isSpeaking ? 'bar-eq-2' : ''} />
            <rect x="55" y="56" width="3" height={isSpeaking ? '9' : '4'} rx="1.5" fill="#38bdf8" className={isSpeaking ? 'bar-eq-3' : ''} />

            {/* 7. Top Radiating Care Sparkle (✦) */}
            <polygon
              points="50,16 52,22 58,24 52,26 50,32 48,26 42,24 48,22"
              fill="#ffffff"
              filter="url(#aiCoreGlow)"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>

      {showLabel && (
        <span
          style={{
            fontSize: dim.fontSize,
            fontWeight: 800,
            color: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          {labelText || 'AI Sahayak'}
        </span>
      )}

      <style>{`
        @keyframes spinSahayakAura {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes sweepSahayak {
          0% { transform: translateX(-160%); }
          40% { transform: translateX(160%); }
          100% { transform: translateX(160%); }
        }
        .ai-pulse-core {
          animation: pulseCoreAnim 0.8s ease-in-out infinite alternate;
          transform-origin: 50px 48px;
        }
        @keyframes pulseCoreAnim {
          0% { r: 3.5; opacity: 0.85; }
          100% { r: 5.5; opacity: 1; filter: drop-shadow(0 0 6px #bef226); }
        }
        .voice-wave-left {
          animation: waveLeftAnim 0.7s infinite alternate ease-in-out;
        }
        .voice-wave-right {
          animation: waveRightAnim 0.7s infinite alternate ease-in-out;
        }
        @keyframes waveLeftAnim {
          0% { transform: translateX(0); opacity: 0.4; }
          100% { transform: translateX(-3px); opacity: 1; }
        }
        @keyframes waveRightAnim {
          0% { transform: translateX(0); opacity: 0.4; }
          100% { transform: translateX(3px); opacity: 1; }
        }
        .bar-eq-1 {
          animation: barEq1 0.4s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }
        .bar-eq-2 {
          animation: barEq2 0.35s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }
        .bar-eq-3 {
          animation: barEq3 0.45s ease-in-out infinite alternate;
          transform-origin: center bottom;
        }
        @keyframes barEq1 {
          0% { height: 4px; y: 58px; }
          100% { height: 11px; y: 54px; }
        }
        @keyframes barEq2 {
          0% { height: 6px; y: 57px; }
          100% { height: 15px; y: 52px; }
        }
        @keyframes barEq3 {
          0% { height: 5px; y: 58px; }
          100% { height: 10px; y: 55px; }
        }
      `}</style>
    </div>
  );
}
