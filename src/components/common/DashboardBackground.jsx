import React from 'react';

/**
 * ManasMitra AI — Ambient Dashboard Background System
 * Inspired by VitAI Healthcare & Milkinside Motion Aesthetics.
 * Provides a dynamic, living ambient canvas with blueprint coordinate grid,
 * chromatic aurora glow orbs, flowing neural/cardiac waves, and floating bokeh.
 */
export default function DashboardBackground({ activeRole: _activeRole = 'caregiver' }) {
  return (
    <div className="dashboard-ambient-canvas" aria-hidden="true">
      {/* 1. Blueprint Coordinate Dot-Matrix Grid */}
      <div className="dash-bg-grid" />

      {/* 2. Luminous Chromatic Aurora Glow Orbs */}
      <div className="dash-aurora-blob aurora-sage" />
      <div className="dash-aurora-blob aurora-coral" />
      <div className="dash-aurora-blob aurora-cyan" />

      {/* 3. Flowing Neural / Cardiac Rhythm Wave (VitAI Signature) */}
      <div className="dash-ecg-stream">
        <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="dash-ecg-svg">
          <path
            d="M0,60 L260,60 L280,35 L295,95 L310,15 L330,80 L350,60 L780,60 L800,40 L815,90 L830,20 L850,75 L870,60 L1440,60"
            className="dash-ecg-path"
          />
        </svg>
      </div>

      {/* 4. Subtle Floating Glass Bokeh Rings (Milkinside Depth Elements) */}
      <div className="dash-bokeh-ring ring-1" />
      <div className="dash-bokeh-ring ring-2" />
      <div className="dash-bokeh-ring ring-3" />

      <style>{`
        /* DASHBOARD AMBIENT BACKGROUND STYLES */
        .dashboard-ambient-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 45%, #edf2f7 100%);
        }

        /* Blueprint Dot-Matrix Lattice */
        .dash-bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(100, 116, 139, 0.18) 1.2px, transparent 1.2px);
          background-size: 32px 32px;
          opacity: 0.7;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 100%);
        }

        /* Ambient Aurora Glowing Orbs */
        .dash-aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.55;
          animation: dashAuroraDrift 12s infinite alternate ease-in-out;
        }

        /* Sage / Biophilic Herbal Emerald Aura */
        .aurora-sage {
          width: 580px;
          height: 580px;
          background: radial-gradient(circle, rgba(27, 67, 50, 0.12) 0%, rgba(45, 106, 79, 0.06) 50%, transparent 75%);
          top: -80px;
          left: -100px;
          animation-delay: 0s;
        }

        /* Coral / Cardiac Lifeline Aura */
        .aurora-coral {
          width: 620px;
          height: 620px;
          background: radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, rgba(225, 29, 72, 0.05) 50%, transparent 75%);
          top: 40px;
          right: -120px;
          animation-delay: -4s;
        }

        /* Cyan / Cognitive AI Clarity Aura */
        .aurora-cyan {
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.09) 0%, rgba(56, 189, 248, 0.04) 50%, transparent 75%);
          bottom: 10%;
          left: 25%;
          animation-delay: -7s;
        }

        @keyframes dashAuroraDrift {
          0% { transform: scale(0.92) translate(-25px, -15px); }
          50% { transform: scale(1.05) translate(15px, 20px); }
          100% { transform: scale(1.18) translate(30px, -10px); }
        }

        /* Translucent Flowing Cardiac ECG Line */
        .dash-ecg-stream {
          position: absolute;
          top: 32%;
          left: 0;
          right: 0;
          height: 100px;
          opacity: 0.28;
          overflow: hidden;
        }

        .dash-ecg-svg {
          width: 200%;
          height: 100%;
          stroke: #f43f5e;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
          animation: dashEcgMove 18s linear infinite;
        }

        @keyframes dashEcgMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Floating Translucent Bokeh Rings */
        .dash-bokeh-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 8px 32px rgba(15, 23, 42, 0.04);
          backdrop-filter: blur(4px);
        }

        .ring-1 {
          width: 140px;
          height: 140px;
          top: 18%;
          left: 12%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(224, 242, 254, 0.15) 100%);
          animation: bokehFloat 8s infinite alternate ease-in-out;
        }

        .ring-2 {
          width: 180px;
          height: 180px;
          top: 55%;
          right: 8%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 241, 242, 0.15) 100%);
          animation: bokehFloat 10s infinite -4s alternate ease-in-out;
        }

        .ring-3 {
          width: 90px;
          height: 90px;
          bottom: 15%;
          left: 48%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(220, 252, 231, 0.15) 100%);
          animation: bokehFloat 7s infinite -2s alternate ease-in-out;
        }

        @keyframes bokehFloat {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-20px) scale(1.08); }
        }

        /* High-contrast mode dimming */
        body.high-contrast .dashboard-ambient-canvas {
          background: #ffffff;
        }
        body.high-contrast .dash-bg-grid,
        body.high-contrast .dash-aurora-blob,
        body.high-contrast .dash-ecg-stream,
        body.high-contrast .dash-bokeh-ring {
          display: none;
        }
      `}</style>
    </div>
  );
}
