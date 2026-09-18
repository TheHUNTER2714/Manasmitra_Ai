import React from 'react';
import { Type, Eye, MapPin, Globe } from 'lucide-react';
import { CULTURAL_PACKS } from '../../data/culturalPacks';
import { SUPPORTED_LANGUAGES, t } from '../../data/translations';

export default function AccessibilityBar({
  isFontXl,
  setIsFontXl,
  isHighContrast,
  setIsHighContrast,
  activeCulturalPack,
  setActiveCulturalPack,
  language = 'hi',
  setLanguage
}) {
  return (
    <div className="accessibility-bar">
      <div className="accessibility-bar-inner">
        {/* Language Selector */}
        {setLanguage && (
          <div className="accessibility-group">
            <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b' }}>
              <Globe size={15} color="#15803d" /> {t('accLanguageLabel', language, 'Language:')}
            </span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                border: '1.5px solid #86efac',
                background: '#f0fdf4',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#14532d',
                cursor: 'pointer'
              }}
              title="Select Language / भाषा चुनें"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.label} • {lang.region}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Cultural Region Selector */}
        <div className="accessibility-group">
          <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#1e293b' }}>
            <MapPin size={15} color="#b45309" /> {t('accRegionLabel', language, 'Cultural Region (NER):')}
          </span>
          <select
            value={activeCulturalPack}
            onChange={(e) => setActiveCulturalPack(e.target.value)}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0f172a',
              cursor: 'pointer'
            }}
          >
            {Object.entries(CULTURAL_PACKS).map(([key, pack]) => (
              <option key={key} value={key}>
                {pack.badge} - {pack.name}
              </option>
            ))}
          </select>
        </div>

        {/* Vision & Contrast Accessibility Options */}
        <div className="accessibility-group">
          <span style={{ fontWeight: 700, color: '#475569', fontSize: '0.82rem' }}>
            {t('accAccessibilityLabel', language, 'Accessibility:')}
          </span>

          {/* Large font toggle */}
          <button
            onClick={() => setIsFontXl(!isFontXl)}
            className={`acc-pill-btn ${isFontXl ? 'active' : ''}`}
            title="Increase text size for easier reading"
          >
            <Type size={14} /> {isFontXl ? t('accFontLargeOn', language, 'Large Font: ON') : t('accFontLargeOff', language, 'Large Font')}
          </button>

          {/* High contrast toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`acc-pill-btn ${isHighContrast ? 'active' : ''}`}
            title="High contrast for vision clarity"
          >
            <Eye size={14} /> {isHighContrast ? t('accContrastOn', language, 'High Contrast: ON') : t('accContrastOff', language, 'High Contrast')}
          </button>
        </div>
      </div>
    </div>
  );
}
