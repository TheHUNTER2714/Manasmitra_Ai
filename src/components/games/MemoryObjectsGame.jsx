import React, { useState, useEffect, useRef, useCallback } from 'react';
import GameContainer from './GameContainer';
import { CULTURAL_PACKS } from '../../data/culturalPacks';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function MemoryObjectsGame({
  onBack,
  activeCulturalPack = 'assam',
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const currentPack = CULTURAL_PACKS[activeCulturalPack] || CULTURAL_PACKS.assam;
  const levelParams = AdaptiveAiEngine.getParametersForLevel(difficultyLevel);

  // States
  const [phase, setPhase] = useState('memorize'); // 'memorize' | 'recall' | 'finished'
  const [countdown, setCountdown] = useState(levelParams.countdownSeconds);
  const [targetItems, setTargetItems] = useState([]);
  const [candidateItems, setCandidateItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startNewRound = useCallback(() => {
    const allObjects = [...currentPack.objects];
    // Shuffle
    const shuffled = allObjects.sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, levelParams.itemCount);
    const distractors = shuffled.slice(levelParams.itemCount);

    // Candidates are targets + distractors in shuffled order
    const candidates = [...targets, ...distractors].sort(() => 0.5 - Math.random());

    setTargetItems(targets);
    setCandidateItems(candidates);
    setSelectedIds([]);
    setPhase('memorize');
    setCountdown(levelParams.countdownSeconds);
    setEvaluationResult(null);

    // Start countdown
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setPhase('recall');
          startTimeRef.current = Date.now();
          speechService.playChime('gentle-bell');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentPack.objects, levelParams.itemCount, levelParams.countdownSeconds]);

  // Initialize round
  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startNewRound]);

  const handleToggleSelect = (item) => {
    if (phase !== 'recall') return;

    speechService.playChime('neutral');
    let newSelected = [...selectedIds];
    if (newSelected.includes(item.id)) {
      newSelected = newSelected.filter(id => id !== item.id);
    } else {
      newSelected.push(item.id);
    }
    setSelectedIds(newSelected);

    // If user has selected required number of items, evaluate
    if (newSelected.length === targetItems.length) {
      finishRound(newSelected);
    }
  };

  const finishRound = (finalSelections) => {
    const now = Date.now();
    const reactionTime = now - (startTimeRef.current || now);
    const targetIds = targetItems.map(t => t.id);

    // Count correct and mistake selections
    let correctCount = 0;
    let mistakes = 0;

    finalSelections.forEach(id => {
      if (targetIds.includes(id)) {
        correctCount++;
      } else {
        mistakes++;
      }
    });

    const accuracy = Math.round((correctCount / targetItems.length) * 100);

    const evalReport = AdaptiveAiEngine.evaluateSession({
      gameCategory: 'memory',
      accuracy,
      reactionTimeMs: Math.round(reactionTime / targetItems.length),
      mistakes,
      currentDifficultyLevel: difficultyLevel,
      previousMovingAvg: 75
    });

    setEvaluationResult(evalReport);
    setPhase('finished');

    // Record into Offline Sync Engine
    offlineSyncEngine.recordEvent('GAME_COMPLETED', {
      gameCategory: 'memory',
      gameTitle: 'Remember the Objects',
      accuracy,
      reactionTimeMs: evalReport.reactionTimeMs,
      mistakes,
      previousLevel: difficultyLevel,
      recommendedLevel: evalReport.recommendedLevel,
      timestamp: new Date().toISOString()
    });

    if (onLevelChange && evalReport.recommendedLevel !== difficultyLevel) {
      onLevelChange(evalReport.recommendedLevel);
    }
  };

  const getAudioInstruction = () => {
    if (phase === 'memorize') {
      return language === 'hi'
        ? `स्क्रीन पर दिख रही ${targetItems.length} वस्तुओं को ध्यान से याद रखें। ${countdown} सेकंड बचे हैं।`
        : `Memorize these ${targetItems.length} items carefully. ${countdown} seconds remaining.`;
    }
    if (phase === 'recall') {
      return language === 'hi'
        ? `आपने जो ${targetItems.length} वस्तुएं देखी थीं, उन पर एक-एक करके टैप करें।`
        : `Tap the ${targetItems.length} items you saw during the memorization phase.`;
    }
    return '';
  };

  return (
    <GameContainer
      title={language === 'hi' ? 'स्मृति खेल: वस्तुएं याद रखें' : 'Working Memory: Remember Objects'}
      category={language === 'hi' ? 'स्मृति सुधार (Memory Domain)' : 'Memory Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={getAudioInstruction()}
      language={language}
      gameCompleted={phase === 'finished'}
      evaluationResult={evaluationResult}
      onPlayNextRound={startNewRound}
    >
      {/* 1. Memorization Phase */}
      {phase === 'memorize' && (
        <div>
          {/* Visual Countdown Bar */}
          <div className="countdown-progress-track">
            <div
              className="countdown-progress-fill"
              style={{ width: `${(countdown / levelParams.countdownSeconds) * 100}%` }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700, color: '#b45309' }}>
            ⏱️ {countdown} {language === 'hi' ? 'सेकंड में वस्तुएं छिप जाएंगी...' : 'seconds remaining...'}
          </div>

          <div className="memory-grid">
            {targetItems.map((item) => (
              <div key={item.id} className="memory-object-card">
                <span className="object-emoji">{item.emoji}</span>
                <span className="object-name">{item.name}</span>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Recall Phase */}
      {phase === 'recall' && (
        <div>
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
              {language === 'hi'
                ? `चुनी गईं वस्तुएं: ${selectedIds.length} / ${targetItems.length}`
                : `Selected: ${selectedIds.length} / ${targetItems.length}`}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {language === 'hi' ? 'पहचानकर टैप करें' : 'Tap to select'}
            </span>
          </div>

          <div className="memory-grid">
            {candidateItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`memory-object-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleToggleSelect(item)}
                >
                  <span className="object-emoji">{item.emoji}</span>
                  <span className="object-name">{item.name}</span>
                  {isSelected && (
                    <span style={{
                      background: '#15803d',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      ✓ {language === 'hi' ? 'चुना' : 'Selected'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </GameContainer>
  );
}
