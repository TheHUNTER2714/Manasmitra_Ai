import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, ChevronRight, Activity } from 'lucide-react';

const SPLASH_LOCALES = {
  hi: {
    badge: 'उत्तर-पूर्व भारत वरिष्ठ संज्ञानात्मक साथी • MDoNER',
    subtitle: 'मानस मित्र • वरिष्ठ नागरिक संज्ञानात्मक साथी',
    desc: 'संज्ञानात्मक न्यूरो-गेम्स • बहुभाषी एआई सहायक • सजीव परिवार संदेश • ऑफलाइन क्लिनिकल सिंक',
    enter: 'मंच में प्रवेश करें'
  },
  en: {
    badge: 'North-Eastern Senior Cognitive Companion • MDoNER',
    subtitle: 'ManasMitra • Senior Cognitive Healthcare Companion',
    desc: 'Adaptive Cognitive Neuro-Gaming • Multilingual Voice AI • Direct Family Messaging • Offline Clinical Sync',
    enter: 'Enter Platform'
  },
  as: {
    badge: 'উত্তৰ-পূব জ্যেষ্ঠ নাগৰিক জ্ঞান সংগী • MDoNER',
    subtitle: 'মানস মিত্র • জ্যেষ্ঠ নাগৰিকৰ জ্ঞানভিত্তিক সংগী',
    desc: 'নিউৰো-গেমছ • বহুভাষিক এআই সহায়ক • পৰিয়ালৰ সৈতে যোগাযোগ • অফলাইন ক্লিনিকেল ছিংক',
    enter: 'মঞ্চত প্ৰৱেশ কৰক'
  },
  bn: {
    badge: 'উত্তর-পূর্ব প্রবীণ জ্ঞানীয় সঙ্গী • MDoNER',
    subtitle: 'মানসমিত্র • প্রবীণ নাগরিক জ্ঞানীয় সঙ্গী',
    desc: 'নিউরো-গেমিং • বহুভাষিক ভয়েস এআই • সরাসরি পারিবারিক বার্তা • অফলাইন ক্লিনিকাল সিঙ্ক',
    enter: 'প্ল্যাটফর্মে প্রবেশ করুন'
  },
  brx: {
    badge: 'सा-सानजा गोरोन्थाय हेफाजाब • MDoNER',
    subtitle: 'मानस मित्र • गोरोन्थाय हेफाजाब',
    desc: 'गोरोन्थाय गेलेनाय • गासै रावआव AI • नखरजों रायज्लायनाय • अफ़लाइन सावस्रि दोनथुमनाय',
    enter: 'मंचायाव हाब'
  },
  kha: {
    badge: 'Ka Jingiarap ia ki Kpa/Kmie ha NER • MDoNER',
    subtitle: 'ManasMitra • U Nongiarap ki Kpa bad Kmie',
    desc: 'Jingialehkai Jingmut • Voice AI ha ki Ktien Khasi • Jingthoh Sha ka Iing • Offline Clinic Sync',
    enter: 'Buh ha ka Platform'
  },
  grt: {
    badge: 'North-East Senior Cognitive Dakchakani • MDoNER',
    subtitle: 'ManasMitra • Gitcham Manderangna Dakchakgipa',
    desc: 'Gisik Tangatgipa Kal·ani • Multilingual AI • Nokdangna Watatani • Offline Sync',
    enter: 'Platformo Napbo'
  },
  mni: {
    badge: 'অৱাং-নোংপোক অহন মীয়ামগী মতেং • MDoNER',
    subtitle: 'মানসমিত্র • অহন মীয়ামগী নিংশিংবা মতেং',
    desc: 'মশক খঙবগী শান্ন-খোৎনবা • তোঙান-তোঙানবা লোলগী AI • য়ুম্বুংবদা পাউ তাবা • অফলাইন হকশেল রেকর্ড',
    enter: 'পোর্তেলদা চংলু'
  },
  lus: {
    badge: 'North-East Senior Hriatna Ṭanpuitu • MDoNER',
    subtitle: 'ManasMitra • Pitar/Putar Hriatna Vawnhimtu',
    desc: 'Hriatna Tichak Game • Tawng Hrang AI • Chhungte Biakpawhna • Offline Record',
    enter: 'Lut Rawh'
  },
  naga: {
    badge: 'North-East Senior Cognitive Care • MDoNER',
    subtitle: 'ManasMitra • Bura Manu Khan Laga Dimag Modot',
    desc: 'Brain Games • Multilingual Voice AI • Direct Family Message • Offline Clinical Sync',
    enter: 'Platform te jabi'
  },
  trp: {
    badge: 'North-East Senior Hamkrai • MDoNER',
    subtitle: 'ManasMitra • Bwswkangni Kokborok Hamkrai',
    desc: 'Gisik Kal·ani • Kokborok AI • Nokphang Message • Offline Record',
    enter: 'Platformo hapdi'
  }
};

