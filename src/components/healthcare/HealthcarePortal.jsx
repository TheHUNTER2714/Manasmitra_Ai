import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Activity,
  Clock,
  MapPin,
  FileText,
  CheckCircle2,
  Droplets,
  Moon,
  Plus,
  Send,
  Stethoscope
} from 'lucide-react';
import DoctorReminderModal from '../common/DoctorReminderModal';
import ClinicalReportModal from '../caregiver/ClinicalReportModal';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { getLocalizedText } from '../../data/translations';

const STORAGE_KEY_ANALYSIS = 'manasmitra_patient_clinical_analysis';
const STORAGE_KEY_FIELD_NOTES = 'manasmitra_patient_field_notes';

export default function HealthcarePortal({ elderData, language = 'hi' }) {
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeReminders, setActiveReminders] = useState([]);
  const [fieldNoteInput, setFieldNoteInput] = useState('');
  const [noteSuccess, setNoteSuccess] = useState('');
  const [fieldNotes, setFieldNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FIELD_NOTES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-1',
          author: 'दीपाली दास (ASHA स्वास्थ्य कार्यकर्ता)',
          date: '14 Aug 2026',
          time: '11:30 AM',
          text: 'गृह-भ्रमण पूरा हुआ। रोगी सतर्क थे और उन्होंने जापी व बिहू ढोल मेमोरी गेम में अच्छा प्रदर्शन किया। बीपी 124/82 mmHg सामान्य पाया गया।'
        }
      ];
    } catch {
      return [];
    }
  });

  const [clinicalAnalysis, setClinicalAnalysis] = useState(null);

  // Load reminders & clinical analysis from localStorage
  useEffect(() => {
    try {
      const savedBookings = localStorage.getItem('manasmitra_active_bookings');
      if (savedBookings) {
        setActiveReminders(JSON.parse(savedBookings));
      }

      const savedAnalysis = localStorage.getItem(STORAGE_KEY_ANALYSIS);
      if (savedAnalysis) {
        setClinicalAnalysis(JSON.parse(savedAnalysis));
      }
    } catch (e) {
      console.warn('Storage read error in HealthcarePortal:', e);
    }
  }, [isReminderModalOpen, isReportModalOpen]);

  const handleSaveFieldNote = (e) => {
    e.preventDefault();
    const clean = fieldNoteInput.trim();
    if (!clean) return;

    const newNote = {
      id: `note-${Date.now()}`,
      author: elderData?.healthWorkerAssigned || 'दीपाली दास (ASHA कार्यकर्ता)',
      date: new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: clean
    };

    const updated = [newNote, ...fieldNotes];
    setFieldNotes(updated);
    setFieldNoteInput('');
    try {
      localStorage.setItem(STORAGE_KEY_FIELD_NOTES, JSON.stringify(updated));
    } catch {}

    speechService.playChime('success');
    setNoteSuccess('रोगी स्वास्थ्य अवलोकन नोट सफलतापूर्वक सुरक्षित किया गया!');
    setTimeout(() => setNoteSuccess(''), 3500);

    offlineSyncEngine.recordEvent('HEALTH_WORKER_PATIENT_NOTE_LOGGED', {
      patientId: elderData?.id,
      patientName: elderData?.name,
      note: clean,
      timestamp: new Date().toISOString()
    });
  };

  const patientName = elderData?.name || 'Hemanta Barua (राज कुमार बरुआ)';
  const patientAge = elderData?.age || 76;
  const patientLocation = elderData?.location || 'गुवाहाटी, कामरूप मेट्रो (असम)';
  const caregiverName = elderData?.caregiverName || 'अनीता बरुआ (बेटी)';
  const caregiverPhone = elderData?.caregiverPhone || '+91 98765 43210';
  const healthWorkerName = elderData?.healthWorkerAssigned || 'दीपाली दास (ASHA कार्यकर्ता, GMCH क्लस्टर)';

  return (
    <div className="dashboard-container">
      {/* 1. Single Patient Health Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
        color: '#ffffff',
        borderRadius: '28px',
        padding: '2.25rem',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            fontSize: '0.84rem',
            fontWeight: 800,
            marginBottom: '0.75rem',
            letterSpacing: '0.04em'
          }}>
            <Stethoscope size={16} color="#bef226" /> MDoNER व्यक्तिगत रोगी स्वास्थ्य प्रोफ़ाइल
          </div>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'white', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
            {patientName}
          </h2>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.95rem' }}>
            <span>🎂 आयु: <strong>{patientAge} वर्ष</strong></span>
            <span><MapPin size={15} style={{ verticalAlign: 'middle', color: '#bef226' }} /> {patientLocation}</span>
            <span>👨‍👩‍👧 परिवार: <strong>{caregiverName}</strong> ({caregiverPhone})</span>
          </div>
          <div style={{ fontSize: '0.86rem', color: '#86efac', marginTop: '0.5rem', fontWeight: 600 }}>
            🏥 संबद्ध प्राथमिक स्वास्थ्य केंद्र: {healthWorkerName}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: 'none',
              borderRadius: '16px',
              padding: '0.85rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
            }}
          >
            <FileText size={18} color="#15803d" /> रिपोर्ट अपलोड व विश्लेषण
          </button>

          <button
            onClick={() => setIsReminderModalOpen(true)}
            style={{
              background: '#bef226',
              color: '#000000',
              border: 'none',
              borderRadius: '16px',
              padding: '0.85rem 1.4rem',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(190, 242, 38, 0.35)'
            }}
          >
            <Clock size={18} /> {getLocalizedText('setDoctorReminder', language) || 'डॉक्टर रिमाइंडर सेट करें'}
          </button>
        </div>
      </div>

      {noteSuccess && (
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          color: '#166534',
          fontSize: '1rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={20} color="#16a34a" />
          <span>{noteSuccess}</span>
        </div>
      )}

      {/* 2. Patient Real-Time Vital Signs & Health Metrics */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <HeartPulse size={22} color="#15803d" />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            रोगी के वास्तविक समय स्वास्थ्य मापदंड (Real-Time Vitals)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
          {/* Blood Pressure */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>रक्तचाप (Blood Pressure)</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0 0.1rem' }}>
              124/82 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>mmHg</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>🟢 सामान्य व नियंत्रित (Optimal)</div>
          </div>

          {/* Heart Rate */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>हृदय गति (Heart Rate)</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#e11d48', margin: '0.3rem 0 0.1rem' }}>
              72 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>BPM</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>🟢 सामान्य साइनुस रिदम</div>
          </div>

          {/* Blood Oxygen */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ऑक्सीजन स्तर (SpO2)</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0284c7', margin: '0.3rem 0 0.1rem' }}>
              98%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>🟢 उत्कृष्ट श्वसन दर</div>
          </div>

          {/* Daily Hydration */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>दैनिक जल सेवन</span>
              <Droplets size={16} color="#0284c7" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0284c7', margin: '0.3rem 0 0.1rem' }}>
              1,800 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>mL</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>लक्ष्य 2,000 mL का 90% पूर्ण</div>
          </div>

          {/* Sleep Quality */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>रात्रि विश्राम / नींद</span>
              <Moon size={16} color="#6366f1" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#6366f1', margin: '0.3rem 0 0.1rem' }}>
              7.2 <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>घंटे</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>गहरी व शांतिपूर्ण नींद</div>
          </div>

          {/* Cognitive Health Index */}
          <div className="card" style={{ padding: '1.25rem', background: '#f0fdf4', border: '2px solid #86efac' }}>
            <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>संज्ञानात्मक सूचकांक (Cognitive Index)</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803d', margin: '0.3rem 0 0.1rem' }}>
              84 <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: 700 }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700 }}>सक्रिय व अनुकूल संज्ञानात्मक स्तर</div>
          </div>
        </div>
      </div>

      {/* 3. Patient Clinical Medical Report Analysis & Prescriptions */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={22} color="#15803d" />
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                रोगी का क्लिनिकल मेडिकल रिकॉर्ड व एआई विश्लेषण
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {clinicalAnalysis ? clinicalAnalysis.title : 'दस्तावेज़ अपलोड कर क्लिनिकल स्कोर प्राप्त करें'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              color: '#0f172a',
              borderRadius: '9999px',
              padding: '0.45rem 1.1rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            नई रिपोर्ट अपलोड / बदलें ↗
          </button>
        </div>

        {clinicalAnalysis ? (
          <div>
            <div style={{
              background: '#f8fafc',
              borderLeft: '4px solid #15803d',
              padding: '1rem 1.25rem',
              borderRadius: '0 12px 12px 0',
              marginBottom: '1.25rem',
              fontSize: '0.92rem',
              color: '#334155'
            }}>
              <strong>क्लिनिकल सारांश:</strong> {clinicalAnalysis.summary}
              <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#64748b' }}>
                परीक्षक: <strong>{clinicalAnalysis.doctor}</strong> • दिनांक: {clinicalAnalysis.date}
              </div>
            </div>

            {/* Scores & Prescriptions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Scores Card */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                  🎯 संज्ञानात्मक परीक्षण स्कोर:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>MMSE Score:</span>
                    <strong style={{ color: '#15803d' }}>{clinicalAnalysis.cognitiveScores?.mmse}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>MoCA Assessment:</span>
                    <strong style={{ color: '#0284c7' }}>{clinicalAnalysis.cognitiveScores?.moca}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Clock Drawing (CDT):</span>
                    <strong>{clinicalAnalysis.cognitiveScores?.clockDraw}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>जोखिम श्रेणी:</span>
                    <span style={{ background: '#fef3c7', color: '#92400e', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                      {clinicalAnalysis.riskBadge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prescribed Medications */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                  💊 निर्धारित दवाइयां (Medications):
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
                  {clinicalAnalysis.prescriptions?.map((p, idx) => (
                    <div key={idx} style={{ background: '#f8fafc', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name} ({p.dosage})</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{p.timing} • {p.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#f8fafc', borderRadius: '16px' }}>
            <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
              रोगी की मेडिकल रिपोर्ट अपलोड करके संज्ञानात्मक स्कोर व बायोमार्कर का विश्लेषण प्राप्त करें।
            </p>
            <button
              onClick={() => setIsReportModalOpen(true)}
              style={{
                background: '#15803d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.6rem 1.4rem',
                fontWeight: 700,
                fontSize: '0.88rem',
                marginTop: '0.75rem',
                cursor: 'pointer'
              }}
            >
              रिपोर्ट अपलोड करें
            </button>
          </div>
        )}
      </div>

      {/* 4. Active Doctor & Health Reminders for this Patient */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              रोगी के सक्रिय डॉक्टर व स्वास्थ्य रिमाइंडर (Active Health Reminders)
            </h3>
          </div>

          <button
            onClick={() => setIsReminderModalOpen(true)}
            style={{
              background: '#f0fdf4',
              color: '#15803d',
              border: '1.5px solid #86efac',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Plus size={14} /> नया रिमाइंडर जोड़ें
          </button>
        </div>

        {activeReminders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeReminders.slice(0, 4).map((rem, i) => (
              <div
                key={rem.id || i}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                    {rem.specialistName || rem.doctorName || 'चिकित्सक परामर्श'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    {rem.consultationType} • Ref: {rem.referenceId}
                  </div>
                  {rem.reminderConfig?.note && (
                    <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>
                      📌 निर्देश: {rem.reminderConfig.note}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>
                    📅 {rem.date} • {rem.time}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginTop: '4px'
                  }}>
                    ⏰ {rem.reminderConfig?.leadTimeLabel || 'रिमाइंडर सक्रिय'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
            वर्तमान में कोई सक्रिय रिमाइंडर दर्ज नहीं है। ऊपर दिए गए बटन पर क्लिक करके नया रिमाइंडर जोड़ें।
          </div>
        )}
      </div>

      {/* 5. Health Worker Field Notes for this Patient */}
      <div className="card" style={{ padding: '1.75rem', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity size={20} color="#15803d" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            स्वास्थ्य कार्यकर्ता गृह-भ्रमण व अवलोकन डायरी (Field Worker Notes)
          </h3>
        </div>

        <form onSubmit={handleSaveFieldNote} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={fieldNoteInput}
              onChange={(e) => setFieldNoteInput(e.target.value)}
              placeholder="रोगी की स्थिति पर आज का अवलोकन दर्ज करें (उदा. बीपी सामान्य रहा, स्मृति खेल खेले)..."
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                border: '1.5px solid #cbd5e1',
                borderRadius: '14px',
                fontSize: '0.95rem',
                color: '#0f172a'
              }}
            />
            <button
              type="submit"
              style={{
                background: '#15803d',
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '0.75rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Send size={16} /> नोट दर्ज करें
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {fieldNotes.map((note) => (
            <div
              key={note.id}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '0.9rem 1.15rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                <strong>{note.author}</strong>
                <span>{note.date} • {note.time}</span>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                {note.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <DoctorReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        elderData={elderData}
        language={language}
      />

      <ClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        elderData={elderData}
        language={language}
      />
    </div>
  );
}
