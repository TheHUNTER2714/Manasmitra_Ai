import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import './styles/elderTheme.css';
import './styles/games.css';
import './styles/dashboard.css';

// Data & Profiles
import { INITIAL_ELDER_PROFILE } from './data/mockElderData';
import { CULTURAL_PACKS } from './data/culturalPacks';
import { SUPPORTED_LANGUAGES, t, getLocalizedText } from './data/translations';

// Common Components
import LogoSplash from './components/common/LogoSplash';
import BrandLogo from './components/common/BrandLogo';
import AccessibilityBar from './components/common/AccessibilityBar';
import VoiceAssistantModal from './components/common/VoiceAssistantModal';
import ElderRegistrationModal from './components/common/ElderRegistrationModal';
import SosEmergencyModal from './components/common/SosEmergencyModal';
import FamilyMessageModal from './components/common/FamilyMessageModal';
import NetworkToast from './components/common/NetworkToast';
import DashboardBackground from './components/common/DashboardBackground';
import AiHelpModal from './components/common/AiHelpModal';
import AiSahayakLogo from './components/common/AiSahayakLogo';
import IntroVideoModal from './components/common/IntroVideoModal';
import DoctorReminderModal from './components/common/DoctorReminderModal';

// Onboarding & Landing
import OnboardingRegister from './components/onboarding/OnboardingRegister';
import LandingPage from './components/landing/LandingPage';

// Elder Components
import ElderHome from './components/elder/ElderHome';
import ElderGamesMenu from './components/elder/ElderGamesMenu';
import ReminderWidget from './components/elder/ReminderWidget';
import MoodCheckIn from './components/elder/MoodCheckIn';

// Games
import MemoryObjectsGame from './components/games/MemoryObjectsGame';
import AttentionTargetGame from './components/games/AttentionTargetGame';
import PatternSequenceGame from './components/games/PatternSequenceGame';
import DailyRoutineGame from './components/games/DailyRoutineGame';
import ObjectSoundGame from './components/games/ObjectSoundGame';
import StoryRecallGame from './components/games/StoryRecallGame';
import CrosswordMemoryGame from './components/games/CrosswordMemoryGame';

// Caregiver & Healthcare Portals
import CaregiverDashboard from './components/caregiver/CaregiverDashboard';
import HealthcarePortal from './components/healthcare/HealthcarePortal';

import { offlineSyncEngine } from './services/offlineSyncEngine';
import { Wifi, WifiOff, MoreVertical, Settings, Play, Stethoscope, MessageSquare, Globe, ChevronRight } from 'lucide-react';