export default function LogoSplash({ onFinish, forceShow = false, language = 'hi' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [phase, setPhase] = useState(1); // 1: Cosmic Aurora & Orbital Tracks, 2: 3D Emblem Lock & Shockwave, 3: Holographic Typography, 4: Complete

  const loc = SPLASH_LOCALES[language] || SPLASH_LOCALES['en'];

  const handleDismiss = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 650);
  }, [onFinish]);

  useEffect(() => {
    // Play synthetic soft celestial harmonic chime on phase 2 lock-in
    const playIntroChime = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 major chord
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0, now + idx * 0.08);
          gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.3);
        });
      } catch {
        // AudioContext may be restricted before gesture
      }
    };

    const t1 = setTimeout(() => {
      setPhase(2);
      playIntroChime();
    }, 550);
    const t2 = setTimeout(() => setPhase(3), 1300);
    const t3 = setTimeout(() => setPhase(4), 2300);
    const tDismiss = setTimeout(() => {
      handleDismiss();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tDismiss);
    };
  }, [handleDismiss]);

  if (!isVisible && !forceShow) return null;

  return (
    <div
      className={`milkinside-splash-wrapper ${isFadingOut ? 'exit-transition' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'radial-gradient(ellipse at 50% 45%, #0d1730 0%, #060b18 55%, #02040a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* 1. COSMIC STARFIELD & BLUEPRINT GRID */}
      <div className="milkinside-grid-canvas" />

      {/* Dynamic Chromatic Aurora Glow Blobs */}
      <div className="milkinside-aurora-blob aurora-coral" />
      <div className="milkinside-aurora-blob aurora-emerald" />
      <div className="milkinside-aurora-blob aurora-indigo" />

      {/* 2. 3D DUAL ELLIPTICAL ORBITAL SVG TRACKS */}
      <div className="milkinside-orbital-system">
        <svg viewBox="0 0 600 600" className="orbital-svg orbit-1">
          <ellipse cx="300" cy="300" rx="250" ry="95" className="orbit-track" />
          <ellipse cx="300" cy="300" rx="250" ry="95" className="orbit-tracer tracer-1" />
        </svg>
        <svg viewBox="0 0 600 600" className="orbital-svg orbit-2">
          <ellipse cx="300" cy="300" rx="250" ry="95" className="orbit-track" />
          <ellipse cx="300" cy="300" rx="250" ry="95" className="orbit-tracer tracer-2" />
        </svg>
      </div>

      {/* Shockwave Blast Ripple on Lock-In */}
      <div className={`milkinside-shockwave ${phase >= 2 ? 'trigger' : ''}`} />

      {/* 3. SIGNATURE MIND-HEART EMBLEM & BRAND STAGE */}
      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', maxWidth: '740px', padding: '2rem' }}>
        
        {/* 3D Morphing Emblem with Rotating Prismatic Rim Lighting */}
        <div className={`milkinside-emblem-stage ${phase >= 2 ? 'locked' : ''}`}>
          {/* Outer Prismatic Conic Rim */}
          <div className="milkinside-prismatic-rim">
            <div className="prismatic-inner-box">
              {/* Core SVG Neural Mind-Heart Emblem */}
              <svg
                viewBox="0 0 100 100"
                style={{
                  width: '80%',
                  height: '80%',
                  filter: 'drop-shadow(0 4px 12px rgba(244, 63, 94, 0.6))',
                  position: 'relative',
                  zIndex: 5
                }}
              >
                <defs>
                  <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="35%" stopColor="#fb7185" />
                    <stop offset="70%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                  <linearGradient id="splashRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bef226" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Synapse Lines */}
                <g opacity="0.5" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3">
                  <line x1="28" y1="36" x2="50" y2="48" />
                  <line x1="72" y1="36" x2="50" y2="48" />
                  <line x1="50" y1="48" x2="50" y2="76" />
                </g>

                {/* Orbital Ring */}
                <ellipse
                  cx="50"
                  cy="50"
                  rx="42"
                  ry="16"
                  fill="none"
                  stroke="url(#splashRingGrad)"
                  strokeWidth="2.4"
                  strokeDasharray="18 10"
                  transform="rotate(-28 50 50)"
                  className="splash-svg-ring"
                />

                {/* Quantum Dot */}
                <circle cx="14" cy="50" r="3.5" fill="#bef226" />

                {/* Unified Mind-Heart Lobe Path */}
                <path
                  d="M 50 28
                     C 40 16, 20 18, 18 36
                     C 16 48, 26 62, 50 82
                     C 74 62, 84 48, 82 36
                     C 80 18, 60 16, 50 28 Z"
                  fill="url(#splashGrad)"
                  className="milkinside-heartbeat"
                />

                {/* Synapse Nodes */}
                <circle cx="34" cy="32" r="3.4" fill="#ffffff" />
                <circle cx="66" cy="32" r="3.4" fill="#ffffff" />
                <circle cx="50" cy="46" r="4.2" fill="#ffffff" />

                {/* Center ECG Pulse Trace */}
                <path
                  d="M 24 50 L 38 50 L 44 38 L 50 62 L 56 42 L 62 50 L 76 50"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Glowing Pulse Rings inside Jewel */}
              <div className="jewel-pulse-ring ring-a" />
              <div className="jewel-pulse-ring ring-b" />

              {/* Orbiting Sparkle Star */}
              <div className="milkinside-orbit-star">
                <Sparkles size={24} color="#bef226" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. TYPOGRAPHY REVEAL WITH HOLOGRAPHIC SHIMMER */}
        <div className={`milkinside-text-container ${phase >= 3 ? 'visible' : ''}`}>
          {/* Initiative Badge */}
          <div className="milkinside-initiative-badge badge-animated-text">
            <Activity size={14} color="#f43f5e" />
            <span>{loc.badge}</span>
          </div>

          <h1 className="milkinside-main-title">
            <span>ManasMitra</span>{' '}
            <span className="milkinside-ai-shimmer">
              AI
            </span>
            <span className="milkinside-flare" />
          </h1>

          {/* Regional Subtitle with Iridescent Shimmer */}
          <div className="milkinside-hindi-title regional-wave-text">
            {loc.subtitle}
          </div>

          <p className="milkinside-desc">
            {loc.desc}
          </p>

          {/* Progress Indicator & Skip / Enter Button */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginTop: '1.5rem' }}>
            <div className="milkinside-progress-track">
              <div className="milkinside-progress-bar" />
            </div>

            <button
              onClick={handleDismiss}
              className="milkinside-enter-btn"
              title="Enter ManasMitra Platform"
            >
              <span>{loc.enter}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* MILKINSIDE SPLASH & EMBLEM ANIMATIONS */
        .milkinside-splash-wrapper {
          transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease;
        }
        .milkinside-splash-wrapper.exit-transition {
          opacity: 0;
          transform: scale(1.08) translateY(-20px);
          filter: blur(12px) brightness(1.2);
          pointer-events: none;
        }

        .milkinside-grid-canvas {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 52px 52px;
          opacity: 0.75;
          pointer-events: none;
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }

        .milkinside-aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          opacity: 0.38;
          animation: auroraFloat 8s infinite alternate ease-in-out;
        }
        .aurora-coral {
          width: 540px;
          height: 540px;
          background: radial-gradient(circle, #f43f5e 0%, transparent 70%);
          top: 15%;
          left: 20%;
          animation-delay: 0s;
        }
        .aurora-emerald {
          width: 580px;
          height: 580px;
          background: radial-gradient(circle, #10b981 0%, transparent 70%);
          bottom: 10%;
          right: 18%;
          animation-delay: -3s;
        }
        .aurora-indigo {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #38bdf8 0%, transparent 70%);
          top: 35%;
          right: 25%;
          animation-delay: -5s;
        }
        @keyframes auroraFloat {
          0% { transform: translate(-35px, -25px) scale(0.95); }
          100% { transform: translate(35px, 25px) scale(1.15); }
        }

        .milkinside-orbital-system {
          position: absolute;
          width: 620px;
          height: 620px;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .orbital-svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        .orbit-1 {
          transform: rotate(-25deg);
        }
        .orbit-2 {
          transform: rotate(55deg);
        }
        .orbit-track {
          fill: none;
          stroke: rgba(255, 255, 255, 0.09);
          stroke-width: 1.5;
          stroke-dasharray: 5 7;
        }
        .orbit-tracer {
          fill: none;
          stroke-width: 3.5;
          stroke-linecap: round;
        }
        .tracer-1 {
          stroke: #f43f5e;
          stroke-dasharray: 120 420;
          animation: tracerSpin 4s linear infinite;
          filter: drop-shadow(0 0 12px #f43f5e);
        }
        .tracer-2 {
          stroke: #10b981;
          stroke-dasharray: 110 460;
          animation: tracerSpin 5.5s linear infinite reverse;
          filter: drop-shadow(0 0 12px #10b981);
        }
        @keyframes tracerSpin {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -540; }
        }

        .milkinside-shockwave {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #f43f5e;
          opacity: 0;
          pointer-events: none;
        }
        .milkinside-shockwave.trigger {
          animation: shockwaveBurst 1.2s ease-out forwards;
        }
        @keyframes shockwaveBurst {
          0% { transform: scale(1); opacity: 0.95; border-color: #f43f5e; }
          50% { opacity: 0.6; }
          100% { transform: scale(9); opacity: 0; border-color: #bef226; }
        }

        .milkinside-emblem-stage {
          margin: 0 auto 2rem;
          width: 132px;
          height: 132px;
          position: relative;
          transform: perspective(900px) rotateX(25deg) rotateY(-20deg) scale(0.4);
          opacity: 0;
          transition: all 1.1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .milkinside-emblem-stage.locked {
          transform: perspective(900px) rotateX(0deg) rotateY(0deg) scale(1);
          opacity: 1;
        }

        .milkinside-prismatic-rim {
          width: 100%;
          height: 100%;
          border-radius: 38px;
          padding: 3.5px;
          background: conic-gradient(from 0deg, #f43f5e, #fb7185, #8b5cf6, #38bdf8, #10b981, #bef226, #f43f5e);
          box-shadow: 
            0 0 55px rgba(244, 63, 94, 0.45),
            0 20px 45px rgba(0, 0, 0, 0.85);
          animation: rotateRim 5s linear infinite;
        }
        @keyframes rotateRim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .prismatic-inner-box {
          width: 100%;
          height: 100%;
          border-radius: 34px;
          background: linear-gradient(135deg, #18223d 0%, #0b1224 60%, #040813 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.3);
        }

        .milkinside-heartbeat {
          animation: milkinsidePulse 1.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
          transform-origin: 50% 50%;
        }
        @keyframes milkinsidePulse {
          0% { transform: scale(1); }
          14% { transform: scale(1.14); }
          28% { transform: scale(1); }
          42% { transform: scale(1.08); }
          70% { transform: scale(1); }
        }

        .splash-svg-ring {
          animation: splashRingRotate 7s linear infinite;
          transform-origin: 50% 50%;
        }
        @keyframes splashRingRotate {
          0% { transform: rotate(-28deg); }
          100% { transform: rotate(332deg); }
        }

        .jewel-pulse-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(244, 63, 94, 0.35);
          pointer-events: none;
        }
        .ring-a {
          width: 75px;
          height: 75px;
          animation: jewelRing 2s infinite ease-out;
        }
        .ring-b {
          width: 110px;
          height: 110px;
          animation: jewelRing 2s infinite 0.7s ease-out;
        }
        @keyframes jewelRing {
          0% { transform: scale(0.6); opacity: 0.85; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .milkinside-orbit-star {
          position: absolute;
          top: 8px;
          right: 8px;
          animation: starFloat 2.5s infinite alternate ease-in-out;
          z-index: 10;
        }
        @keyframes starFloat {
          0% { transform: scale(0.9) rotate(0deg); filter: drop-shadow(0 0 6px #bef226); }
          100% { transform: scale(1.3) rotate(60deg); filter: drop-shadow(0 0 16px #bef226); }
        }

        .milkinside-text-container {
          opacity: 0;
          transform: translateY(26px);
          transition: all 0.85s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .milkinside-text-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .milkinside-initiative-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(244, 63, 94, 0.14);
          border: 1px solid rgba(244, 63, 94, 0.35);
          color: #fb7185;
          padding: 0.35rem 1rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 0.85rem;
        }

        .milkinside-main-title {
          font-size: 3.8rem;
          font-weight: 800;
          font-family: var(--font-display, "Sora", sans-serif);
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 0.5rem;
          position: relative;
          display: inline-block;
          color: #ffffff;
        }

        .milkinside-ai-shimmer {
          background: linear-gradient(120deg, #f43f5e 0%, #fb7185 25%, #38bdf8 50%, #10b981 75%, #bef226 100%);
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 3.5s linear infinite;
        }
        @keyframes textShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 250% center; }
        }

        .milkinside-hindi-title {
          font-size: 1.7rem;
          font-weight: 700;
          color: #e2e8f0;
          font-family: var(--font-hindi, "Noto Sans Devanagari", sans-serif);
          margin-bottom: 0.6rem;
          letter-spacing: 0.01em;
        }

        .milkinside-desc {
          font-size: 1.05rem;
          color: #94a3b8;
          font-weight: 500;
          max-width: 580px;
          margin: 0 auto 1.8rem;
          line-height: 1.6;
        }

        .milkinside-progress-track {
          width: 180px;
          height: 4.5px;
          background: rgba(255, 255, 255, 0.14);
          border-radius: 9999px;
          overflow: hidden;
        }
        .milkinside-progress-bar {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #f43f5e, #38bdf8, #10b981);
          animation: progressRun 3.8s ease-out forwards;
        }
        @keyframes progressRun {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .milkinside-enter-btn {
          background: rgba(255, 255, 255, 0.09);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          padding: 0.55rem 1.3rem;
          border-radius: 9999px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          backdrop-filter: blur(12px);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .milkinside-enter-btn:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: rgba(255, 255, 255, 0.45);
          transform: translateY(-2px);
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
}
