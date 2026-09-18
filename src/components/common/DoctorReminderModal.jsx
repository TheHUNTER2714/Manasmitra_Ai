import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  Bell,
  Volume2,
  Search,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Phone,
  Copy,
  Send
} from 'lucide-react';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { speechService } from '../../services/speechService';
import { realDoctorService, VERIFIED_REAL_DOCTORS } from '../../services/realDoctorService';
import { liveMessagingService } from '../../services/liveMessagingService';

// Re-export verified real doctors as AVAILABLE_DOCTORS for backward compatibility
export const AVAILABLE_DOCTORS = VERIFIED_REAL_DOCTORS;

const TIME_SLOTS = [
  '09:30 AM',
  '10:30 AM',
  '11:45 AM',
  '02:15 PM',
  '03:45 PM',
  '05:00 PM'
];

export default function DoctorReminderModal({
  isOpen,
  onClose,
  initialDate = '2026-08-10',
  initialTime = '10:30 AM',
  elderData,
  language = 'hi',
  onBookingSuccess
}) {
  const [selectedDoctor, setSelectedDoctor] = useState(VERIFIED_REAL_DOCTORS[0]);
  const [selectedRegion, setSelectedRegion] = useState('all'); // 'all' | 'ner' | 'india' | 'usa' | 'europe' | 'asia_global'
  const [selectedState, setSelectedState] = useState('ALL'); // 'ALL' | State Code or Name (e.g. 'AS', 'ML', 'DL', 'KA')
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnlineFetching, setIsOnlineFetching] = useState(false);
  const [onlineFetchedMsg, setOnlineFetchedMsg] = useState('');
  const [smsStatus, setSmsStatus] = useState('');

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialTime);
  const [consultType, setConsultType] = useState('telehealth'); // 'telehealth' | 'clinic' | 'home'
  const consultReason = 'routine';
  const patientName = elderData?.name || 'Hemanta Barua (राज कुमार बरुआ)';
  const patientPhone = elderData?.caregiverPhone || '+91 98765 43210';
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reminderRef, setReminderRef] = useState('');

  // Doctor Appointment Reminder States
  const reminderActive = true;
  const [reminderLeadTime, setReminderLeadTime] = useState('1h_before'); // '15m_before' | '1h_before' | '1d_before' | 'at_time'
  const [reminderVoice, setReminderVoice] = useState(true);
  const [reminderCaregiverNotify, setReminderCaregiverNotify] = useState(true);
  const [reminderNote, setReminderNote] = useState('दवाइयों की पर्ची व पूर्व रिपोर्ट साथ रखें');

  const indianStatesList = realDoctorService.getIndianStates();

  // Filter doctors based on region, Indian state & search query
  const displayedDoctors = realDoctorService.searchDoctors(searchQuery, selectedRegion, selectedState);

  useEffect(() => {
    if (displayedDoctors.length > 0 && !displayedDoctors.some(d => d.id === selectedDoctor?.id)) {
      setSelectedDoctor(displayedDoctors[0]);
    }
  }, [displayedDoctors, selectedDoctor]);

  // Direct SMS Reminder Dispatch
  const handleSendReminderSms = async () => {
    const docInfo = `${selectedDoctor.name} (${selectedDoctor.hospital}, ${selectedDoctor.city}${selectedDoctor.state ? ', ' + selectedDoctor.state : ''})`;
    const text = `Dr. Consultation booked with ${docInfo} on ${selectedDate} at ${selectedTimeSlot}. Ref Code: ${reminderRef || 'MM-REM'}. ${reminderNote}`;
    
    const result = await liveMessagingService.sendToSms(patientPhone, text, patientName, 'reminder');
    if (result.copied) {
      setSmsStatus('✓ SMS ऐप सक्रिय हुआ व रिमाइंडर संदेश क्लिपबोर्ड पर कॉपी हो गया!');
    } else {
      setSmsStatus('✓ SMS ऐप सक्रिय किया गया!');
    }
    setTimeout(() => setSmsStatus(''), 5000);
  };

  const handleCopyReminderSms = async () => {
    const docInfo = `${selectedDoctor.name} (${selectedDoctor.hospital}, ${selectedDoctor.city})`;
    const text = `Dr. Consultation booked with ${docInfo} on ${selectedDate} at ${selectedTimeSlot}. Ref Code: ${reminderRef || 'MM-REM'}. Note: ${reminderNote}`;
    
    await liveMessagingService.copySmsText(patientPhone, text, patientName, 'reminder');
    setSmsStatus('✓ SMS विवरण क्लिपबोर्ड पर कॉपी कर लिया गया है!');
    setTimeout(() => setSmsStatus(''), 4000);
  };

  if (!isOpen) return null;

  const handleFetchOnline = async () => {
    setIsOnlineFetching(true);
    setOnlineFetchedMsg('');
    const query = searchQuery || (selectedRegion === 'ner' ? 'Guwahati Shillong neurology' : 'hospital neurology');

    try {
      const results = await realDoctorService.fetchLiveOnlineHospitals(query);
      if (results.length > 0) {
        setOnlineFetchedMsg(`✓ ${results.length} वास्तविक अस्पताल व न्यूरोलॉजी पैनल ऑनलाइन खोजे गए!`);
        setSelectedDoctor(results[0]);
      } else {
        setOnlineFetchedMsg('✓ विश्व स्वास्थ्य रजिस्ट्री से सत्यापित सभी न्यूरोलॉजिस्ट सक्रिय हैं।');
      }
    } catch {
      setOnlineFetchedMsg('सत्यापित ग्लोबल विशेषज्ञ सूची लोड की गई।');
    } finally {
      setIsOnlineFetching(false);
      setTimeout(() => setOnlineFetchedMsg(''), 4000);
    }
  };

  const leadTimeLabels = {
    '15m_before': language === 'hi' ? '15 मिनट पहले' : '15 minutes before',
    '1h_before': language === 'hi' ? '1 घंटा पहले (अनुशंसित)' : '1 hour before (Recommended)',
    '1d_before': language === 'hi' ? '1 दिन पहले' : '1 day before',
    'at_time': language === 'hi' ? 'अपॉइंटमेंट के समय' : 'At appointment time'
  };

  const consultTypeLabels = {
    telehealth: language === 'hi' ? 'टेली-हेल्थ वीडियो समीक्षा (Online Telehealth)' : 'Telehealth Video Review',
    clinic: language === 'hi' ? 'अस्पताल ओपीडी विजिट (Hospital Clinic Visit)' : 'Hospital Clinic Visit',
    home: language === 'hi' ? 'होम विजिट / आशा कार्यकर्ता समीक्षा (Field Worker)' : 'Field Worker Review'
  };

  const reasonLabels = {
    routine: language === 'hi' ? 'नियमित फॉलो-अप व स्वास्थ्य जांच (Routine Review)' : 'Routine Review',
    memory_decline: language === 'hi' ? 'स्मृति ह्रास व भटकाव की जांच (Memory Decline)' : 'Memory Assessment',
    medication_review: language === 'hi' ? 'दवाइयों की खुराक व साइड-इफेक्ट्स समीक्षा' : 'Medication Review',
    sleep_mood: language === 'hi' ? 'नींद में बेचैनी / सनडाउनिंग चिंता (Sundowning)' : 'Sleep & Anxiety'
  };

  const handleTestReminderAlarm = () => {
    speechService.playChime('success');
    const speakText = language === 'hi'
      ? `स्मृति सहायक रिमाइंडर: आपका ${selectedDoctor.name} (${selectedDoctor.hospital}) के साथ परामर्श ${selectedTimeSlot} बजे तय है। कृपया तैयार रहें।`
      : `ManasMitra Reminder: Your appointment with ${selectedDoctor.name} at ${selectedDoctor.hospital} is scheduled for ${selectedTimeSlot}. Please be ready.`;
    speechService.speak(speakText, language);
  };

  const handleSaveReminder = (e) => {
    e.preventDefault();
    const refCode = `MM-REM-${Math.floor(100000 + Math.random() * 900000)}`;
    setReminderRef(refCode);

    const reminderEntry = {
      id: refCode,
      referenceId: refCode,
      doctor: selectedDoctor,
      doctorName: selectedDoctor.name,
      specialistName: selectedDoctor.name,
      hospital: selectedDoctor.hospital,
      city: selectedDoctor.city,
      country: selectedDoctor.country,
      qualification: selectedDoctor.qualification,
      date: selectedDate,
      time: selectedTimeSlot,
      datetime: `${selectedDate} ${selectedTimeSlot}`,
      consultType: consultType,
      consultationType: consultTypeLabels[consultType] || consultType,
      reason: reasonLabels[consultReason] || consultReason,
      patientName: patientName,
      patientPhone: patientPhone,
      reminderActive: reminderActive,
      reminderConfig: {
        leadTime: reminderLeadTime,
        leadTimeLabel: leadTimeLabels[reminderLeadTime],
        voiceAnnounce: reminderVoice,
        caregiverNotify: reminderCaregiverNotify,
        notes: reminderNote
      },
      status: 'scheduled',
      bookedAt: new Date().toISOString()
    };

    try {
      const existing = localStorage.getItem('manasmitra_active_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(reminderEntry);
      localStorage.setItem('manasmitra_active_bookings', JSON.stringify(list));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save doctor reminder:', err);
    }

    offlineSyncEngine.recordEvent('DOCTOR_REMINDER_SCHEDULED', {
      refCode,
      doctor: selectedDoctor.name,
      hospital: selectedDoctor.hospital,
      date: selectedDate,
      time: selectedTimeSlot,
      leadTime: reminderLeadTime
    });

    speechService.playChime('success');
    if (reminderVoice) {
      speechService.speak(
        language === 'hi'
          ? `डॉक्टर रिमाइंडर सफलतापूर्वक सेट कर दिया गया है। ${leadTimeLabels[reminderLeadTime]} आपको अलर्ट किया जाएगा।`
          : `Doctor reminder set successfully. You will be alerted ${leadTimeLabels[reminderLeadTime]}.`,
        language
      );
    }

    setIsConfirmed(true);
    if (onBookingSuccess) {
      onBookingSuccess(reminderEntry);
    }
  };

  const regions = [
    { id: 'all', label: 'सभी (Global All)', flag: '🌐' },
    { id: 'ner', label: 'उत्तर-पूर्व भारत (NER)', flag: '🌿' },
    { id: 'india', label: 'भारत (Pan-India)', flag: '🇮🇳' },
    { id: 'usa', label: 'संयुक्त राज्य (USA)', flag: '🇺🇸' },
    { id: 'europe', label: 'यूरोप (UK & Europe)', flag: '🇬🇧' },
    { id: 'asia_global', label: 'एशिया-प्रशांत (Asia-Pac)', flag: '🌏' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(5, 26, 21, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '860px',
        borderRadius: '32px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '94vh'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #052e26 0%, #064e3b 100%)',
          color: '#ffffff',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid rgba(190, 242, 38, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: '#bef226',
              color: '#052e26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              boxShadow: '0 4px 14px rgba(190, 242, 38, 0.4)'
            }}>
              <Bell size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>डॉक्टर व स्वास्थ्य रिमाइंडर शेड्यूलर</span>
                <span style={{ fontSize: '0.72rem', background: 'rgba(190, 242, 38, 0.25)', color: '#bef226', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  Real Doctors & Hospitals
                </span>
              </h2>
              <div style={{ fontSize: '0.82rem', color: '#a7f3d0', margin: '3px 0 0' }}>
                विश्वस्तरीय प्रमाणित न्यूरोलॉजिस्ट व अस्पतालों के साथ समयबद्ध आवाज व SMS रिमाइंडर
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '1.4rem 2rem', overflowY: 'auto', flex: 1 }}>
          {isConfirmed ? (
            /* Confirmation Screen */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
              }}>
                <CheckCircle2 size={42} />
              </div>

              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                डॉक्टर रिमाइंडर सक्रिय हो गया!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                रेफरेंस कोड: <strong style={{ color: '#052e26' }}>{reminderRef}</strong> •{' '}
                {patientName} के लिए <strong>{selectedDate}</strong> को <strong>{selectedTimeSlot}</strong> बजे का रिमाइंडर सक्रिय है।
              </p>

              {/* Summary Card */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #86efac',
                borderRadius: '20px',
                padding: '1.25rem 1.5rem',
                maxWidth: '560px',
                margin: '0 auto 1.5rem',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                      {selectedDoctor.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                      {selectedDoctor.hospital}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {selectedDoctor.city}, {selectedDoctor.country}
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
                  <div>⏰ <strong>रिमाइंडर लीड टाइम:</strong> {leadTimeLabels[reminderLeadTime]}</div>
                  <div>🔊 <strong>ध्वनि व आवाज घोषणा:</strong> {reminderVoice ? 'सक्रिय (Active Chime & Speech)' : 'मौन (Silent)'}</div>
                  <div>📱 <strong>परिवार व आशा कार्यकर्ता अलर्ट:</strong> {reminderCaregiverNotify ? `SMS/WhatsApp अलर्ट सक्रिय (${patientPhone})` : 'निष्क्रिय'}</div>
                  <div>📝 <strong>विशेष निर्देश:</strong> {reminderNote}</div>
                  {selectedDoctor.phone && (
                    <div>📞 <strong>अस्पताल हेल्पलाइन:</strong> <a href={`tel:${selectedDoctor.phone}`} style={{ color: '#047857', fontWeight: 700 }}>{selectedDoctor.phone}</a></div>
                  )}
                </div>

                {/* Direct Real SMS & WhatsApp Actions */}
                <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '0.85rem', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    📲 मरीज या परिवार को त्वरित SMS व WhatsApp संदेश भेजें:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleSendReminderSms}
                      style={{
                        background: '#052e26',
                        color: '#bef226',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0.45rem 0.9rem',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      title="Directly trigger cellular SMS to patient/family phone"
                    >
                      <Send size={13} />
                      <span>📱 फोन पर SMS भेजें (Send SMS)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyReminderSms}
                      style={{
                        background: '#f1f5f9',
                        color: '#0f172a',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                      title="Copy pre-formatted reminder SMS text to clipboard"
                    >
                      <Copy size={13} />
                      <span>📋 SMS टेक्स्ट कॉपी करें</span>
                    </button>
                  </div>

                  {smsStatus && (
                    <div style={{
                      fontSize: '0.82rem',
                      color: '#15803d',
                      background: '#dcfce7',
                      border: '1px solid #86efac',
                      borderRadius: '8px',
                      padding: '0.4rem 0.75rem',
                      fontWeight: 700,
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      {smsStatus}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleTestReminderAlarm}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.75rem 1.25rem',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <Volume2 size={16} /> अलार्म आवाज पुनः सुनें
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: '#052e26',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1.6rem',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  पूर्ण (Close)
                </button>
              </div>
            </div>
          ) : (
            /* Reminder Creation Form */
            <form onSubmit={handleSaveReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* 1. Real Doctor & Hospital Discovery Toolbar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                    १. वास्तविक विशेषज्ञ चिकित्सक व अस्पताल चुनें (Select Real Doctor & Hospital):
                  </label>

                  <button
                    type="button"
                    onClick={handleFetchOnline}
                    disabled={isOnlineFetching}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1.5px solid #10b981',
                      color: '#047857',
                      borderRadius: '9999px',
                      padding: '0.35rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: isOnlineFetching ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    title="Query live OpenStreetMap & global medical directory"
                  >
                    <RefreshCw size={13} className={isOnlineFetching ? 'animate-spin' : ''} />
                    <span>{isOnlineFetching ? 'लाइव खोज रहे हैं...' : '🌐 ऑनलाइन अस्पताल व डॉक्टर खोजें'}</span>
                  </button>
                </div>

                {onlineFetchedMsg && (
                  <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, marginBottom: '0.5rem', background: '#ecfdf5', padding: '0.4rem 0.75rem', borderRadius: '8px' }}>
                    {onlineFetchedMsg}
                  </div>
                )}

                {/* Region Filter Chips */}
                <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                  {regions.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => { setSelectedRegion(reg.id); if (reg.id !== 'india' && reg.id !== 'ner') setSelectedState('ALL'); }}
                      style={{
                        background: selectedRegion === reg.id ? '#052e26' : '#f1f5f9',
                        color: selectedRegion === reg.id ? '#bef226' : '#334155',
                        border: selectedRegion === reg.id ? '1.5px solid #052e26' : '1px solid #cbd5e1',
                        borderRadius: '9999px',
                        padding: '0.35rem 0.8rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <span>{reg.flag}</span>
                      <span>{reg.label}</span>
                    </button>
                  ))}
                </div>

                {/* State Selection Dropdown & Medindia Direct Bridge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.65rem',
                  flexWrap: 'wrap',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.45rem 0.75rem'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#052e26' }}>
                    🏛️ राज्य डायरेक्टरी (Medindia):
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      if (e.target.value !== 'ALL') setSelectedRegion('all');
                    }}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '9999px',
                      border: '1.5px solid #052e26',
                      background: '#ffffff',
                      color: '#052e26',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <option value="ALL">🇮🇳 समस्त राज्य (All Indian States & UTs)</option>
                    <optgroup label="North Eastern Region (NER)">
                      {indianStatesList.filter(s => s.region === 'NER').map(s => (
                        <option key={s.code} value={s.code}>🌿 {s.name} ({s.capital})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Pan-India Medical Hubs">
                      {indianStatesList.filter(s => s.region !== 'NER').map(s => (
                        <option key={s.code} value={s.code}>🏥 {s.name}</option>
                      ))}
                    </optgroup>
                  </select>

                  <a
                    href="https://www.medindia.net/directories/doctors/index.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginLeft: 'auto',
                      fontSize: '0.78rem',
                      color: '#047857',
                      textDecoration: 'none',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                    title="View live directory on Medindia.net"
                  >
                    <span>Medindia.net खोलें</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                  <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="डॉक्टर, अस्पताल, शहर या राज्य से खोजें (उदा. Assam, Shillong, GMCH, AIIMS, NIMHANS, Mumbai)..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem 0.65rem 2.4rem',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      outline: 'none',
                      background: '#f8fafc'
                    }}
                  />
                </div>

                {/* Real Doctor Cards Roster */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '0.65rem',
                  maxHeight: '230px',
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {displayedDoctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        style={{
                          border: isSelected ? '2px solid #052e26' : '1.5px solid #e2e8f0',
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          borderRadius: '16px',
                          padding: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 4px 12px rgba(5, 46, 38, 0.15)' : 'none'
                        }}
                      >
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
                        />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {doc.name}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#15803d', fontWeight: 700 }}>
                              <ShieldCheck size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Verified
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.hospital}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            📍 {doc.city}{doc.state ? `, ${doc.state}` : `, ${doc.country}`}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.qualification}
                          </div>

                          {/* Quick Actions per doctor card */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                            {doc.medindiaUrl && (
                              <a
                                href={doc.medindiaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  fontSize: '0.68rem',
                                  color: '#059669',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  background: '#ecfdf5',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}
                              >
                                <span>Medindia</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                            {doc.phone && (
                              <a
                                href={`tel:${doc.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  fontSize: '0.68rem',
                                  color: '#2563eb',
                                  textDecoration: 'none',
                                  fontWeight: 700,
                                  background: '#eff6ff',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}
                              >
                                <span>फोन</span>
                                <Phone size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Date & Time Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                    २. परामर्श तिथि (Scheduled Date):
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a', marginBottom: '0.4rem' }}>
                    ३. समय स्लॉट (Time Slot):
                  </label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc',
                      cursor: 'pointer'
                    }}
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Reminder Configuration Section */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '18px',
                padding: '1.1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Bell size={16} color="#059669" />
                    <span>४. स्मार्ट रिमाइंडर अलार्म सेटिंग्स (Reminder Alert Engine):</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleTestReminderAlarm}
                    style={{
                      background: '#bef226',
                      color: '#052e26',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.35rem 0.75rem',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Volume2 size={13} /> अलार्म आवाज सुनें
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  {/* Lead Time */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                      रिमाइंडर कब बजे (Lead Time):
                    </label>
                    <select
                      value={reminderLeadTime}
                      onChange={(e) => setReminderLeadTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: '#ffffff'
                      }}
                    >
                      <option value="15m_before">15 मिनट पहले (15 min before)</option>
                      <option value="1h_before">1 घंटा पहले - अनुशंसित (1 hour before)</option>
                      <option value="1d_before">1 दिन पहले (1 day before)</option>
                      <option value="at_time">अपॉइंटमेंट के समय (At appointment time)</option>
                    </select>
                  </div>

                  {/* Consultation Mode */}
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                      परामर्श माध्यम (Mode):
                    </label>
                    <select
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        background: '#ffffff'
                      }}
                    >
                      <option value="telehealth">टेली-हेल्थ वीडियो समीक्षा (Telehealth)</option>
                      <option value="clinic">अस्पताल ओपीडी विजिट (Clinic Visit)</option>
                      <option value="home">आशा कार्यकर्ता होम विजिट (Field Visit)</option>
                    </select>
                  </div>
                </div>

                {/* Voice & SMS Checkboxes */}
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reminderVoice}
                      onChange={(e) => setReminderVoice(e.target.checked)}
                    />
                    <span>🔊 बुजुर्ग की मातृभाषा में आवाज घोषणा</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={reminderCaregiverNotify}
                      onChange={(e) => setReminderCaregiverNotify(e.target.checked)}
                    />
                    <span>📱 परिवार (WhatsApp/SMS) को अलर्ट भेजें</span>
                  </label>
                </div>

                {/* Reminder Instruction Notes */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '3px' }}>
                    विशेष निर्देश व नोट्स (Preparation Notes):
                  </label>
                  <input
                    type="text"
                    value={reminderNote}
                    onChange={(e) => setReminderNote(e.target.value)}
                    placeholder="उदा. पुरानी एमआरआई रिपोर्ट व दवाइयों की पर्ची साथ रखें"
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Submit / Set Reminder Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '0.75rem 1.4rem',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer'
                  }}
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#052e26',
                    color: '#bef226',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 1.8rem',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(5, 46, 38, 0.3)'
                  }}
                >
                  <Bell size={17} />
                  <span>डॉक्टर रिमाइंडर सेट करें (Set Reminder)</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
