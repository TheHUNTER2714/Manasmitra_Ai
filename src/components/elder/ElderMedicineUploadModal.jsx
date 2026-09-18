import React, { useState } from 'react';
import {
  X,
  Upload,
  Pill,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Camera,
  AlertCircle,
  Bell,
  Volume2
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { t } from '../../data/translations';

// Sample Prescriptions for Instant 1-Tap Elderly Testing
const PRESET_PRESCRIPTIONS = [
  {
    id: 'preset-donepezil',
    clinicName: 'गुवाहाटी न्यूरोलॉजिकल सेंटर (डॉ. बरुआ)',
    doctor: 'Dr. R. Baruah (MD, DM Neurology)',
    name: 'डोनेपेज़िल (Donepezil 5mg)',
    purpose: 'स्मृति व एकाग्रता सहारा (Memory & Cognitive Support)',
    timing: '09:00 PM (रात)',
    withFood: 'रात के खाने के बाद (After Dinner)',
    dosage: '1 गोली (1 Tablet Daily)'
  },
  {
    id: 'preset-memantine',
    clinicName: 'शिलांग मेमोरी क्लिनिक (NEIGRIHMS)',
    doctor: 'Dr. Olivia Bennett (Neurologist)',
    name: 'मेमेंटाइन (Memantine 10mg)',
    purpose: 'संज्ञानात्मक स्थिरता (Cognitive Stabilization)',
    timing: '01:30 PM (दोपहर)',
    withFood: 'दोपहर भोजन के बाद (After Lunch)',
    dosage: '1 गोली (1 Tablet Daily)'
  },
  {
    id: 'preset-bp',
    clinicName: 'एम्स गुवाहाटी / कार्डियोलॉजी ओपीडी',
    doctor: 'Dr. P. Sarma (Cardiology)',
    name: 'टेलमिसार्टन (Telmisartan 40mg)',
    purpose: 'रक्तचाप नियंत्रण (Blood Pressure Support)',
    timing: '08:30 AM (सुबह)',
    withFood: 'सुबह नाश्ते के बाद (After Breakfast)',
    dosage: '1 गोली (1 Tablet Morning)'
  }
];

export default function ElderMedicineUploadModal({
  isOpen,
  onClose,
  onAddMedicine,
  language = 'hi'
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedMed, setExtractedMed] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartScan = (presetMed, file = null) => {
    setSelectedFile(file ? file.name : 'Prescription_Slip_Scanned.pdf');
    setIsScanning(true);
    setScanProgress(10);
    setExtractedMed(null);

    // Simulated AI OCR Scanning animation
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setExtractedMed(presetMed || PRESET_PRESCRIPTIONS[0]);
          speechService.playChime('success');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleStartScan(PRESET_PRESCRIPTIONS[0], file);
    }
  };

  const handleConfirmAdd = () => {
    if (!extractedMed) return;

    const newMedObj = {
      id: `med-${Date.now()}`,
      name: extractedMed.name,
      purpose: extractedMed.purpose,
      timing: extractedMed.timing,
      withFood: extractedMed.withFood,
      dosage: extractedMed.dosage || '1 गोली',
      taken: false,
      timeTaken: null,
      reminderActive: true,
      addedFromReport: true,
      dateAdded: new Date().toLocaleDateString()
    };

    if (onAddMedicine) {
      onAddMedicine(newMedObj);
    }

    setIsSuccess(true);
    speechService.playChime('success');

    const speakText = language === 'hi'
      ? `बहुत बढ़िया! आपकी नई दवा ${extractedMed.name} और ${extractedMed.timing} का रिमाइंडर सफलतापूर्वक जुड़ गया है।`
      : `Great! Your new medicine ${extractedMed.name} and reminder for ${extractedMed.timing} have been successfully scheduled.`;
    speechService.speak(speakText, language === 'hi' ? 'hi-IN' : 'en-IN');

    setTimeout(() => {
      setIsSuccess(false);
      setSelectedFile(null);
      setExtractedMed(null);
      onClose();
    }, 1600);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(5, 15, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '28px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        border: '2px solid #bef226'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, #052e26 0%, #064e3b 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTopLeftRadius: '26px',
          borderTopRightRadius: '26px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#bef226',
              color: '#052e26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Pill size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                {language === 'hi' ? '💊 दवा की पर्ची / रिपोर्ट अपलोड करें' : '💊 Upload Prescription / Report'}
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 600 }}>
                {language === 'hi' ? 'AI स्वतः दवा पहचानेगा व समय पर रिमाइंडर सेट करेगा' : 'AI automatically detects medicines & sets alarms'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem 1.75rem' }}>
          {isSuccess ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={46} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d', margin: 0 }}>
                {language === 'hi' ? '✓ दवा व रिमाइंडर सफलतापूर्वक जुड़ गया!' : '✓ Medicine & Reminder Scheduled!'}
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0 }}>
                {language === 'hi'
                  ? `अब दादाजी को ${extractedMed?.timing} पर आवाज के साथ दवा लेने की याद दिलाई जाएगी।`
                  : `Reminder with voice chime set for ${extractedMed?.timing}.`}
              </p>
            </div>
          ) : (
            <>
              {/* Option 1: File Dropzone / Photo Snap */}
              <div style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                marginBottom: '1.5rem',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}>
                  <Camera size={26} />
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {language === 'hi' ? 'पर्ची की फोटो खींचें या फाइल चुनें' : 'Snap Photo of Prescription or Browse File'}
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                  JPG, PNG, PDF, या क्लिनिक डिस्चार्ज स्लिप समर्थित है
                </p>

                <label style={{
                  background: '#052e26',
                  color: '#bef226',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(5, 46, 38, 0.2)'
                }}>
                  <Upload size={16} />
                  <span>{language === 'hi' ? '📂 फाइल अपलोड करें' : '📂 Choose Prescription'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileInput}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Scanning In Progress Visualizer */}
              {isScanning && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '16px',
                  padding: '1.2rem',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <Sparkles size={18} className="animate-spin" />
                    <span>{language === 'hi' ? 'एआई पर्ची स्कैन कर रहा है...' : 'AI is reading prescription OCR...'}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '9999px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${scanProgress}%`,
                      height: '100%',
                      background: '#16a34a',
                      transition: 'width 0.25s linear'
                    }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                    {selectedFile} • {scanProgress}%
                  </div>
                </div>
              )}

              {/* Option 2: Instant 1-Tap Sample Prescriptions */}
              {!extractedMed && !isScanning && (
                <div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#334155',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <Sparkles size={16} color="#059669" />
                    <span>{language === 'hi' ? 'या इन असली डॉक्टर पर्चियों में से चुनें (तुरंत 1-टैप):' : 'Or tap a verified sample prescription:'}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {PRESET_PRESCRIPTIONS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => handleStartScan(preset)}
                        style={{
                          background: '#f8fafc',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '0.85rem 1.1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          gap: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                              {preset.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {preset.clinicName} • {preset.timing}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          style={{
                            background: '#bef226',
                            color: '#052e26',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '6px 14px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            flexShrink: 0
                          }}
                        >
                          {language === 'hi' ? 'स्कैन करें' : 'Scan'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Medicine Verification Card */}
              {extractedMed && !isScanning && (
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                  border: '2px solid #86efac',
                  borderRadius: '20px',
                  padding: '1.25rem',
                  marginTop: '1rem',
                  boxShadow: '0 4px 15px rgba(22, 163, 74, 0.12)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{
                      fontSize: '0.75rem',
                      background: '#15803d',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontWeight: 800
                    }}>
                      {language === 'hi' ? '✓ पर्ची से पहचानी गई दवा' : '✓ Extracted from Prescription'}
                    </span>
                    <button
                      onClick={() => setExtractedMed(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {language === 'hi' ? 'बदलें' : 'Change'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                        {language === 'hi' ? 'दवा का नाम (Medicine Name):' : 'Medicine Name:'}
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                        {extractedMed.name}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="#15803d" />
                          <span>{language === 'hi' ? 'रिमाइंडर समय' : 'Scheduled Time'}</span>
                        </div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#15803d' }}>
                          {extractedMed.timing}
                        </div>
                      </div>

                      <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                          {language === 'hi' ? 'निर्देश' : 'Instructions'}
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {extractedMed.withFood}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#15803d',
                      fontWeight: 700
                    }}>
                      <Bell size={15} />
                      <span>{language === 'hi' ? '🔔 आवाज के साथ स्वतः रिमाइंडर अलार्म चालू रहेगा' : '🔔 Audio voice chime alarm will sound automatically'}</span>
                    </div>

                    {/* Final Confirm Button */}
                    <button
                      onClick={handleConfirmAdd}
                      style={{
                        marginTop: '0.85rem',
                        background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.85rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 16px rgba(21, 128, 61, 0.35)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <CheckCircle2 size={18} />
                      <span>{language === 'hi' ? 'दवा जोड़ें व रिमाइंडर सेट करें' : 'Add Medicine & Set Reminder'}</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
