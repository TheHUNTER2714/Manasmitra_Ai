// ==========================================================================
// ManasMitra AI - Adaptive AI Difficulty & Cognitive Profiling Engine
// Evaluates performance signals and dynamically calibrates cognitive activities
// ==========================================================================

export class AdaptiveAiEngine {
  /**
   * Evaluates a game session and calculates difficulty adjustments & cognitive deltas.
   *
   * @param {Object} sessionData
   * @param {string} sessionData.gameCategory - 'memory' | 'attention' | 'pattern' | 'recall' | 'sound' | 'story'
   * @param {number} sessionData.accuracy - 0 to 100 percentage
   * @param {number} sessionData.reactionTimeMs - Average latency per decision in milliseconds
   * @param {number} sessionData.mistakes - Total incorrect clicks/selections
   * @param {number} sessionData.currentDifficultyLevel - Current level (1 = Easy, 2 = Medium, 3 = Challenge)
   * @param {number} sessionData.previousMovingAvg - User's historical moving average for this category
   * @returns {Object} Adaptive decision report
   */
  static evaluateSession(sessionData) {
    const {
      gameCategory = 'memory',
      accuracy = 80,
      reactionTimeMs = 2000,
      mistakes = 0,
      currentDifficultyLevel = 1,
      previousMovingAvg = 70
    } = sessionData;

    let nextDifficultyLevel = currentDifficultyLevel;
    let difficultyAction = 'MAINTAIN'; // 'INCREASE' | 'MAINTAIN' | 'GENTLE_SUPPORT'
    let rationale = '';
    let rationaleHindi = '';
    let performanceTier = 'Good';

    // 1. Multi-factor decision matrix
    if (accuracy >= 85 && reactionTimeMs <= 2600 && mistakes <= 1) {
      // High competence detected
      if (currentDifficultyLevel < 3) {
        nextDifficultyLevel = currentDifficultyLevel + 1;
        difficultyAction = 'INCREASE';
        rationale = `High accuracy (${accuracy}%) and prompt reaction speed (${(reactionTimeMs / 1000).toFixed(1)}s) indicates high engagement. Escalating difficulty to Level ${nextDifficultyLevel} to maintain optimal cognitive neuro-stimulation.`;
        rationaleHindi = `उत्कृष्ट शुद्धता (${accuracy}%) व त्वरित प्रतिक्रिया गति को देखते हुए AI इंजन ने कठिनाई स्तर बढ़ाकर ${nextDifficultyLevel} कर दिया है।`;
      } else {
        difficultyAction = 'MAINTAIN';
        rationale = `Maximum difficulty level sustained with mastery (${accuracy}% accuracy). Reinforcing working memory stability.`;
        rationaleHindi = `सर्वोच्च स्तर पर उत्कृष्ट प्रदर्शन! याददाश्त को मजबूत बनाए रखने के लिए अभ्यास जारी है।`;
      }
      performanceTier = 'Excellent';
    } else if (accuracy < 60 || mistakes >= 3 || reactionTimeMs > 4500) {
      // User struggled or showed hesitation/confusion
      if (currentDifficultyLevel > 1) {
        nextDifficultyLevel = currentDifficultyLevel - 1;
        difficultyAction = 'GENTLE_SUPPORT';
        rationale = `Elevated hesitation (${(reactionTimeMs / 1000).toFixed(1)}s) or misidentifications detected. Decreasing difficulty to Level ${nextDifficultyLevel} to prevent cognitive fatigue and frustration.`;
        rationaleHindi = `थकावट या उलझन से बचाने के लिए AI इंजन ने सरलता स्तर बढ़ाकर आसान सहायता मोड सक्रिय किया है।`;
      } else {
        difficultyAction = 'MAINTAIN';
        rationale = `Maintaining accessible baseline with additional audio cues and extended memorization windows.`;
        rationaleHindi = `आरामदायक गति से अभ्यास जारी रखें। कोई जल्दबाज़ी नहीं है।`;
      }
      performanceTier = 'Needs Support';
    } else {
      // Stable performance within standard target zone
      difficultyAction = 'MAINTAIN';
      rationale = `Performance consistent within nominal therapeutic range (${accuracy}% accuracy). Maintaining Level ${currentDifficultyLevel} for consolidation.`;
      rationaleHindi = `संतुलित व स्थिर प्रदर्शन (${accuracy}%)। स्मृति स्थिरता हेतु वर्तमान स्तर जारी रखा गया है।`;
      performanceTier = 'Good';
    }

    // 2. Exponential Moving Average update for cognitive domain
    const alpha = 0.35; // Smoothing factor
    const newMovingAvg = Math.round(alpha * accuracy + (1 - alpha) * previousMovingAvg);
    const deltaScore = newMovingAvg - previousMovingAvg;

    return {
      category: gameCategory,
      accuracy,
      reactionTimeMs,
      mistakes,
      previousLevel: currentDifficultyLevel,
      recommendedLevel: nextDifficultyLevel,
      difficultyAction,
      performanceTier,
      rationale,
      rationaleHindi,
      updatedMovingAvg: newMovingAvg,
      deltaScore,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Returns game parameters tailored for each difficulty level
   */
  static getParametersForLevel(level = 1) {
    switch (level) {
      case 2:
        return {
          level: 2,
          name: 'Medium (मध्यम)',
          itemCount: 4,
          countdownSeconds: 7,
          targetCount: 5,
          totalDistractors: 12
        };
      case 3:
        return {
          level: 3,
          name: 'Challenge (उन्नत)',
          itemCount: 6,
          countdownSeconds: 5,
          targetCount: 7,
          totalDistractors: 16
        };
      case 1:
      default:
        return {
          level: 1,
          name: 'Easy (सरल)',
          itemCount: 3,
          countdownSeconds: 10,
          targetCount: 3,
          totalDistractors: 8
        };
    }
  }
}
