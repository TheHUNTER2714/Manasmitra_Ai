import React, { useState } from 'react';
import {
  HeartPulse,
  Clock,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Share2,
  Stethoscope,
  MapPin,
  Globe,
  BellRing,
  UploadCloud,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import IndividualizedInterventionModal from '../common/IndividualizedInterventionModal';
import BookingModal from '../common/BookingModal';
import ClinicalReportModal from '../caregiver/ClinicalReportModal';
import BrandLogo from '../common/BrandLogo';
import AiSahayakLogo from '../common/AiSahayakLogo';
import IntroAudioPlayer from '../common/IntroAudioPlayer';
import ScrollingIntroShowcase from './ScrollingIntroShowcase';
import { VERIFIED_REAL_DOCTORS } from '../../services/realDoctorService';
import { t } from '../../data/translations';

export default function LandingPage({
  onLaunchElderMode,
  onLaunchCaregiver,
  onLaunchHealthcare,
  onLaunchGame,
  _onOpenRegister,
  _onTriggerSos,
  elderData,
  _activeCulturalPack,
  _setActiveCulturalPack,
  language = 'hi',
  onOpenIntroVideo,
  onOpenAiHelp,
  onOpenDoctorReminder,
  onOpenFamilyMessage
}) {
  const [selectedDay, setSelectedDay] = useState(10);
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailJoined, setEmailJoined] = useState(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  const days = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
    [31, 1, 2, 3, 4, 5, 6]
  ];

  return (
    <div className="dribbble-vitai-canvas">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & HEADER (Exact Dribbble VitAI Electric Lime Stage) */}
      {/* ========================================================================= */}
      <div className="vitai-hero-wrapper">
        {/* Navigation Bar inside the Hero Canvas */}
        <header className="vitai-nav-bar">
          <BrandLogo
            size="md"
            showBadge={true}
            showSubtitle={false}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          <nav className="vitai-nav-links">
            <a href="#hero" className="active">{t('navLinkHome', language, 'Home')}</a>
            <a href="#how-it-works">{t('navLinkHowItWorks', language, 'How It Works')}</a>
            <a href="#biomarkers">{t('navLinkBiomarkers', language, 'Biomarker Decoder')}</a>
            <a href="#portal" onClick={(e) => { e.preventDefault(); onLaunchElderMode(); }}>{t('navLinkPatientPortal', language, 'Patient Portal')}</a>
            <a href="#about" className="has-dropdown">{t('navLinkAbout', language, 'About NER Mission')} <span>⌄</span></a>
          </nav>

          <div className="vitai-nav-actions">
            <button
              onClick={onOpenAiHelp}
              className="vitai-pill-action outline"
              title="Open 24x7 AI Sahayak for Dementia Guidance & App Help"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <AiSahayakLogo size="xs" animated={true} />
              <span>{t('navAiSahayak', language, 'AI Sahayak')}</span>
            </button>
            <button
              onClick={onOpenIntroVideo}
              className="vitai-pill-action outline"
              title="Watch 2-Minute Feature Video Tour"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>▶</span> <span>{t('navVideoTour', language, 'Video Tour')}</span>
            </button>
            <button
              onClick={() => setIsInterventionModalOpen(true)}
              className="vitai-pill-action outline"
              title="View Individualized Intervention based on Emotion Trends"
            >
              <Sparkles size={15} /> <span>{t('btnNavInterventions', language, 'Interventions')}</span>
            </button>
            <button
              onClick={() => {
                if (onOpenDoctorReminder) onOpenDoctorReminder();
                else {
                  setSelectedDoctorForBooking(null);
                  setIsBookingModalOpen(true);
                }
              }}
              className="vitai-pill-action solid"
              id="btn-nav-set-reminder"
            >
              {t('btnNavDoctorReminder', language, 'Doctor Directory & Reminders')}
            </button>
          </div>
        </header>

        {/* Hero Central Content */}
        <div className="vitai-hero-body">
          <h1 className="vitai-hero-headline">
            {t('heroHeadline1', language, 'Healthcare that speaks')}<br />
            <span className="vitai-hero-serif">{t('heroHeadline2', language, 'your language')}</span>
          </h1>
          <p style={{
            maxWidth: '680px',
            margin: '0 auto 1.5rem',
            color: '#134e4a',
            fontSize: '1.05rem',
            lineHeight: 1.55,
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {t('heroSub', language, 'North East India\'s first culturally grounded digital therapeutic platform for dementia and cognitive care across 8 states.')}
          </p>

          <div className="vitai-hero-cta-wrap" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onLaunchElderMode}
              className="vitai-cta-black-pill"
              id="btn-explore-patient-portal"
            >
              {t('btnExplorePatientPortal', language, 'Explore Patient Portal')}
            </button>

            <button
              onClick={onOpenIntroVideo}
              style={{
                background: '#ffffff',
                color: '#052e26',
                border: '2px solid #052e26',
                borderRadius: '9999px',
                padding: '0.8rem 1.5rem',
                fontSize: '0.98rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(5, 46, 38, 0.12)'
              }}
              title="Watch 2-Minute Guided Tour Video"
            >
              <span style={{ color: '#059669' }}>▶</span>
              <span>{t('btnWatchVideoTour', language, 'Watch Video Tour (2 Min)')}</span>
            </button>

            <IntroAudioPlayer language={language} onOpenTour={onOpenIntroVideo} />
          </div>

          {/* Realistic iPhone Floating Centerpiece */}
          <div className="vitai-hero-mockup-stage">
            {/* Left Floating Glass Card: Vitamin D / Cognitive Biomarker */}
            <div className="vitai-floating-pill float-left-card">
              <div className="float-card-header">
                <span>Vitamin D is up 15%</span>
                <TrendingUp size={16} color="#16a34a" />
              </div>
              <p className="float-card-sub">
                Great progress! Your levels are moving in the right direction.
              </p>
              <div className="float-card-badge">
                <CheckCircle2 size={13} /> AI confidence: High
              </div>
            </div>

            {/* Central Smartphone Mockup */}
            <div className="vitai-iphone-bezel">
              {/* Dynamic Island / Top Speaker Notch */}
              <div className="vitai-iphone-island" />

              {/* Status Bar */}
              <div className="vitai-iphone-status">
                <span className="status-time">9:41</span>
                <div className="status-icons">
                  <span className="status-signal">📶</span>
                  <span className="status-wifi">📡</span>
                  <span className="status-battery">🔋</span>
                </div>
              </div>

              {/* Phone App Content */}
              <div className="vitai-phone-inner">
                {/* User Greeting Bar */}
                <div className="phone-user-row">
                  <div className="phone-avatar-info">
                    <div className="phone-avatar-circle">
                      👴
                    </div>
                    <div>
                      <div className="phone-greeting-sub">Welcome back,</div>
                      <div className="phone-user-name">{elderData?.preferredName || 'Ava Carter'}</div>
                    </div>
                  </div>
                  <div className="phone-share-icon">
                    <Share2 size={16} />
                  </div>
                </div>

                {/* Report Subheading */}
                <div className="phone-report-header">
                  <h3>Visual Biomarkers Report</h3>
                  <span className="phone-report-date">July 30, 2026</span>
                </div>

                {/* Biomarker Overview Section */}
                <div className="phone-biomarker-card">
                  <div className="phone-biomarker-title">Biomarker Overview</div>

                  {/* Meter 1 */}
                  <div className="biomarker-meter-row">
                    <div className="biomarker-meter-bar">
                      <div className="meter-fill" style={{ width: '75%' }} />
                    </div>
                    <div className="biomarker-meter-val">
                      <strong>34 ng/mL</strong> • In range
                    </div>
                  </div>

                  {/* Meter 2 */}
                  <div className="biomarker-meter-row">
                    <div className="biomarker-meter-bar">
                      <div className="meter-fill" style={{ width: '60%' }} />
                    </div>
                    <div className="biomarker-meter-val">
                      <strong>8.5</strong> • In range
                    </div>
                  </div>

                  {/* Meter 3 */}
                  <div className="biomarker-meter-row">
                    <div className="biomarker-meter-bar">
                      <div className="meter-fill" style={{ width: '88%' }} />
                    </div>
                    <div className="biomarker-meter-val">
                      <strong>88/100</strong> • In range
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Floating Glass Card: Goals on track */}
            <div className="vitai-floating-pill float-right-card">
              <div className="float-card-header">
                <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Your progress</span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                2 of 3 goals on track <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ⓘ</span>
              </div>
              <div className="goal-checklist">
                <div className="goal-check-item">
                  <span className="goal-check-circle checked">✓</span>
                  <span>Ferritin in optimal range</span>
                </div>
                <div className="goal-check-item">
                  <span className="goal-check-circle checked">✓</span>
                  <span>Vitamin D in optimal range</span>
                </div>
                <div className="goal-check-item">
                  <span className="goal-check-circle toggle">○</span>
                  <span>Sleep quality improved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1.5. SCROLLING ANIMATED SITE INTRO VIDEO SHOWCASE & REEL (All 12 Features) */}
      {/* ========================================================================= */}
      <ScrollingIntroShowcase
        language={language}
        onOpenFullscreenTour={onOpenIntroVideo}
        onLaunchElderMode={onLaunchElderMode}
        onLaunchCaregiver={onLaunchCaregiver}
        onLaunchHealthcare={onLaunchHealthcare}
        onTriggerSos={_onTriggerSos}
        onOpenDoctorReminder={onOpenDoctorReminder}
        onOpenAiHelp={onOpenAiHelp}
        onOpenFamilyMessage={onOpenFamilyMessage}
      />

      {/* ========================================================================= */}
      {/* 2. SECTION: TRADITIONAL LAB REPORTS VS AI INTERPRETATION */}
      {/* ========================================================================= */}
      <section className="vitai-compare-section" id="biomarkers">
        {/* Blueprint Registration Square Markers (exact from video) */}
        <div className="reg-mark mark-left" />
        <div className="reg-mark mark-right" />

        <div className="compare-header-wrap">
          <div className="compare-subheading">
            {t('compareSubheading', language, 'Traditional lab reports create panic.')}
          </div>
          <h2 className="compare-headline">
            {t('compareHeadline', language, 'We bring clarity.')}
          </h2>

          <div className="see-difference-node-wrap">
            <button
              className="see-difference-pill"
              onClick={() => setIsInterventionModalOpen(true)}
            >
              {t('btnSeeDifference', language, 'See the difference')}
            </button>
            <div className="difference-stem" />
            <div className="difference-node-symbol">
              <span className="dot dot-top" />
              <div className="dots-bottom">
                <span className="dot dot-left" />
                <span className="dot dot-right" />
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Cards Grid */}
        <div className="compare-cards-grid">
          {/* Card Left: Traditional Lab Report (Paper, Cryptic) */}
          <div className="card-traditional-report">
            <div className="trad-card-header">
              <span style={{ fontSize: '1rem' }}>📄</span>
              <span>{t('tradCardTitle', language, 'Traditional Lab Report')}</span>
            </div>

            <table className="trad-report-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Flag</th>
                  <th>Reference range</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="test-name">HGB</div>
                    <div className="test-full">Hemoglobin</div>
                  </td>
                  <td><strong>12.1</strong> g/dL</td>
                  <td></td>
                  <td>13.5–17.5</td>
                </tr>
                <tr>
                  <td>
                    <div className="test-name">HCT</div>
                    <div className="test-full">Hematocrit</div>
                  </td>
                  <td><strong>36.2</strong> %</td>
                  <td></td>
                  <td>41–53</td>
                </tr>
                <tr className="flagged-row">
                  <td>
                    <div className="test-name">MCHC</div>
                    <div className="test-full">Mean Corpuscular Hemoglobin Conc.</div>
                  </td>
                  <td><strong>31.4</strong> g/dL</td>
                  <td><span className="flag-l">L</span></td>
                  <td>32.0–36.0</td>
                </tr>
                <tr>
                  <td>
                    <div className="test-name">RDW</div>
                    <div className="test-full">Red Cell Distribution Width</div>
                  </td>
                  <td><strong>15.6</strong> %</td>
                  <td></td>
                  <td>11.5–14.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card Right: ManasMitra AI Interpretation (Sleek, Glowing) */}
          <div className="card-vitai-interpretation">
            <div className="vitai-interp-top">
              <div className="vitai-interp-brand">
                <div className="mini-brand-symbol">
                  <span className="dot dot-top" />
                  <div className="dots-bottom">
                    <span className="dot dot-left" />
                    <span className="dot dot-right" />
                  </div>
                </div>
                <span>{t('manasMitraInterp', language, 'ManasMitra Interpretation')}</span>
              </div>
              <div className="vitai-interp-status-badge">
                <span className="status-label">Overall Status</span>
                <span className="status-pill-green">In Range</span>
              </div>
            </div>

            <h3 className="vitai-interp-title">
              {t('overallStatusBalanced', language, 'Your results look balanced.')}
            </h3>
            <p className="vitai-interp-desc">
              {t('balancedDesc', language, 'Cognitive biomarkers and vital nutrients are in an optimal range, supporting steady energy and memory stability.')}
            </p>

            {/* Meter 1: Vitamin D */}
            <div className="vitai-meter-group">
              <div className="meter-label-row">
                <span>Vitamin D</span>
                <span className="meter-badge-val">42 ng/mL • In range</span>
              </div>
              <div className="vitai-meter-track">
                <div className="vitai-meter-fill" style={{ width: '84%' }} />
              </div>
            </div>

            {/* Meter 2: Omega-3 Index */}
            <div className="vitai-meter-group">
              <div className="meter-label-row">
                <span>Omega-3 Index</span>
                <span className="meter-badge-val">6.8 % • In range</span>
              </div>
              <div className="vitai-meter-track">
                <div className="vitai-meter-fill" style={{ width: '68%' }} />
              </div>
            </div>

            {/* Meter 3: Metabolic Health */}
            <div className="vitai-meter-group">
              <div className="meter-label-row">
                <span>Metabolic Health</span>
                <span className="meter-badge-val">82/100 • In range</span>
              </div>
              <div className="vitai-meter-track">
                <div className="vitai-meter-fill" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION: A SEAMLESS JOURNEY (Fluid Booking, Video Call, Medical Conclusion) */}
      {/* ========================================================================= */}
      <section className="vitai-journey-section" id="how-it-works">
        {/* Registration Marks */}
        <div className="reg-mark mark-left" />
        <div className="reg-mark mark-right" />

        <div className="journey-header-wrap">
          <div className="journey-subheading">{t('journeySubheading', language, 'A seamless journey')}</div>
          <h2 className="journey-headline">{t('journeyHeadline', language, 'Trust at every step')}</h2>
        </div>

        <div className="journey-columns-grid">
          {/* Column 1: Fluid Booking Calendar */}
          <div className="journey-card fluid-booking-card">
            <div className="booking-title">{t('schedulerTitle', language, 'Doctor Reminder Scheduler')}</div>

            <div className="calendar-month-selector">
              <span className="month-text">August 2026 &gt;</span>
              <div className="month-arrows">
                <button aria-label="Previous Month">&lt;</button>
                <button aria-label="Next Month">&gt;</button>
              </div>
            </div>

            <div className="calendar-days-header">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>

            <div className="calendar-days-grid">
              {days.map((week, wIdx) => (
                <div key={wIdx} className="calendar-week-row">
                  {week.map((d, dIdx) => {
                    const isFaded = (wIdx === 0 && d > 20) || (wIdx >= 4 && d < 10);
                    const isSelected = d === selectedDay && !isFaded;
                    return (
                      <button
                        key={dIdx}
                        onClick={() => !isFaded && setSelectedDay(d)}
                        className={`cal-day-cell ${isSelected ? 'selected' : ''} ${isFaded ? 'faded' : ''}`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Time Selector Dropdown Pill */}
            <div className="time-select-pill">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Clock size={16} />
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  aria-label="Select appointment time"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>
              <ChevronDown size={16} />
            </div>

            <button
              className="btn-confirm-appointment"
              onClick={() => {
                setSelectedDoctorForBooking(VERIFIED_REAL_DOCTORS[0]);
                setIsBookingModalOpen(true);
              }}
            >
              {bookingConfirmed ? '✓ Reminder Scheduled!' : t('btnSetDoctorReminderDirect', language, 'Set Doctor Reminder →')}
            </button>
          </div>

          {/* Column 2: Verified Clinical Specialists & Instant Reminder Setup */}
          <div className="journey-card specialist-booking-roster-card">
            <div className="specialist-card-top">
              <div className="specialist-badge">
                <ShieldCheck size={14} color="#16a34a" /> <span>Verified Board Specialists</span>
              </div>
              <h3 className="specialist-title">{t('specialistRosterTitle', language, 'Set Specialist Doctor Reminders')}</h3>
              <p className="specialist-sub">{t('specialistRosterSub', language, 'Verified specialists from NEIGRIHMS Shillong, GMCH, RIMS & NIMHANS')}</p>
            </div>

            <div className="specialist-roster-list">
              {/* Doctor 1: Dr. Shri Ram Sharma (NEIGRIHMS Shillong) */}
              <div className="specialist-item">
                <img
                  src={VERIFIED_REAL_DOCTORS[0].avatar}
                  alt={VERIFIED_REAL_DOCTORS[0].name}
                  className="specialist-thumb"
                />
                <div className="specialist-info">
                  <div className="specialist-name">{VERIFIED_REAL_DOCTORS[0].name}</div>
                  <div className="specialist-role">HOD Neurology • NEIGRIHMS Shillong</div>
                  <div className="specialist-slot">● Available Tue/Fri, 10:30 AM</div>
                </div>
                <button
                  className="btn-book-slot"
                  onClick={() => {
                    setSelectedDoctorForBooking(VERIFIED_REAL_DOCTORS[0]);
                    setIsBookingModalOpen(true);
                  }}
                >
                  {t('btnSetDoctorElderHome', language, 'Set Reminder')}
                </button>
              </div>

              {/* Doctor 2: Dr. Satish Bawri (GMCH Guwahati) */}
              <div className="specialist-item">
                <img
                  src={VERIFIED_REAL_DOCTORS[2].avatar}
                  alt={VERIFIED_REAL_DOCTORS[2].name}
                  className="specialist-thumb"
                />
                <div className="specialist-info">
                  <div className="specialist-name">{VERIFIED_REAL_DOCTORS[2].name}</div>
                  <div className="specialist-role">Senior Neurologist • GMCH Guwahati</div>
                  <div className="specialist-slot">● Available Tomorrow, 11:45 AM</div>
                </div>
                <button
                  className="btn-book-slot"
                  onClick={() => {
                    setSelectedDoctorForBooking(VERIFIED_REAL_DOCTORS[2]);
                    setIsBookingModalOpen(true);
                  }}
                >
                  {t('btnSetDoctorElderHome', language, 'Set Reminder')}
                </button>
              </div>

              {/* Doctor 3: Dr. Suvarna Alladi (NIMHANS Bengaluru) */}
              <div className="specialist-item">
                <img
                  src={VERIFIED_REAL_DOCTORS[5].avatar}
                  alt={VERIFIED_REAL_DOCTORS[5].name}
                  className="specialist-thumb"
                />
                <div className="specialist-info">
                  <div className="specialist-name">{VERIFIED_REAL_DOCTORS[5].name}</div>
                  <div className="specialist-role">Head, Cognitive Clinic • NIMHANS</div>
                  <div className="specialist-slot">● Available Friday, 3:00 PM</div>
                </div>
                <button
                  className="btn-book-slot"
                  onClick={() => {
                    setSelectedDoctorForBooking(VERIFIED_REAL_DOCTORS[5]);
                    setIsBookingModalOpen(true);
                  }}
                >
                  {t('btnSetDoctorElderHome', language, 'Set Reminder')}
                </button>
              </div>
            </div>

            <div className="specialist-footer-note">
              <Stethoscope size={14} color="#bef226" /> Verified specialists from NEIGRIHMS Shillong, GMCH & NIMHANS
            </div>
          </div>

          {/* Column 3: Medical Conclusion Card */}
          <div className="journey-card medical-conclusion-card">
            <div className="conclusion-banner">{t('medicalConclusionTitle', language, 'Medical Conclusion & Analysis')}</div>

            <div className="doctor-profile-row">
              <img
                src={VERIFIED_REAL_DOCTORS[0].avatar}
                alt={VERIFIED_REAL_DOCTORS[0].name}
                className="doctor-avatar-thumb"
              />
              <div>
                <div className="doctor-profile-name">{VERIFIED_REAL_DOCTORS[0].name}</div>
                <div className="doctor-assessment-badge">
                  <CheckCircle2 size={13} /> {VERIFIED_REAL_DOCTORS[0].hospital}
                </div>
              </div>
            </div>

            <div className="conclusion-items-list">
              {/* Item 1 */}
              <div className="conclusion-item-row">
                <div className="item-icon-circle green">
                  <HeartPulse size={18} />
                </div>
                <div>
                  <div className="item-header">Overall health summary</div>
                  <div className="item-desc">Your results are within the expected range.</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="conclusion-item-row">
                <div className="item-icon-circle blue">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div className="item-header">Key findings</div>
                  <div className="item-desc">No urgent concerns identified</div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="conclusion-item-row">
                <div className="item-icon-circle lime">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="item-header">Next steps</div>
                  <div className="item-desc">Continue regular monitoring</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-view-full-report"
            >
              {t('btnUploadAnalyzeReport', language, 'Upload & Analyze Patient Report →')}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION: TAKE CONTROL OF YOUR HEALTH (Doctor Photo with Overlay) */}
      {/* ========================================================================= */}
      <section className="vitai-photo-banner-section">
        <div className="photo-banner-container">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80"
            alt="Caring Doctor with Senior Patient"
            className="photo-banner-bg"
          />

          {/* Centered Floating Lime Green Dialog Card */}
          <div className="floating-lime-dialog">
            <h3 className="dialog-title">
              {t('bannerHead', language, 'Take control of your health. Calmly.')}
            </h3>

            <div className="dialog-btn-row">
              <button
                onClick={onLaunchElderMode}
                className="dialog-btn-solid"
              >
                {t('btnGetAppElder', language, 'Explore Elder Mode')}
              </button>
              <button
                onClick={onLaunchCaregiver}
                className="dialog-btn-outline"
              >
                {t('btnPartnerCaregiver', language, 'Caregiver Portal')}
              </button>
            </div>

            {/* Bottom Molecular 3-Node Emblem */}
            <div className="dialog-node-emblem">
              <span className="dot dot-top" />
              <div className="dots-bottom">
                <span className="dot dot-left" />
                <span className="dot dot-right" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ABOUT SECTION: NORTH EASTERN REGION (NER) DEMENTIA CARE CRISIS & MANASMITRA */}
      {/* ========================================================================= */}
      <section id="about" className="ner-about-section">
        <div className="ner-about-container">
          {/* Top Regional Badge */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <span className="ner-badge-pill">
              {t('aboutBadge', language, '🌿 उत्तर-पूर्व भारत विशेष मिशन • North Eastern Region (NER) Cognitive Health Mission')}
            </span>
          </div>

          <h2 className="ner-headline">
            {t('aboutHeadline', language, 'Bridging the Dementia Care Divide in North East India')}
          </h2>
          <p className="ner-subheadline">
            {t('aboutSubheadline', language, 'Empowering 45+ Lakh Elders Across the 8 Sister States with Culturally Grounded, Mother-Tongue Digital Therapeutics & Proactive Memory Care')}
          </p>

          {/* Primary Verbatim Mission Manifest Card */}
          <div className="ner-mission-card">
            <div className="ner-quote-mark">“</div>
            <blockquote className="ner-mission-text">
              The North Eastern Region (NER) is witnessing a gradual rise in age-related cognitive disorders such as dementia and memory loss among the elderly population. Many families in remote and rural areas face challenges in accessing specialized neurological care, cognitive therapy, and long-term elderly support services due to limited healthcare infrastructure and geographical barriers. Elderly patients suffering from dementia often experience memory decline, confusion, anxiety, and social isolation, while caregivers face difficulties in continuous monitoring and engagement. There is limited availability of affordable and culturally inclusive digital therapeutic solutions tailored for elderly individuals in the North-Eastern Region.
            </blockquote>
            <div className="ner-mission-footer">
              <span className="ner-mission-tagline">
                ManasMitra AI Charter for Regional Inclusion & Non-Pharmacological Neurological Support
              </span>
              <span className="ner-states-badge">
                Assam • Meghalaya • Manipur • Mizoram • Nagaland • Tripura • Arunachal • Sikkim
              </span>
            </div>
          </div>

          {/* 3 Core Regional Challenge Pillars */}
          <div className="ner-grid-3">
            <div className="ner-challenge-card">
              <div className="ner-card-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                <MapPin size={24} />
              </div>
              <h3 className="ner-card-title">{t('challenge1Title', language, 'Geographical Barriers & Clinic Scarcity')}</h3>
              <p className="ner-card-desc">
                High mountain ranges, dense valleys, and riverine floodplains mean that reaching state tertiary medical colleges like GMCH Guwahati, NEIGRIHMS Shillong, or RIMS Imphal requires treacherous multi-day journeys for frail seniors experiencing memory loss.
              </p>
            </div>

            <div className="ner-challenge-card">
              <div className="ner-card-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                <AlertCircle size={24} />
              </div>
              <h3 className="ner-card-title">{t('challenge2Title', language, 'Caregiver Strain & Continuous Monitoring Gaps')}</h3>
              <p className="ner-card-desc">
                Family caregivers face overwhelming psychological and physical fatigue managing sundowning agitation, progressive confusion, nighttime wandering, and strict medication compliance without professional guidance or respite support.
              </p>
            </div>

            <div className="ner-challenge-card">
              <div className="ner-card-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                <Globe size={24} />
              </div>
              <h3 className="ner-card-title">{t('challenge3Title', language, 'Linguistic & Cultural Alienation in Care')}</h3>
              <p className="ner-card-desc">
                Mainstream cognitive evaluation tests and digital apps designed exclusively in English or Western metaphors cause acute anxiety in elders who think, pray, and reminisce in Assamese, Bodo, Khasi, Garo, Meitei, Mizo, Nagamese, or Kokborok.
              </p>
            </div>
          </div>

          {/* 4 ManasMitra Solution Pillars */}
          <div className="ner-solutions-wrap">
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ color: '#bef226', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                The ManasMitra Solution Architecture
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
                Inclusive, Offline-First Dementia Support Tailored for NER
              </h3>
            </div>

            <div className="ner-grid-4">
              <div className="ner-solution-box">
                <div style={{ color: '#bef226', marginBottom: '0.75rem' }}>
                  <Globe size={28} />
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                  {t('sol1Title', language, '11 Mother-Tongue Regional Voice')}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
                  High-fidelity bilingual and dialect speech synthesis & recognition supporting Assamese, Bodo, Khasi, Garo, Meitei, Mizo, Nagamese, Kokborok, Bengali, Hindi, and English.
                </p>
              </div>

              <div className="ner-solution-box">
                <div style={{ color: '#bef226', marginBottom: '0.75rem' }}>
                  <ShieldCheck size={28} />
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                  {t('sol2Title', language, 'Offline-First Valley Resilience')}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
                  Zero internet requirement for core daily cognitive games, voice check-ins, and vital monitoring. Automatic background queue synchronizes whenever connectivity returns.
                </p>
              </div>

              <div className="ner-solution-box">
                <div style={{ color: '#bef226', marginBottom: '0.75rem' }}>
                  <BellRing size={28} />
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                  {t('sol3Title', language, 'Doctor & Health Reminders')}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
                  Proactive spoken audio alerts, large visual countdowns, and automated SMS/WhatsApp alerts sent directly to family caregivers and local ASHA healthcare workers.
                </p>
              </div>

              <div className="ner-solution-box">
                <div style={{ color: '#bef226', marginBottom: '0.75rem' }}>
                  <UploadCloud size={28} />
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                  {t('sol4Title', language, 'Report Upload & AI Analyzer')}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.55, margin: 0 }}>
                  Digitizes hospital discharge papers, MMSE/MoCA cognitive scores, and MRI biomarkers into actionable caregiver steps with 1-click prescription reminder syncing.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive CTAs inside About Section */}
          <div className="ner-about-actions">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="ner-btn-primary"
              id="btn-about-upload-report"
            >
              <UploadCloud size={18} /> Upload & Analyze Patient Report
            </button>
            <button
              onClick={() => {
                setSelectedDoctorForBooking(null);
                setIsBookingModalOpen(true);
              }}
              className="ner-btn-secondary"
              id="btn-about-set-reminder"
            >
              <BellRing size={18} /> Set Doctor Reminder
            </button>
            <button
              onClick={onLaunchElderMode}
              className="ner-btn-outline"
              id="btn-about-launch-elder"
            >
              Explore Patient Portal <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION: GIANT ELECTRIC LIME FOOTER BANNER */}
      {/* ========================================================================= */}
      <footer className="vitai-footer-section">
        {/* 3 Interactive Dots at top */}
        <div className="footer-top-dots">
          <span className="footer-dot" />
          <span className="footer-dot" />
          <span className="footer-dot" />
        </div>

        <div className="footer-lime-card">
          {/* Top Early Access Row */}
          <div className="footer-early-access-row">
            <div className="early-access-label">
              Get early access to ManasMitra AI
            </div>
            <div className="early-access-form">
              <input
                type="email"
                placeholder="Email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button
                onClick={() => {
                  if (emailInput.includes('@')) setEmailJoined(true);
                }}
              >
                {emailJoined ? 'Joined ✓' : 'Join'}
              </button>
            </div>
          </div>

          {/* GIANT Typographic Wordmark: ManasMitra AI (replacing VitAI) */}
          <div className="footer-giant-wordmark" aria-label="ManasMitra AI">
            ManasMitra AI
          </div>

          {/* Bottom Navigation & Social Links */}
          <div className="footer-bottom-row">
            <div className="footer-nav-links">
              <a href="#portal" onClick={(e) => { e.preventDefault(); onLaunchElderMode(); }}>For Patients</a>
              <span>•</span>
              <a href="#healthcare" onClick={(e) => { e.preventDefault(); onLaunchHealthcare(); }}>For Clinics</a>
              <span>•</span>
              <a href="#how-it-works">How It Works</a>
              <span>•</span>
              <a href="#about">About Us</a>
              <span>•</span>
              <a href="#contact">Contact</a>
            </div>

            <div className="footer-social-links">
              <span className="social-icon">f</span>
              <span className="social-icon">𝕏</span>
              <span className="social-icon">📸</span>
              <span className="social-icon">in</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Individualized Interventions Modal */}
      <IndividualizedInterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        elderData={elderData}
        onLaunchGame={onLaunchGame}
        language={language}
      />

      {/* Clinical Consultation Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedSpecialist={selectedDoctorForBooking}
        prefilledDate={`2026-08-${String(selectedDay).padStart(2, '0')}`}
        prefilledTime={selectedTime}
        elderData={elderData}
        onBookingSuccess={() => {
          setBookingConfirmed(true);
        }}
        language={language}
      />

      {/* Full Clinical & Lab Interpretation Report Modal */}
      <ClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        elderData={elderData}
      />

      {/* ========================================================================= */}
      {/* 6. EXACT DRIBBLE VITAI STYLING & ANIMATIONS */}
      {/* ========================================================================= */}
      <style>{`
        /* Global Canvas Setup */
        .dribbble-vitai-canvas {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #f7f7f5;
          color: #0f172a;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        /* 1. HERO SECTION & ELECTRIC LIME STAGE */
        .vitai-hero-wrapper {
          background: #bef226;
          border-radius: 44px;
          margin: 12px;
          padding: 2rem 2.5rem 0;
          position: relative;
          box-shadow: 0 10px 40px rgba(190, 242, 38, 0.25);
          overflow: hidden;
        }

        /* Nav Bar */
        .vitai-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2rem;
        }
        .vitai-brand-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .vitai-logo-symbol {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 22px;
        }
        .vitai-logo-symbol .dot {
          width: 5px;
          height: 5px;
          background: #000000;
          border-radius: 50%;
          display: inline-block;
        }
        .vitai-logo-symbol .dots-bottom {
          display: flex;
          gap: 7px;
          margin-top: 3px;
        }
        .vitai-brand-name {
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #000000;
        }

        .vitai-nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        .vitai-nav-links a {
          color: #1a1a1a;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .vitai-nav-links a:hover {
          opacity: 0.7;
        }
        .vitai-nav-links a.active {
          font-weight: 800;
        }

        .vitai-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .vitai-pill-action {
          border-radius: 9999px;
          padding: 0.6rem 1.4rem;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .vitai-pill-action.solid {
          background: #000000;
          color: #ffffff;
          border: none;
        }
        .vitai-pill-action.solid:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .vitai-pill-action.outline {
          background: rgba(255, 255, 255, 0.4);
          border: 1.5px solid rgba(0, 0, 0, 0.2);
          color: #000000;
        }
        .vitai-pill-action.outline:hover {
          background: rgba(255, 255, 255, 0.8);
        }

        /* Hero Typography */
        .vitai-hero-body {
          text-align: center;
          padding-top: 1.5rem;
        }
        .vitai-hero-headline {
          font-size: 4.6rem;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.035em;
          color: #000000;
          margin: 0 0 2rem;
        }
        .vitai-hero-serif {
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-weight: 400;
        }

        .vitai-hero-cta-wrap {
          margin-bottom: 3.5rem;
        }
        .vitai-cta-black-pill {
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.85rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .vitai-cta-black-pill:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        /* Central Smartphone Mockup & Floating Glass Cards */
        .vitai-hero-mockup-stage {
          position: relative;
          max-width: 440px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }

        .vitai-iphone-bezel {
          background: #000000;
          border-radius: 54px 54px 0 0;
          border: 10px solid #1a1a1a;
          border-bottom: none;
          width: 360px;
          height: 380px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          z-index: 10;
        }
        .vitai-iphone-island {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 24px;
          background: #000000;
          border-radius: 20px;
          z-index: 20;
        }
        .vitai-iphone-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 22px 6px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #000000;
          background: #ffffff;
        }

        .vitai-phone-inner {
          background: #ffffff;
          height: 100%;
          padding: 0.85rem 1.25rem;
          text-align: left;
        }
        .phone-user-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .phone-avatar-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .phone-avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .phone-greeting-sub {
          font-size: 0.72rem;
          color: #64748b;
        }
        .phone-user-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f172a;
        }
        .phone-share-icon {
          color: #64748b;
          cursor: pointer;
        }

        .phone-report-header {
          margin-bottom: 1.25rem;
        }
        .phone-report-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }
        .phone-report-date {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .phone-biomarker-card {
          background: #000000;
          border-radius: 20px;
          padding: 1.1rem;
          color: #ffffff;
        }
        .phone-biomarker-title {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 700;
          margin-bottom: 0.85rem;
        }
        .biomarker-meter-row {
          margin-bottom: 0.75rem;
        }
        .biomarker-meter-bar {
          background: rgba(255, 255, 255, 0.15);
          height: 6px;
          border-radius: 9999px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }
        .meter-fill {
          height: 100%;
          background: #bef226;
          border-radius: 9999px;
        }
        .biomarker-meter-val {
          font-size: 0.75rem;
          color: #cbd5e1;
          text-align: right;
        }
        .biomarker-meter-val strong {
          color: #ffffff;
        }

        /* Left & Right Floating Glass Cards */
        .vitai-floating-pill {
          position: absolute;
          background: #ffffff;
          border-radius: 20px;
          padding: 1rem 1.25rem;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
          text-align: left;
          z-index: 15;
          animation: floatSway 6s infinite alternate ease-in-out;
        }
        .float-left-card {
          width: 250px;
          top: 15%;
          left: -190px;
        }
        .float-right-card {
          width: 270px;
          top: 30%;
          right: -210px;
          animation-delay: -3s;
        }

        .float-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }
        .float-card-sub {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0 0 0.75rem;
        }
        .float-card-badge {
          background: #dcfce7;
          color: #166534;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .goal-checklist {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .goal-check-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: #f8fafc;
          border-radius: 8px;
          padding: 0.35rem 0.55rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0f172a;
        }
        .goal-check-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }
        .goal-check-circle.checked {
          background: #bef226;
          color: #000000;
          font-weight: 900;
        }
        .goal-check-circle.toggle {
          background: #e2e8f0;
          color: #64748b;
        }

        @keyframes floatSway {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }

        /* 2. COMPARE SECTION */
        .vitai-compare-section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        .reg-mark {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #000000;
          top: 3rem;
        }
        .mark-left { left: 1rem; }
        .mark-right { right: 1rem; }

        .compare-header-wrap {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3.5rem;
        }
        .compare-subheading {
          font-size: 1.4rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 0.5rem;
        }
        .compare-headline {
          font-size: 3.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #000000;
          margin: 0 0 2rem;
        }

        .see-difference-node-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .see-difference-pill {
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.65rem 1.6rem;
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
        }
        .difference-stem {
          width: 1.5px;
          height: 48px;
          background: #cbd5e1;
          margin: 4px 0;
        }
        .difference-node-symbol {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 24px;
        }
        .difference-node-symbol .dot {
          width: 5px;
          height: 5px;
          background: #000000;
          border-radius: 50%;
        }
        .difference-node-symbol .dots-bottom {
          display: flex;
          gap: 8px;
          margin-top: 3px;
        }

        .compare-cards-grid {
          display: grid;
          grid-templateColumns: 1fr 1.15fr;
          gap: 2.5rem;
          align-items: center;
        }

        /* Traditional Report Card */
        .card-traditional-report {
          background: #f4f4f0;
          border-radius: 28px;
          padding: 2.5rem 2rem;
          border: 1px solid #e5e5e0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .trad-card-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }
        .trad-report-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }
        .trad-report-table th {
          text-align: left;
          color: #94a3b8;
          font-weight: 600;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        .trad-report-table td {
          padding: 0.85rem 0;
          border-bottom: 1px solid #e2e8f0;
          color: #475569;
        }
        .trad-report-table .test-name {
          font-weight: 800;
          color: #0f172a;
        }
        .trad-report-table .test-full {
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .flag-l {
          color: #ef4444;
          font-weight: 800;
          background: #fee2e2;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* VitAI Interpretation Card */
        .card-vitai-interpretation {
          background: #0c100e;
          color: #ffffff;
          border-radius: 28px;
          padding: 2.5rem 2.25rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        }
        .vitai-interp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        .vitai-interp-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #cbd5e1;
        }
        .mini-brand-symbol .dot {
          width: 4px;
          height: 4px;
          background: #bef226;
          border-radius: 50%;
          display: inline-block;
        }
        .mini-brand-symbol .dots-bottom {
          display: flex;
          gap: 6px;
          margin-top: 2px;
        }
        .vitai-interp-status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .status-label {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .status-pill-green {
          background: #bef226;
          color: #000000;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
        }

        .vitai-interp-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 0.85rem;
          color: #ffffff;
        }
        .vitai-interp-desc {
          color: #94a3b8;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .vitai-meter-group {
          margin-bottom: 1.4rem;
        }
        .meter-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          font-weight: 700;
          margin-bottom: 0.45rem;
        }
        .meter-badge-val {
          color: #cbd5e1;
          font-size: 0.8rem;
        }
        .vitai-meter-track {
          background: rgba(255, 255, 255, 0.12);
          height: 7px;
          border-radius: 9999px;
          overflow: hidden;
        }
        .vitai-meter-fill {
          background: #bef226;
          height: 100%;
          border-radius: 9999px;
        }

        /* 3. A SEAMLESS JOURNEY */
        .vitai-journey-section {
          padding: 6rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }
        .journey-header-wrap {
          text-align: center;
          margin-bottom: 4rem;
        }
        .journey-subheading {
          font-size: 1.35rem;
          font-weight: 600;
          color: #000000;
          margin-bottom: 0.5rem;
        }
        .journey-headline {
          font-size: 3.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #000000;
          margin: 0;
        }

        .journey-columns-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          align-items: stretch;
        }
        .journey-card {
          border-radius: 28px;
          padding: 2.25rem 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        /* Fluid Booking Card */
        .fluid-booking-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }
        .booking-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
        }
        .calendar-month-selector {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          font-size: 0.95rem;
          margin-bottom: 1.25rem;
        }
        .month-arrows button {
          background: transparent;
          border: none;
          font-weight: 800;
          cursor: pointer;
          font-size: 0.95rem;
          padding: 0 4px;
        }
        .calendar-days-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 0.6rem;
        }
        .calendar-days-grid {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1.5rem;
        }
        .calendar-week-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
        }
        .cal-day-cell {
          background: transparent;
          border: none;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          cursor: pointer;
          border-radius: 50%;
        }
        .cal-day-cell.selected {
          background: #bef226;
          color: #000000;
          font-weight: 900;
        }
        .cal-day-cell.faded {
          color: #cbd5e1;
        }

        .time-select-pill {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 9999px;
          padding: 0.65rem 1.2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 800;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }
        .btn-confirm-appointment {
          width: 100%;
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.85rem;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        /* Specialist Booking Roster Card (Replaces pre-recorded video call) */
        .specialist-booking-roster-card {
          background: #0f172a;
          color: #ffffff;
          border-radius: 28px;
          padding: 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
        }
        .specialist-card-top {
          margin-bottom: 1.25rem;
        }
        .specialist-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(22, 163, 74, 0.18);
          color: #4ade80;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 9999px;
          margin-bottom: 0.5rem;
        }
        .specialist-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.25rem;
          letter-spacing: -0.01em;
        }
        .specialist-sub {
          font-size: 0.82rem;
          color: #94a3b8;
          margin: 0;
        }
        .specialist-roster-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin: 0.5rem 0 1.25rem;
        }
        .specialist-item {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 0.75rem 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform 0.2s, background 0.2s;
        }
        .specialist-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .specialist-thumb {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #bef226;
          flex-shrink: 0;
        }
        .specialist-info {
          flex: 1;
          min-width: 0;
        }
        .specialist-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .specialist-role {
          font-size: 0.74rem;
          color: #cbd5e1;
          margin-top: 2px;
        }
        .specialist-slot {
          font-size: 0.72rem;
          color: #bef226;
          font-weight: 700;
          margin-top: 3px;
        }
        .btn-book-slot {
          background: #bef226;
          color: #000000;
          border: none;
          border-radius: 10px;
          padding: 0.5rem 0.85rem;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s;
        }
        .btn-book-slot:hover {
          transform: scale(1.04);
        }
        .specialist-footer-note {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 600;
          background: rgba(0, 0, 0, 0.25);
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
        }

        /* Medical Conclusion Card */
        .medical-conclusion-card {
          background: #bef226;
          color: #000000;
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
        }
        .conclusion-banner {
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }
        .doctor-profile-row {
          background: rgba(255, 255, 255, 0.75);
          border-radius: 18px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .doctor-avatar-thumb {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .doctor-profile-name {
          font-weight: 800;
          font-size: 0.95rem;
        }
        .doctor-assessment-badge {
          font-size: 0.75rem;
          color: #166534;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .conclusion-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 2rem;
        }
        .conclusion-item-row {
          background: rgba(255, 255, 255, 0.75);
          border-radius: 16px;
          padding: 0.85rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .item-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .item-icon-circle.green { background: #dcfce7; color: #16a34a; }
        .item-icon-circle.blue { background: #e0f2fe; color: #0284c7; }
        .item-icon-circle.lime { background: #000000; color: #bef226; }

        .item-header {
          font-weight: 800;
          font-size: 0.88rem;
          color: #0f172a;
        }
        .item-desc {
          font-size: 0.78rem;
          color: #475569;
        }

        .btn-view-full-report {
          background: #ffffff;
          color: #000000;
          border: none;
          border-radius: 9999px;
          padding: 0.85rem;
          font-weight: 800;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-view-full-report:hover {
          background: #000000;
          color: #ffffff;
        }

        /* 4. DOCTOR PHOTO BANNER SECTION */
        .vitai-photo-banner-section {
          padding: 3rem 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .photo-banner-container {
          position: relative;
          border-radius: 40px;
          overflow: hidden;
          height: 480px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .photo-banner-bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.92);
        }
        .floating-lime-dialog {
          position: absolute;
          background: #bef226;
          border-radius: 36px;
          padding: 2.5rem 3rem;
          text-align: center;
          max-width: 480px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }
        .dialog-title {
          font-size: 2.1rem;
          font-weight: 800;
          line-height: 1.18;
          color: #000000;
          margin: 0 0 1.75rem;
        }
        .dialog-btn-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .dialog-btn-solid {
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.75rem 1.6rem;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
        }
        .dialog-btn-outline {
          background: transparent;
          color: #000000;
          border: 1.5px solid rgba(0, 0, 0, 0.3);
          border-radius: 9999px;
          padding: 0.75rem 1.6rem;
          font-size: 0.92rem;
          font-weight: 800;
          cursor: pointer;
        }
        .dialog-node-emblem {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 auto;
          width: 24px;
        }
        .dialog-node-emblem .dot {
          width: 6px;
          height: 6px;
          background: #000000;
          border-radius: 50%;
        }
        .dialog-node-emblem .dots-bottom {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        /* 5. GIANT ELECTRIC LIME FOOTER */
        .vitai-footer-section {
          padding: 3rem 12px 12px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .footer-top-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 1.5rem;
        }
        .footer-dot {
          width: 7px;
          height: 7px;
          background: #000000;
          border-radius: 50%;
        }
        .footer-lime-card {
          background: #bef226;
          border-radius: 44px;
          padding: 3.5rem 3rem 2rem;
          box-shadow: 0 15px 40px rgba(190, 242, 38, 0.25);
        }
        .footer-early-access-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }
        .early-access-label {
          font-size: 1.45rem;
          font-weight: 800;
          color: #000000;
        }
        .early-access-form {
          background: #ffffff;
          border-radius: 9999px;
          padding: 4px 6px 4px 18px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          max-width: 380px;
        }
        .early-access-form input {
          border: none;
          outline: none;
          font-size: 0.95rem;
          flex: 1;
          color: #000000;
          background: transparent;
        }
        .early-access-form button {
          background: #000000;
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 0.65rem 1.4rem;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
        }

        /* GIANT WORDMARK */
        .footer-giant-wordmark {
          font-size: clamp(3.8rem, 11vw, 12rem);
          font-weight: 900;
          color: #000000;
          letter-spacing: -0.04em;
          line-height: 0.9;
          margin-bottom: 3rem;
          text-align: left;
          user-select: none;
        }

        .footer-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          border-top: 1.5px solid rgba(0, 0, 0, 0.1);
          padding-top: 2rem;
        }
        .footer-nav-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: #000000;
          flex-wrap: wrap;
        }
        .footer-nav-links a {
          color: #000000;
          text-decoration: none;
        }
        .footer-social-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .social-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
        }

        /* ========================================================================= */
        /* 7. NORTH EASTERN REGION (NER) ABOUT SECTION STYLING */
        /* ========================================================================= */
        .ner-about-section {
          background: linear-gradient(180deg, #051a15 0%, #092a22 45%, #051612 100%);
          border-radius: 40px;
          margin: 16px 12px;
          padding: 4.5rem 2.5rem;
          color: #ffffff;
          box-shadow: 0 20px 60px rgba(5, 26, 21, 0.45);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(190, 242, 38, 0.2);
        }

        .ner-about-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .ner-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(190, 242, 38, 0.12);
          border: 1.5px solid rgba(190, 242, 38, 0.4);
          color: #bef226;
          border-radius: 9999px;
          padding: 0.45rem 1.25rem;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .ner-headline {
          font-size: 2.75rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          text-align: center;
          margin: 1.25rem auto 0.75rem;
          max-width: 950px;
          line-height: 1.2;
          color: #ffffff;
        }

        .ner-subheadline {
          font-size: 1.15rem;
          color: #94a3b8;
          text-align: center;
          max-width: 820px;
          margin: 0 auto 2.75rem;
          line-height: 1.6;
        }

        .ner-mission-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
          border: 1.5px solid rgba(190, 242, 38, 0.35);
          border-radius: 28px;
          padding: 2.75rem 3rem 2rem;
          backdrop-filter: blur(16px);
          position: relative;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);
          margin-bottom: 3.5rem;
        }

        .ner-quote-mark {
          position: absolute;
          top: -15px;
          left: 28px;
          font-size: 5rem;
          line-height: 1;
          color: #bef226;
          font-family: Georgia, serif;
          opacity: 0.45;
          pointer-events: none;
        }

        .ner-mission-text {
          font-size: 1.28rem;
          line-height: 1.85;
          color: #f1f5f9;
          font-weight: 500;
          margin: 0 0 2rem 0;
          font-style: italic;
          letter-spacing: -0.01em;
        }

        .ner-mission-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.35rem;
        }

        .ner-mission-tagline {
          font-weight: 800;
          color: #bef226;
          font-size: 0.95rem;
        }

        .ner-states-badge {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.4rem 1rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          color: #e2e8f0;
          font-weight: 600;
        }

        .ner-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
          margin-bottom: 3.5rem;
        }

        .ner-challenge-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 22px;
          padding: 2rem 2.2rem;
          transition: all 0.25s ease;
        }

        .ner-challenge-card:hover {
          transform: translateY(-4px);
          border-color: rgba(190, 242, 38, 0.5);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
          background: rgba(255, 255, 255, 0.06);
        }

        .ner-card-icon-wrap {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .ner-card-title {
          font-size: 1.22rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
        }

        .ner-card-desc {
          font-size: 0.94rem;
          line-height: 1.65;
          color: #94a3b8;
          margin: 0;
        }

        .ner-solutions-wrap {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 26px;
          padding: 2.75rem;
          margin-bottom: 3rem;
        }

        .ner-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .ner-solution-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          padding: 1.6rem;
          transition: all 0.2s ease;
        }

        .ner-solution-box:hover {
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(190, 242, 38, 0.4);
        }

        .ner-about-actions {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .ner-btn-primary {
          background: #bef226;
          color: #051a15;
          border: none;
          border-radius: 14px;
          padding: 0.9rem 1.6rem;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          box-shadow: 0 6px 20px rgba(190, 242, 38, 0.35);
          transition: all 0.2s ease;
        }

        .ner-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(190, 242, 38, 0.5);
        }

        .ner-btn-secondary {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 0.9rem 1.6rem;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          transition: all 0.2s ease;
        }

        .ner-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.18);
          border-color: #bef226;
        }

        .ner-btn-outline {
          background: transparent;
          color: #bef226;
          border: 1.5px solid rgba(190, 242, 38, 0.4);
          border-radius: 14px;
          padding: 0.9rem 1.6rem;
          font-weight: 800;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          transition: all 0.2s ease;
        }

        .ner-btn-outline:hover {
          background: rgba(190, 242, 38, 0.1);
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .vitai-hero-headline {
            font-size: 3.2rem;
          }
          .compare-cards-grid {
            grid-template-columns: 1fr;
          }
          .float-left-card, .float-right-card {
            display: none;
          }
          .footer-giant-wordmark {
            font-size: 4rem;
          }
        }
      `}</style>
    </div>
  );
}