const PROFILE_STORAGE_KEY = 'manasmitra_registered_profile';
const REGISTERED_FLAG_KEY = 'manasmitra_has_registered';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Onboarding Registration State
  const [isRegistered, setIsRegistered] = useState(() => {
    try {
      return Boolean(localStorage.getItem(REGISTERED_FLAG_KEY));
    } catch {
      return false;
    }
  });

  // Current Active Persona / View: 'landing' | 'elder' | 'caregiver' | 'healthcare'
  const [activeRole, setActiveRole] = useState('landing');
  const [elderTab, setElderTab] = useState('home'); // 'home' | 'games' | 'reminders' | 'mood'
  const [activeGameId, setActiveGameId] = useState(null);
  const [gameDifficultyLevel, setGameDifficultyLevel] = useState(1);

  // Settings & Accessibility
  const [activeCulturalPack, setActiveCulturalPack] = useState('assam');
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('manasmitra_language') || 'hi';
    } catch {
      return 'hi';
    }
  });

  const handleSetLanguage = (newLang) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('manasmitra_language', newLang);
    } catch (e) {
      console.error('Failed to save language:', e);
    }
  };

  const [isFontXl, setIsFontXl] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Modals
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [voiceInitialQuery, setVoiceInitialQuery] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isFamilyMessageOpen, setIsFamilyMessageOpen] = useState(false);
  const [isAiHelpOpen, setIsAiHelpOpen] = useState(false);
  const [isIntroVideoOpen, setIsIntroVideoOpen] = useState(false);
  const [isDoctorReminderOpen, setIsDoctorReminderOpen] = useState(false);

  // Network State
  const [networkOnline, setNetworkOnline] = useState(offlineSyncEngine.isOnline);

  // 3-Dot More Menu State
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMoreMenuOpen]);

  useEffect(() => {
    const unsub = offlineSyncEngine.subscribe((state) => {
      setNetworkOnline(state.isOnline);
    });
    return () => unsub();
  }, []);

  // Patient State with LocalStorage Persistence
  const [elderData, setElderData] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ELDER_PROFILE;
    } catch {
      return INITIAL_ELDER_PROFILE;
    }
  });

  // Onboarding Registration Submission
  const handleCompleteOnboarding = (profileData) => {
    const updated = {
      ...elderData,
      ...profileData
    };
    setElderData(updated);
    setIsRegistered(true);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(REGISTERED_FLAG_KEY, 'true');
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
    setActiveRole('landing');
  };

  // Edit / Update profile from modal
  const handleSaveProfile = (newProfile) => {
    const updated = {
      ...elderData,
      ...newProfile
    };
    setElderData(updated);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  };

  // Add medicine from report / prescription upload
  const handleAddMedicine = (newMed) => {
    const updatedMeds = [
      ...elderData.medications,
      newMed
    ];
    const updatedProfile = {
      ...elderData,
      medications: updatedMeds
    };
    setElderData(updatedProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Failed to save profile medications:', e);
    }
    offlineSyncEngine.recordEvent('MEDICATION_ADDED_FROM_REPORT', {
      medName: newMed.name,
      timing: newMed.timing,
      timestamp: new Date().toISOString()
    });
  };

  // Apply Accessibility Classes to Body
  useEffect(() => {
    if (isFontXl) {
      document.body.classList.add('font-xl');
    } else {
      document.body.classList.remove('font-xl');
    }
  }, [isFontXl]);

  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  // Voice Intent Actions Handler
  const handleTriggerVoiceAction = (action) => {
    if (action === 'open_games') {
      setActiveRole('elder');
      setActiveGameId('memory');
    } else if (action === 'open_reminders') {
      setActiveRole('elder');
      setActiveGameId(null);
      setElderTab('reminders');
    } else if (action === 'open_mood') {
      setActiveRole('elder');
      setActiveGameId(null);
      setElderTab('mood');
    } else if (action === 'call_caregiver') {
      setIsSosOpen(true);
    } else if (action === 'open_family_messages') {
      setIsFamilyMessageOpen(true);
    }
  };

  const handleOpenVoice = (initialQuery = '') => {
    setVoiceInitialQuery(initialQuery);
    setIsVoiceOpen(true);
  };

  const currentPack = CULTURAL_PACKS[activeCulturalPack] || CULTURAL_PACKS.assam;

  return (
    <div className="app-container">
      {/* 0. Cinematic Animated Logo Splash Screen (Shows on launch or replay) */}
      {showSplash && (
        <LogoSplash onFinish={() => setShowSplash(false)} language={language} />
      )}

      {/* Ambient VitAI & Milkinside Inspired Living Background Canvas */}
      {!showSplash && <DashboardBackground activeRole={activeRole} />}

      {/* 1. First-Time Registration Onboarding Flow (Shows after logo if not registered) */}
      {!showSplash && !isRegistered && (
        <OnboardingRegister
          onCompleteRegistration={handleCompleteOnboarding}
          language={language}
        />
      )}

      {/* 2. Main Live Platform (Accessible after registration) */}
      {(!showSplash && isRegistered) && (
        <>
          {/* Floating Automatic Online/Offline Notification Toast */}
          <NetworkToast />

          {/* Clean Top Navigation (Hackathon banner removed) */}
          <header className="top-nav">
            <div className="top-nav-inner">
              {/* Impressive Brand Logo */}
              <BrandLogo
                size="md"
                showBadge={true}
                showSubtitle={true}
                onClick={() => setActiveRole('landing')}
              />

              {/* Persona Navigation Tabs */}
              <div className="role-switcher" role="tablist" aria-label="Portal Selector">
                <button
                  role="tab"
                  aria-selected={activeRole === 'landing'}
                  className={`role-btn ${activeRole === 'landing' ? 'active' : ''}`}
                  onClick={() => setActiveRole('landing')}
                >
                  🌐 {t('navOverview', language, 'Overview')}
                </button>
                <button
                  role="tab"
                  aria-selected={activeRole === 'elder'}
                  className={`role-btn ${activeRole === 'elder' ? 'active' : ''}`}
                  onClick={() => { setActiveRole('elder'); setActiveGameId(null); }}
                  id="role-tab-elder"
                >
                  👴 {t('navElder', language, 'Elder Mode')}
                </button>
                <button
                  role="tab"
                  aria-selected={activeRole === 'caregiver'}
                  className={`role-btn ${activeRole === 'caregiver' ? 'active' : ''}`}
                  onClick={() => setActiveRole('caregiver')}
                  id="role-tab-caregiver"
                >
                  👨‍👩‍👧 {t('navCaregiver', language, 'Caregiver')}
                </button>
                <button
                  role="tab"
                  aria-selected={activeRole === 'healthcare'}
                  className={`role-btn ${activeRole === 'healthcare' ? 'active' : ''}`}
                  onClick={() => setActiveRole('healthcare')}
                  id="role-tab-healthcare"
                >
                  👩‍⚕️ {t('navHealthcare', language, 'Health Portal')}
                </button>
              </div>

              {/* Action Controls: Prominent SOS + 3-Dot (⋮) More Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', position: 'relative' }}>
                {/* 1. Pulsating Emergency SOS Button (Always prominent for senior safety) */}
                <button
                  onClick={() => setIsSosOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
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
                    boxShadow: '0 3px 12px rgba(225, 29, 72, 0.4)',
                    animation: 'pulseGlow 2s infinite',
                    whiteSpace: 'nowrap'
                  }}
                  title="Trigger Emergency SOS Missed Call & Message"
                  id="btn-nav-sos"
                >
                  🚨 {t('navSosCall', language, 'SOS Call')}
                </button>

                {/* 2. Three-Dot (⋮) More Menu Trigger */}
                <div ref={moreMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isMoreMenuOpen ? '#052e26' : '#f8fafc',
                      color: isMoreMenuOpen ? '#bef226' : '#0f172a',
                      border: isMoreMenuOpen ? '1.5px solid #bef226' : '1.5px solid #cbd5e1',
                      cursor: 'pointer',
                      boxShadow: isMoreMenuOpen ? '0 0 14px rgba(190, 242, 38, 0.35)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    title="More Options (Online, Profile, Tour, AI Help, Doctors, Language, Family Message)"
                    id="btn-nav-more-menu"
                    aria-expanded={isMoreMenuOpen}
                  >
                    <MoreVertical size={19} />
                  </button>

                  {/* 3. Three-Dot Dropdown Popover */}
                  {isMoreMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      zIndex: 99999,
                      minWidth: '290px',
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '20px',
                      padding: '0.65rem',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.2), 0 0 20px rgba(5, 46, 38, 0.08)',
                      backdropFilter: 'blur(16px)',
                      animation: 'fadeIn 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem'
                    }}>
                      {/* Item 1: Online / Offline Status Toggle */}
                      <button
                        onClick={() => {
                          offlineSyncEngine.setSimulatedNetworkStatus(!networkOnline);
                        }}
                        style={{
                          background: networkOnline ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                          border: networkOnline ? '1px solid #bbf7d0' : '1px solid #fecaca',
                          borderRadius: '12px',
                          padding: '0.6rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                        title="Click to toggle offline mode simulation"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <div style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            background: networkOnline ? '#22c55e' : '#ef4444',
                            boxShadow: networkOnline ? '0 0 8px #22c55e' : '0 0 8px #ef4444'
                          }} />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: networkOnline ? '#15803d' : '#b91c1c' }}>
                              {networkOnline ? t('navOnline', language, 'Online') : t('navOffline', language, 'Offline')}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {networkOnline ? 'क्लाउड सिंक चालू • क्लिक करें' : 'लोकल सिंक चालू • क्लिक करें'}
                            </div>
                          </div>
                        </div>
                        {networkOnline ? <Wifi size={15} color="#15803d" /> : <WifiOff size={15} color="#b91c1c" />}
                      </button>

                      {/* Item 2: Profile & SOS */}
                      <button
                        onClick={() => {
                          setIsRegisterOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.55rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Settings size={16} color="#0284c7" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                              {t('navProfileSos', language, 'Profile & SOS')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              बुजुर्ग विवरण व आपातकालीन नंबर
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94a3b8" />
                      </button>

                      {/* Item 3: Video Tour (2 Min) */}
                      <button
                        onClick={() => {
                          setIsIntroVideoOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        style={{
                          background: 'rgba(190, 242, 38, 0.12)',
                          border: '1px solid rgba(190, 242, 38, 0.4)',
                          borderRadius: '12px',
                          padding: '0.55rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Play size={16} color="#052e26" fill="#bef226" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#052e26' }}>
                              {t('navVideoTour', language, 'Video Tour (2 Min)')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                              सभी 12 फीचर्स का सजीव टूर
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#047857" />
                      </button>

                      {/* Item 4: AI Sahayak (AI Help) */}
                      <button
                        onClick={() => {
                          setIsAiHelpOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.55rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <AiSahayakLogo size="xs" animated={true} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                              {t('navAiSahayak', language, 'AI Sahayak (AI Help)')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              24x7 बोलकर या लिखकर सहायता
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94a3b8" />
                      </button>

                      {/* Item 5: Doctors (Medindia) */}
                      <button
                        onClick={() => {
                          setIsDoctorReminderOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '0.55rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Stethoscope size={16} color="#0284c7" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                              {t('navDoctor', language, 'Doctors (Medindia)')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                              सत्यापित न्यूरोलॉजिस्ट व रिमाइंडर
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#94a3b8" />
                      </button>

                      {/* Item 6: Language Selector */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.55rem 0.8rem'
                      }}>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Globe size={13} color="#0284c7" />
                          <span>भाषा (Language • 11 Regional)</span>
                        </div>
                        <select
                          value={language}
                          onChange={(e) => {
                            handleSetLanguage(e.target.value);
                          }}
                          id="more-menu-language-select"
                          style={{
                            width: '100%',
                            cursor: 'pointer',
                            fontWeight: 700,
                            padding: '0.45rem 0.65rem',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            color: '#0f172a',
                            fontSize: '0.82rem',
                            outline: 'none'
                          }}
                        >
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.label} ({lang.region})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Item 7: Message (Family) */}
                      <button
                        onClick={() => {
                          setIsFamilyMessageOpen(true);
                          setIsMoreMenuOpen(false);
                        }}
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '12px',
                          padding: '0.55rem 0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <MessageSquare size={16} color="#15803d" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#15803d' }}>
                              {t('navFamilyMessage', language, 'Message (Family)')}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#047857' }}>
                              परिवार को सीधा SMS व व्हाट्सएप
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} color="#15803d" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Accessibility & Regional Theme Bar (Shown on portal pages) */}
          {activeRole !== 'landing' && (
            <AccessibilityBar
              isFontXl={isFontXl}
              setIsFontXl={setIsFontXl}
              isHighContrast={isHighContrast}
              setIsHighContrast={setIsHighContrast}
              activeCulturalPack={activeCulturalPack}
              setActiveCulturalPack={setActiveCulturalPack}
              language={language}
              setLanguage={handleSetLanguage}
            />
          )}

          {/* Sub-Navigation for Elder Mode */}
          {activeRole === 'elder' && (
            <div style={{
              background: '#ffffff',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '0.6rem 1.25rem'
            }}>
              <div style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                overflowX: 'auto'
              }}>
                <button
                  onClick={() => { setElderTab('home'); setActiveGameId(null); }}
                  className={`acc-pill-btn ${elderTab === 'home' && !activeGameId ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                >
                  🏠 {t('tabHome', language, 'Home')}
                </button>
                <button
                  onClick={() => { setElderTab('games'); setActiveGameId(null); }}
                  className={`acc-pill-btn ${elderTab === 'games' || activeGameId ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                >
                  🧠 {t('tabGames', language, 'Brain Games')}
                </button>
                <button
                  onClick={() => { setElderTab('reminders'); setActiveGameId(null); }}
                  className={`acc-pill-btn ${elderTab === 'reminders' ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                >
                  💊 {t('tabReminders', language, 'Reminders')}
                </button>
                <button
                  onClick={() => { setElderTab('mood'); setActiveGameId(null); }}
                  className={`acc-pill-btn ${elderTab === 'mood' ? 'active' : ''}`}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                >
                  😊 {t('tabMood', language, 'Mood Check-in')}
                </button>
              </div>
            </div>
          )}

          {/* Main Content Router with Smooth Portal Page Transitions */}
          <main key={activeRole} className={`${activeRole === 'landing' ? '' : 'main-content'} portal-page-enter`}>
            {/* VIEW 0: LIVE PUBLIC LANDING PAGE */}
            {activeRole === 'landing' && (
              <LandingPage
                onLaunchElderMode={() => { setActiveRole('elder'); setElderTab('home'); setActiveGameId(null); }}
                onLaunchCaregiver={() => setActiveRole('caregiver')}
                onLaunchHealthcare={() => setActiveRole('healthcare')}
                onLaunchGame={(gameId) => {
                  setActiveRole('elder');
                  setActiveGameId(gameId);
                }}
                onOpenRegister={() => setIsRegisterOpen(true)}
                onTriggerSos={() => setIsSosOpen(true)}
                elderData={elderData}
                activeCulturalPack={activeCulturalPack}
                setActiveCulturalPack={setActiveCulturalPack}
                language={language}
                onOpenIntroVideo={() => setIsIntroVideoOpen(true)}
                onOpenAiHelp={() => setIsAiHelpOpen(true)}
                onOpenDoctorReminder={() => setIsDoctorReminderOpen(true)}
                onOpenFamilyMessage={() => setIsFamilyMessageOpen(true)}
              />
            )}

            {/* VIEW 1: ELDER PERSONA */}
            {activeRole === 'elder' && (
              <>
                {/* Individual Game Routers */}
                {activeGameId === 'memory' && (
                  <MemoryObjectsGame
                    onBack={() => setActiveGameId(null)}
                    activeCulturalPack={activeCulturalPack}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'attention' && (
                  <AttentionTargetGame
                    onBack={() => setActiveGameId(null)}
                    activeCulturalPack={activeCulturalPack}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'pattern' && (
                  <PatternSequenceGame
                    onBack={() => setActiveGameId(null)}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'routine' && (
                  <DailyRoutineGame
                    onBack={() => setActiveGameId(null)}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'sound' && (
                  <ObjectSoundGame
                    onBack={() => setActiveGameId(null)}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'story' && (
                  <StoryRecallGame
                    onBack={() => setActiveGameId(null)}
                    activeCulturalPack={activeCulturalPack}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}
                {activeGameId === 'crossword' && (
                  <CrosswordMemoryGame
                    onBack={() => setActiveGameId(null)}
                    difficultyLevel={gameDifficultyLevel}
                    onLevelChange={setGameDifficultyLevel}
                    language={language}
                  />
                )}

                {/* No Game Active: Route by Tab */}
                {!activeGameId && elderTab === 'home' && (
                  <ElderHome
                    elderData={elderData}
                    setElderData={setElderData}
                    activeCulturalPack={activeCulturalPack}
                    onNavigateTab={(tab) => setElderTab(tab)}
                    onOpenVoice={handleOpenVoice}
                    onOpenRegister={() => setIsRegisterOpen(true)}
                    onTriggerSos={() => setIsSosOpen(true)}
                    onOpenFamilyMessage={() => setIsFamilyMessageOpen(true)}
                    onAddMedicine={handleAddMedicine}
                    onLaunchGame={(gameId) => {
                      setActiveGameId(gameId);
                    }}
                    language={language}
                  />
                )}

                {!activeGameId && elderTab === 'games' && (
                  <ElderGamesMenu
                    onSelectGame={(gameId) => setActiveGameId(gameId)}
                    language={language}
                    culturalPackName={currentPack.name}
                  />
                )}

                {!activeGameId && elderTab === 'reminders' && (
                  <ReminderWidget
                    elderData={elderData}
                    setElderData={setElderData}
                    language={language}
                  />
                )}

                {!activeGameId && elderTab === 'mood' && (
                  <MoodCheckIn
                    currentMood={elderData.todayMood}
                    onMoodSelect={(emoji, text) => {
                      setElderData({
                        ...elderData,
                        todayMood: emoji,
                        todayMoodText: text
                      });
                    }}
                    language={language}
                  />
                )}
              </>
            )}

            {/* VIEW 2: CAREGIVER DASHBOARD */}
            {activeRole === 'caregiver' && (
              <CaregiverDashboard
                elderData={elderData}
                setElderData={setElderData}
                onLaunchGame={(gameId) => {
                  setActiveRole('elder');
                  setActiveGameId(gameId);
                }}
                language={language}
              />
            )}

            {/* VIEW 3: HEALTHCARE WORKER PORTAL */}
            {activeRole === 'healthcare' && (
              <HealthcarePortal language={language} />
            )}
          </main>

          {/* Voice Assistant Modal */}
          <VoiceAssistantModal
            isOpen={isVoiceOpen}
            onClose={() => setIsVoiceOpen(false)}
            initialQuery={voiceInitialQuery}
            language={language}
            onTriggerAction={handleTriggerVoiceAction}
          />

          {/* Elder Registration & SOS Numbers Modal */}
          <ElderRegistrationModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            elderData={elderData}
            onSaveProfile={handleSaveProfile}
            language={language}
          />

          {/* Automated Emergency SOS Modal (With Missed Call Simulation) */}
          <SosEmergencyModal
            isOpen={isSosOpen}
            onClose={() => setIsSosOpen(false)}
            elderData={elderData}
            language={language}
          />

          {/* Direct Family Messaging Modal */}
          <FamilyMessageModal
            isOpen={isFamilyMessageOpen}
            onClose={() => setIsFamilyMessageOpen(false)}
            elderData={elderData}
            language={language}
          />

          {/* 24x7 AI Sahayak Assistant Modal */}
          <AiHelpModal
            isOpen={isAiHelpOpen}
            onClose={() => setIsAiHelpOpen(false)}
            language={language}
            onNavigateAction={(role) => {
              setActiveRole(role);
              setIsAiHelpOpen(false);
            }}
          />

          {/* 2-Min Interactive Feature Video Tour Modal */}
          <IntroVideoModal
            isOpen={isIntroVideoOpen}
            onClose={() => setIsIntroVideoOpen(false)}
            language={language}
            onNavigateRole={(role) => {
              setActiveRole(role);
              setIsIntroVideoOpen(false);
            }}
            onTriggerAction={(action) => {
              setIsIntroVideoOpen(false);
              if (action === 'open_doctor_modal') setIsDoctorReminderOpen(true);
              else if (action === 'open_family_message') setIsFamilyMessageOpen(true);
              else if (action === 'open_sos') setIsSosOpen(true);
              else if (action === 'open_ai_help') setIsAiHelpOpen(true);
              else if (action === 'open_register') setIsRegisterOpen(true);
              else if (action === 'toggle_online') offlineSyncEngine.setSimulatedNetworkStatus(!networkOnline);
              else if (action === 'focus_language') {
                const el = document.getElementById('top-nav-language-select');
                if (el) { el.scrollIntoView({ behavior: 'smooth' }); el.focus(); }
              }
            }}
          />

          {/* State-Wise Medindia Doctor Directory & Reminder Modal */}
          <DoctorReminderModal
            isOpen={isDoctorReminderOpen}
            onClose={() => setIsDoctorReminderOpen(false)}
            elderData={elderData}
            language={language}
          />

          {/* Floating Accessible AI Sahayak Widget (Bottom-Right) */}
          <div style={{
            position: 'fixed',
            bottom: '22px',
            right: '22px',
            zIndex: 9999
          }}>
            <button
              onClick={() => setIsAiHelpOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #052e26 0%, #064e3b 100%)',
                color: '#bef226',
                border: '2px solid #bef226',
                borderRadius: '9999px',
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(5, 46, 38, 0.45)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                animation: 'pulseGlow 3s infinite'
              }}
              title="Click to open 24x7 AI Sahayak Help Assistant"
            >
              <AiSahayakLogo size="sm" animated={true} />
              <span>{t('floatingAiSahayak', language, 'AI Sahayak')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
