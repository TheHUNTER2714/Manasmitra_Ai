import React, { useState, useEffect } from 'react';
import GameContainer from './GameContainer';
import { AdaptiveAiEngine } from '../../services/adaptiveAiEngine';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';
import { Lightbulb, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

/**
 * ManasMitra AI — Crossword Memory Game (शब्द पहेली)
 * 
 * Based on Research:
 * "Artificial Intelligence (AI) Based Game Development 'Memory Game'
 * for Training Functions Alzheimer and Dementia Cognitive"
 * (Khairunisa, Kuswoyo, Nurwicaksono, KnE Engineering / JICOMS 2024)
 * Citing Pillai et al. [16] (2011): Crossword puzzle participation delays cognitive memory decline by 2.54 years.
 *
 * Implements:
 * 1. GDLC (Game Development Life Cycle) Model
 * 2. Multi-tier AI Hint Generation Algorithm (Easy: full word, Medium: partial definition, Hard: letter mask)
 * 3. 4 Levels of Difficulty (Daily health, routine, and cultural vocabulary)
 * 4. Senior-adapted touch UI with large cells and on-screen keyboard
 * 5. Automated answer verification with gentle non-punitive feedback
 */

const CROSSWORD_LEVELS = {
  1: {
    level: 1,
    nameHi: 'स्तर १: सरल स्वास्थ्य दिनचर्या (Level 1: Easy)',
    gridSize: 3,
    words: [
      { id: '1-across', direction: 'ACROSS', row: 0, col: 0, answer: 'TEA', clueHi: 'सुबह का गर्म पेय — चाय (Morning warm cup)', clueEn: 'Warm morning herbal cup (TEA)', partialDef: 'Beloved warm morning brew enjoyed across India', number: 1 },
      { id: '1-down', direction: 'DOWN', row: 0, col: 0, answer: 'TAB', clueHi: 'दवाई की गोली (Short for tablet / medicine pill)', clueEn: 'Medicine pill or tablet (TAB)', partialDef: 'Prescribed medication taken with water', number: 1 },
      { id: '2-across', direction: 'ACROSS', row: 2, col: 0, answer: 'BED', clueHi: 'विश्राम व निद्रा का स्थान — बिस्तर (Place to sleep & rest)', clueEn: 'Comfortable place to sleep and rest (BED)', partialDef: 'Where you rest peacefully every night', number: 2 }
    ]
  },
  2: {
    level: 2,
    nameHi: 'स्तर २: मानसिक शांति व देखभाल (Level 2: Gentle Care)',
    gridSize: 4,
    words: [
      { id: '1-across', direction: 'ACROSS', row: 0, col: 0, answer: 'CARE', clueHi: 'परिजनों की देखभाल व स्नेह (Affection and support for family)', clueEn: 'Affection and daily assistance for elders (CARE)', partialDef: 'Loving attention provided by family and doctors', number: 1 },
      { id: '1-down', direction: 'DOWN', row: 0, col: 0, answer: 'CALM', clueHi: 'शांत व तनावमुक्त मन (Peaceful, anxiety-free mental state)', clueEn: 'Peaceful and tranquil state of mind (CALM)', partialDef: 'The opposite of agitation or distress', number: 1 },
      { id: '2-across', direction: 'ACROSS', row: 2, col: 0, answer: 'LIFE', clueHi: 'स्वस्थ व सक्रिय जीवन (Vitality and living well)', clueEn: 'Vitality and healthy living (LIFE)', partialDef: 'Healthy, active daily existence', number: 2 },
      { id: '3-down', direction: 'DOWN', row: 0, col: 3, answer: 'EASE', clueHi: 'आराम और सहजता (Freedom from pain and tension)', clueEn: 'Freedom from worry or physical strain (EASE)', partialDef: 'Relaxation and peaceful comfort', number: 3 }
    ]
  },
  3: {
    level: 3,
    nameHi: 'स्तर ३: पोषण व शारीरिक स्वास्थ्य (Level 3: Nutrition & Wellness)',
    gridSize: 5,
    words: [
      { id: '1-across', direction: 'ACROSS', row: 0, col: 0, answer: 'WATER', clueHi: 'जीवनदायक स्वच्छ जल — दिन में ८ गिलास (Essential hydration)', clueEn: 'Essential daily hydration for brain health (WATER)', partialDef: 'Clear natural liquid vital for cognitive alertness', number: 1 },
      { id: '1-down', direction: 'DOWN', row: 0, col: 0, answer: 'WALK', clueHi: 'सुबह की हल्की सैर — चुस्ती हेतु (Gentle morning stroll)', clueEn: 'Gentle morning outdoor exercise (WALK)', partialDef: 'Daily low-impact stroll to maintain mobility', number: 1 },
      { id: '2-across', direction: 'ACROSS', row: 2, col: 0, answer: 'LOTUS', clueHi: 'कमल का फूल — शांति का राष्ट्रीय प्रतीक (National flower)', clueEn: 'National flower symbolizing serenity and purity (LOTUS)', partialDef: 'Sacred aquatic blossom representing mindfulness', number: 2 },
      { id: '3-down', direction: 'DOWN', row: 0, col: 2, answer: 'TOTAL', clueHi: 'सम्पूर्ण स्वास्थ्य संतुलन (Complete holistic wellness)', clueEn: 'Complete and holistic health balance (TOTAL)', partialDef: 'Entire harmony of memory, mood, and body', number: 3 }
    ]
  },
  4: {
    level: 4,
    nameHi: 'स्तर ४: संज्ञानात्मक स्मृति व ध्यान (Level 4: Cognitive Acuity)',
    gridSize: 6,
    words: [
      { id: '1-across', direction: 'ACROSS', row: 0, col: 0, answer: 'MEMORY', clueHi: 'स्मृति व याददाश्त — निरंतर अभ्यास से मजबूत (Power to recall)', clueEn: 'Cognitive recall power strengthened by puzzles (MEMORY)', partialDef: 'Brain function that preserves past experiences and words', number: 1 },
      { id: '1-down', direction: 'DOWN', row: 0, col: 0, answer: 'MEDIC', clueHi: 'स्वास्थ्य रक्षक व चिकित्सक (Healthcare worker or physician)', clueEn: 'Doctor or community health guardian (MEDIC)', partialDef: 'Trained professional who monitors elder vitals', number: 1 },
      { id: '2-across', direction: 'ACROSS', row: 2, col: 0, answer: 'DHYANA', clueHi: 'ध्यान व एकाग्रता — मानसिक स्थिरता (Mindfulness meditation)', clueEn: 'Mindfulness meditation for calm focus (DHYANA)', partialDef: 'Sanskrit practice of serene centered awareness', number: 2 },
      { id: '3-down', direction: 'DOWN', row: 0, col: 3, answer: 'OXYGEN', clueHi: 'प्राणवायु — गहरी सांस से मस्तिष्क में वृद्धि (Vital fresh air)', clueEn: 'Vital air increased by 4-7-8 breathing (OXYGEN)', partialDef: 'Essential gas that nourishes brain cells and clarity', number: 3 }
    ]
  }
};

export default function CrosswordMemoryGame({
  onBack,
  difficultyLevel = 1,
  onLevelChange,
  language = 'hi'
}) {
  const currentLevelData = CROSSWORD_LEVELS[difficultyLevel] || CROSSWORD_LEVELS[1];
  const gridSize = currentLevelData.gridSize;

  // Helper to build initial grid
  const createGridForLevel = (levelData) => {
    const size = levelData.gridSize;
    const initialGrid = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({
        value: '',
        isPlayable: false,
        expected: '',
        wordIds: [],
        cellNumber: null,
        status: 'EMPTY' // 'EMPTY' | 'CORRECT' | 'WRONG'
      }))
    );

    levelData.words.forEach((word) => {
      const { direction, row, col, answer, id, number } = word;
      for (let i = 0; i < answer.length; i++) {
        const r = direction === 'ACROSS' ? row : row + i;
        const c = direction === 'ACROSS' ? col + i : col;

        if (r < size && c < size) {
          initialGrid[r][c].isPlayable = true;
          initialGrid[r][c].expected = answer[i].toUpperCase();
          initialGrid[r][c].wordIds.push(id);
          if (i === 0 && !initialGrid[r][c].cellNumber) {
            initialGrid[r][c].cellNumber = number;
          }
        }
      }
    });
    return initialGrid;
  };

  // Grid cell data: matrix of { letter, isPlayable, expected, number }
  const [grid, setGrid] = useState(() => createGridForLevel(currentLevelData));
  const [selectedWord, setSelectedWord] = useState(() => currentLevelData.words[0] || null);
  const [activeCell, setActiveCell] = useState(() => currentLevelData.words[0] ? { row: currentLevelData.words[0].row, col: currentLevelData.words[0].col } : null);
  const [aiHintMessage, setAiHintMessage] = useState('');
  const [validationReport, setValidationReport] = useState(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const startTimeRef = useRef(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Keyboard characters for on-screen touch
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Sync Grid when level changes
  useEffect(() => {
    setGrid(createGridForLevel(currentLevelData));
    if (currentLevelData.words.length > 0) {
      setSelectedWord(currentLevelData.words[0]);
      setActiveCell({ row: currentLevelData.words[0].row, col: currentLevelData.words[0].col });
    }
    startTimeRef.current = Date.now();
    setAiHintMessage('');
    setValidationReport(null);
    setGameCompleted(false);
    setMistakesCount(0);
    setEvaluationResult(null);
  }, [difficultyLevel, currentLevelData]);

  // AI Hint Generation Algorithm (Exact Implementation from Research Paper Page 6)
  const handleRequestAiHint = () => {
    if (!selectedWord) return;

    const chosenWord = selectedWord.answer.toUpperCase();
    let hint = '';

    switch (difficultyLevel) {
      case 1:
        // Easy: Direct word reveal to eliminate anxiety and cognitive distress
        hint = language === 'hi'
          ? `💡 AI संकेत (सरल सहायता): इस पहेली का पूरा उत्तर "${chosenWord}" है।`
          : `💡 AI Hint (Easy Mode): The complete answer is "${chosenWord}".`;
        break;

      case 2:
      case 3:
        // Medium: Partial definition and semantic associative clue
        hint = language === 'hi'
          ? `💡 AI आंशिक परिभाषा: ${selectedWord.partialDef}`
          : `💡 AI Partial Definition: ${selectedWord.partialDef}`;
        break;

      case 4:
      default:
        // Hard: Reveal alternate letters (RevealLetters algorithm)
        const masked = chosenWord
          .split('')
          .map((char, index) => (index % 2 === 0 ? char : '_'))
          .join(' ');
        hint = language === 'hi'
          ? `💡 AI अक्षर संकेत: ${masked}`
          : `💡 AI Letter Reveal: ${masked}`;
        break;
    }

    setAiHintMessage(hint);
    speechService.speak(hint, language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  // Handle Input in Active Cell
  const handleLetterInput = (letter) => {
    if (!activeCell) return;
    const { row, col } = activeCell;
    if (!grid[row][col].isPlayable) return;

    const newGrid = [...grid.map((r) => [...r])];
    newGrid[row][col].value = letter.toUpperCase();
    newGrid[row][col].status = 'FILLED';
    setGrid(newGrid);

    // Auto-advance cursor to next cell in current word
    if (selectedWord) {
      advanceCursor(row, col);
    }
  };

  const advanceCursor = (r, c) => {
    if (!selectedWord) return;
    const isAcross = selectedWord.direction === 'ACROSS';
    const nextR = isAcross ? r : r + 1;
    const nextC = isAcross ? c + 1 : c;

    if (nextR < gridSize && nextC < gridSize && grid[nextR][nextC].isPlayable) {
      setActiveCell({ row: nextR, col: nextC });
    }
  };

  const handleBackspace = () => {
    if (!activeCell) return;
    const { row, col } = activeCell;
    const newGrid = [...grid.map((r) => [...r])];
    newGrid[row][col].value = '';
    newGrid[row][col].status = 'EMPTY';
    setGrid(newGrid);
  };

  // Check Answers (Alpha Testing Validation Table 2)
  const handleCheckAnswers = () => {
    let correctCount = 0;
    let totalPlayable = 0;
    let hasMistakes = false;

    const validatedGrid = grid.map((row) =>
      row.map((cell) => {
        if (!cell.isPlayable) return cell;
        totalPlayable++;
        const isMatch = cell.value.toUpperCase() === cell.expected.toUpperCase();
        if (isMatch) {
          correctCount++;
          return { ...cell, status: 'CORRECT' };
        } else {
          hasMistakes = true;
          return { ...cell, status: cell.value ? 'WRONG' : 'EMPTY' };
        }
      })
    );

    setGrid(validatedGrid);

    const accuracy = Math.round((correctCount / totalPlayable) * 100);
    const now = Date.now();
    const durationMs = now - (startTimeRef.current || now);

    if (!hasMistakes && accuracy === 100) {
      setValidationReport({
        type: 'SUCCESS',
        messageHi: 'अद्भुत! आपने सभी शब्द बिल्कुल सही भरे हैं।',
        messageEn: 'Splendid! All crossword words have been solved correctly.'
      });
      setGameCompleted(true);

      // Adaptive AI evaluation
      const report = AdaptiveAiEngine.evaluateSession({
        gameCategory: 'crossword',
        accuracy: 100,
        reactionTimeMs: Math.round(durationMs / totalPlayable),
        mistakes: mistakesCount,
        currentDifficultyLevel: difficultyLevel,
        previousMovingAvg: 75
      });
      setEvaluationResult(report);

      offlineSyncEngine.recordEvent('CROSSWORD_COMPLETED', {
        level: difficultyLevel,
        accuracy: 100,
        durationMs,
        timestamp: new Date().toISOString()
      });
    } else {
      setMistakesCount((prev) => prev + 1);
      setValidationReport({
        type: 'TRY_AGAIN',
        messageHi: `${correctCount} / ${totalPlayable} अक्षर सही हैं। गलत अक्षरों को लाल रंग में दर्शाया गया है। AI संकेत की सहायता लें।`,
        messageEn: `${correctCount} of ${totalPlayable} letters correct. Red cells need correction. Use the AI Hint button for gentle guidance.`
      });
      speechService.playChime('neutral-ding');
    }
  };

  const handleNextLevel = () => {
    if (difficultyLevel < 4) {
      if (onLevelChange) onLevelChange(difficultyLevel + 1);
    } else {
      if (onLevelChange) onLevelChange(1);
    }
  };

  return (
    <GameContainer
      title={language === 'hi' ? 'शब्द पहेली (Crossword Memory Game)' : 'AI Crossword Memory Game'}
      category={language === 'hi' ? 'भाषा व स्मृति उत्तेजना (Semantic Association)' : 'Semantic Memory & Diction'}
      difficultyLevel={difficultyLevel}
      onBack={onBack}
      language={language}
      gameCompleted={gameCompleted}
      evaluationResult={evaluationResult}
      onPlayNextRound={handleNextLevel}
      audioPrompt={
        language === 'hi'
          ? 'क्रॉसवर्ड ग्रिड में अक्षरों को भरकर पहेली सुलझाएं। आवश्यकता पड़ने पर AI संकेत दबाएं।'
          : 'Fill in the crossword puzzle letters. Tap AI Hint if you need gentle guidance.'
      }
    >
      <div className="crossword-layout-wrapper">
        {/* Research Clinical Motivation Banner */}
        <div className="crossword-research-banner">
          <BookOpen size={18} color="#0f766e" />
          <span>
            <strong>अनुसंधान आधारित (Khairunisa et al., 2024; Pillai et al., 2011):</strong> क्रॉसवर्ड शब्द पहेली से बुजुर्गों में संज्ञानात्मक स्मृति ह्रास <strong>२.५४ वर्ष</strong> तक धीमा किया जा सकता है।
          </span>
        </div>

        {/* Level Selector Tabs (Levels 1 to 4) */}
        <div className="crossword-level-bar">
          {[1, 2, 3, 4].map((lvl) => (
            <button
              key={lvl}
              onClick={() => onLevelChange && onLevelChange(lvl)}
              className={`crossword-lvl-btn ${difficultyLevel === lvl ? 'active' : ''}`}
            >
              Level {lvl}
            </button>
          ))}
          <span className="current-level-label">{currentLevelData.nameHi}</span>
        </div>

        {/* Main Interactive Stage: Grid (Left) + Clues & AI Hints (Right) */}
        <div className="crossword-stage-grid">
          {/* LEFT: Grid Matrix */}
          <div className="crossword-grid-container">
            <div
              className="crossword-matrix"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                maxWidth: `${gridSize * 74}px`
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isSelectedCell = activeCell?.row === rIdx && activeCell?.col === cIdx;
                  const isWordCell = selectedWord && cell.wordIds.includes(selectedWord.id);

                  if (!cell.isPlayable) {
                    return <div key={`${rIdx}-${cIdx}`} className="crossword-cell black-cell" />;
                  }

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => {
                        setActiveCell({ row: rIdx, col: cIdx });
                        // If cell belongs to a word, highlight that word
                        if (cell.wordIds.length > 0) {
                          const w = currentLevelData.words.find((item) => item.id === cell.wordIds[0]);
                          if (w) setSelectedWord(w);
                        }
                      }}
                      className={`crossword-cell playable-cell ${isSelectedCell ? 'active' : ''} ${isWordCell ? 'word-active' : ''} ${cell.status.toLowerCase()}`}
                    >
                      {cell.cellNumber && <span className="cell-number-badge">{cell.cellNumber}</span>}
                      <span className="cell-letter-text">{cell.value}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Action Buttons: Check Answers & AI Hint */}
            <div className="crossword-actions-row">
              <button
                onClick={handleCheckAnswers}
                className="btn-crossword-check"
                id="btn-check-answers"
              >
                <CheckCircle2 size={18} />
                <span>{language === 'hi' ? 'उत्तर जांचें (Check Answers)' : 'Check Answers'}</span>
              </button>

              <button
                onClick={handleRequestAiHint}
                className="btn-crossword-hint"
                id="btn-ai-hint"
                title="AI-assisted hint based on research paper algorithm"
              >
                <Lightbulb size={18} />
                <span>{language === 'hi' ? 'AI संकेत लें (Get Hint)' : 'AI Hint'}</span>
              </button>
            </div>

            {/* AI Hint Output Box */}
            {aiHintMessage && (
              <div className="crossword-hint-box">
                <Sparkles size={20} color="#b45309" />
                <div className="hint-text">{aiHintMessage}</div>
              </div>
            )}

            {/* Validation Feedback Banner */}
            {validationReport && (
              <div className={`crossword-feedback-banner ${validationReport.type.toLowerCase()}`}>
                {validationReport.type === 'SUCCESS' ? (
                  <CheckCircle2 size={22} color="#15803d" />
                ) : (
                  <AlertCircle size={22} color="#dc2626" />
                )}
                <span>
                  {language === 'hi' ? validationReport.messageHi : validationReport.messageEn}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: Clues Panel & Senior Virtual Keypad */}
          <div className="crossword-clues-container">
            <h3 className="clues-header-title">
              {language === 'hi' ? 'पहेली संकेत (Crossword Clues)' : 'Puzzle Clues'}
            </h3>

            {/* Across Clues */}
            <div className="clues-group">
              <div className="clue-direction-badge">बाएं से दाएं (Across ➔)</div>
              {currentLevelData.words
                .filter((w) => w.direction === 'ACROSS')
                .map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      setSelectedWord(w);
                      setActiveCell({ row: w.row, col: w.col });
                    }}
                    className={`clue-item-card ${selectedWord?.id === w.id ? 'active' : ''}`}
                  >
                    <span className="clue-num">{w.number}.</span>
                    <span className="clue-text">
                      {language === 'hi' ? w.clueHi : w.clueEn}
                    </span>
                  </div>
                ))}
            </div>

            {/* Down Clues */}
            <div className="clues-group">
              <div className="clue-direction-badge">ऊपर से नीचे (Down ⬇)</div>
              {currentLevelData.words
                .filter((w) => w.direction === 'DOWN')
                .map((w) => (
                  <div
                    key={w.id}
                    onClick={() => {
                      setSelectedWord(w);
                      setActiveCell({ row: w.row, col: w.col });
                    }}
                    className={`clue-item-card ${selectedWord?.id === w.id ? 'active' : ''}`}
                  >
                    <span className="clue-num">{w.number}.</span>
                    <span className="clue-text">
                      {language === 'hi' ? w.clueHi : w.clueEn}
                    </span>
                  </div>
                ))}
            </div>

            {/* Senior Large Keypad */}
            <div className="senior-keypad-panel">
              <div className="keypad-label">
                {language === 'hi' ? 'टच कीबोर्ड (Tap Letters):' : 'Senior On-Screen Keyboard:'}
              </div>
              <div className="keypad-keys-grid">
                {alphabet.map((char) => (
                  <button
                    key={char}
                    onClick={() => handleLetterInput(char)}
                    className="keypad-btn"
                  >
                    {char}
                  </button>
                ))}
                <button
                  onClick={handleBackspace}
                  className="keypad-btn backspace-btn"
                  title="Clear letter"
                >
                  ⌫
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .crossword-layout-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .crossword-research-banner {
          background: #ccfbf1;
          border: 1.5px solid #5eead4;
          color: #0f766e;
          border-radius: 16px;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .crossword-level-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 0.5rem 1rem;
          flex-wrap: wrap;
        }
        .crossword-lvl-btn {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          padding: 0.4rem 1rem;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          color: #0f172a;
          transition: all 0.2s;
        }
        .crossword-lvl-btn.active {
          background: #1b4332;
          color: #ffffff;
          border-color: #1b4332;
        }
        .current-level-label {
          margin-left: auto;
          font-size: 0.9rem;
          font-weight: 700;
          color: #15803d;
        }

        .crossword-stage-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 2rem;
          align-items: flex-start;
        }

        /* Matrix styling */
        .crossword-grid-container {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        .crossword-matrix {
          display: grid;
          gap: 6px;
          background: #0f172a;
          padding: 10px;
          border-radius: 18px;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
        }

        .crossword-cell {
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          border-radius: 10px;
          font-size: 1.8rem;
          font-weight: 900;
          user-select: none;
        }
        .black-cell {
          background: #0f172a;
        }
        .playable-cell {
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          border: 2px solid #cbd5e1;
          transition: all 0.2s;
        }
        .playable-cell.word-active {
          background: #fef08a;
        }
        .playable-cell.active {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.35);
          background: #bef226;
        }
        .playable-cell.correct {
          background: #dcfce7;
          border-color: #22c55e;
          color: #15803d;
        }
        .playable-cell.wrong {
          background: #fee2e2;
          border-color: #ef4444;
          color: #dc2626;
        }

        .cell-number-badge {
          position: absolute;
          top: 3px;
          left: 5px;
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
        }

        .crossword-actions-row {
          display: flex;
          gap: 1rem;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-crossword-check {
          background: #1b4332;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 0.85rem 1.6rem;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.25);
        }
        .btn-crossword-hint {
          background: #fef3c7;
          color: #b45309;
          border: 1.5px solid #fde68a;
          border-radius: 12px;
          padding: 0.85rem 1.4rem;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .crossword-hint-box {
          background: #fffbeb;
          border: 1.5px solid #fde68a;
          border-radius: 14px;
          padding: 0.85rem 1.25rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          color: #92400e;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .crossword-feedback-banner {
          border-radius: 14px;
          padding: 0.85rem 1.25rem;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          font-weight: 700;
          font-size: 0.92rem;
        }
        .crossword-feedback-banner.success {
          background: #dcfce7;
          border: 1.5px solid #86efac;
          color: #166534;
        }
        .crossword-feedback-banner.try_again {
          background: #fee2e2;
          border: 1.5px solid #fca5a5;
          color: #991b1b;
        }

        /* Clues panel */
        .crossword-clues-container {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }
        .clues-header-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 1rem;
        }
        .clues-group {
          margin-bottom: 1.25rem;
        }
        .clue-direction-badge {
          font-size: 0.8rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .clue-item-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.65rem 0.85rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          transition: all 0.2s;
        }
        .clue-item-card.active {
          background: #fef08a;
          border-color: #facc15;
        }
        .clue-num {
          font-weight: 900;
          color: #0f172a;
          font-size: 0.9rem;
        }
        .clue-text {
          font-size: 0.88rem;
          color: #334155;
          line-height: 1.4;
        }

        /* Keypad */
        .senior-keypad-panel {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }
        .keypad-label {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 0.6rem;
        }
        .keypad-keys-grid {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 5px;
        }
        .keypad-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0.55rem 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
          cursor: pointer;
          transition: background 0.15s;
        }
        .keypad-btn:hover {
          background: #bef226;
        }
        .backspace-btn {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fca5a5;
        }

        @media (max-width: 900px) {
          .crossword-stage-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </GameContainer>
  );
}
