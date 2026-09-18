import React, { useState, useEffect } from 'react';

/**
 * ShimmerText
 * Continuous flowing iridescent or chromatic gradient on text
 */
export function ShimmerText({ children, variant = 'brand', className = '', style = {} }) {
  const variantClass = {
    brand: 'font-shimmer-brand',
    emerald: 'font-shimmer-emerald',
    cyan: 'font-shimmer-cyan',
    amber: 'font-shimmer-amber'
  }[variant] || 'font-shimmer-brand';

  return (
    <span className={`${variantClass} ${className}`} style={style}>
      {children}
    </span>
  );
}

/**
 * KineticHeading
 * High-tech entrance animation with geometric letterform and tracking expansion
 */
export function KineticHeading({
  children,
  as: Component = 'h1',
  className = '',
  style = {},
  ...props
}) {
  return (
    <Component className={`kinetic-title ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
}

/**
 * AnimatedNumber
 * Smoothly counting up or pulsing clinical numeric indicators (e.g. 99.4%, 4200+, 88%)
 * Renders in monospaced Space Grotesk with high-tech glowing aura
 */
export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  glow = true,
  className = '',
  style = {}
}) {
  const [displayValue, setDisplayValue] = useState(0);

  // Extract numerical component
  const numericMatch = typeof value === 'string' ? value.match(/[\d.]+/) : null;
  const targetNum = numericMatch ? parseFloat(numericMatch[0]) : (typeof value === 'number' ? value : 0);
  const isDecimal = String(value).includes('.');

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * targetNum;
      
      setDisplayValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetNum);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [targetNum, duration, isDecimal]);

  return (
    <span
      className={`stat-number-animated ${glow ? 'glow-pulse' : ''} ${className}`}
      style={style}
    >
      {prefix}
      {isDecimal ? displayValue.toFixed(1) : displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

/**
 * LivingBadge
 * Micro-badge with animated sweeping light sheen and active pulse beacon
 */
export function LivingBadge({
  icon: Icon,
  children,
  pulseColor = '#10b981',
  variant: _variant = 'brand',
  className = '',
  style = {}
}) {
  return (
    <div
      className={`badge-animated-text ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.95rem',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        fontWeight: 700,
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(226, 232, 240, 0.8)',
        background: 'rgba(255, 255, 255, 0.9)',
        ...style
      }}
    >
      {Icon && <Icon size={15} style={{ flexShrink: 0 }} />}
      {pulseColor && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: pulseColor,
            boxShadow: `0 0 0 0 ${pulseColor}`,
            animation: 'emeraldBeacon 1.8s infinite'
          }}
        />
      )}
      <span className="interactive-text-expand">{children}</span>
    </div>
  );
}
