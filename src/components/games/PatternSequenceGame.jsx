import React, { useState, useEffect } from 'react';
import GameContainer from './GameContainer';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function PatternSequenceGame({
  onBack,
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const patterns = [
    {
      sequence: ['🔵', '🔴', '🔵', '🔴'],
      options: ['🔵', '🔴', '🟢'],
      correctAnswer: '🔵',
      hintHi: 'नीला, लाल, नीला, लाल... इसके बाद क्या आएगा?',
      hintEn: 'Blue, Red, Blue, Red... what comes next?'
    },
    {
      sequence: ['🍵', '👒', '🍵', '👒'],
      options: ['🍵', '👒', '🥁'],
      correctAnswer: '🍵',
      hintHi: 'चाय, जापी, चाय, जापी... अगला चिन्ह कौन सा होगा?',
      hintEn: 'Tea, Japi, Tea, Japi... which item completes the sequence?'
    },
    {
      sequence: ['⭐', '🌙', '⭐', '🌙'],
      options: ['⭐', '🌙', '☀️'],
      correctAnswer: '⭐',
      hintHi: 'तारा, चाँद, तारा, चाँद... इसके बाद क्या आएगा?',
      hintEn: 'Star, Moon, Star, Moon... what comes next?'
    },
    {
      sequence: ['🟡', '🟢', '🟡', '🟢'],
      options: ['🟡', '🟢', '🔴'],
      correctAnswer: '🟡',
      hintHi: 'पीला, हरा, पीला, हरा... अगला रंग कौन सा होगा?',
      hintEn: 'Yellow, Green, Yellow, Green... what comes next?'
    }
  ];

  const currentPattern = patterns[currentPatternIndex % patterns.length];

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentPatternIndex]);

  const handleOptionSelect = (option) => {
    const latency = Date.now() - startTime;

    if (option === currentPattern.correctAnswer) {
      speechService.playChime('success');

      // Check if finished 3 patterns or single round
      if (currentPatternIndex >= 2) {
        const accuracy = Math.max(50, 100 - mistakes * 20);
        const evalReport = AdaptiveAiEngine.evaluateSession({
          gameCategory: 'pattern',
          accuracy,
          reactionTimeMs: latency,
          mistakes,
          currentDifficultyLevel: difficultyLevel,
          previousMovingAvg: 76
        });

        setEvaluationResult(evalReport);
        setRoundCompleted(true);

        offlineSyncEngine.recordEvent('GAME_COMPLETED', {
          gameCategory: 'pattern',
          gameTitle: 'Pattern Completion',
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
        setCurrentPatternIndex((prev) => prev + 1);
      }
    } else {
      speechService.playChime('neutral');
      setMistakes((prev) => prev + 1);
    }
  };

  const instruction = language === 'hi'
    ? currentPattern.hintHi
    : currentPattern.hintEn;

  return (
    <GameContainer
      title={language === 'hi' ? 'पैटर्न पहचान: श्रृंखला पूरी करें' : 'Pattern Recognition: Sequence Flow'}
      category={language === 'hi' ? 'पैटर्न व तर्क (Pattern Domain)' : 'Pattern Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={instruction}
      language={language}
      gameCompleted={roundCompleted}
      evaluationResult={evaluationResult}
      onPlayNextRound={() => {
        setCurrentPatternIndex(0);
        setMistakes(0);
        setRoundCompleted(false);
        setEvaluationResult(null);
      }}
    >
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#475569', marginBottom: '1.5rem' }}>
          {language === 'hi'
            ? `प्रश्न ${currentPatternIndex + 1} / 3: सही अगला चिन्ह चुनें`
            : `Question ${currentPatternIndex + 1} of 3: Select the next item`}
        </div>

        {/* Visual Sequence Row */}
        <div className="sequence-row">
          {currentPattern.sequence.map((item, idx) => (
            <div key={idx} className="sequence-item">
              <span>{item}</span>
            </div>
          ))}
          <div className="sequence-question">
            <span>?</span>
          </div>
        </div>

        {/* Clickable Candidate Options */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
            {language === 'hi' ? 'नीचे दिए गए विकल्पों में से चुनें:' : 'Choose the correct answer:'}
          </div>
          <div className="pattern-options-grid">
            {currentPattern.options.map((opt, i) => (
              <button
                key={i}
                className="pattern-option-btn"
                onClick={() => handleOptionSelect(opt)}
              >
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </GameContainer>
  );
}
