import React from 'react';
import { User, Users, Stethoscope, PhoneCall, Globe, Volume2, UserPlus, Play } from 'lucide-react';
import { speechService } from '../../services/speechService';
import BrandLogo from './BrandLogo';

export default function HeaderNav({
  activeRole,
  setActiveRole,
  language,
  setLanguage,
  onCallCaregiver,
  onOpenRegister,
  onReplaySplash
}) {
  const handleAudioIntro = () => {
    const text = language === 'hi'
      ? 'नमस्ते! मानस मित्र में आपका स्वागत है। आप खेल खेल सकते हैं, अपनी दवाइयों का समय देख सकते हैं या मुझसे बोलकर बात कर सकते हैं।'
      : 'Welcome to ManasMitra AI, your adaptive cognitive companion for elderly well-being.';
    speechService.speak(text, language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        {/* Impressive Brand Logo */}
        <BrandLogo
          size="md"
          showBadge={true}
          showSubtitle={true}
          onClick={onReplaySplash}
        />

        {/* Role Switcher */}
        <div className="role-switcher" role="tablist" aria-label="User Persona Selector">
          <button
            role="tab"
            aria-selected={activeRole === 'elder'}
            className={`role-btn interactive-text-expand ${activeRole === 'elder' ? 'active' : ''}`}
            onClick={() => setActiveRole('elder')}
            id="role-tab-elder"
          >
            <User size={16} /> 👴 Elder Mode (बुजुर्ग साथी)
          </button>
          <button
            role="tab"
            aria-selected={activeRole === 'caregiver'}
            className={`role-btn interactive-text-expand ${activeRole === 'caregiver' ? 'active' : ''}`}
            onClick={() => setActiveRole('caregiver')}
            id="role-tab-caregiver"
          >
            <Users size={16} /> 👨‍👩‍👧 Caregiver (केयरगिवर)
          </button>
          <button
            role="tab"
            aria-selected={activeRole === 'healthcare'}
            className={`role-btn interactive-text-expand ${activeRole === 'healthcare' ? 'active' : ''}`}
            onClick={() => setActiveRole('healthcare')}
            id="role-tab-healthcare"
          >
            <Stethoscope size={16} /> 👩‍⚕️ Health Worker (स्वास्थ्य पोर्टल)
          </button>
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Elder Registration button */}
          <button
            onClick={onOpenRegister}
            className="acc-pill-btn"
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              color: '#0f172a',
              fontWeight: 700
            }}
            title="Register Elder & Family SOS Contacts"
          >
            <UserPlus size={15} color="#0284c7" />
            <span>पंजीकरण (Register Elder)</span>
          </button>

          {/* Replay logo splash animation */}
          <button
            onClick={onReplaySplash}
            className="acc-pill-btn"
            title="Replay animated intro logo"
            style={{ color: '#64748b' }}
          >
            <Play size={14} /> <span>Intro</span>
          </button>

          {/* Audio introduction button */}
          <button
            onClick={handleAudioIntro}
            className="acc-pill-btn"
            title="Listen to audio guide"
            style={{ color: '#1b4332' }}
          >
            <Volume2 size={16} /> <span>Audio</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="acc-pill-btn"
            title="Toggle Hindi / English"
          >
            <Globe size={15} /> {language === 'hi' ? 'हिन्दी' : 'English'}
          </button>

          {/* Quick SOS Caregiver button */}
          <button
            onClick={onCallCaregiver}
            style={{
              background: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 3px 10px rgba(225, 29, 72, 0.35)',
              animation: 'pulseGlow 2s infinite'
            }}
            title="Trigger Automated SOS Alert & Missed Call"
            id="btn-nav-sos"
          >
            <PhoneCall size={15} /> 🚨 SOS Call
          </button>
        </div>
      </div>
    </header>
  );
}
