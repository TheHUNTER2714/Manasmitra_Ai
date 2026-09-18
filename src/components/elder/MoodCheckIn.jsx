import React, { useState } from 'react';
import { Heart, Sparkles, Check } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';

export default function MoodCheckIn({ currentMood, onMoodSelect, language = 'hi' }) {
  const [selectedMood, setSelectedMood] = useState(currentMood || null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const moods = [
    {
      emoji: '😊',
      labelHi: 'प्रसन्न (Happy)',
      labelEn: 'Happy',
      replyHi: 'यह जानकर बहुत खुशी हुई कि आपका मन प्रसन्न है! चलिए थोड़ा मस्तिष्क व्यायाम करते हैं।',
      replyEn: 'So happy to hear you are feeling joyful today! Let us do a light brain game.'
    },
    {
      emoji: '🙂',
      labelHi: 'अच्छा (Good)',
      labelEn: 'Good',
      replyHi: 'सुंदर! आपका दिन सुखद और शांतिपूर्ण रहे।',
      replyEn: 'Wonderful! Wishing you a peaceful and pleasant day.'
    },
    {
      emoji: '😐',
      labelHi: 'सामान्य (Okay)',
      labelEn: 'Okay',
      replyHi: 'कोई बात नहीं दादाजी। थोड़ा सा ताज़ा पानी पीजिए और आराम कीजिए।',
      replyEn: 'That is completely alright Dadaji. Take a sip of water and rest well.'
    },
    {
      emoji: '😔',
      labelHi: 'उदास (Sad)',
      labelEn: 'Feeling Low',
      replyHi: 'हम आपके साथ हैं दादाजी। क्या आप अपनी बेटी अनीता से बात करना चाहेंगे या मधुर धुन सुनना चाहेंगे?',
      replyEn: 'We are right here with you. Would you like to call Anita or listen to gentle folk music?'
    },
    {
      emoji: '😟',
      labelHi: 'चिंतित (Anxious)',
      labelEn: 'Worried',
      replyHi: 'गहरी सांस लें दादाजी। सब कुछ ठीक है। आपकी देखभाल के लिए हम सब यहाँ हैं।',
      replyEn: 'Take a slow, deep breath Dadaji. Everything is safe. We are all here for you.'
    }
  ];

  const handleSelect = (m) => {
    setSelectedMood(m.emoji);
    const text = language === 'hi' ? m.replyHi : m.replyEn;
    setFeedbackMsg(text);

    speechService.playChime('gentle-bell');
    speechService.speak(text, language === 'hi' ? 'hi-IN' : 'en-IN');

    // Record into offline sync queue
    offlineSyncEngine.recordEvent('MOOD_LOGGED', {
      moodEmoji: m.emoji,
      moodLabel: language === 'hi' ? m.labelHi : m.labelEn,
      timestamp: new Date().toISOString()
    });

    if (onMoodSelect) {
      onMoodSelect(m.emoji, language === 'hi' ? m.labelHi : m.labelEn);
    }
  };

  return (
    <div className="card" style={{ padding: '2rem', border: '2px solid #e2e8f0', borderRadius: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
        <Heart color="#e11d48" size={26} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
          {language === 'hi' ? 'आज आप कैसा महसूस कर रहे हैं?' : 'How are you feeling today?'}
        </h3>
      </div>
      <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '1.75rem' }}>
        {language === 'hi'
          ? 'अपनी भावना चुनिए — आपकी मानसिक व भावनात्मक संतुष्टि हमारे लिए सबसे महत्वपूर्ण है।'
          : 'Tap the face that matches your feelings today.'}
      </p>

      {/* Mood Faces Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {moods.map((m, i) => {
          const isSelected = selectedMood === m.emoji;
          return (
            <button
              key={i}
              onClick={() => handleSelect(m)}
              style={{
                background: isSelected ? '#f0fdf4' : '#ffffff',
                border: isSelected ? '3px solid #16a34a' : '2px solid #e2e8f0',
                borderRadius: '18px',
                padding: '1.25rem 0.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: isSelected ? '0 0 0 4px rgba(22, 163, 74, 0.15)' : 'var(--shadow-sm)',
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '3rem', lineHeight: 1 }}>{m.emoji}</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 700, color: isSelected ? '#15803d' : '#334155' }}>
                {language === 'hi' ? m.labelHi : m.labelEn}
              </span>
              {isSelected && (
                <span style={{ background: '#16a34a', color: 'white', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reassuring feedback box */}
      {feedbackMsg && (
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          color: '#166534',
          fontSize: '1.2rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Sparkles size={24} color="#16a34a" />
          <span>{feedbackMsg}</span>
        </div>
      )}
    </div>
  );
}
