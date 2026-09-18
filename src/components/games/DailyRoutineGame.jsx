import React, { useState } from 'react';
import GameContainer from './GameContainer';
import { Clock, CheckCircle2 } from 'lucide-react';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';

export default function DailyRoutineGame({
  onBack,
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());

  const questions = [
    {
      qHi: 'सुबह सोकर उठने के बाद सबसे पहला स्वास्थ्यप्रद काम क्या होता है?',
      qEn: 'What is the most healthy morning routine right after waking up?',
      optionsHi: [
        'ताज़ा पानी पीना और हाथ-मुँह धोना',
        'सीधे धूप में जाकर भारी सामान उठाना',
        'बिना पानी पिए दिनभर लेटे रहना'
      ],
      optionsEn: [
        'Drink fresh water and freshen up',
        'Carry heavy weights under the hot sun',
        'Stay in bed all day without water'
      ],
      correct: 0
    },
    {
      qHi: 'सुबह का नाश्ता करने के बाद डॉक्टर द्वारा दी गई सुबह की दवा कब लेनी चाहिए?',
      qEn: 'When should morning prescribed medicine be taken after breakfast?',
      optionsHi: [
        'नाश्ते के ठीक बाद सादे पानी के साथ',
        'रात को सोते समय एक साथ सब',
        'दवा लेने की आवश्यकता नहीं'
      ],
      optionsEn: [
        'Right after breakfast with fresh water',
        'All combined late at night',
        'Skip the medication'
      ],
      correct: 0
    },
    {
      qHi: 'दोपहर का भोजन करने के बाद क्या करना बुजुर्गों के लिए सबसे अच्छा है?',
      qEn: 'What is recommended for elders after having lunch?',
      optionsHi: [
        'थोड़ी देर सुस्ताकर हल्की चहलकदमी करना',
        'तेज़ गति से दौड़ लगाना',
        'भारी दौड़ प्रतियोगिता में भाग लेना'
      ],
      optionsEn: [
        'Rest comfortably and take a gentle stroll',
        'Sprint at high speed',
        'Run a marathon'
      ],
      correct: 0
    }
  ];

  const currentQ = questions[questionIndex % questions.length];

  const handleSelectOption = (idx) => {
    const latency = Date.now() - startTime;

    if (idx === currentQ.correct) {
      speechService.playChime('success');

      if (questionIndex >= questions.length - 1) {
        const accuracy = Math.max(60, 100 - mistakes * 20);
        const evalReport = AdaptiveAiEngine.evaluateSession({
          gameCategory: 'recall',
          accuracy,
          reactionTimeMs: latency,
          mistakes,
          currentDifficultyLevel: difficultyLevel,
          previousMovingAvg: 70
        });

        setEvaluationResult(evalReport);
        setGameCompleted(true);

        offlineSyncEngine.recordEvent('GAME_COMPLETED', {
          gameCategory: 'recall',
          gameTitle: 'Daily Routine Recall',
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
        setQuestionIndex((prev) => prev + 1);
        setStartTime(Date.now());
      }
    } else {
      speechService.playChime('neutral');
      setMistakes((prev) => prev + 1);
    }
  };

  const instruction = language === 'hi' ? currentQ.qHi : currentQ.qEn;

  return (
    <GameContainer
      title={language === 'hi' ? 'दिनचर्या स्मरण: दैनिक क्रम' : 'Routine Recall: Daily Steps'}
      category={language === 'hi' ? 'दिनचर्या व अभिविन्यास (Routine Domain)' : 'Routine Category'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      audioPrompt={instruction}
      language={language}
      gameCompleted={gameCompleted}
      evaluationResult={evaluationResult}
      onPlayNextRound={() => {
        setQuestionIndex(0);
        setMistakes(0);
        setGameCompleted(false);
        setEvaluationResult(null);
        setStartTime(Date.now());
      }}
    >
      <div>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#64748b', fontWeight: 700 }}>
          {language === 'hi'
            ? `प्रश्न ${questionIndex + 1} / ${questions.length}: दिनचर्या का सही क्रम चुनें`
            : `Question ${questionIndex + 1} of ${questions.length}: Select the correct sequence`}
        </div>

        {/* Question Banner */}
        <div className="routine-question-box">
          {language === 'hi' ? currentQ.qHi : currentQ.qEn}
        </div>

        {/* Large Accessible Option Cards */}
        <div className="routine-options-list">
          {(language === 'hi' ? currentQ.optionsHi : currentQ.optionsEn).map((opt, i) => (
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
                color: '#334155',
                flexShrink: 0
              }}>
                {i + 1}
              </div>
              <span>{opt}</span>
            </button>
          ))}
        </div>
      </div>
    </GameContainer>
  );
}
