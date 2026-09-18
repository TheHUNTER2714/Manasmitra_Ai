import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, CornerDownLeft } from 'lucide-react';
import { speechService, adaptSpeechPronunciation } from '../../services/speechService';
import AiSahayakLogo from './AiSahayakLogo';
import { parseVoiceIntent } from '../../data/voiceIntents';

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  initialQuery = '',
  language = 'hi',
  onTriggerAction
}) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleProcessQuery = useCallback((queryText) => {
    setTranscript(queryText);
    const matchedIntent = parseVoiceIntent(queryText);

    if (matchedIntent) {
      const reply = language === 'hi'
        ? matchedIntent.spokenResponseHindi
        : matchedIntent.spokenResponseEnglish;

      const gender = speechService.getVoiceGender();
      const adaptedReply = adaptSpeechPronunciation(reply, gender, language);

      setResponseMessage(adaptedReply);
      setIsSpeaking(true);

      speechService.speak(reply, language === 'hi' ? 'hi-IN' : 'en-IN', () => {
        setIsSpeaking(false);
      });

      // If action is requested (e.g. open games, open reminders, call caregiver)
      if (matchedIntent.action && matchedIntent.action !== 'none' && onTriggerAction) {
        setTimeout(() => {
          onTriggerAction(matchedIntent.action);
          onClose();
        }, 3200);
      }
    }
  }, [language, onClose, onTriggerAction]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleProcessQuery(initialQuery);
    }
  }, [isOpen, initialQuery, handleProcessQuery]);

  const handleStartListening = () => {
    setIsListening(true);
    setResponseMessage('');

    const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
    const started = speechService.startListening(
      langCode,
      (text) => {
        setTranscript(text);
        setIsListening(false);
        handleProcessQuery(text);
      },
      (_err) => {
        setIsListening(false);
        setResponseMessage(
          language === 'hi'
            ? 'आवाज़ सुनने में परेशानी हुई। कृपया नीचे दिए गए उदाहरण प्रश्नों पर टैप करें।'
            : 'Could not capture speech. Please tap any of the sample questions below.'
        );
      }
    );

    if (!started) {
      setIsListening(false);
      setResponseMessage(
        language === 'hi'
          ? 'माइक्रोफ़ोन सक्रिय नहीं है। आप नीचे दिए गए किसी भी प्रश्न पर टैप कर सकते हैं।'
          : 'Microphone not detected. You can tap any sample query below.'
      );
    }
  };

  const handleStopListening = () => {
    speechService.stopListening();
    setIsListening(false);
  };

  if (!isOpen) return null;

  const sampleQueries = language === 'hi' ? [
    'मेरी अगली दवाई कब है? (When is my medicine?)',
    'चलो आज का मेमोरी गेम खेलें (Start memory game)',
    'आज कितना पानी पिया है? (Check hydration)',
    'डॉक्टर से अपॉइंटमेंट कब है? (Doctor appointment)',
    'आज मन थोड़ा उदास लग रहा है (Feeling low)'
  ] : [
    'When is my next medicine?',
    'Start today\'s cognitive memory game',
    'How much water have I logged today?',
    'When is my doctor appointment?',
    'I am feeling a little anxious today'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '580px', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AiSahayakLogo size="sm" isSpeaking={isSpeaking} gender={speechService.getVoiceGender()} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1b4332', margin: 0 }}>
              मानस मित्र वाणी (ManasMitra Voice Assistant)
            </h3>
          </div>
          <button
            onClick={() => {
              speechService.stopSpeaking();
              speechService.stopListening();
              onClose();
            }}
            style={{ background: 'transparent', color: '#64748b' }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          {language === 'hi'
            ? 'बोलकर कुछ भी पूछें — दवाइयां, पानी, खेल या अपनी भावनाएं।'
            : 'Speak naturally to ask about medicine, hydration, cognitive games, or mood.'}
        </p>

        {/* Pulsing Audio Circle */}
        <div
          className="voice-pulse-circle"
          onClick={isListening ? handleStopListening : handleStartListening}
          style={{ cursor: 'pointer' }}
          title={isListening ? 'Tap to stop' : 'Tap to speak'}
        >
          {isListening ? <Mic size={38} color="#ffffff" /> : <MicOff size={38} color="#ffffff" />}
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: isListening ? '#15803d' : '#1e293b', marginBottom: '1.5rem' }}>
          {isListening
            ? 'सुन रहे हैं... कृपया बोलिए (Listening... Speak now)'
            : 'माइक पर टैप करके बोलें (Tap circle to speak)'}
        </div>

        {/* Transcript Box */}
        {transcript && (
          <div style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              आपने कहा (You said):
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
              "{transcript}"
            </div>
          </div>
        )}

        {/* AI Response Box */}
        {responseMessage && (
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Volume2 size={16} /> मानस मित्र का उत्तर (Assistant Reply):
              </div>
              {isSpeaking && (
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '9999px' }}>
                  बोल रहे हैं (Speaking...)
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.15rem', color: '#14532d', fontWeight: 600, marginTop: '0.4rem', lineHeight: 1.5 }}>
              {responseMessage}
            </div>
          </div>
        )}

        {/* 1-Tap Sample Evaluator Queries for quick testing without microphone */}
        <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569', marginBottom: '0.6rem' }}>
            💡 त्वरित परीक्षण प्रश्न (Tap any sample query to test):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sampleQueries.map((query, i) => (
              <button
                key={i}
                onClick={() => handleProcessQuery(query)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#1e293b',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span>{query}</span>
                <CornerDownLeft size={16} color="#64748b" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
