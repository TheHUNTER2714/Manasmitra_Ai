import React, { useState } from 'react';
import { Phone, Heart, CheckCircle2, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';

export default function OnboardingRegister({ onCompleteRegistration, language = 'hi' }) {
  const [formData, setFormData] = useState({
    name: 'राज कुमार बरुआ (Raj Kumar Baruah)',
    preferredName: 'दादाजी (Dadaji)',
    age: 74,
    gender: 'पुरुष (Male)',
    location: 'Guwahati, Kamrup Metro, Assam',
    primaryLanguage: 'Hindi / Assamese',
    conditionStage: 'प्रारंभिक स्मृति भ्रम (Mild Cognitive Impairment / Early Dementia)',
    caregiverName: 'अनीता बरुआ (Anita Baruah)',
    caregiverRelationship: 'बेटी (Daughter)',
    caregiverPhone: '+91 98765 43210',
    secondaryContactName: 'बिक्रम बरुआ (Son)',
    secondaryContactPhone: '+91 98111 22334',
    doctorAssigned: 'डॉ. एन. बरुआ (वरिष्ठ न्यूरोलॉजिस्ट)',
    doctorPhone: '+91 94350 12345',
    sosMessageTemplate: 'आपातकालीन सूचना: दादाजी ने मानस मित्र पर SOS दबाया है। कृपया तुरंत संपर्क करें।'
  });

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleQuickDemoFill = () => {
    setFormData({
      ...formData,
      name: 'राज कुमार बरुआ (Raj Kumar Baruah)',
      preferredName: 'दादाजी (Dadaji)',
      age: 74,
      location: 'Guwahati, Kamrup Metro, Assam',
      caregiverName: 'अनीता बरुआ (Anita Baruah)',
      caregiverRelationship: 'बेटी (Daughter)',
      caregiverPhone: '+91 98765 43210'
    });
    speechService.playChime('success');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    offlineSyncEngine.recordEvent('ELDER_PROFILE_REGISTERED', {
      elderName: formData.name,
      caregiverPhone: formData.caregiverPhone,
      timestamp: new Date().toISOString()
    });

    speechService.playChime('success');
    speechService.speak(
      language === 'hi'
        ? `नमस्ते दादाजी! आपका पंजीकरण पूरा हो गया है। परिवार का आपातकालीन SOS नंबर सक्रिय है।`
        : `Welcome! Registration is complete. Your family SOS lifeline is active.`,
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );

    onCompleteRegistration(formData);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0b132b 0%, #172554 50%, #080d1a 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem'
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          width: '100%',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '32px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.35fr'
        }}
      >
        {/* Left Side: Brand Narrative & Visual Banner */}
        <div
          style={{
            background: 'linear-gradient(160deg, #0b132b 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '2.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #f43f5e, #1b4332)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(244, 63, 94, 0.4)'
              }}>
                <Heart size={24} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                ManasMitra <span style={{ color: '#f43f5e' }}>AI</span>
              </span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={14} /> चरण 1: वरिष्ठ नागरिक पंजीकरण
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, color: '#ffffff', marginBottom: '0.75rem' }}>
              सुरक्षित व सम्मानित <span style={{ color: '#f43f5e' }}>संज्ञानात्मक जीवन</span>
            </h2>

            <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              उत्तर-पूर्व क्षेत्र के बुजुर्गों के लिए अनुकूलित याददाश्त खेल, बोलकर सहायता और परिवार के लिए आपातकालीन SOS लाइफलाइन।
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <span>परिवार के नंबर पर स्वचालित SOS संदेश व मिस्ड कॉल</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <span>6 अनुकूलित याददाश्त व एकाग्रता अभ्यास खेल</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={18} color="#34d399" />
                <span>100% ऑफलाइन कार्यक्षमता (इंटरनेट के बिना भी सक्रिय)</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Pre-fill CTA for Evaluators */}
          <div style={{ marginTop: '2.5rem', position: 'relative', zIndex: 2 }}>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px dashed rgba(255, 255, 255, 0.25)',
                color: '#f8fafc',
                padding: '0.75rem',
                borderRadius: '14px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Zap size={16} color="#fde047" /> त्वरित डेमो डेटा भरें (Quick Fill)
            </button>
            <button
              type="button"
              onClick={() => onCompleteRegistration(formData)}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                background: 'linear-gradient(135deg, #bef226 0%, #a3e635 100%)',
                color: '#052e26',
                border: 'none',
                padding: '0.85rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 16px rgba(190, 242, 38, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>🚀 सीधे मुख्य मंच पर जाएं (Enter Main Platform)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Registration & SOS Contact Form */}
        <div style={{ padding: '2.5rem', overflowY: 'auto', maxHeight: '85vh' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                पंजीकरण विवरण (Registration Setup)
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.2rem' }}>
                कृपया बुजुर्ग एवं परिवार के आपातकालीन संपर्क का विवरण दर्ज करें:
              </p>
            </div>
            <button
              type="button"
              onClick={() => onCompleteRegistration(formData)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="सीधे बिना पंजीकरण के मुख्य मंच देखें"
            >
              <span>सीधे मंच खोलें (Skip)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. Elder Profile */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  बुजुर्ग का पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  पुकारने का नाम (Preferred Name)
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => handleChange('preferredName', e.target.value)}
                  placeholder="उदा. दादाजी (Dadaji)"
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  आयु (Age)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  क्षेत्र व जिला (NER Location)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* 2. Primary Family SOS Mobile Number (KEY HIGHLIGHT) */}
            <div style={{
              background: '#fff1f2',
              border: '2px solid #fecdd3',
              borderRadius: '18px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#9f1239', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={18} color="#e11d48" />
                परिवार का आपातकालीन SOS नंबर (Direct SMS, WhatsApp व कॉल अलर्ट) *
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#881337', marginBottom: '0.3rem' }}>
                    परिवार के सदस्य का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.caregiverName}
                    onChange={(e) => handleChange('caregiverName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #fb7185',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#881337', marginBottom: '0.3rem' }}>
                    संबंध (Relationship)
                  </label>
                  <input
                    type="text"
                    value={formData.caregiverRelationship}
                    onChange={(e) => handleChange('caregiverRelationship', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #fb7185',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#9f1239', marginBottom: '0.3rem' }}>
                  🚨 प्राथमिक SOS मोबाइल नंबर (Family Primary SOS Number) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.caregiverPhone}
                  onChange={(e) => handleChange('caregiverPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '2px solid #e11d48',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#9f1239',
                    background: '#ffffff'
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: '#9f1239', fontWeight: 600, display: 'block', marginTop: '0.3rem' }}>
                  * आपातकालीन SOS दबाने पर इस नंबर पर सीधा SMS, WhatsApp संदेश व कॉल डायल होगी।
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                fontSize: '1.15rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
                marginTop: '0.5rem',
                transition: 'transform 0.2s ease'
              }}
            >
              <span>पंजीकरण पूरा करें और लाइव पोर्टल पर जाएं</span>
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
