import React, { useEffect } from 'react';
import { ArrowLeft, Volume2, Sparkles, Award, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speechService } from '../../services/speechService';

export default function GameContainer({
  title,
  category,
  difficultyLevel = 1,
  onBack,
  audioPrompt,
  language = 'hi',
  gameCompleted = false,
  evaluationResult = null,
  onPlayNextRound,
  children
}) {
  useEffect(() => {
    if (audioPrompt) {
      speechService.speak(audioPrompt, language === 'hi' ? 'hi-IN' : 'en-IN');
    }
  }, [audioPrompt, language]);

  useEffect(() => {
    if (gameCompleted) {
      speechService.playChime('success');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [gameCompleted]);

  const handleReplayAudio = () => {
    if (audioPrompt) {
      speechService.speak(audioPrompt, language === 'hi' ? 'hi-IN' : 'en-IN');
    }
  };

  const getDifficultyPill = () => {
    if (difficultyLevel === 2) return <span className="difficulty-pill medium">Level 2 (Medium / मध्यम)</span>;
    if (difficultyLevel === 3) return <span className="difficulty-pill adaptive">Level 3 (Challenge / उन्नत)</span>;
    return <span className="difficulty-pill easy">Level 1 (Easy / सरल)</span>;
  };

  return (
    <div className="game-viewport">
      {/* Top Controls Bar */}
      <div className="game-top-bar">
        <div className="game-title-wrap">
          <button
            onClick={onBack}
            className="acc-pill-btn"
            style={{ fontWeight: 700 }}
            title="Go back to games list"
          >
            <ArrowLeft size={16} /> {language === 'hi' ? 'वापस (Back)' : 'Back'}
          </button>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
              {category}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {title}
            </h2>
          </div>
        </div>

        <div className="game-meta-group">
          {getDifficultyPill()}

          {audioPrompt && (
            <button
              onClick={handleReplayAudio}
              className="audio-guide-pill-btn"
              title="Listen to instructions again"
            >
              <Volume2 size={16} color="#15803d" />
              <span>{language === 'hi' ? 'निर्देश सुनें' : 'Audio Guide'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Prompt Text Banner */}
      {audioPrompt && !gameCompleted && (
        <div className="voice-instruction-bar">
          <Volume2 size={28} color="#16a34a" style={{ flexShrink: 0 }} />
          <div className="voice-instruction-text">
            {audioPrompt}
          </div>
        </div>
      )}

      {/* Main Game Content or Completion Screen */}
      {!gameCompleted ? (
        children
      ) : (
        <div className="game-result-card">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', color: '#15803d', padding: '0.35rem 1rem', borderRadius: '9999px', fontWeight: 800, fontSize: '0.88rem' }}>
            <Award size={18} /> {language === 'hi' ? 'अभ्यास सफलतापूर्वक संपन्न!' : 'Session Completed!'}
          </div>

          <h3 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0' }}>
            {language === 'hi' ? 'बहुत सुंदर दादाजी! 🌟' : 'Wonderful Effort Dadaji! 🌟'}
          </h3>

          {evaluationResult && (
            <>
              {/* Score ring */}
              <div className="result-score-ring">
                <span>{evaluationResult.accuracy}%</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Accuracy</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', color: '#475569', fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                <span>⏱️ प्रतिक्रिया गति: <strong>{(evaluationResult.reactionTimeMs / 1000).toFixed(1)}s</strong></span>
                <span>🎯 त्रुटियाँ: <strong>{evaluationResult.mistakes}</strong></span>
                <span>📈 स्कोर प्रभाव: <strong style={{ color: '#15803d' }}>+{Math.max(1, evaluationResult.deltaScore || 3)}</strong></span>
              </div>

              {/* Adaptive AI Engine Decision Box (The Judge Demonstration Highlight) */}
              <div className="adaptive-decision-box">
                <div className="adaptive-decision-title">
                  <Sparkles size={18} />
                  <span>🧠 AI अनूकुली निर्णय (Adaptive AI Engine Output):</span>
                </div>
                <div className="adaptive-decision-text">
                  {language === 'hi' ? evaluationResult.rationaleHindi : evaluationResult.rationale}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: '0.5rem', fontStyle: 'italic' }}>
                  Next Recommended Level: <strong>Level {evaluationResult.recommendedLevel}</strong> • Action: <strong>{evaluationResult.difficultyAction}</strong>
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={onBack}
              style={{
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                padding: '0.8rem 1.4rem',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {language === 'hi' ? 'खेल सूची पर लौटें' : 'All Games'}
            </button>

            {onPlayNextRound && (
              <button
                onClick={onPlayNextRound}
                style={{
                  background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.6rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(27, 67, 50, 0.25)',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={18} />
                {language === 'hi' ? 'अगला राउंड खेलें →' : 'Play Next Round →'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
