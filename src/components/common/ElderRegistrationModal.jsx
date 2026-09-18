import React, { useState } from 'react';
import { User, Phone, X, CheckCircle2 } from 'lucide-react';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';

export default function ElderRegistrationModal({
  isOpen,
  onClose,
  elderData,
  onSaveProfile,
  language = 'hi'
}) {
  const [formData, setFormData] = useState({
    name: elderData.name || 'राज कुमार बरुआ (Raj Kumar Baruah)',
    preferredName: elderData.preferredName || 'दादाजी (Dadaji)',
    age: elderData.age || 74,
    gender: elderData.gender || 'पुरुष (Male)',
    location: elderData.location || 'Guwahati, Kamrup Metro, Assam',
    primaryLanguage: elderData.primaryLanguage || 'Hindi / Assamese',
    conditionStage: elderData.conditionStage || 'प्रारंभिक स्मृति भ्रम (Mild Cognitive Impairment / Early Dementia)',
    caregiverName: elderData.caregiverName || 'अनीता बरुआ (Anita Baruah)',
    caregiverRelationship: elderData.caregiverRelationship || 'बेटी (Daughter)',
    caregiverPhone: elderData.caregiverPhone || '+91 98765 43210',
    secondaryContactName: elderData.secondaryContactName || 'बिक्रम बरुआ (Son)',
    secondaryContactPhone: elderData.secondaryContactPhone || '+91 98111 22334',
    doctorAssigned: elderData.doctorAssigned || 'डॉ. एन. बरुआ (वरिष्ठ न्यूरोलॉजिस्ट)',
    doctorPhone: elderData.doctorPhone || '+91 94350 12345',
    sosMessageTemplate: elderData.sosMessageTemplate || 'आपातकालीन सूचना: दादाजी ने मानस मित्र पर SOS दबाया है। कृपया तुरंत संपर्क करें।'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);

    // Save into offline sync engine
    offlineSyncEngine.recordEvent('ELDER_PROFILE_REGISTERED', {
      elderName: formData.name,
      caregiverPhone: formData.caregiverPhone,
      timestamp: new Date().toISOString()
    });

    speechService.playChime('success');
    speechService.speak(
      language === 'hi'
        ? 'वरिष्ठ नागरिक एवं परिवार के आपातकालीन नंबर सुरक्षित रूप से दर्ज कर लिए गए हैं।'
        : 'Elder registration and family SOS contact numbers have been saved successfully.',
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                {language === 'hi' ? 'वरिष्ठ नागरिक पंजीकरण व SOS संपर्क' : 'Elder Registration & Family SOS Setup'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                {language === 'hi'
                  ? 'आपातकालीन स्थिति में परिवार के सदस्य को तुरंत संदेश व कॉल भेजने हेतु संपर्क विवरण दर्ज करें'
                  : 'Register family contacts for automated SOS SMS alerts and missed calls'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {savedSuccess ? (
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '18px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            color: '#166534'
          }}>
            <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>पंजीकरण सफलतापूर्वक सहेजा गया!</h4>
            <p style={{ marginTop: '0.5rem', fontSize: '1rem', color: '#15803d' }}>
              परिवार का SOS नंबर: <strong>{formData.caregiverPhone}</strong> आपातकाल हेतु सक्रिय है।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Section 1: Elder Information */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={18} color="#1b4332" />
                1. वरिष्ठ नागरिक का विवरण (Elder Profile)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    पूरा नाम (Full Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    पुकारने का नाम (Preferred Name)
                  </label>
                  <input
                    type="text"
                    value={formData.preferredName}
                    onChange={(e) => handleChange('preferredName', e.target.value)}
                    placeholder="उदा. दादाजी / Dadaji"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    आयु (Age)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    लिंग (Gender)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  >
                    <option value="पुरुष (Male)">पुरुष (Male)</option>
                    <option value="महिला (Female)">महिला (Female)</option>
                    <option value="अन्य (Other)">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    प्राथमिक भाषा (Language)
                  </label>
                  <input
                    type="text"
                    value={formData.primaryLanguage}
                    onChange={(e) => handleChange('primaryLanguage', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                  स्थान व जिला (NER Location & District)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                  संज्ञानात्मक स्थिति (Cognitive / Dementia Stage)
                </label>
                <select
                  value={formData.conditionStage}
                  onChange={(e) => handleChange('conditionStage', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    background: 'white'
                  }}
                >
                  <option value="प्रारंभिक स्मृति भ्रम (Mild Cognitive Impairment / Early Dementia)">
                    प्रारंभिक स्मृति भ्रम (Mild Cognitive Impairment)
                  </option>
                  <option value="मध्यम डिमेंशिया स्थिति (Moderate Dementia)">
                    मध्यम डिमेंशिया स्थिति (Moderate Dementia)
                  </option>
                  <option value="स्वस्थ वरिष्ठ नागरिक (Healthy Senior Wellness)">
                    स्वस्थ वरिष्ठ नागरिक (Healthy Senior Wellness)
                  </option>
                </select>
              </div>
            </div>

            {/* Section 2: Family Member & Emergency SOS Contacts (THE CORE FEATURE) */}
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fca5a5',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem'
            }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={18} color="#dc2626" />
                2. आपातकालीन SOS संपर्क व परिवार का मोबाइल नंबर *
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '0.3rem' }}>
                    प्राथमिक परिवार सदस्य (Caregiver Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.caregiverName}
                    onChange={(e) => handleChange('caregiverName', e.target.value)}
                    placeholder="उदा. अनीता बरुआ"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '2px solid #f87171',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#7f1d1d', marginBottom: '0.3rem' }}>
                    संबंध (Relationship)
                  </label>
                  <input
                    type="text"
                    value={formData.caregiverRelationship}
                    onChange={(e) => handleChange('caregiverRelationship', e.target.value)}
                    placeholder="उदा. बेटी (Daughter)"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #f87171',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              {/* High-priority Primary Mobile SOS Number */}
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#b91c1c', marginBottom: '0.3rem' }}>
                  🚨 प्राथमिक SOS मोबाइल नंबर (Family Primary SOS Number - SMS, WhatsApp & Call) *
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="tel"
                    required
                    value={formData.caregiverPhone}
                    onChange={(e) => handleChange('caregiverPhone', e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '2.5px solid #dc2626',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#991b1b',
                      background: '#ffffff'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600, display: 'block', marginTop: '0.3rem' }}>
                  * जब बुजुर्ग SOS दबाएंगे, इस नंबर पर प्रत्यक्ष आपातकालीन SMS, WhatsApp और कॉल ट्रिगर होगी।
                </span>
              </div>

              {/* Secondary Backup Contact */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.9rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    द्वितीयक संपर्क नाम (Secondary Contact)
                  </label>
                  <input
                    type="text"
                    value={formData.secondaryContactName}
                    onChange={(e) => handleChange('secondaryContactName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                    द्वितीयक फ़ोन नंबर (Secondary Phone)
                  </label>
                  <input
                    type="tel"
                    value={formData.secondaryContactPhone}
                    onChange={(e) => handleChange('secondaryContactPhone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      background: 'white'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                color: 'white',
                border: 'none',
                padding: '0.95rem 1.8rem',
                borderRadius: '14px',
                fontSize: '1.15rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(27, 67, 50, 0.3)'
              }}
            >
              <CheckCircle2 size={20} />
              {language === 'hi' ? 'पंजीकरण सहेजें व SOS सक्रिय करें' : 'Save Registration & Activate SOS'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
