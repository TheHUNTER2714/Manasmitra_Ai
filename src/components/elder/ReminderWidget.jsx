import React, { useState } from 'react';
import {
  Pill,
  Droplets,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  CalendarPlus,
  Video,
  UserCheck,
  Bell,
  Volume2,
  Upload
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import BookingModal from '../common/BookingModal';
import ElderMedicineUploadModal from './ElderMedicineUploadModal';

export default function ReminderWidget({
  elderData,
  setElderData,
  language = 'hi'
}) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isUploadMedicineOpen, setIsUploadMedicineOpen] = useState(false);
  const [liveBookings, setLiveBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('manasmitra_active_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { medications, appointments, waterGlassesToday, waterGoal } = elderData;

  const handleToggleMed = (medId) => {
    const updatedMeds = medications.map((med) => {
      if (med.id === medId) {
        const newStatus = !med.taken;
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (newStatus) {
          speechService.playChime('success');
          const speakText = language === 'hi'
            ? `बहुत अच्छा दादाजी! आपने ${med.name} ले ली है।`
            : `Great job Dadaji! You have taken your ${med.name}.`;
          speechService.speak(speakText, language === 'hi' ? 'hi-IN' : 'en-IN');

          // Enqueue into offline sync engine
          offlineSyncEngine.recordEvent('MEDICATION_TAKEN', {
            medId: med.id,
            medName: med.name,
            timing: med.timing,
            timeLogged: nowStr
          });
        }

        return {
          ...med,
          taken: newStatus,
          timeTaken: newStatus ? nowStr : null
        };
      }
      return med;
    });

    setElderData({
      ...elderData,
      medications: updatedMeds
    });
  };

  const handleLogWater = () => {
    if (waterGlassesToday < waterGoal + 2) {
      const newCount = waterGlassesToday + 1;
      setElderData({
        ...elderData,
        waterGlassesToday: newCount
      });

      speechService.playChime('success');
      const speakText = language === 'hi'
        ? `शाबाश! आपने ${newCount} गिलास पानी पूरा कर लिया है। शरीर में ताजगी बनी रहेगी।`
        : `Well done! You have logged ${newCount} glasses of water today.`;
      speechService.speak(speakText, language === 'hi' ? 'hi-IN' : 'en-IN');

      offlineSyncEngine.recordEvent('WATER_LOGGED', {
        glassesToday: newCount,
        goal: waterGoal,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Toggle Reminder on a Booking
  const handleToggleBookingReminder = (bookingId) => {
    const updated = liveBookings.map((b) => {
      if (b.id === bookingId) {
        const nextState = !(b.reminderActive ?? true);
        if (nextState) {
          speechService.playChime('notification');
        }
        return {
          ...b,
          reminderActive: nextState
        };
      }
      return b;
    });

    setLiveBookings(updated);
    try {
      localStorage.setItem('manasmitra_active_bookings', JSON.stringify(updated));
    } catch {}
  };

  // Play test alarm chime & speak announcement
  const handleTestAlarm = (docName, timeStr) => {
    speechService.playChime('success');
    const speakText = language === 'hi'
      ? `याद दिलाना: आपका ${docName} के साथ डॉक्टर अपॉइंटमेंट ${timeStr} बजे तय है। कृपया तैयार रहें।`
      : `Reminder alert: Your doctor appointment with ${docName} is scheduled for ${timeStr}.`;
    speechService.speak(speakText, language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  // Determine if there is any upcoming appointment
  const nextBooking = liveBookings.find(b => b.reminderActive ?? true) || appointments?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 0. Upcoming Doctor Appointment Top Alert Banner (If Any Appointment Exists) */}
      {nextBooking && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '2px solid #86efac',
          borderRadius: '24px',
          padding: '1.4rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 6px 20px rgba(16, 185, 129, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              flexShrink: 0
            }}>
              <Bell size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
                  ⏰ आगामी परामर्श रिमाइंडर (Appointment Reminder)
                </span>
                <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
                  ● सक्रिय अलर्ट
                </span>
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {nextBooking.specialistName || nextBooking.doctor?.name || nextBooking.doctor || 'डॉक्टर परामर्श'}
              </h4>
              <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
                तय समय: <strong>{nextBooking.date || 'गुरुवार'} • {nextBooking.time || nextBooking.datetime || '11:30 AM'}</strong> ({nextBooking.consultationType || nextBooking.type || 'परामर्श'})
              </p>
            </div>
          </div>

          <button
            onClick={() => handleTestAlarm(
              nextBooking.specialistName || nextBooking.doctor?.name || nextBooking.doctor || 'डॉक्टर',
              nextBooking.time || nextBooking.datetime || '10:30 AM'
            )}
            style={{
              background: '#15803d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.65rem 1.3rem',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
            }}
          >
            <Volume2 size={16} />
            <span>{language === 'hi' ? 'आवाज अलर्ट सुनें' : 'Test Audio Reminder'}</span>
          </button>
        </div>
      )}

      {/* 1. Medication Schedule */}
      <div className="card" style={{ border: '2px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>
                {language === 'hi' ? 'दवाइयों की समय-सारणी (Medicines)' : 'Medication Schedule'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {language === 'hi' ? 'दवा लेने के बाद हरे बटन पर टैप करें' : 'Tap the green button after taking medicine'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsUploadMedicineOpen(true)}
              style={{
                background: '#052e26',
                color: '#bef226',
                border: '1.5px solid #bef226',
                borderRadius: '9999px',
                padding: '0.45rem 1.1rem',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 3px 10px rgba(5, 46, 38, 0.25)'
              }}
              title="Upload doctor prescription or report to auto-extract medicines and schedule voice reminders"
            >
              <Upload size={15} />
              <span>{language === 'hi' ? '📄 पर्ची / रिपोर्ट से दवा जोड़ें' : '📄 Upload Prescription'}</span>
            </button>
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}>
              {medications.filter(m => m.taken).length} / {medications.length} {language === 'hi' ? 'दवाइयां ली गईं' : 'Taken'}
            </div>
          </div>
        </div>

        {/* Medication Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {medications.map((med) => (
            <div
              key={med.id}
              style={{
                background: med.taken ? '#f8fafc' : '#ffffff',
                border: med.taken ? '2px solid #cbd5e1' : '2px solid #f59e0b',
                borderRadius: '18px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                opacity: med.taken ? 0.85 : 1,
                boxShadow: med.taken ? 'none' : 'var(--shadow-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: med.taken ? '#dcfce7' : '#fef3c7',
                  color: med.taken ? '#15803d' : '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  flexShrink: 0
                }}>
                  {med.taken ? <CheckCircle2 size={32} /> : <Clock size={30} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {med.name}
                    </span>
                    <span style={{
                      background: '#e2e8f0',
                      color: '#334155',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700
                    }}>
                      {med.timing}
                    </span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.2rem' }}>
                    {med.purpose} • <strong style={{ color: '#b45309' }}>{med.withFood}</strong>
                  </div>
                  {med.taken && (
                    <div style={{ color: '#15803d', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.25rem' }}>
                      ✓ {language === 'hi' ? `लिया गया (${med.timeTaken})` : `Taken at ${med.timeTaken}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleToggleMed(med.id)}
                style={{
                  background: med.taken ? '#f1f5f9' : '#15803d',
                  color: med.taken ? '#475569' : '#ffffff',
                  border: med.taken ? '1px solid #cbd5e1' : 'none',
                  borderRadius: '16px',
                  padding: '0.9rem 1.6rem',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  minHeight: '54px',
                  boxShadow: med.taken ? 'none' : '0 4px 14px rgba(21, 128, 61, 0.3)'
                }}
              >
                {med.taken ? (
                  <>
                    <CheckCircle2 size={20} color="#15803d" />
                    {language === 'hi' ? 'ले ली गई (Taken)' : 'Taken'}
                  </>
                ) : (
                  <>
                    <Pill size={20} />
                    {language === 'hi' ? 'मैंने ले ली ✓' : 'Mark as Taken ✓'}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hydration Water Tracker */}
      <div className="card" style={{ border: '2px solid #e2e8f0', borderRadius: '24px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Droplets size={26} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e293b' }}>
                {language === 'hi' ? 'जल सेवन (Hydration Tracker)' : 'Daily Hydration'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                {language === 'hi' ? 'दिन में कम से कम 8 गिलास पानी पिएं' : 'Goal: Drink at least 8 glasses daily'}
              </p>
            </div>
          </div>

          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>
            {waterGlassesToday} / {waterGoal} {language === 'hi' ? 'गिलास' : 'Glasses'}
          </div>
        </div>

        {/* 8 Glasses visual indicators */}
        <div className="water-glasses-row">
          {Array.from({ length: waterGoal }).map((_, index) => {
            const isFilled = index < waterGlassesToday;
            return (
              <div
                key={index}
                className={`water-glass-btn ${isFilled ? 'filled' : ''}`}
                title={`Glass ${index + 1}`}
              >
                💧
              </div>
            );
          })}
        </div>

        <button
          onClick={handleLogWater}
          className="water-log-action-btn"
          style={{ cursor: 'pointer' }}
        >
          <Plus size={20} />
          {language === 'hi' ? '+ 1 गिलास पानी पिया' : '+ Log 1 Glass of Water'}
        </button>
      </div>

      {/* 3. Upcoming Doctor Appointments & Reminders Card */}
      <div className="card" style={{
        border: '2px solid #bef226',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)',
        borderRadius: '24px',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={28} color="#15803d" />
            <div>
              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
                {language === 'hi' ? 'चिकित्सक परामर्श व रिमाइंडर (Doctor Appointments & Reminders)' : 'Medical Appointments & Reminders'}
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {language === 'hi' ? 'स्वचालित आवाज अलर्ट व पारिवारिक सूचना के साथ' : 'Automated voice alerts and family notification enabled'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsBookingOpen(true)}
            style={{
              background: '#bef226',
              color: '#000000',
              border: 'none',
              borderRadius: '12px',
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 12px rgba(190, 242, 38, 0.4)'
            }}
            id="btn-reminder-set-doctor-reminder"
          >
            <CalendarPlus size={18} /> {language === 'hi' ? '+ डॉक्टर रिमाइंडर सेट करें' : '+ Set Doctor Reminder'}
          </button>
        </div>

        {/* Dynamic bookings from BookingModal */}
        {liveBookings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1rem' }}>
            {liveBookings.map((b) => {
              const docName = b.specialistName || b.doctor?.name || b.doctorName || 'वरिष्ठ विशेषज्ञ';
              const consultTypeText = b.consultationType || b.consultType || 'टेली-हेल्थ परामर्श';
              const isReminderOn = b.reminderActive ?? true;
              const leadText = b.reminderConfig?.leadTimeLabel || '1 घंटा पहले';

              return (
                <div
                  key={b.id}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #86efac',
                    borderRadius: '18px',
                    padding: '1.15rem 1.4rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: '#dcfce7',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <UserCheck size={26} />
                    </div>

                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>
                        {docName}
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.9rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Video size={14} color="#0284c7" /> {consultTypeText} • Ref: <strong>{b.referenceId || b.id}</strong>
                      </div>

                      {/* Reminder Badge & Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: isReminderOn ? '#dcfce7' : '#f1f5f9',
                          color: isReminderOn ? '#166534' : '#64748b',
                          border: isReminderOn ? '1px solid #86efac' : '1px solid #cbd5e1',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Bell size={12} /> {isReminderOn ? `⏰ रिमाइंडर सक्रिय (${leadText})` : 'रिमाइंडर बंद'}
                        </span>

                        <button
                          onClick={() => handleToggleBookingReminder(b.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0284c7',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          {isReminderOn ? 'बंद करें' : 'चालू करें'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      <Clock size={16} color="#059669" /> {b.date} • {b.time}
                    </div>

                    <button
                      onClick={() => handleTestAlarm(docName, b.time)}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #15803d',
                        color: '#15803d',
                        borderRadius: '12px',
                        padding: '0.5rem 0.9rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                      title="Test Audio Reminder Voice"
                    >
                      <Volume2 size={15} /> <span>आवाज सुनें</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Existing baseline appointments */}
        {appointments && appointments.map((app) => (
          <div
            key={app.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1rem 1.4rem',
              marginTop: '0.5rem'
            }}
          >
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                {app.doctor}
              </div>
              <div style={{ color: '#475569', fontSize: '0.92rem', marginTop: '0.15rem' }}>
                {app.facility} • {app.type}
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.3rem', color: '#15803d', fontSize: '0.8rem', fontWeight: 700 }}>
                <Bell size={12} /> ⏰ निर्धारित मासिक रिमाइंडर सक्रिय
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                color: '#334155',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}>
                🕒 {app.datetime}
              </div>

              <button
                onClick={() => handleTestAlarm(app.doctor, app.datetime)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #15803d',
                  color: '#15803d',
                  borderRadius: '10px',
                  padding: '0.5rem 0.8rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Volume2 size={14} /> <span>आवाज</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        elderData={elderData}
        onBookingSuccess={(newBooking) => {
          setLiveBookings((prev) => [newBooking, ...prev]);
        }}
        language={language}
      />

      {/* Upload Prescription / Report & Auto-Set Medicine Reminder Modal */}
      <ElderMedicineUploadModal
        isOpen={isUploadMedicineOpen}
        onClose={() => setIsUploadMedicineOpen(false)}
        onAddMedicine={(newMed) => {
          const updated = {
            ...elderData,
            medications: [...elderData.medications, newMed]
          };
          setElderData(updated);
          try {
            localStorage.setItem('manasmitra_registered_profile', JSON.stringify(updated));
          } catch (e) {
            console.error(e);
          }
        }}
        language={language}
      />
    </div>
  );
}
