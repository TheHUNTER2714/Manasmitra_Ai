import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Sparkles, Wind, X, ShieldCheck } from 'lucide-react';
import { InterventionEngine } from '../../services/interventionEngine';

export default function IndividualizedInterventionModal({
  isOpen,
  onClose,
  elderData,
  onLaunchGame,
  language = 'hi'
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'music' | 'relax'
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioController, setAudioController] = useState(null);
  const [breathPhase, setBreathPhase] = useState('Inhale (सांस लें)');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Compute individualized intervention
  const intervention = InterventionEngine.analyzeTrendsAndPrescribe({
    currentMood: elderData?.todayMood || '😊',
    recentMoodHistory: elderData?.moodHistory || [],
    medications: elderData?.medications || [],
    routineChecklist: elderData?.dailyRoutine || [],
    cognitiveScore: elderData?.cognitiveIndex || 84
  });

  // Handle generative music playback
  const toggleMusic = () => {
    if (isPlayingMusic && audioController) {
      audioController.stop();
      setIsPlayingMusic(false);
      setAudioController(null);
    } else {
      const controller = InterventionEngine.playGenerativeRaga(
        intervention.musicTherapy.audioTrackId,
        () => setIsPlayingMusic(false)
      );
      setAudioController(controller);
      setIsPlayingMusic(true);
    }
  };

  // Stop music if modal closes
  useEffect(() => {
    return () => {
      if (audioController) {
        audioController.stop();
      }
    };
  }, [audioController]);

  // Guided breathing cycle logic (4-7-8 Pranayama)
  useEffect(() => {
    let timer;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase.startsWith('Inhale')) {
                return 'Hold (सांस रोकें)';
              } else if (currentPhase.startsWith('Hold')) {
                return 'Exhale (सांस छोड़ें)';
              } else {
                return 'Inhale (सांस लें)';
              }
            });
            return breathPhase.startsWith('Inhale') ? 7 : breathPhase.startsWith('Hold') ? 8 : 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '720px',
        borderRadius: '28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#bef226',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {language === 'hi' ? 'व्यक्तिगत स्वास्थ्य हस्तक्षेप (Individualized Plan)' : 'Individualized Care Intervention'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                Based on continuous emotion trend & routine pattern analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          padding: '0.5rem 1.5rem 0'
        }}>
          {[
            { id: 'overview', label: language === 'hi' ? 'विश्लेषण व सिफारिश' : 'Trend Analysis' },
            { id: 'music', label: language === 'hi' ? 'संगीत चिकित्सा (Music)' : 'Music Therapy' },
            { id: 'relax', label: language === 'hi' ? 'विश्राम प्राणायाम' : 'Relaxing Activity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                border: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                borderBottom: activeTab === tab.id ? '3px solid #bef226' : '3px solid transparent',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: OVERVIEW & TREND ANALYSIS */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Telemetry Pill Matrix */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>मनोदशा स्थिति (Affective Status)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{elderData?.todayMood || '😊'}</span>
                    <span style={{ fontSize: '0.95rem' }}>{elderData?.todayMoodText || 'प्रसन्न'}</span>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>दैनिक दिनचर्या (Routine Pattern)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a', marginTop: '0.35rem' }}>
                    {intervention.routineAdherence}% <span style={{ fontSize: '0.85rem', color: '#64748b' }}>अनुकूलन</span>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem'
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>दवाई अनुपालन (Medication Adherence)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7', marginTop: '0.35rem' }}>
                    {intervention.medAdherence}% <span style={{ fontSize: '0.85rem', color: '#64748b' }}>पूर्ण</span>
                  </div>
                </div>
              </div>

              {/* AI Clinical Assessment Callout */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <ShieldCheck size={26} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#14532d', fontSize: '1rem' }}>
                    AI क्लिनिकल विश्लेषण (Clinical Assessment)
                  </div>
                  <p style={{ margin: '0.4rem 0 0', color: '#166534', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {language === 'hi' ? intervention.clinicalRationaleHi : intervention.clinicalRationale}
                  </p>
                </div>
              </div>

              {/* 3 Individualized Prescriptions Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* 1. Music Therapy */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #bef226',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '2rem' }}>{intervention.musicTherapy.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginTop: '0.5rem' }}>
                      {intervention.musicTherapy.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {intervention.musicTherapy.tempo}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('music')}
                    style={{
                      background: '#bef226',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.6rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    सुनें (Listen Now) →
                  </button>
                </div>

                {/* 2. Cognitive Game */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #cbd5e1',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '2rem' }}>{intervention.recommendedGame.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginTop: '0.5rem' }}>
                      {intervention.recommendedGame.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                      Level {intervention.recommendedGame.level} • {intervention.recommendedGame.reason}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      if (onLaunchGame) onLaunchGame(intervention.recommendedGame.id);
                    }}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.6rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    खेलें (Play Game) →
                  </button>
                </div>

                {/* 3. Relaxing Activity */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #cbd5e1',
                  borderRadius: '18px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div>
                    <span style={{ fontSize: '2rem' }}>{intervention.relaxingActivity.icon}</span>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a', marginTop: '0.5rem' }}>
                      {intervention.relaxingActivity.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                      समय: {intervention.relaxingActivity.duration}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('relax')}
                    style={{
                      background: '#f1f5f9',
                      color: '#0f172a',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '0.6rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    अभ्यास करें (Practice) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC THERAPY PLAYER */}
          {activeTab === 'music' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: isPlayingMusic ? 'radial-gradient(circle, #bef226 0%, #a3e635 100%)' : '#f1f5f9',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isPlayingMusic ? '0 0 35px rgba(190, 242, 38, 0.6)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <Music size={52} color={isPlayingMusic ? '#000000' : '#64748b'} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                {intervention.musicTherapy.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                {intervention.musicTherapy.description}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#475569',
                marginBottom: '2rem'
              }}>
                <span>{intervention.musicTherapy.tempo}</span>
                <span>•</span>
                <span>{intervention.musicTherapy.frequency}</span>
                <span>•</span>
                <span style={{ color: '#16a34a' }}>100% ऑफलाइन संश्लेषित (Offline Generated)</span>
              </div>

              <div>
                <button
                  onClick={toggleMusic}
                  style={{
                    background: isPlayingMusic ? '#dc2626' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '1rem 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {isPlayingMusic ? <Pause size={22} /> : <Play size={22} />}
                  <span>{isPlayingMusic ? 'संगीत रोकें (Pause Therapy)' : 'संगीत प्रारंभ करें (Play Soothing Raga)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: RELAXING ACTIVITY (BREATHING COACH) */}
          {activeTab === 'relax' && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: isBreathingActive
                  ? breathPhase.startsWith('Inhale')
                    ? 'radial-gradient(circle, #e0f2fe 0%, #38bdf8 100%)'
                    : breathPhase.startsWith('Hold')
                    ? 'radial-gradient(circle, #fef3c7 0%, #f59e0b 100%)'
                    : 'radial-gradient(circle, #dcfce7 0%, #22c55e 100%)'
                  : '#f1f5f9',
                margin: '0 auto 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isBreathingActive ? '0 15px 35px rgba(56, 189, 248, 0.3)' : 'none',
                transform: isBreathingActive && breathPhase.startsWith('Inhale') ? 'scale(1.15)' : 'scale(1)',
                transition: 'transform 4s ease-in-out, background 0.8s ease'
              }}>
                <Wind size={36} color="#0f172a" />
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
                  {isBreathingActive ? breathSeconds : '4-7-8'}
                </div>
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                {isBreathingActive ? breathPhase : intervention.relaxingActivity.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                {language === 'hi'
                  ? 'धीमी और गहरी सांस लेने से हृदय गति शांत होती है और मस्तिष्क को शांति मिलती है।'
                  : 'Gentle rhythmic breathing stimulates the vagus nerve and restores neural calm.'}
              </p>

              <div>
                <button
                  onClick={() => {
                    setIsBreathingActive(!isBreathingActive);
                    setBreathPhase('Inhale (सांस लें)');
                    setBreathSeconds(4);
                  }}
                  style={{
                    background: isBreathingActive ? '#dc2626' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.9rem 2.2rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {isBreathingActive ? 'रोकें (Stop)' : 'प्राणायाम शुरू करें (Start Breathing Cycle)'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
