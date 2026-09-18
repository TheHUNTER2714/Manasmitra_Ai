// ==========================================================================
// ManasMitra AI - Speech & Audio Service
// Features:
// 1. Text-To-Speech (TTS) with Male / Female Persona selection
// 2. Comprehensive Multilingual Voice Mapping across 11 Pan-India & NER Languages
// 3. Complete Emoji Stripping from both Spoken Audio and Written Transcripts
// 4. Adaptive Pronunciation & Grammatical Verbal Agreement (Hindi / Indic / English)
// 5. Intelligent Script-Aware Voice Chaining (Eastern Indic, Devanagari, Latin)
// 6. Speech-To-Text (STT) with polite fallback and audio chime feedback
// ==========================================================================

const VOICE_GENDER_STORAGE_KEY = 'manasmitra_ai_voice_gender';

// Comprehensive regex for all Unicode emojis, symbols, and pictographs
export const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B50}\u{200D}\u{FE0F}\u{FE0E}]/gu;

/**
 * Clean all emojis and presentation artifacts from text
 */
export function stripEmojis(text = '') {
  if (!text) return '';
  return text
    .replace(EMOJI_REGEX, '')
    .replace(/[•●▪]/g, '-')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

/**
 * Adapt text pronunciation and grammatical agreement to match voice gender.
 * In Hindi and Indic languages, first-person verbal inflections agree with speaker gender:
 * - Female: "कर सकती हूँ", "बता रही हूँ", "समझ रही हूँ", "करूँगी", "बताऊँगी", "सहायिका"
 * - Male:   "कर सकता हूँ", "बता रहा हूँ", "समझ रहा हूँ", "करूँगा", "बताऊँगा", "सहायक"
 */
export function adaptSpeechPronunciation(text = '', gender = 'female', lang = 'hi') {
  if (!text) return '';
  
  // Guarantee no emojis in text
  let adapted = stripEmojis(text);

  const isFemale = gender === 'female';

  if (lang.startsWith('hi') || lang === 'hi') {
    if (isFemale) {
      adapted = adapted
        .replace(/कर सकता हूँ/g, 'कर सकती हूँ')
        .replace(/कर सकता हु/g, 'कर सकती हूँ')
        .replace(/सकता हूँ/g, 'सकती हूँ')
        .replace(/सकता हु/g, 'सकती हूँ')
        .replace(/बता रहा हूँ/g, 'बता रही हूँ')
        .replace(/बता रहा हु/g, 'बता रही हूँ')
        .replace(/रहा हूँ/g, 'रही हूँ')
        .replace(/रहा हु/g, 'रही हूँ')
        .replace(/समझ रहा हूँ/g, 'समझ रही हूँ')
        .replace(/मदद करूँगा/g, 'मदद करूँगी')
        .replace(/करूँगा/g, 'करूँगी')
        .replace(/बताऊँगा/g, 'बताऊँगी')
        .replace(/सकूँगा/g, 'सकूँगी')
        .replace(/AI सहायक\b/g, 'AI सहायिका')
        .replace(/सहायक हूँ/g, 'सहायिका हूँ')
        .replace(/आपका मानस मित्र सहायक/g, 'आपकी मानस मित्र सहायिका')
        .replace(/आपका डिजिटल सहायक/g, 'आपकी डिजिटल सहायिका');
    } else {
      adapted = adapted
        .replace(/कर सकती हूँ/g, 'कर सकता हूँ')
        .replace(/कर सकती हु/g, 'कर सकता हूँ')
        .replace(/सकती हूँ/g, 'सकता हूँ')
        .replace(/सकती हु/g, 'सकता हूँ')
        .replace(/बता रही हूँ/g, 'बता रहा हूँ')
        .replace(/बता रही हु/g, 'बता रहा हूँ')
        .replace(/रही हूँ/g, 'रहा हूँ')
        .replace(/रही हु/g, 'रहा हूँ')
        .replace(/समझ रही हूँ/g, 'समझ रहा हूँ')
        .replace(/मदद करूँगी/g, 'मदद करूँगा')
        .replace(/करूँगी/g, 'करूँगा')
        .replace(/बताऊँगी/g, 'बताऊँगा')
        .replace(/सकूँगी/g, 'सकूँगा')
        .replace(/AI सहायिका\b/g, 'AI सहायक')
        .replace(/सहायिका हूँ/g, 'सहायक हूँ')
        .replace(/आपकी मानस मित्र सहायिका/g, 'आपका मानस मित्र सहायक')
        .replace(/आपकी डिजिटल सहायिका/g, 'आपका डिजिटल सहायक');
    }
  } else if (lang.startsWith('en') || lang === 'en') {
    if (isFemale) {
      adapted = adapted
        .replace(/male care assistant/gi, 'female care companion')
        .replace(/AI assistant/gi, 'AI companion and assistant');
    } else {
      adapted = adapted
        .replace(/female care companion/gi, 'male care assistant')
        .replace(/AI companion and assistant/gi, 'AI assistant');
    }
  }

  return adapted;
}

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.voices = [];

    // Load initial gender persona from storage or default to female
    this.voiceGender = 'female';
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(VOICE_GENDER_STORAGE_KEY);
        if (saved === 'male' || saved === 'female') {
          this.voiceGender = saved;
        }
      } catch {
        // LocalStorage access fallback
      }
    }

    // Cache available synthesis voices
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }

    // Initialize Web Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'hi-IN';

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (this.onResultCallback) {
            this.onResultCallback(transcript);
          }
          this.isListening = false;
        };

        this.recognition.onerror = (err) => {
          console.warn('Speech recognition warning/error:', err);
          if (this.onErrorCallback) {
            this.onErrorCallback(err);
          }
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch {
      this.voices = [];
    }
  }

  // Get current active voice gender
  getVoiceGender() {
    return this.voiceGender;
  }

  // Set voice gender ('female' | 'male') and persist
  setVoiceGender(gender) {
    if (gender === 'male' || gender === 'female') {
      this.voiceGender = gender;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(VOICE_GENDER_STORAGE_KEY, gender);
        } catch (e) {
          console.warn('Failed to save voice gender to localStorage:', e);
        }
      }
    }
  }

  // Resolve speech voice code for all Indian & NER languages
  resolveVoiceLang(langCode = 'hi') {
    const clean = (langCode || 'hi').toLowerCase().split('-')[0];
    const langMap = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'as': 'as-IN', // Assamese
      'bn': 'bn-IN', // Bengali
      'brx': 'hi-IN', // Bodo uses Devanagari script phonetics
      'kha': 'en-IN', // Khasi uses Latin script phonetics
      'grt': 'en-IN', // Garo uses Latin script phonetics
      'mni': 'bn-IN', // Manipuri uses Eastern Indic / Bengali script phonetics
      'lus': 'en-IN', // Mizo uses Latin script phonetics
      'naga': 'en-IN', // Nagamese uses Latin script phonetics
      'trp': 'bn-IN'  // Kokborok uses Eastern Indic / Bengali phonetics
    };
    return langMap[clean] || 'hi-IN';
  }

  // Find optimal voice matching target language, script family, and gender persona
  findBestVoice(langCode = 'hi-IN', gender = this.voiceGender) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const targetLang = (langCode || 'hi-IN').toLowerCase();
    const shortLang = targetLang.substring(0, 2);
    const isFemale = gender === 'female';

    // Gender keyword tokens
    const femaleTokens = /(female|zira|kalpana|lekha|neerja|geeta|swara|aditi|kavya|priya|samantha|victoria|karen|moira|fiona|susan|catherine|hazel|veena|sangeeta)/i;
    const maleTokens = /(male|david|hemant|ravi|madhur|george|mark|alex|daniel|oliver|rishi|james|richard|tom|neeraj|ashok)/i;
    const targetPattern = isFemale ? femaleTokens : maleTokens;

    // 1. Direct exact language match
    const exactVoices = this.voices.filter(v => 
      v.lang && (v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(shortLang))
    );

    if (exactVoices.length > 0) {
      const genderMatch = exactVoices.find(v => targetPattern.test(v.name));
      if (genderMatch) return genderMatch;
      return exactVoices[0];
    }

    // 2. Script-aware intelligent voice chaining for Indian & NER languages:
    // Eastern Indic family (Assamese 'as', Manipuri 'mni', Kokborok 'trp'):
    // If no direct voice exists, use Bengali 'bn-IN', which shares the same script and phonology
    if (shortLang === 'as' || targetLang.includes('as') || shortLang === 'mn' || shortLang === 'tr') {
      const bengaliVoices = this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('bn'));
      if (bengaliVoices.length > 0) {
        const bnGenderMatch = bengaliVoices.find(v => targetPattern.test(v.name));
        if (bnGenderMatch) return bnGenderMatch;
        return bengaliVoices[0];
      }
    }

    // 3. Devanagari family (Hindi 'hi', Bodo 'brx'):
    // If exact voice not found, look for any Hindi or Marathi voice
    if (shortLang === 'hi' || shortLang === 'br' || targetLang.includes('hi')) {
      const hindiVoices = this.voices.filter(v => v.lang && (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().startsWith('mr')));
      if (hindiVoices.length > 0) {
        const hiGenderMatch = hindiVoices.find(v => targetPattern.test(v.name));
        if (hiGenderMatch) return hiGenderMatch;
        return hindiVoices[0];
      }
    }

    // 4. Indian English family (en-IN, Khasi, Garo, Mizo, Nagamese)
    const indianVoices = this.voices.filter(v => v.lang && v.lang.toLowerCase().includes('in'));
    if (indianVoices.length > 0) {
      const inGenderMatch = indianVoices.find(v => targetPattern.test(v.name));
      if (inGenderMatch) return inGenderMatch;
      return indianVoices[0];
    }

    // 5. Fallback: Any voice matching target gender
    const anyGenderMatch = this.voices.find(v => targetPattern.test(v.name));
    if (anyGenderMatch) return anyGenderMatch;

    // 6. Default system voice
    return this.voices.find(v => v.default) || (this.voices.length > 0 ? this.voices[0] : null);
  }

  // Speak text in any of the 11 supported languages with ZERO emojis and adaptive pronunciation
  speak(text, lang = 'hi', onEnd, genderOverride = null) {
    if (!this.synth) {
      console.log('[TTS Simulation]:', text);
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Cancel any ongoing speech to avoid overlap
      const resolvedLang = this.resolveVoiceLang(lang);
      const gender = genderOverride || this.voiceGender;

      // Adapt text pronunciation according to gender and strip all emojis
      const adaptedText = adaptSpeechPronunciation(text, gender, lang);

      // Clean markdown symbols, bullets, asterisks, brackets, and emojis
      const cleanSpokenText = stripEmojis(adaptedText)
        .replace(/[*_#•`~>]/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/[-–—]/g, ' ')
        .replace(/\n+/g, '. ')
        .replace(/\s{2,}/g, ' ')
        .trim();

      if (!cleanSpokenText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      utterance.lang = resolvedLang;

      // Find best gender-matched voice
      const bestVoice = this.findBestVoice(resolvedLang, gender);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Precise Pitch & Rate calibration based on gender:
      // Female: Warm, clear, bright pitch (1.18) with comfortable tempo (0.88)
      // Male:   Calm, deep, resonant pitch (0.84) with gentle tempo (0.86)
      if (gender === 'female') {
        utterance.pitch = 1.18;
        utterance.rate = 0.88;
      } else {
        utterance.pitch = 0.84;
        utterance.rate = 0.86;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = () => onEnd();
      }

      this.synth.speak(utterance);
    } catch (e) {
      console.warn('TTS execution warning:', e);
      if (onEnd) onEnd();
    }
  }

  // Preview the voice immediately upon toggling gender in active language (No emojis)
  previewVoice(gender = this.voiceGender, lang = 'hi', onEnd) {
    const isFemale = gender === 'female';
    const cleanLang = (lang || 'hi').toLowerCase().split('-')[0];

    const previewGreetings = {
      hi: isFemale
        ? 'नमस्ते! मैं आपकी मानस मित्र सहायिका हूँ। मैं आपकी सहायता के लिए उपस्थित हूँ।'
        : 'नमस्ते! मैं आपका मानस मित्र सहायक हूँ। मैं आपकी सहायता के लिए तैयार हूँ।',
      en: isFemale
        ? 'Hello! I am your ManasMitra care companion. Ready to assist you.'
        : 'Hello! I am your ManasMitra care assistant. Ready to support you.',
      as: isFemale
        ? 'নমস্কাৰ! মই আপোনাৰ মানস মিত্ৰ সহায়িকা। মই আপোনাক সহায় কৰিবলৈ সাজু।'
        : 'নমস্কাৰ! মই আপোনাৰ মানস মিত্ৰ সহায়ক। মই আপোনাক সহায় কৰিবলৈ সাজু।',
      bn: isFemale
        ? 'নমস্কার! আমি আপনার মানস মিত্র সহায়িকা। আপনার সেবায় সর্বদা প্রস্তুত।'
        : 'নমস্কার! আমি আপনার মানস মিত্র সহায়ক। আপনার সেবায় সর্বদা প্রস্তুত।',
      brx: isFemale
        ? 'खुलुमबाय! आं नोंथांनि मानस मित्र हेफाजाबगिरि। आं हेफाजाब होनो थाखाय थियारि।'
        : 'खुलुमबाय! आं नोंथांनि मानस मित्र हेफाजाबगिरि। आं हेफाजाब होनो थाखाय थियारि।',
      kha: isFemale
        ? 'Khublei! Nga dei ka ManasMitra iarap jong phi. Nga kloi ban iarap ia phi.'
        : 'Khublei! Nga dei u ManasMitra iarap jong phi. Nga kloi ban iarap ia phi.',
      grt: isFemale
        ? 'Mitela! Anga nang·ni ManasMitra dakchakgipa ong·a. Anga dakchakna tarie donga.'
        : 'Mitela! Anga nang·ni ManasMitra dakchakgipa ong·a. Anga dakchakna tarie donga.',
      mni: isFemale
        ? 'খুরুমজরি! ঐহাক নহাক্কী মানস মিত্র মতেং পাংবীনি। ঐহাক মতেং পাংনবা থৌরাং তৌরে।'
        : 'খুরুমজরি! ঐহাক নহাক্কী মানস মিত্র মতেং পাংবনি। ঐহাক মতেং পাংনবা থৌরাং তৌরে।',
      lus: isFemale
        ? 'Chibai! I ManasMitra puihtu ka ni e. Puih tur chein ka inpeih e.'
        : 'Chibai! I ManasMitra puihtu ka ni e. Puih tur chein ka inpeih e.',
      naga: isFemale
        ? 'Namaste! Ami apuni laga ManasMitra sahayak ase. Modot koribole tayar ase.'
        : 'Namaste! Ami apuni laga ManasMitra sahayak ase. Modot koribole tayar ase.',
      trp: isFemale
        ? 'Khulumkha! Ang nini ManasMitra chubagwlak. Chuba rwnani thwi tongo.'
        : 'Khulumkha! Ang nini ManasMitra chubagwlak. Chuba rwnani thwi tongo.'
    };

    const greeting = previewGreetings[cleanLang] || previewGreetings.hi;
    this.speak(greeting, cleanLang, onEnd, gender);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  stop() {
    this.stopSpeaking();
  }

  // Start listening to user microphone with resolved language
  startListening(lang = 'hi', onResult, onError) {
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    if (!this.recognition) {
      console.info('SpeechRecognition API not available in browser, using fallback prompt dispatcher.');
      return false;
    }

    try {
      this.recognition.lang = this.resolveVoiceLang(lang);
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      if (onError) onError(e);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Gentle audio chime for positive reinforcement using Web Audio API
  playChime(type = 'success') {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'tap') {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'gentle-bell') {
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 1.2);
      } else {
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // AudioContext might be constrained before user gesture
    }
  }
}

export const speechService = new SpeechService();
