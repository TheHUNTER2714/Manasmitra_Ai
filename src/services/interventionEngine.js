// ==========================================================================
// ManasMitra AI — Individualized Intervention & Affective Routine Engine
// Analyzes emotion trends and routine patterns to prescribe:
// 1. Music Therapy (Folk ragas, soundscapes, 432Hz restorative frequencies)
// 2. Cognitive Games (Adaptive difficulty matching emotional energy)
// 3. Relaxing Activities (4-7-8 Pranayama, valley nature visualizer)
// ==========================================================================

import { offlineSyncEngine } from './offlineSyncEngine';
import { speechService } from './speechService';

export class InterventionEngine {
  /**
   * Evaluates emotion trends and routine patterns to generate an individualized care plan
   * @param {Object} params
   * @param {string} params.currentMood - '😊' | '🙂' | '😐' | '😔' | '😟'
   * @param {Array} params.recentMoodHistory - Array of recent mood entries { emoji, label, date }
   * @param {Array} params.medications - Medication checklist
   * @param {Array} params.routineChecklist - Daily routine tasks
   * @param {number} params.cognitiveScore - Current moving average
   */
  static analyzeTrendsAndPrescribe({
    currentMood = '😊',
    recentMoodHistory = [],
    medications = [],
    routineChecklist = [],
    cognitiveScore = 82
  }) {
    // 1. Emotion Trend Analysis
    const anxietyOrSadCount = (recentMoodHistory || []).filter(
      (m) => m.emoji === '😔' || m.emoji === '😟'
    ).length;
    const isAnxiousOrLow = currentMood === '😔' || currentMood === '😟' || anxietyOrSadCount >= 2;
    const isNeutralOrFatigued = currentMood === '😐';
    const isJoyfulOrStable = currentMood === '😊' || currentMood === '🙂';

    // 2. Routine Pattern Analysis
    const totalMeds = (medications && medications.length) || 1;
    const takenMeds = (medications || []).filter((m) => m.taken).length;
    const medAdherence = Math.round((takenMeds / totalMeds) * 100);

    const routineItems = routineChecklist || [];
    const routineCompleted = routineItems.filter((r) => r.done).length;
    const routineAdherence = routineItems.length > 0
      ? Math.round((routineCompleted / routineItems.length) * 100)
      : 80;

    let routineStatus = 'OPTIMAL';
    if (medAdherence < 60 || routineAdherence < 50) {
      routineStatus = 'DISRUPTED';
    } else if (medAdherence < 100 || routineAdherence < 80) {
      routineStatus = 'PARTIAL';
    }

    // 3. Synthesize Individualized Interventions
    let musicTherapy = {};
    let recommendedGame = {};
    let relaxingActivity = {};
    let clinicalRationale = '';
    let clinicalRationaleHi = '';

    if (isAnxiousOrLow) {
      // Calming, restorative therapy
      musicTherapy = {
        title: 'Bansuri & Evening Raga Yaman (बांसुरी व राग यमन)',
        tempo: '48 BPM • Soothing / Slow',
        frequency: '432 Hz Solfeggio Harmonic',
        description: 'Gentle bamboo flute tuned to natural healing harmonics to alleviate heart rate acceleration and mild cognitive agitation.',
        audioTrackId: 'raga-yaman',
        icon: '🎵'
      };

      recommendedGame = {
        id: 'sound',
        name: 'Sound & Object Match (ध्वनि पहचान)',
        level: 1,
        reason: 'Gentle auditory stimulus requires low cognitive strain while engaging temporal lobe pathways.',
        icon: '🔔'
      };

      relaxingActivity = {
        type: 'pranayama',
        title: '4-7-8 शांत प्राणायाम (Deep Calming Breathing)',
        duration: '3 Minutes',
        steps: [
          'Inhale through nose smoothly for 4 seconds',
          'Hold breath gently for 7 seconds',
          'Exhale through mouth with soft sigh for 8 seconds'
        ],
        icon: '🫁'
      };

      clinicalRationale = 'Detected affective distress or anxiety pattern. Intervening with parasympathetic nerve stimulation via slow-tempo modal ragas and simplified acoustic matching.';
      clinicalRationaleHi = 'तनाव या घबराहट के संकेत मिलने पर AI ने शांत राग यमन बांसुरी धुन और सरल ध्वनि खेल की व्यक्तिगत सिफारिश की है।';

    } else if (isNeutralOrFatigued) {
      // Uplifting yet non-taxing therapy
      musicTherapy = {
        title: 'Assamese Borgeet & Morning Flute (असमिया बोरगीत व प्रभात धुन)',
        tempo: '64 BPM • Gentle Awakening',
        frequency: '528 Hz Transformation Harmonic',
        description: 'Traditional melodic devotion invoking familiar regional memory landscapes of Assam and Brahmaputra valley.',
        audioTrackId: 'borgeet-flute',
        icon: '🎶'
      };

      recommendedGame = {
        id: 'story',
        name: 'Regional Story Recall (लोककथा स्मरण)',
        level: 1,
        reason: 'Comforting narrative listening stimulates long-term cultural recall without time pressure.',
        icon: '📖'
      };

      relaxingActivity = {
        type: 'sensory',
        title: 'हर्बल चाय व स्मृति चिंतन (Warm Tea & Sensory Pause)',
        duration: '5 Minutes',
        steps: [
          'Sip warm Assam orthodox or herbal tea slowly',
          'Observe the warmth of the cup in your hands',
          'Listen to the garden sounds outside your window'
        ],
        icon: '🍵'
      };

      clinicalRationale = 'Neutral affect with potential daytime cognitive fatigue. Applying culturally grounded narrative therapy to reactivate autobiographical memory anchors.';
      clinicalRationaleHi = 'हल्की सुस्ती या उदासीनता को दूर करने के लिए परिचित असमिया लोककथा व बोरगीत धुन का चयन किया गया है।';

    } else {
      // Vibrant, neuro-stimulating therapy
      musicTherapy = {
        title: 'Bihu Folk Rhythm & Santoor (बिहू लोकधुने व संतूर)',
        tempo: '78 BPM • Uplifting & Alert',
        frequency: 'Standard Concert Pitch 440 Hz',
        description: 'Vibrant rhythmic patterns that boost dopamine, motor synchronization, and positive memory consolidation.',
        audioTrackId: 'bihu-santoor',
        icon: '🪕'
      };

      recommendedGame = {
        id: 'crossword',
        name: 'शब्द पहेली (AI Crossword Memory Game)',
        level: cognitiveScore >= 85 ? 3 : cognitiveScore >= 75 ? 2 : 1,
        reason: 'Research-backed semantic diction (Pillai et al. 2011; Khairunisa et al. 2024): stimulates neural lexical associations and delays memory decline by 2.54 years.',
        icon: '✨'
      };

      relaxingActivity = {
        type: 'walk',
        title: 'हल्की धूप व आंगन में चहलकदमी (Gentle Garden Stroll)',
        duration: '10 Minutes',
        steps: [
          'Walk slowly in courtyard or balcony in morning sunlight',
          'Notice green plants, birds, and flowers around you',
          'Keep a glass of fresh water nearby'
        ],
        icon: '🌿'
      };

      clinicalRationale = 'Positive affective state indicates high neuroplastic readiness. Elevating working memory load with regional memory challenges.';
      clinicalRationaleHi = 'प्रसन्नचित्त मनोदशा संज्ञानात्मक अभ्यास के लिए उत्तम है! स्मरण शक्ति को सक्रिय रखने हेतु वस्तु स्मरण खेल की संस्तुति है।';
    }

    return {
      currentMood,
      isAnxiousOrLow,
      routineStatus,
      medAdherence,
      routineAdherence,
      musicTherapy,
      recommendedGame,
      relaxingActivity,
      clinicalRationale,
      clinicalRationaleHi,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Synthesizes and plays soothing generative ragas using Web Audio API
   * completely offline without external audio files!
   */
  static playGenerativeRaga(trackId = 'raga-yaman', onStop) {
    if (typeof window === 'undefined') return null;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;

      const ctx = new AudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
      masterGain.connect(ctx.destination);

      // Tanpura Drone frequencies (Sa - Pa - Sa)
      const baseFreq = 130.81; // C3
      const paFreq = 196.00;   // G3

      // Create warm Tanpura oscillators
      const droneOsc1 = ctx.createOscillator();
      const droneOsc2 = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

      droneOsc1.type = 'triangle';
      droneOsc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      droneOsc2.type = 'sine';
      droneOsc2.frequency.setValueAtTime(paFreq, ctx.currentTime);

      droneOsc1.connect(droneGain);
      droneOsc2.connect(droneGain);
      droneGain.connect(masterGain);

      droneOsc1.start();
      droneOsc2.start();

      // Flute / Bansuri melodic sequence based on track
      let melodyNotes = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88]; // Raga Yaman Kalyan
      if (trackId === 'borgeet-flute') {
        melodyNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Pentatonic Bhoopali
      } else if (trackId === 'bihu-santoor') {
        melodyNotes = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25]; // Joyful folk modal
      }

      let noteIndex = 0;
      const intervalId = setInterval(() => {
        if (ctx.state === 'closed') {
          clearInterval(intervalId);
          return;
        }

        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Warm bamboo flute timbre
        noteOsc.type = 'sine';
        const freq = melodyNotes[noteIndex % melodyNotes.length];
        noteOsc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft attack and gentle breath envelope
        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);

        noteOsc.connect(noteGain);
        noteGain.connect(masterGain);

        noteOsc.start();
        noteOsc.stop(ctx.currentTime + 2.3);

        noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % melodyNotes.length;
      }, 1800);

      // Return controller object
      return {
        stop: () => {
          clearInterval(intervalId);
          try {
            masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            setTimeout(() => {
              droneOsc1.stop();
              droneOsc2.stop();
              ctx.close();
              if (onStop) onStop();
            }, 600);
          } catch (e) {
            console.warn('Audio context close error:', e);
          }
        }
      };
    } catch (err) {
      console.warn('Web Audio synthesis error:', err);
      return null;
    }
  }
}
