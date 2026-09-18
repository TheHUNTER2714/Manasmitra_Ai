import React, { useState } from 'react';
import { Brain, Mic, Pill, Heart, Droplets, Clock, Sparkles, PhoneCall, UserPlus, PhoneForwarded, Music, Calendar, MessageSquare, Upload } from 'lucide-react';
import { CULTURAL_PACKS } from '../../data/culturalPacks';
import IndividualizedInterventionModal from '../common/IndividualizedInterventionModal';
import BookingModal from '../common/BookingModal';
import ElderMedicineUploadModal from './ElderMedicineUploadModal';
import { InterventionEngine } from '../../services/interventionEngine';
import { t } from '../../data/translations';

export default function ElderHome({
  elderData,
  setElderData,
  activeCulturalPack,
  onNavigateTab,
  onOpenVoice,
  onOpenRegister,
  onTriggerSos,
  onLaunchGame,
  onOpenFamilyMessage,
  onAddMedicine,
  language = 'hi'
}) {
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isUploadMedicineOpen, setIsUploadMedicineOpen] = useState(false);
  const currentPack = CULTURAL_PACKS[activeCulturalPack] || CULTURAL_PACKS.assam;
  const pendingMeds = elderData.medications.filter(m => !m.taken);

  const intervention = InterventionEngine.analyzeTrendsAndPrescribe({
    currentMood: elderData?.todayMood || '😊',
    recentMoodHistory: elderData?.moodHistory || [],
    medications: elderData?.medications || [],
    routineChecklist: elderData?.dailyRoutine || [],
    cognitiveScore: elderData?.cognitiveIndex || 84
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Hero Greeting Card */}
      <div className="elder-hero-card">
        <div>
          <div className="elder-greeting-badge">
            <Sparkles size={16} /> {currentPack.badge}
          </div>
          <h1 className="elder-hero-title">
            {t('elderMorningGreeting', language, `Good Morning, ${elderData.preferredName} 👋`)}
          </h1>
          <p className="elder-hero-subtitle">
            {t('elderGreetingSub', language, 'Wishing you a peaceful and bright day. What would you like to do?')}
          </p>
        </div>

        {/* Large Voice Button */}
        <button
          className="elder-hero-voice-btn"
          onClick={() => onOpenVoice()}
          id="btn-elder-talk-hero"
        >
          <Mic size={28} color="#1b4332" />
          <span>{t('elderVoiceBtn', language, 'Voice Assistant')}</span>
        </button>
      </div>

      {/* AI Individualized Intervention Banner (Emotion Trends & Routine Patterns) */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
        border: '2px solid #bef226',
        borderRadius: '24px',
        padding: '1.4rem 1.75rem',
        boxShadow: '0 6px 20px rgba(190, 242, 38, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: '#bef226',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            flexShrink: 0
          }}>
            {intervention.musicTherapy.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', background: '#000000', color: '#bef226', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                {t('aiRecBadge', language, 'AI Individualized Recommendation')}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700 }}>
                {t('aiRecSub', language, '● Based on today\'s mood and routine')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {intervention.musicTherapy.title}
            </h3>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
              {language === 'hi' ? intervention.clinicalRationaleHi : intervention.clinicalRationale}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsInterventionOpen(true)}
          style={{
            background: '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.75rem 1.5rem',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        >
          <Music size={16} color="#bef226" />
          <span>{t('btnOpenTherapy', language, 'Open Music & Therapy')} →</span>
        </button>
      </div>

      {/* 2. Registered Family SOS Contacts Card (Dribbble Inspired Contrast Card) */}
      <div style={{
        background: 'linear-gradient(135deg, #0b132b 0%, #172554 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '1.75rem 2rem',
        boxShadow: '0 8px 24px rgba(11, 19, 43, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
            flexShrink: 0
          }}>
            <PhoneForwarded size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.82rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase' }}>
                {t('registeredSosBadge', language, 'Registered Family SOS')}
              </span>
              <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 700 }}>
                {t('familySosActive', language, '● 24/7 Active')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
              {elderData.caregiverName} ({elderData.caregiverRelationship || 'Family'}) • <span style={{ color: '#f43f5e' }}>{elderData.caregiverPhone}</span>
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginTop: '0.15rem' }}>
              {t('familySosText', language, 'In emergency, 1-tap triggers direct SMS, WhatsApp, and phone calls to your designated family contacts.')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Emergency SOS Red Trigger */}
          <button
            onClick={onTriggerSos}
            style={{
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '0.75rem 1.4rem',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
              cursor: 'pointer'
            }}
            id="btn-elder-home-sos"
          >
            <PhoneCall size={18} /> {t('btnSosElderHome', language, 'Emergency SOS')}
          </button>

          {/* Direct Family Message Button */}
          <button
            onClick={onOpenFamilyMessage}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              borderRadius: '14px',
              border: 'none',
              padding: '0.75rem 1.35rem',
              fontWeight: 800,
              fontSize: '0.98rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
            id="btn-elder-family-message"
          >
            <MessageSquare size={18} /> {t('btnFamilyMsgElderHome', language, 'Message Family')}
          </button>

          {/* Set Doctor Reminder Button */}
          <button
            onClick={() => setIsBookingOpen(true)}
            style={{
              background: '#bef226',
              color: '#000000',
              borderRadius: '14px',
              border: 'none',
              padding: '0.75rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(190, 242, 38, 0.4)'
            }}
            id="btn-elder-set-doctor-reminder"
          >
            <Calendar size={16} /> {t('btnSetDoctorElderHome', language, 'Set Doctor Reminder')}
          </button>

          {/* Edit/Register Profile */}
          <button
            onClick={onOpenRegister}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '0.75rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <UserPlus size={16} /> {t('btnChangeProfileElderHome', language, 'Change Profile / SOS')}
          </button>
        </div>
      </div>

      {/* 3. Four Core Elder Action Tiles */}
      <div className="elder-tiles-grid">
        {/* Tile 1: Play Games */}
        <div
          className="elder-action-tile tile-games"
          onClick={() => onNavigateTab('games')}
          id="tile-play-games"
        >
          <div className="tile-icon-badge">
            <Brain size={36} />
          </div>
          <div className="tile-header-group">
            <div className="tile-primary-text">
              {language === 'hi' ? '🧠 खेल खेलें' : 'Play Games'}
            </div>
            <div className="tile-secondary-text">
              {language === 'hi' ? 'याददाश्त व एकाग्रता अभ्यास' : 'Memory & Attention Exercises'}
            </div>
          </div>
          <div className="tile-tag">
            <span>{language === 'hi' ? '6 संज्ञानात्मक खेल →' : '6 Brain Games →'}</span>
          </div>
        </div>

        {/* Tile 2: Talk to AI */}
        <div
          className="elder-action-tile tile-voice"
          onClick={() => onOpenVoice()}
          id="tile-talk-voice"
        >
          <div className="tile-icon-badge">
            <Mic size={36} />
          </div>
          <div className="tile-header-group">
            <div className="tile-primary-text">
              {language === 'hi' ? '🎤 बात करें (Voice)' : 'Talk to AI'}
            </div>
            <div className="tile-secondary-text">
              {language === 'hi' ? 'बोलकर पूछें — दवा, समय या धुन' : 'Ask anything by voice'}
            </div>
          </div>
          <div className="tile-tag">
            <span>{language === 'hi' ? 'वाणी सहायक सक्रिय →' : 'Voice Companion →'}</span>
          </div>
        </div>

        {/* Tile 3: Medicines & Hydration */}
        <div
          className="elder-action-tile tile-meds"
          onClick={() => onNavigateTab('reminders')}
          id="tile-meds-reminders"
        >
          <div className="tile-icon-badge">
            <Pill size={36} />
          </div>
          <div className="tile-header-group">
            <div className="tile-primary-text">
              {language === 'hi' ? '💊 दवाई और पानी' : 'Meds & Water'}
            </div>
            <div className="tile-secondary-text">
              {pendingMeds.length > 0
                ? (language === 'hi' ? `अगली दवा: ${pendingMeds[0].timing}` : `Next: ${pendingMeds[0].timing}`)
                : (language === 'hi' ? 'आज की सभी दवाएं पूरी ✓' : 'All meds taken today ✓')}
            </div>
          </div>
          <div className="tile-tag">
            <span>{language === 'hi' ? 'समय-सारणी देखें →' : 'View Schedule →'}</span>
          </div>
        </div>

        {/* Tile 4: Mood Check-in */}
        <div
          className="elder-action-tile tile-mood"
          onClick={() => onNavigateTab('mood')}
          id="tile-mood-checkin"
        >
          <div className="tile-icon-badge">
            <Heart size={36} />
          </div>
          <div className="tile-header-group">
            <div className="tile-primary-text">
              {language === 'hi' ? '😊 कैसा महसूस हो रहा?' : 'How are you?'}
            </div>
            <div className="tile-secondary-text">
              {language === 'hi'
                ? `वर्तमान मन: ${elderData.todayMood} ${elderData.todayMoodText}`
                : `Today's Mood: ${elderData.todayMood} ${elderData.todayMoodText}`}
            </div>
          </div>
          <div className="tile-tag">
            <span>{language === 'hi' ? 'मन की बात साझा करें →' : 'Check-in Mood →'}</span>
          </div>
        </div>
      </div>

      {/* 4. Quick Status Row (Medicine Alert & Hydration Snapshot) */}
      <div className="elder-status-row">
        {/* Next Med Snapshot */}
        <div className="elder-info-card">
          <div className="info-card-header">
            <span className="info-card-title">
              <Clock size={22} color="#b45309" />
              {language === 'hi' ? 'आज की अगली दवा (Next Medicine)' : 'Next Scheduled Medicine'}
            </span>
            <button
              onClick={() => setIsUploadMedicineOpen(true)}
              style={{
                background: '#052e26',
                color: '#bef226',
                border: '1.5px solid #bef226',
                borderRadius: '9999px',
                padding: '0.4rem 0.95rem',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(5, 46, 38, 0.2)'
              }}
              title="Upload doctor prescription or report to auto-extract medicines and set audio reminder"
            >
              <Upload size={14} />
              <span>{language === 'hi' ? '📄 पर्ची से दवा जोड़ें (AI)' : '📄 Upload Prescription'}</span>
            </button>
          </div>
          {pendingMeds.length > 0 ? (
            <div style={{
              background: '#fffbeb',
              border: '2px solid #fde68a',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e' }}>
                  {pendingMeds[0].name}
                </div>
                <div style={{ color: '#b45309', fontSize: '1rem', marginTop: '0.2rem' }}>
                  समय: <strong>{pendingMeds[0].timing}</strong> ({pendingMeds[0].withFood})
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('reminders')}
                style={{
                  background: '#b45309',
                  color: 'white',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}
              >
                {language === 'hi' ? 'देखें' : 'View'}
              </button>
            </div>
          ) : (
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #bbf7d0',
              borderRadius: '16px',
              padding: '1.25rem',
              color: '#15803d',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>
              ✓ {language === 'hi' ? 'सभी निर्धारित दवाएं समय पर ले ली गई हैं।' : 'All scheduled medicines are up to date!'}
            </div>
          )}
        </div>

        {/* Hydration Tracker Snapshot */}
        <div className="elder-info-card">
          <div className="info-card-header">
            <span className="info-card-title">
              <Droplets size={22} color="#0284c7" />
              {language === 'hi' ? 'ताज़ा पानी (Hydration)' : 'Water Tracker'}
            </span>
            <span style={{ fontWeight: 800, color: '#0284c7', fontSize: '1.1rem' }}>
              {elderData.waterGlassesToday} / {elderData.waterGoal} {language === 'hi' ? 'गिलास' : 'Glasses'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.75rem 0' }}>
            {Array.from({ length: elderData.waterGoal }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '1.5rem',
                  filter: i < elderData.waterGlassesToday ? 'none' : 'grayscale(100%) opacity(0.35)'
                }}
              >
                💧
              </span>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('reminders')}
            style={{
              background: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '0.55rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? 'पानी जोड़ें व नियम देखें →' : 'Log Water & Reminders →'}
          </button>
        </div>
      </div>

      {/* 5. Cultural Memory Pack Banner */}
      <div className="cultural-pack-banner">
        <div className="cultural-banner-left">
          <div className="cultural-badge-circle">
            🏞️
          </div>
          <div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#92400e' }}>
              {currentPack.name} ({currentPack.regionalName})
            </h4>
            <p style={{ color: '#b45309', fontSize: '0.95rem' }}>
              {language === 'hi'
                ? 'क्षेत्रीय संस्कृति, पारंपरिक संगीत, वाद्य यंत्र और जाने-पहचाने प्रतीकों से सजा संज्ञानात्मक मंच।'
                : 'Culturally tailored neuro-engagement with regional artifacts, sounds, and stories.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('games')}
          style={{
            background: '#b45309',
            color: 'white',
            padding: '0.7rem 1.25rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap'
          }}
        >
          {language === 'hi' ? 'संस्कृति खेलें' : 'Play Regional Pack'}
        </button>
      </div>

      {/* Individualized Intervention Modal */}
      <IndividualizedInterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        elderData={elderData}
        onLaunchGame={onLaunchGame}
        language={language}
      />

      {/* Doctor Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        elderData={elderData}
        language={language}
      />

      {/* Upload Prescription / Report & Auto-Set Medicine Reminder Modal */}
      <ElderMedicineUploadModal
        isOpen={isUploadMedicineOpen}
        onClose={() => setIsUploadMedicineOpen(false)}
        onAddMedicine={onAddMedicine}
        language={language}
      />
    </div>
  );
}
