import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  ExternalLink,
  Brain,
  MessageSquare,
  Activity,
  Heart,
  User,
  PhoneCall,
  Settings,
  Wifi,
  Stethoscope,
  MapPin,
  CheckCircle2,
  Music,
  Languages,
  Film,
  Shield,
  Clock,
  Send,
  Droplet,
  Radio
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import AiSahayakLogo from './AiSahayakLogo';
import { INTRO_CHAPTERS, getChapterLocalized, getSpeechVoiceLang } from '../../data/introChaptersData';

// Maintain backwards compatibility for any external import of VIDEO_CHAPTERS
export const VIDEO_CHAPTERS = INTRO_CHAPTERS;

export default function IntroVideoModal({
  isOpen,
  onClose,
  language = 'hi',
  onNavigateRole,
  onTriggerAction
}) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(0); // 0 to 100
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [slideDirection, setSlideDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioCtxRef = useRef(null);
  const chapter = INTRO_CHAPTERS[currentChapterIdx] || INTRO_CHAPTERS[0];
  const activeLoc = getChapterLocalized(chapter, language);

  // Play exact C5 - E5 - G5 - C6 celestial harmonic chord progression
  const playHarmonicChime = () => {
    if (!chimeEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.warn('Audio chime warning:', e);
    }
  };

  // Trigger celestial chord chime on initial modal open
  useEffect(() => {
    if (isOpen) {
      playHarmonicChime();
    }
  }, [isOpen]);

  const transitionToChapter = (newIdx, dir = 'next') => {
    setSlideDirection(dir);
    setIsTransitioning(true);
    setCurrentChapterIdx(newIdx);
    setPlaybackProgress(0);
    playHarmonicChime();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 450);
  };

  // Handle chapter progression & voiceover
  useEffect(() => {
    if (!isOpen) return;

    // Speak chapter narration
    let timerVoice = null;
    if (voiceEnabled && activeLoc?.narration) {
      const voiceLang = getSpeechVoiceLang(language);
      speechService.stop();

      // Gentle pause before narration so opening chord is heard cleanly
      timerVoice = setTimeout(() => {
        speechService.speak(activeLoc.narration, voiceLang);
      }, 350);
    }

    if (!isPlaying) return;

    const chapterDurationMs = (chapter.duration || 9) * 1000;
    const intervalMs = 100;
    const stepIncrement = (intervalMs / chapterDurationMs) * 100;

    const timer = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 100) {
          if (currentChapterIdx < INTRO_CHAPTERS.length - 1) {
            transitionToChapter(currentChapterIdx + 1, 'next');
          } else {
            // End of complete tour - resolution chime
            playHarmonicChime();
            setIsPlaying(false);
          }
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      if (timerVoice) clearTimeout(timerVoice);
      speechService.stop();
    };
  }, [isOpen, currentChapterIdx, isPlaying, voiceEnabled, chimeEnabled, language]);

  if (!isOpen) return null;

  const handleNextChapter = () => {
    if (currentChapterIdx < INTRO_CHAPTERS.length - 1) {
      transitionToChapter(currentChapterIdx + 1, 'next');
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      transitionToChapter(currentChapterIdx - 1, 'prev');
    }
  };

  const handleRestart = () => {
    transitionToChapter(0, 'prev');
    setIsPlaying(true);
  };

  const handleActionClick = () => {
    speechService.stop();
    if (chapter.targetAction === 'restart_tour') {
      handleRestart();
      return;
    }
    onClose();
    if (chapter.targetRole && onNavigateRole) {
      onNavigateRole(chapter.targetRole);
    } else if (chapter.targetAction && onTriggerAction) {
      onTriggerAction(chapter.targetAction);
    }
  };

  // Compute live elapsed timecode
  const elapsedSeconds = INTRO_CHAPTERS.slice(0, currentChapterIdx).reduce((acc, c) => acc + (c.duration || 9), 0) +
    Math.floor((playbackProgress / 100) * (chapter.duration || 9));
  const totalSeconds = INTRO_CHAPTERS.reduce((acc, c) => acc + (c.duration || 9), 0);
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(5, 15, 20, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        background: '#091512',
        border: '2px solid rgba(190, 242, 38, 0.35)',
        borderRadius: '32px',
        width: '100%',
        maxWidth: '960px',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), 0 0 40px rgba(190, 242, 38, 0.15)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '0.9rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(5, 30, 25, 0.85)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#bef226',
              boxShadow: '0 0 14px #bef226',
              animation: 'pulseGlow 1.5s infinite'
            }} />
            <div>
              <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#ffffff' }}>
                🎬 ManasMitra AI • {activeLoc.title}
              </span>
              <span style={{
                marginLeft: '0.6rem',
                fontSize: '0.74rem',
                background: 'rgba(190, 242, 38, 0.2)',
                color: '#bef226',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: 800,
                border: '1px solid rgba(190, 242, 38, 0.35)'
              }}>
                {activeLoc.badge}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Celestial Chime Toggle */}
            <button
              onClick={() => {
                setChimeEnabled(!chimeEnabled);
                if (!chimeEnabled) playHarmonicChime();
              }}
              style={{
                background: chimeEnabled ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: chimeEnabled ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                color: chimeEnabled ? '#38bdf8' : '#94a3b8',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Toggle Celestial Chord Chimes (C5-E5-G5-C6)"
            >
              <Music size={13} />
              <span>{chimeEnabled ? 'धुन चालू' : 'धुन बंद'}</span>
            </button>

            {/* Voiceover Toggle */}
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled) speechService.stop();
              }}
              style={{
                background: voiceEnabled ? 'rgba(190, 242, 38, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: voiceEnabled ? '1px solid #bef226' : '1px solid rgba(255, 255, 255, 0.15)',
                color: voiceEnabled ? '#bef226' : '#94a3b8',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Toggle Spoken Voice Narration"
            >
              {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              <span>{voiceEnabled ? 'आवाज़ सक्रिय' : 'मौन'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                speechService.stop();
                onClose();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="Close Tour"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Cinema Viewport Top Stream Banner: REC, Timecode & Equalizer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 1.6rem',
          background: 'rgba(2, 14, 10, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '0.74rem',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#ef4444',
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px #ef4444',
                animation: 'pulseGlow 1s infinite'
              }} />
              REC
            </span>
            <span style={{ color: '#cbd5e1', fontFamily: 'monospace', fontWeight: 700 }}>
              {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '2px 7px',
              borderRadius: '4px',
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#e2e8f0'
            }}>
              1080p 60fps HD AI Stream
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Live Audio Frequency Spectrum */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '14px' }}>
              {[35, 70, 45, 90, 60, 80, 50, 95].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: `${isPlaying ? h : 20}%`,
                    background: isPlaying ? '#bef226' : '#64748b',
                    borderRadius: '2px',
                    animation: isPlaying ? `eqBarPulse 0.6s infinite alternate ${i * 0.08}s` : 'none',
                    transition: 'height 0.2s'
                  }}
                />
              ))}
            </div>
            <span style={{ color: '#bef226', fontWeight: 800 }}>
              CH {currentChapterIdx + 1}/{INTRO_CHAPTERS.length}
            </span>
          </div>
        </div>

        {/* 16:9 Video Canvas Viewport with Sliding Cinematic Transitions */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          minHeight: '380px',
          maxHeight: '460px',
          background: 'radial-gradient(ellipse at center, #07352a 0%, #02110c 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          overflow: 'hidden'
        }}>
          {/* Ambient Glow Aura */}
          <div style={{
            position: 'absolute',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: chapter.highlightColor,
            filter: 'blur(130px)',
            opacity: 0.18,
            pointerEvents: 'none',
            transition: 'background 0.5s ease'
          }} />

          {/* Dynamic Scene Visualizer Container with Cinematic Slide Animation */}
          <div
            key={`${chapter.id}-${language}`}
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: '740px',
              width: '100%',
              animation: isTransitioning
                ? (slideDirection === 'next' ? 'slideOutLeft 0.4s ease forwards' : 'slideOutRight 0.4s ease forwards')
                : (slideDirection === 'next' ? 'slideInRight 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'slideInLeft 0.45s cubic-bezier(0.16, 1, 0.3, 1)')
            }}
          >
            {/* Custom Scene Stage with Specialized Micro-Animations for all 12 Features */}
            <div style={{
              height: '110px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.8rem'
            }}>
              {/* 1. Overview: Orbiting Digital Globe & Mission Beacons */}
              {chapter.visualKey === 'overview' && (
                <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px dashed rgba(190, 242, 38, 0.4)',
                    animation: 'spinSlow 12s linear infinite'
                  }} />
                  <div style={{
                    position: 'absolute',
                    inset: '12px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    animation: 'spinReverse 8s linear infinite'
                  }} />
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #bef226 0%, #052e26 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px #bef22688'
                  }}>
                    <Languages size={32} color="#ffffff" />
                  </div>
                </div>
              )}

              {/* 2. Elder Mode: Flipping Assam Jaapi Card & Hydration Droplet */}
              {chapter.visualKey === 'elder_mode' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '2px solid #10b981',
                    borderRadius: '20px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    animation: 'floatSlow 2.5s ease-in-out infinite',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)'
                  }}>
                    <span style={{ fontSize: '2rem' }}>👒</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>অসম জাপি / Jaapi Match</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Cultural Memory Neuro-Game</div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '2px solid #38bdf8',
                    borderRadius: '50%',
                    width: '54px',
                    height: '54px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulseGlow 1.8s infinite'
                  }}>
                    <Droplet size={26} color="#38bdf8" />
                  </div>
                </div>
              )}

              {/* 3. Caregiver: Animated Emotion Radar & Adherence Curve */}
              {chapter.visualKey === 'family_caregiver' && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '20px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
                }}>
                  <Activity size={36} color="#38bdf8" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>দैनिक মনৰ অৱস্থা / Daily Emotion Telemetry</div>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '24px', marginTop: '4px' }}>
                      {[40, 70, 55, 90, 85, 95].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '8px',
                            height: `${h}%`,
                            background: '#38bdf8',
                            borderRadius: '3px',
                            animation: `eqBarPulse 0.6s infinite alternate ${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <CheckCircle2 size={24} color="#10b981" />
                </div>
              )}

              {/* 4. Healthcare Portal: Brain MRI Laser Scanner & Cognitive MMSE Meter */}
              {chapter.visualKey === 'healthcare_portal' && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.12)',
                  border: '1.5px solid #f43f5e',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 30px rgba(244, 63, 94, 0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: '#f43f5e',
                    boxShadow: '0 0 15px #f43f5e',
                    animation: 'scanLaser 2s linear infinite'
                  }} />
                  <Brain size={40} color="#f43f5e" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f43f5e' }}>Brain MRI AI Risk Stratification</div>
                    <div style={{ fontSize: '0.75rem', color: '#e2e8f0', display: 'flex', gap: '0.5rem', marginTop: '3px' }}>
                      <span style={{ background: 'rgba(244, 63, 94, 0.3)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                        MMSE: 28/30
                      </span>
                      <span style={{ color: '#86efac', fontWeight: 700 }}>Mild Cognitive Risk</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Online Status: Emerald Beacon Signal & Local Cache DB Sync */}
              {chapter.visualKey === 'online_status' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '2px solid #22c55e',
                    borderRadius: '20px',
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 0 25px rgba(34, 197, 94, 0.35)'
                  }}>
                    <Wifi size={32} color="#22c55e" style={{ animation: 'pulseGlow 1.5s infinite' }} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#22c55e' }}>অটো-ছিংক / Offline Encrypted Cache</div>
                      <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>IndexedDB Encrypted Local Storage</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. Profile & SOS Settings: Elder Identity & ASHA Worker Link */}
              {chapter.visualKey === 'profile_sos' && (
                <div style={{
                  background: 'rgba(167, 139, 250, 0.15)',
                  border: '2px solid #a78bfa',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 25px rgba(167, 139, 250, 0.35)'
                }}>
                  <User size={36} color="#a78bfa" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a78bfa' }}>बुजुर्ग पहचान व आशा कार्यकर्ता लिंक</div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Primary SOS Contact & Medical History</div>
                  </div>
                  <Shield size={24} color="#bef226" />
                </div>
              )}

              {/* 7. Video Tour: Harmonic Frequency Sine Waves & Audio Visualizer */}
              {chapter.visualKey === 'video_tour' && (
                <div style={{
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '2px solid #fbbf24',
                  borderRadius: '20px',
                  padding: '10px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'
                }}>
                  <Film size={34} color="#fbbf24" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>C5-E5-G5-C6 Celestial Harmonic Chime</div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                      {['523Hz', '659Hz', '784Hz', '1046Hz'].map((f, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.68rem',
                            background: 'rgba(251, 191, 36, 0.25)',
                            color: '#ffffff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 8. AI Sahayak: Dual Voice Speech Avatar with Audio Waveform */}
              {chapter.visualKey === 'ai_sahayak' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '24px',
                    background: 'rgba(190, 242, 38, 0.15)',
                    border: '2px solid #bef226',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(190, 242, 38, 0.4)'
                  }}>
                    <AiSahayakLogo size="md" isSpeaking={true} />
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '8px 14px',
                    textAlign: 'left',
                    border: '1px solid rgba(190, 242, 38, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#bef226' }}>24x7 Multilingual AI Sahayak</div>
                    <div style={{ fontSize: '0.72rem', color: '#e2e8f0' }}>👩 Trisha (Female) & 👨 Rahul (Male) Voices</div>
                  </div>
                </div>
              )}

              {/* 9. Doctor Directory: Stethoscope with Clock Reminder & State Badges */}
              {chapter.visualKey === 'doctor_medindia' && (
                <div style={{
                  background: 'rgba(14, 165, 233, 0.15)',
                  border: '2px solid #0ea5e9',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 30px rgba(14, 165, 233, 0.35)'
                }}>
                  <Stethoscope size={36} color="#0ea5e9" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0ea5e9' }}>Medindia Verified Neurologists</div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                      <Clock size={13} color="#bef226" />
                      <span>Calendar Appointment Reminder Scheduling</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 10. Family Message: SMS/WhatsApp Transmission Simulation */}
              {chapter.visualKey === 'family_message' && (
                <div style={{
                  background: 'rgba(251, 146, 60, 0.15)',
                  border: '2px solid #fb923c',
                  borderRadius: '20px',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 30px rgba(251, 146, 60, 0.35)'
                }}>
                  <MessageSquare size={34} color="#fb923c" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fb923c' }}>সরাসরি পারিবারিক বার্তা / Cellular SMS</div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Voice-to-Text Speech Dictation & Instant Dispatch</div>
                  </div>
                  <Send size={20} color="#bef226" />
                </div>
              )}

              {/* 11. Emergency SOS: Crimson Radar Wave & GPS Location Pin */}
              {chapter.visualKey === 'emergency_sos' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '2px solid #ef4444',
                  borderRadius: '22px',
                  padding: '10px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  animation: 'pulseGlow 1.2s infinite',
                  boxShadow: '0 0 35px rgba(239, 68, 68, 0.5)'
                }}>
                  <PhoneCall size={36} color="#ef4444" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#f87171' }}>🚨 Emergency Lifeline (SOS Call)</div>
                    <div style={{ fontSize: '0.74rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '2px' }}>
                      <MapPin size={14} color="#ef4444" />
                      <span>Simulated Missed Call + Real-time GPS Location SMS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 12. Multilingual: 11 Languages Cloud with Flag Badges */}
              {chapter.visualKey === 'multilingual' && (
                <div style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '2px solid #34d399',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 0 30px rgba(52, 211, 153, 0.35)'
                }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Languages size={18} />
                    <span>১১ अखिल भारतीय व उत्तर-पूर्वी भाषाएं (11 Languages)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['🇮🇳 हिन्दी', 'অসমীয়া', 'বাংলা', 'Boro', 'Khasi', 'Garo', 'মৈতৈলোন্', 'Mizo', 'English', 'Nagamese', 'Kokborok'].map((l, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.68rem',
                          background: 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          padding: '2px 7px',
                          borderRadius: '9999px',
                          fontWeight: 700
                        }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Heading (Localized automatically) */}
            <h3 style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 0.55rem 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.6)'
            }}>
              {activeLoc.title}
            </h3>

            {/* Subtitle Narration Script Banner (Localized automatically) */}
            <p style={{
              fontSize: '0.96rem',
              lineHeight: '1.55',
              color: '#e2e8f0',
              margin: '0 auto 1.2rem auto',
              background: 'rgba(0, 0, 0, 0.58)',
              padding: '0.75rem 1.3rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              maxWidth: '680px'
            }}>
              {activeLoc.narration}
            </p>

            {/* Quick Interactive Jump Trigger */}
            <button
              onClick={handleActionClick}
              style={{
                background: chapter.highlightColor,
                color: '#052e26',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.6rem 1.4rem',
                fontSize: '0.9rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: `0 4px 20px ${chapter.highlightColor}55`,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              title="Jump directly to this module"
            >
              <span>{activeLoc.actionText}</span>
              <ExternalLink size={15} />
            </button>
          </div>
        </div>

        {/* Video Scrubber & Timeline Bar */}
        <div style={{
          padding: '0.75rem 1.75rem 0.6rem',
          background: 'rgba(3, 17, 13, 0.95)'
        }}>
          {/* Chapter Scrubber Progress Dots (12 Dots) */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.65rem' }}>
            {INTRO_CHAPTERS.map((ch, idx) => {
              const isPast = idx < currentChapterIdx;
              const isCurrent = idx === currentChapterIdx;
              const chLoc = getChapterLocalized(ch, language);
              return (
                <div
                  key={ch.id}
                  onClick={() => transitionToChapter(idx, idx > currentChapterIdx ? 'next' : 'prev')}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '9999px',
                    background: isPast
                      ? '#bef226'
                      : isCurrent
                      ? '#10b981'
                      : 'rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.25s'
                  }}
                  title={chLoc.title}
                >
                  {isCurrent && (
                    <div style={{
                      width: `${playbackProgress}%`,
                      height: '100%',
                      background: '#bef226',
                      transition: 'width 0.1s linear'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Playback Controls & Chapter Counter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '0.4rem'
          }}>
            {/* Left Controls: Prev, Play/Pause, Next, Replay */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <button
                onClick={handlePrevChapter}
                disabled={currentChapterIdx === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: currentChapterIdx === 0 ? '#475569' : '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: currentChapterIdx === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Previous Feature"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: '#bef226',
                  color: '#052e26',
                  border: 'none',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  boxShadow: '0 0 16px rgba(190, 242, 38, 0.45)'
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={handleNextChapter}
                disabled={currentChapterIdx === INTRO_CHAPTERS.length - 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: currentChapterIdx === INTRO_CHAPTERS.length - 1 ? '#475569' : '#ffffff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  cursor: currentChapterIdx === INTRO_CHAPTERS.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Next Feature"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={handleRestart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.78rem'
                }}
                title="Restart Video Tour"
              >
                <RotateCcw size={14} />
                <span>पुनः शुरू करें</span>
              </button>
            </div>

            {/* Chapter counter & active title */}
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#bef226' }}>{currentChapterIdx + 1} / {INTRO_CHAPTERS.length}</span>
              <span style={{ color: '#64748b' }}>•</span>
              <span style={{ color: '#e2e8f0' }}>{activeLoc.badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Cinematic Keyframes */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(45px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-45px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(-45px) scale(0.96); }
        }
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to { opacity: 0; transform: translateX(45px) scale(0.96); }
        }
        @keyframes scanLaser {
          0% { left: 0%; }
          50% { left: 100%; }
          100% { left: 0%; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
