import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  CheckSquare,
  TrendingUp,
  FileText,
  Phone,
  MapPin,
  Sparkles,
  Music,
  Calendar,
  Clock,
  Video,
  UserCheck,
  Bell,
  MessageSquare,
  Send
} from 'lucide-react';
import CognitiveTrendsChart from './CognitiveTrendsChart';
import AlertCenter from './AlertCenter';
import ClinicalReportModal from './ClinicalReportModal';
import BookingModal from '../common/BookingModal';
import IndividualizedInterventionModal from '../common/IndividualizedInterventionModal';
import { InterventionEngine } from '../../services/interventionEngine';
import { AnimatedNumber } from '../common/AnimatedTypography';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { liveMessagingService } from '../../services/liveMessagingService';

export default function CaregiverDashboard({ elderData, onLaunchGame, language = 'hi' }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('manasmitra_active_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Family Messaging State
  const [familyMessages, setFamilyMessages] = useState(() => {
    return liveMessagingService.getMessages();
  });
  const [caregiverReply, setCaregiverReply] = useState('');
  const [incomingMessageAlert, setIncomingMessageAlert] = useState(null);

  useEffect(() => {
    const unsubscribe = liveMessagingService.subscribe((event) => {
      if (event.type === 'NEW_ELDER_MESSAGE') {
        setFamilyMessages(liveMessagingService.getMessages());
        setIncomingMessageAlert(event.message);
        speechService.playChime('notification');
      } else if (event.type === 'NEW_CAREGIVER_REPLY' || event.type === 'STORAGE_UPDATE') {
        setFamilyMessages(liveMessagingService.getMessages());
      }
    });

    const handleStorage = (e) => {
      if (e.key === 'manasmitra_active_bookings' && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const completedMeds = elderData.medications.filter(m => m.taken).length;
  const totalMeds = elderData.medications.length;
  const adherencePercent = Math.round((completedMeds / totalMeds) * 100);

  const intervention = InterventionEngine.analyzeTrendsAndPrescribe({
    currentMood: elderData?.todayMood || '😊',
    recentMoodHistory: elderData?.moodHistory || [],
    medications: elderData?.medications || [],
    routineChecklist: elderData?.dailyRoutine || [],
    cognitiveScore: elderData?.cognitiveIndex || 84
  });

  const handleBookingSuccess = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleSendCaregiverReply = useCallback((textToSend = caregiverReply) => {
    const clean = textToSend.trim();
    if (!clean) return;

    liveMessagingService.sendCaregiverReply(clean, elderData.caregiverName || 'अनीता बरुआ (बेटी)');
    setFamilyMessages(liveMessagingService.getMessages());
    setCaregiverReply('');
    setIncomingMessageAlert(null);

    speechService.playChime('success');
    offlineSyncEngine.recordEvent('FAMILY_REPLY_SENT_BY_CAREGIVER', {
      text: clean,
      recipient: elderData.name,
      timestamp: new Date().toISOString()
    });
  }, [caregiverReply, elderData.caregiverName, elderData.name]);

  return (
    <div className="dashboard-container">
      {/* 1. Patient Overview Card */}
      <div className="patient-overview-card">
        <div className="patient-info-left">
          <div className="patient-avatar-circle">
            👴
          </div>
          <div>
            <div className="patient-name-title">
              {elderData.name}
              <span style={{
                fontSize: '0.8rem',
                background: '#e8f5e9',
                color: '#1b4332',
                padding: '3px 9px',
                borderRadius: '9999px',
                fontWeight: 700
              }}>
                {elderData.supportLevel}
              </span>
            </div>
            <div className="patient-meta-row">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={15} color="#c2410c" /> {elderData.location}
              </span>
              <span>•</span>
              <span>आयु: {elderData.age} वर्ष</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={14} color="#0369a1" /> SOS: <strong>{elderData.caregiverPhone}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Book Consultation & Generate Printable Report */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsBookingOpen(true)}
            style={{
              background: '#bef226',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(190, 242, 38, 0.4)',
              cursor: 'pointer'
            }}
            id="btn-caregiver-set-reminder"
          >
            <Calendar size={18} /> डॉक्टर व स्वास्थ्य रिमाइंडर सेट करें (Set Doctor Reminder)
          </button>
          <button
            onClick={() => setIsReportOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(27, 67, 50, 0.25)',
              cursor: 'pointer'
            }}
            id="btn-generate-report"
          >
            <FileText size={18} /> सारांश रिपोर्ट (Clinical Summary)
          </button>
        </div>
      </div>

      {/* Active / Booked Clinical Consultations Widget */}
      {bookings.length > 0 && (
        <div style={{
          background: '#ffffff',
          border: '2px solid #bef226',
          borderRadius: '20px',
          padding: '1.25rem 1.75rem',
          marginBottom: '1.75rem',
          boxShadow: '0 6px 20px rgba(190, 242, 38, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#bef226', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000' }}>
                <Calendar size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  आगामी डॉक्टर व स्वास्थ्य रिमाइंडर (Doctor & Health Reminders)
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {bookings.length} सक्रिय रिमाइंडर दर्ज हैं • ManasMitra Proactive Voice & SMS Alert Engine
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              + नया डॉक्टर रिमाइंडर जोड़ें (+ Add Doctor Reminder)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
            {bookings.slice(0, 4).map((b) => {
              const docName = b.specialistName || b.doctor?.name || b.doctorName || 'वरिष्ठ विशेषज्ञ';
              const consultTypeText = b.consultationType || b.consultType || 'टेली-हेल्थ';
              const isReminderOn = b.reminderActive ?? true;

              return (
                <div
                  key={b.id}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '0.95rem 1.1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <UserCheck size={15} color="#16a34a" /> {docName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={12} /> {b.date} • {b.time}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#0284c7', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Video size={12} /> {consultTypeText}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: isReminderOn ? '#dcfce7' : '#f1f5f9',
                      color: isReminderOn ? '#166534' : '#64748b',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <Bell size={11} /> {isReminderOn ? '⏰ रिमाइंडर चालू' : 'रिमाइंडर बंद'}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px' }}>
                      {b.referenceId || b.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Four Quick Stat Metric Tiles */}
      <div className="metrics-row">
        {/* Metric 1: Today's Engagement */}
        <div className="metric-card">
          <div className="metric-header">
            <span>दैनिक सक्रियता (Daily Activity)</span>
            <Activity size={18} color="#15803d" />
          </div>
          <div className="metric-value">
            <AnimatedNumber value={42} glow={false} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>मिनट</span>
          </div>
          <div className="metric-sub positive">
            ↗ 12% अधिक सक्रियता (लक्ष्य: 30 मिनट)
          </div>
        </div>

        {/* Metric 2: Games Completed */}
        <div className="metric-card">
          <div className="metric-header">
            <span>संज्ञानात्मक खेल (Games Played)</span>
            <Sparkles size={18} color="#0284c7" />
          </div>
          <div className="metric-value">
            <AnimatedNumber value={4} glow={false} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>सत्र</span>
          </div>
          <div className="metric-sub positive">
            ✓ स्मृति व एकाग्रता मॉड्यूल संपन्न
          </div>
        </div>

        {/* Metric 3: Medication Adherence */}
        <div className="metric-card">
          <div className="metric-header">
            <span>दवा अनुपालन (Med Adherence)</span>
            <CheckSquare size={18} color="#b45309" />
          </div>
          <div className="metric-value">
            <AnimatedNumber value={adherencePercent} suffix="%" glow={true} />
          </div>
          <div className="metric-sub">
            {completedMeds} / {totalMeds} दवाएं समय पर ली गईं
          </div>
        </div>

        {/* Metric 4: Cognitive Index */}
        <div className="metric-card">
          <div className="metric-header">
            <span>संज्ञानात्मक सूचकांक (Cognitive Index)</span>
            <TrendingUp size={18} color="#8b5cf6" />
          </div>
          <div className="metric-value">
            <AnimatedNumber value={elderData.cognitiveBaseline.memoryScore} glow={true} /> <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/ 100</span>
          </div>
          <div className="metric-sub positive">
            +3.5 अंक सुधार (साप्ताहिक औसत)
          </div>
        </div>
      </div>

      {/* 3. Direct Family Message Center Card */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #86efac',
        borderRadius: '24px',
        padding: '1.5rem 1.75rem',
        marginBottom: '1.75rem',
        boxShadow: '0 6px 24px rgba(16, 185, 129, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                दादाजी के साथ पारिवारिक संदेश (Messages from {elderData.preferredName || 'Dadaji'})
              </h4>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                सीधा संपर्क • वृद्धजन हेतु 1-टैप वॉयस व टेक्स्ट मैसेजिंग प्रणाली
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              'दादाजी, हमने आपका संदेश देख लिया है ❤️',
              'शाम को 6 बजे घर आकर मिलते हैं 🏡',
              'दवा समय पर लेने के लिए शाबाश! 💊'
            ].map((quick, i) => (
              <button
                key={i}
                onClick={() => handleSendCaregiverReply(quick)}
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {quick}
              </button>
            ))}
          </div>
        </div>

        {/* Message Stream */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1rem',
          maxHeight: '180px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          marginBottom: '1rem'
        }}>
          {familyMessages.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.88rem', textAlign: 'center', padding: '1rem' }}>
              अभी कोई संदेश नहीं है। आप दादाजी को नीचे से संदेश भेज सकते हैं।
            </div>
          ) : (
            familyMessages.map((m) => {
              const isCaregiver = m.sender === 'caregiver';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isCaregiver ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCaregiver ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                    {m.senderName} • {m.time}
                  </div>
                  <div style={{
                    background: isCaregiver ? '#0f172a' : '#ffffff',
                    color: isCaregiver ? '#ffffff' : '#0f172a',
                    border: isCaregiver ? 'none' : '1px solid #cbd5e1',
                    borderRadius: isCaregiver ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.92rem',
                    lineHeight: 1.4,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Incoming Live Elder Message Alert Banner */}
        {incomingMessageAlert && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
            border: '2px solid #f59e0b',
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
            animation: 'pulseGlow 2s infinite'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📢</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#92400e' }}>
                  दादाजी ({incomingMessageAlert.senderName}) का नया लाइव संदेश:
                </div>
                <div style={{ fontSize: '0.88rem', color: '#78350f', fontWeight: 600, marginTop: '2px' }}>
                  "{incomingMessageAlert.text}" • <span style={{ fontSize: '0.75rem' }}>{incomingMessageAlert.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setCaregiverReply(`नमस्ते दादाजी, मुझे आपका संदेश मिला। हम सब ठीक हैं ❤️`);
              }}
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              तुरंत उत्तर दें
            </button>
          </div>
        )}

        {/* Quick Caring Reply Chips for Caregiver */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {[
            'नमस्ते दादाजी, मैं सुन रही हूँ। सब बिल्कुल ठीक है ❤️',
            'दवाइयाँ समय पर ले लीं ना? पानी भी पीते रहना।',
            'मैं शाम 6 बजे पसंदीदा फल लेकर पहुँच रही हूँ!',
            'आप आराम करें, मैं 10 मिनट में आपको फोन करती हूँ।'
          ].map((chip, cIdx) => (
            <button
              key={cIdx}
              onClick={() => handleSendCaregiverReply(chip)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#334155';
              }}
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Caregiver Reply Input */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <input
            type="text"
            value={caregiverReply}
            onChange={(e) => setCaregiverReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendCaregiverReply();
            }}
            placeholder="दादाजी के लिए उत्तर या प्यार भरा संदेश लिखें (लाइव 0ms सिंक)..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.95rem',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleSendCaregiverReply()}
            disabled={!caregiverReply.trim()}
            style={{
              background: caregiverReply.trim() ? '#10b981' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: caregiverReply.trim() ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: caregiverReply.trim() ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            <Send size={16} /> <span>उत्तर भेजें (Live)</span>
          </button>
        </div>
      </div>

      {/* 4. Individualized AI Intervention Prescription */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '1.6rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.3)'
      }}>
        <div style={{ maxWidth: '680px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{
              background: '#bef226',
              color: '#000000',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ✨ AI व्यक्तिगत नैदानिक सिफारिश (Personalized Intervention)
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
              Affective Trend & Routine Pattern Engine
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.4rem' }}>
            {intervention.musicTherapy.title} • {intervention.recommendedGame.name}
          </h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
            {language === 'hi' ? intervention.clinicalRationaleHi : intervention.clinicalRationale}
          </p>
        </div>

        <button
          onClick={() => setIsInterventionOpen(true)}
          style={{
            background: '#bef226',
            color: '#000000',
            border: 'none',
            borderRadius: '12px',
            padding: '0.85rem 1.4rem',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(190, 242, 38, 0.4)'
          }}
        >
          <Music size={18} />
          <span>व्यक्तिगत हस्तक्षेप देखें (Open Interventions)</span>
        </button>
      </div>

      {/* 5. Two-Column Analytics Layout */}
      <div className="dashboard-main-columns">
        {/* Left Column: 7-Day Trend Chart & Domain Skill Meters */}
        <div>
          <CognitiveTrendsChart
            weeklyData={elderData.weeklyTrends}
            baseline={elderData.cognitiveBaseline}
          />
        </div>

        {/* Right Column: Intelligent Attention Priority Alerts */}
        <div>
          <AlertCenter alerts={elderData.alerts} />
        </div>
      </div>

      {/* Individualized Intervention Modal */}
      <IndividualizedInterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        elderData={elderData}
        onLaunchGame={onLaunchGame}
        language={language}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        elderData={elderData}
        onBookingSuccess={handleBookingSuccess}
        language={language}
      />

      {/* Report Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        elderData={elderData}
      />
    </div>
  );
}
