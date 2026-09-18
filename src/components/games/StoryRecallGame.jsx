import React, { useState, useEffect } from 'react';
import GameContainer from './GameContainer';
import { Volume2, BookOpen, CheckCircle2 } from 'lucide-react';
import { CULTURAL_PACKS } from '../../data/culturalPacks';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function StoryRecallGame({
  onBack,
  activeCulturalPack = 'assam',
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const currentPack = CULTURAL_PACKS[activeCulturalPack] || CULTURAL_PACKS.assam;
  const currentStory = (currentPack.stories && currentPack.stories[0]) || {
    title: 'गुवाहाटी हाट की यात्रा',
    storyText: 'रवि सुबह गुवाहाटी के उज़ान बाज़ार गया। उसने अपनी पोती के लिए ताज़े मीठे संतरे खरीदे।',
    question: 'रवि ने बाज़ार में क्या खरीदा?',
    options: ['ताज़े मीठे संतरे', 'खिलौना ढोल', 'नया जापी'],
    correctIndex: 0
  };

  const [phase, setPhase] = useState('read'); // 'read' | 'question' | 'completed'
  const [isNarrating, setIsNarrating] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    handleNarrate();
  }, [activeCulturalPack]);

  const handleNarrate = () => {
    setIsNarrating(true);
    speechService.speak(currentStory.storyText, language === 'hi' ? 'hi-IN' : 'en-IN', () => {
      setIsNarrating(false);
    });
  };

  const handleProceedToQuestion = () => {
    speechService.stopSpeaking();
    setIsNarrating(false);
    setPhase('question');
    setStartTime(Date.now());
  };

  const handleSelectOption = (idx) => {
    const latency = Date.now() - startTime;

    if (idx === currentStory.correctIndex) {
      speechService.playChime('success');
      const accuracy = Math.max(60, 100 - mistakes * 20);

      const evalReport = AdaptiveAiEngine.evaluateSession({
        gameCategory: 'story',
        accuracy,
        reactionTimeMs: latency,
        mistakes,
        currentDifficultyLevel: difficultyLevel,
        previousMovingAvg: 72
      });

      setEvaluationResult(evalReport);
      setPhase('completed');

      offlineSyncEngine.recordEvent('GAME_COMPLETED', {
        gameCategory: 'story',
        gameTitle: 'Regional Story Recall',
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
      speechService.playChime('neutral');
      setMistakes((prev) => prev + 1);
    }
  };

  const instruction = phase === 'read'
    ? (language === 'hi' ? 'इस सुंदर स्थानीय कहानी को ध्यान से सुनें या पढ़ें।' : 'Listen to this comforting regional story carefully.')
    : currentStory.question;

  return (
    <GameContainer
      title={language === 'hi' ? 'लोककथा स्मरण (Story Recall)' : 'Regional Story Recall'}
      category={language === 'hi' ? 'श्रवण स्मृति (Auditory Retention)' : 'Story Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={instruction}
      language={language}
      gameCompleted={phase === 'completed'}
      evaluationResult={evaluationResult}
      onPlayNextRound={() => {
        setPhase('read');
        setMistakes(0);
        setEvaluationResult(null);
        handleNarrate();
      }}
    >
      {/* Reading / Listening Phase */}
      {phase === 'read' && (
        <div>
          <div className="story-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#92400e' }}>
                <BookOpen size={22} />
                <span>{currentStory.title}</span>
              </div>

              <button
                onClick={handleNarrate}
                className="audio-guide-pill-btn"
                style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
              >
                <Volume2 size={16} /> {isNarrating ? 'सुनाया जा रहा है...' : 'कहानी सुनें'}
              </button>
            </div>

            <p className="story-narration-text">
              {currentStory.storyText}
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button
              onClick={handleProceedToQuestion}
              style={{
                background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '16px',
                fontSize: '1.2rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(27, 67, 50, 0.25)'
              }}
            >
              {language === 'hi' ? 'प्रश्न का उत्तर दें →' : 'Answer Question →'}
            </button>
          </div>
        </div>
      )}

      {/* Recall Question Phase */}
      {phase === 'question' && (
        <div>
          <div className="routine-question-box">
            {currentStory.question}
          </div>

          <div className="routine-options-list">
            {currentStory.options.map((opt, i) => (
              <button
                key={i}
                className="routine-option-card"
                onClick={() => handleSelectOption(i)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#334155'
                }}>
                  {i + 1}
                </div>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </GameContainer>
  );
}
