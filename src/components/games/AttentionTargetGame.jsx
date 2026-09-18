import React, { useState, useEffect, useRef } from 'react';
import GameContainer from './GameContainer';
import { CULTURAL_PACKS } from '../../data/culturalPacks';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function AttentionTargetGame({
  onBack,
  activeCulturalPack = 'assam',
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const currentPack = CULTURAL_PACKS[activeCulturalPack] || CULTURAL_PACKS.assam;
  const levelParams = AdaptiveAiEngine.getParametersForLevel(difficultyLevel);

  const [targetItem, setTargetItem] = useState(null);
  const [gridItems, setGridItems] = useState([]);
  const [foundCount, setFoundCount] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  const startTimeRef = useRef(null);
  const clickTimestampsRef = useRef([]);

  const initRound = React.useCallback(() => {
    const allObjects = [...currentPack.objects];
    const chosenTarget = allObjects[0]; // Primary regional icon (e.g. Japi or Tea)
    const distractors = allObjects.slice(1);

    const targetTotal = levelParams.targetCount;
    const distractorTotal = levelParams.totalDistractors;

    const items = [];
    // Place target items
    for (let i = 0; i < targetTotal; i++) {
      items.push({
        id: `t-${i}`,
        isTarget: true,
        emoji: chosenTarget.emoji,
        name: chosenTarget.name,
        clicked: false,
        error: false
      });
    }

    // Place distractor items
    for (let i = 0; i < distractorTotal; i++) {
      const d = distractors[i % distractors.length];
      items.push({
        id: `d-${i}`,
        isTarget: false,
        emoji: d.emoji,
        name: d.name,
        clicked: false,
        error: false
      });
    }

    // Shuffle grid
    items.sort(() => 0.5 - Math.random());

    setTargetItem(chosenTarget);
    setGridItems(items);
    setFoundCount(0);
    setMistakes(0);
    setGameFinished(false);
    setEvaluationResult(null);
    clickTimestampsRef.current = [];
    startTimeRef.current = Date.now();
  }, [currentPack.objects, levelParams.targetCount, levelParams.totalDistractors]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const handleItemClick = (index) => {
    if (gameFinished) return;
    const item = gridItems[index];
    if (item.clicked) return; // Already solved

    const now = Date.now();
    clickTimestampsRef.current.push(now);

    if (item.isTarget) {
      speechService.playChime('success');
      const updated = [...gridItems];
      updated[index] = { ...item, clicked: true };
      setGridItems(updated);

      const newFound = foundCount + 1;
      setFoundCount(newFound);

      if (newFound >= levelParams.targetCount) {
        finishGame(mistakes);
      }
    } else {
      speechService.playChime('neutral');
      const updated = [...gridItems];
      updated[index] = { ...item, error: true };
      setGridItems(updated);
      setMistakes((prev) => prev + 1);

      setTimeout(() => {
        setGridItems((prev) => {
          const revert = [...prev];
          if (revert[index]) revert[index] = { ...revert[index], error: false };
          return revert;
        });
      }, 600);
    }
  };

  const finishGame = (totalMistakes) => {
    const totalDuration = Date.now() - (startTimeRef.current || Date.now());
    const avgLatency = Math.round(totalDuration / levelParams.targetCount);

    // Accuracy penalizes wrong clicks
    const accuracy = Math.max(20, Math.round(100 - totalMistakes * 15));

    const evalReport = AdaptiveAiEngine.evaluateSession({
      gameCategory: 'attention',
      accuracy,
      reactionTimeMs: avgLatency,
      mistakes: totalMistakes,
      currentDifficultyLevel: difficultyLevel,
      previousMovingAvg: 68
    });

    setEvaluationResult(evalReport);
    setGameFinished(true);

    offlineSyncEngine.recordEvent('GAME_COMPLETED', {
      gameCategory: 'attention',
      gameTitle: 'Find the Target',
      accuracy,
      reactionTimeMs: avgLatency,
      mistakes: totalMistakes,
      previousLevel: difficultyLevel,
      recommendedLevel: evalReport.recommendedLevel,
      timestamp: new Date().toISOString()
    });

    if (onLevelChange && evalReport.recommendedLevel !== difficultyLevel) {
      onLevelChange(evalReport.recommendedLevel);
    }
  };

  const instruction = targetItem
    ? (language === 'hi'
      ? `स्क्रीन पर सभी "${targetItem.name}" ${targetItem.emoji} को ढूंढकर उन पर टैप करें।`
      : `Scan the grid and tap all "${targetItem.name}" ${targetItem.emoji} items.`)
    : '';

  return (
    <GameContainer
      title={language === 'hi' ? 'एकाग्रता: निशान खोजें' : 'Attention: Find the Target'}
      category={language === 'hi' ? 'एकाग्रता व ध्यान (Attention Domain)' : 'Attention Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={instruction}
      language={language}
      gameCompleted={gameFinished}
      evaluationResult={evaluationResult}
      onPlayNextRound={initRound}
    >
      {/* Target Counter */}
      <div style={{
        background: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>{targetItem?.emoji}</span>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              {language === 'hi' ? 'खोजें (Find Target):' : 'Target:'}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {targetItem?.name}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
          {language === 'hi'
            ? `पाए गए: ${foundCount} / ${levelParams.targetCount}`
            : `Found: ${foundCount} / ${levelParams.targetCount}`}
        </div>
      </div>

      {/* Target Grid Field */}
      <div className="target-grid">
        {gridItems.map((item, idx) => (
          <button
            key={item.id}
            className={`target-item-btn ${item.clicked ? 'clicked-correct' : ''} ${item.error ? 'clicked-wrong' : ''}`}
            onClick={() => handleItemClick(idx)}
          >
            <span>{item.emoji}</span>
            {item.clicked && (
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    </GameContainer>
  );
}
