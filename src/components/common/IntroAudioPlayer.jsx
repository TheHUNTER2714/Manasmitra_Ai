import React, { useState, useRef, useEffect } from 'react';
import { Play, Square, Sparkles, Film, ChevronDown, ChevronUp, Music } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { INTRO_CHAPTERS, getChapterLocalized, getSpeechVoiceLang } from '../../data/introChaptersData';

export const PLATFORM_FEATURE_SEQUENCE = INTRO_CHAPTERS;

/**
 * IntroAudioPlayer - Celestial Harmonic Chime & Spoken Narrator
 * Enhanced with 12 sequential feature badges and responsive animation.
 */
export default function IntroAudioPlayer({
  language = 'hi',
  onOpenTour,
  className = '',
  style = {}
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSequence, setShowSequence] = useState(false);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
  const audioCtxRef = useRef(null);
  const sequenceTimerRef = useRef(null);

  // Play exact C5 - E5 - G5 - C6 celestial chord progression
  const playHarmonicChime = (ctx) => {
    if (!ctx) return;
    try {
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
      console.warn('Audio chime playback warning:', e);
    }
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    if (sequenceTimerRef.current) {
      clearInterval(sequenceTimerRef.current);
    }
  };

  const playVoiceAndAudio = () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    if (typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
      }
    } catch {
      // Browser audio context fallback
    }

    setIsPlaying(true);
    setActiveFeatureIdx(0);

    // 1. Play Opening Celestial Chimes
    if (audioCtxRef.current) {
      playHarmonicChime(audioCtxRef.current);
    }

    // 2. Localized Narrator Scripts for Selected Language
    const narratorScripts = {
      hi: 'मानस मित्र एआई में आपका स्वागत है। उत्तर-पूर्व भारत के बुजुर्गों और डिमेंशिया देखभाल के लिए यह एक समर्पित डिजिटल थैराप्यूटिक मंच है। ' +
          'इसमें अवलोकन, बुजुर्ग मोड, परिवार पोर्टल, रोगी स्वास्थ्य विश्लेषण, ऑनलाइन सिंकिंग, प्रोफाइल व आपातकालीन एसओएस, ' +
          'सचित्र वीडियो टूर, चौबीस घंटे एआई सहायक, मेडइंडिया सत्यापित डॉक्टर, परिवार संदेश, और ग्यारह देशीय क्षेत्रीय भाषाएं उपलब्ध हैं। ' +
          'मानस मित्र: मस्तिष्कों की सुरक्षा, परिवारों का सजीव जुड़ाव।',
      en: 'Welcome to ManasMitra AI, an adaptive cognitive companion designed for seniors across the North-Eastern Region. ' +
          'Featuring an interactive overview, elder cognitive mode with Assam Jaapi, caregiver emotion tracking, patient health clinical analysis, ' +
          'offline-first online resilience, emergency SOS with live GPS, 24x7 dual-voice AI Sahayak, verified Medindia specialists, and 11 native languages. ' +
          'ManasMitra AI: Protecting minds, connecting families.',
      as: 'মানস মিত্ৰ এআইলৈ স্বাগতম। উত্তৰ-পূব ভাৰতৰ জ্যেষ্ঠ নাগৰিক আৰু ডিমেনচিয়া আক্ৰান্তসকলৰ বাবে ই এক বিশেষ ডিজিটেল চিকিৎসা মঞ্চ। ' +
          'ইয়াৰ জৰিয়তে জ্যেষ্ঠজনে সহজে খেলিব পাৰে, পৰিয়ালে যত্ন ল’ব পাৰে আৰু চিকিৎসকে নিৰীক্ষণ কৰিব পাৰে।',
      bn: 'মানসমিত্র এআই-তে স্বাগতম। উত্তর-পূর্ব ভারতের প্রবীণ ও ডিমেনশিয়া আক্রান্তদের জন্য একটি বিশেষ ডিজিটাল থেরাপিউটিক প্ল্যাটফর্ম। ' +
          'এখানে রয়েছে জ্ঞানীয় স্মৃতি খেলা, পারিবারিক পর্যবেক্ষণ, এআই সহায়ক এবং জরুরি এসওএস।',
      brx: 'मानस मित्र AI याव बरायबाय। सा-सानजा भारतनि बैसो गोराफोरनि थाखाय बेयो मोनसे गोनांथार सावस्रि मन्च।',
      kha: 'Pdiang sngewbha sha ManasMitra AI. Ka lad ai jingiada ia ki kpa bad kmie ha North East India.',
      grt: 'ManasMitra AI-ona rimnapbeani. Gitcham manderang aro gisik gimaatenggiparangna miksonggipa digital platform ong·a.',
      mni: 'মানসমিত্র AI দা তরাম্না ওকচরি। অৱাং-নোংপোক ভারতকী অহন মীয়ামগীদমক নিংশিংবা অমসুং হকশেল ঙাকপগী প্লেতফোর্মনি।',
      lus: 'ManasMitra AI-ah kan lo lawm a che. North East India-a pitar leh putar te tana digital enkawlna hmasawn a ni.',
      naga: 'ManasMitra AI te swagat ase. North East bura manu khan nimite digital medicine companion platform ase.',
      trp: 'ManasMitra AI-o kaham hwnwi lamsohoro. North East Tripura-ni bura-burhi dementia hamkrani digital platform.'
    };

    const script = narratorScripts[language] || narratorScripts['en'];
    const voiceGender = speechService.getVoiceGender ? speechService.getVoiceGender() : 'female';
    const langCode = getSpeechVoiceLang(language);

    // Step sequentially through the 12 features during narration
    const stepDuration = 1800; // ms per highlight
    if (sequenceTimerRef.current) clearInterval(sequenceTimerRef.current);
    sequenceTimerRef.current = setInterval(() => {
      setActiveFeatureIdx((prev) => (prev + 1) % INTRO_CHAPTERS.length);
    }, stepDuration);

    // Delay speech slightly so opening chime resonates cleanly
    setTimeout(() => {
      speechService.speak(
        script,
        langCode,
        () => {
          // 3. Play Closing Chime Resolution
          if (audioCtxRef.current) {
            playHarmonicChime(audioCtxRef.current);
          }
          setIsPlaying(false);
          if (sequenceTimerRef.current) clearInterval(sequenceTimerRef.current);
        },
        voiceGender
      );
    }, 400);
  };

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  const activeChapter = INTRO_CHAPTERS[activeFeatureIdx] || INTRO_CHAPTERS[0];
  const activeLoc = getChapterLocalized(activeChapter, language);

  const getAudioButtonLabel = () => {
    if (isPlaying) {
      return language === 'hi' ? 'रोकें (Pause Narration)' : 'Pause Narration';
    }
    return language === 'hi' ? '🎧 ऑडियो सुनें (Intro)' : '🎧 Audio Intro';
  };

  const getSeqToggleLabel = () => {
    return language === 'hi' ? '१२ फीचर्स क्रम' : '12 Features Sequence';
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', ...style }} className={className}>
      {/* Primary Audio Player Trigger Button */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button
          onClick={playVoiceAndAudio}
          className="intro-audio-player-btn"
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, #052e26 0%, #064e3b 100%)'
              : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
            color: '#ffffff',
            padding: '10px 22px',
            borderRadius: '9999px',
            fontSize: '0.92rem',
            fontWeight: 800,
            border: isPlaying ? '2px solid #bef226' : '2px solid transparent',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: isPlaying ? '0 0 20px rgba(190, 242, 38, 0.45)' : '0 4px 16px rgba(244, 63, 94, 0.35)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          title="Play 12-Feature Audio Narration & Harmonic Chimes"
        >
          {isPlaying ? (
            <>
              <Square size={16} fill="#bef226" color="#bef226" />
              <span>{getAudioButtonLabel()}</span>
              <div style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: '14px', marginLeft: '4px' }}>
                <div style={{ width: '3px', height: '100%', background: '#bef226', borderRadius: '1px', animation: 'eqBarPulse 0.4s infinite alternate' }} />
                <div style={{ width: '3px', height: '60%', background: '#bef226', borderRadius: '1px', animation: 'eqBarPulse 0.5s infinite alternate 0.1s' }} />
                <div style={{ width: '3px', height: '80%', background: '#bef226', borderRadius: '1px', animation: 'eqBarPulse 0.45s infinite alternate 0.2s' }} />
              </div>
            </>
          ) : (
            <>
              <Play size={16} fill="#ffffff" />
              <span>{getAudioButtonLabel()}</span>
              <Music size={14} style={{ opacity: 0.8 }} />
            </>
          )}
        </button>

        {/* 12 Features Sequence Dropdown Toggle */}
        <button
          onClick={() => setShowSequence(!showSequence)}
          style={{
            background: showSequence ? 'rgba(5, 46, 38, 0.1)' : 'rgba(255, 255, 255, 0.9)',
            border: '1.5px solid #cbd5e1',
            borderRadius: '9999px',
            color: '#0f172a',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease'
          }}
          title="View 12 features sequence"
        >
          <span style={{ color: '#0284c7' }}>{getSeqToggleLabel()}</span>
          {showSequence ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Watch Full Video Tour Shortcut */}
        {onOpenTour && (
          <button
            onClick={onOpenTour}
            style={{
              background: 'linear-gradient(135deg, #052e26 0%, #047857 100%)',
              color: '#bef226',
              border: '1.5px solid #bef226',
              borderRadius: '9999px',
              padding: '8px 15px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 10px rgba(5, 46, 38, 0.25)'
            }}
            title="Open 2-minute interactive video tour"
          >
            <Film size={14} />
            <span>{language === 'hi' ? '🎬 वीडियो टूर (2 मिनट)' : '🎬 Video Tour (2 Min)'}</span>
          </button>
        )}
      </div>

      {/* Active Feature Live Pill when playing */}
      {isPlaying && (
        <div style={{
          background: 'rgba(5, 46, 38, 0.92)',
          color: '#bef226',
          border: '1px solid #bef226',
          borderRadius: '9999px',
          padding: '4px 14px',
          fontSize: '0.78rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          animation: 'fadeIn 0.3s ease',
          boxShadow: '0 2px 12px rgba(190, 242, 38, 0.3)'
        }}>
          <Sparkles size={13} color="#bef226" />
          <span>{activeChapter.icon} {activeLoc.badge} ({activeFeatureIdx + 1}/12)</span>
        </div>
      )}

      {/* Expandable 12-Feature Ordered Drawer */}
      {showSequence && (
        <div style={{
          marginTop: '0.35rem',
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '20px',
          padding: '0.75rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          maxWidth: '560px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.45rem',
          animation: 'fadeIn 0.2s ease',
          zIndex: 40
        }}>
          {INTRO_CHAPTERS.map((f, idx) => {
            const isCurrent = isPlaying && activeFeatureIdx === idx;
            const fLoc = getChapterLocalized(f, language);
            return (
              <div
                key={f.id}
                onClick={() => {
                  setActiveFeatureIdx(idx);
                  if (!isPlaying) playVoiceAndAudio();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  background: isCurrent ? '#052e26' : '#f8fafc',
                  color: isCurrent ? '#bef226' : '#1e293b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isCurrent ? '1px solid #bef226' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>{f.icon}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {idx + 1}. {fLoc.badge}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Keyframe for equalizer bars */}
      <style>{`
        @keyframes eqBarPulse {
          0% { height: 25%; }
          100% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
