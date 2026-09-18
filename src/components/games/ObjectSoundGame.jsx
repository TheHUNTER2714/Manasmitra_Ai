import React, { useState, useRef } from 'react';
import GameContainer from './GameContainer';
import { Volume2, Play } from 'lucide-react';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function ObjectSoundGame({
  onBack,
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const startTimeRef = useRef(Date.now());

  const sounds = [
    {
      id: 'bell',
      nameHi: 'मंदिर की घंटी (Temple Bell)',
      nameEn: 'Temple Bell',
      type: 'bell',
      options: [
        { nameHi: 'मंदिर की घंटी', nameEn: 'Temple Bell', emoji: '🔔', isCorrect: true },
        { nameHi: 'कार का हॉर्न', nameEn: 'Car Horn', emoji: '🚗', isCorrect: false },
        { nameHi: 'दीवार घड़ी', nameEn: 'Wall Clock', emoji: '🕰️', isCorrect: false }
      ]
    },
    {
      id: 'kettle',
      nameHi: 'चाय की केतली (Tea Kettle)',
      nameEn: 'Boiling Tea Kettle',
      type: 'kettle',
      options: [
        { nameHi: 'गरम चाय की केतली', nameEn: 'Boiling Tea Kettle', emoji: '🫖', isCorrect: true },
        { nameHi: 'टेलीफोन की घंटी', nameEn: 'Telephone', emoji: '☎️', isCorrect: false },
        { nameHi: 'बांसुरी', nameEn: 'Flute', emoji: '🪈', isCorrect: false }
      ]
    },
    {
      id: 'bird',
      nameHi: 'सुबह की चिड़िया (Chirping Bird)',
      nameEn: 'Chirping Bird',
      type: 'bird',
      options: [
        { nameHi: 'चिड़िया की चहचहाहट', nameEn: 'Chirping Bird', emoji: '🐦', isCorrect: true },
        { nameHi: 'रेलगाड़ी', nameEn: 'Train', emoji: '🚂', isCorrect: false },
        { nameHi: 'ढोलक', nameEn: 'Dholak Drum', emoji: '🥁', isCorrect: false }
      ]
    }
  ];

  const currentSound = sounds[currentSoundIndex % sounds.length];

  // Synthesize acoustic tone using Web Audio API
  const playSoundEffect = (type) => {
    setIsPlaying(true);
    if (typeof window === 'undefined') return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'bell') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.8);
      } else if (type === 'kettle') {
        // High whistle simulation
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1450, ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.5);
      } else {
        // Bird chirp arpeggio
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(1800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1900, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.8);
      }

      setTimeout(() => setIsPlaying(false), 1600);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSelectOption = (isCorrect) => {
    const now = Date.now();
    const latency = now - (startTimeRef.current || now);

    if (isCorrect) {
      speechService.playChime('success');

      if (currentSoundIndex >= sounds.length - 1) {
        const accuracy = Math.max(50, 100 - mistakes * 20);
        const evalReport = AdaptiveAiEngine.evaluateSession({
          gameCategory: 'sound',
          accuracy,
          reactionTimeMs: latency,
          mistakes,
          currentDifficultyLevel: difficultyLevel,
          previousMovingAvg: 74
        });

        setEvaluationResult(evalReport);
        setGameCompleted(true);

        offlineSyncEngine.recordEvent('GAME_COMPLETED', {
          gameCategory: 'sound',
          gameTitle: 'Sound & Object Recognition',
          accuracy,
          reactionTimeMs: latency,
          mistakes,
          previousLevel: difficultyLevel,
          recommendedLevel: evalReport.recommendedLevel,
          timestamp: new Date().toISOString()
        });

        if (onLevelChange && evalReport.recommendedLevel !== difficultyLevel) {
          onLevelChange(evalReport.recommendedLevel);
        }
      } else {
        setCurrentSoundIndex((prev) => prev + 1);
        startTimeRef.current = Date.now();
      }
    } else {
      speechService.playChime('neutral');
      setMistakes((prev) => prev + 1);
    }
  };

  const instruction = language === 'hi'
    ? 'हरे बटन पर दबाकर आवाज़ सुनें और पहचानें कि यह किस वस्तु की आवाज़ है।'
    : 'Tap the green button to listen to the sound, then identify the matching object.';

  return (
    <GameContainer
      title={language === 'hi' ? 'ध्वनि व वस्तु पहचान' : 'Object & Sound Matching'}
      category={language === 'hi' ? 'श्रवण व प्रत्यक्षीकरण (Auditory Domain)' : 'Auditory Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={instruction}
      language={language}
      gameCompleted={gameCompleted}
      evaluationResult={evaluationResult}
      onPlayNextRound={() => {
        setCurrentSoundIndex(0);
        setMistakes(0);
        setGameCompleted(false);
        setEvaluationResult(null);
        setStartTime(Date.now());
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#64748b', fontWeight: 700, marginBottom: '1.5rem' }}>
          {language === 'hi'
            ? `ध्वनि ${currentSoundIndex + 1} / ${sounds.length}: आवाज़ सुनें और पहचानें`
            : `Sound ${currentSoundIndex + 1} of ${sounds.length}: Listen and identify`}
        </div>

        {/* Big Sound Play Box */}
        <div className="sound-player-box">
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.75rem' }}>
            {language === 'hi' ? 'आवाज़ बजाने के लिए दबाएं (Tap to Play)' : 'Tap circle to listen'}
          </div>

          <button
            className="sound-play-btn"
            onClick={() => playSoundEffect(currentSound.type)}
            title="Play Audio Sound"
          >
            {isPlaying ? <Volume2 size={36} /> : <Play size={36} />}
          </button>

          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isPlaying ? '#34d399' : '#e2e8f0' }}>
            {isPlaying
              ? (language === 'hi' ? 'ध्वनि बज रही है...' : 'Playing sound...')
              : (language === 'hi' ? 'आवाज़ सुनें ▶' : 'Listen ▶')}
          </div>
        </div>

        {/* Identification Options */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
            {language === 'hi' ? 'यह आवाज़ किसकी थी?' : 'Which object made this sound?'}
          </div>

          <div className="pattern-options-grid">
            {currentSound.options.map((opt, i) => (
              <button
                key={i}
                className="memory-object-card"
                onClick={() => handleSelectOption(opt.isCorrect)}
                style={{ minWidth: '160px', padding: '1.5rem 1rem' }}
              >
                <span className="object-emoji">{opt.emoji}</span>
                <span className="object-name">{language === 'hi' ? opt.nameHi : opt.nameEn}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameContainer>
  );
}
