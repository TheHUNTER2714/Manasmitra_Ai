import React from 'react';
import { Brain, Target, Shapes, Clock, Volume2, BookOpen, PlayCircle, Sparkles } from 'lucide-react';

export default function ElderGamesMenu({ onSelectGame, language = 'hi', culturalPackName = 'Assam' }) {
  const gamesList = [
    {
      id: 'memory',
      categoryHi: 'स्मृति सुधार (Memory)',
      categoryEn: 'Working Memory',
      titleHi: 'याद रखें और पहचानें (Remember the Objects)',
      titleEn: 'Remember the Cultural Objects',
      descHi: `पारंपरिक वस्तुओं (जैसे जापी, चाय, बिहू ढोल) को देखें और छिपाने के बाद पहचानें।`,
      descEn: `View familiar regional objects and recall them after they are concealed.`,
      icon: <Brain size={32} />,
      color: '#15803d',
      bg: '#dcfce7',
      levelBadge: 'Adaptive AI • स्तर 1-3'
    },
    {
      id: 'attention',
      categoryHi: 'एकाग्रता व ध्यान (Attention)',
      categoryEn: 'Visual Search & Concentration',
      titleHi: 'निशान खोजें (Find the Target)',
      titleEn: 'Spot the Target Item',
      descHi: 'कई वस्तुओं के बीच में से सही वस्तु (जैसे चाय की पत्ती) को तेज़ी से ढूंढें।',
      descEn: 'Scan and tap the target objects among surrounding distractors.',
      icon: <Target size={32} />,
      color: '#0284c7',
      bg: '#e0f2fe',
      levelBadge: 'Reaction Latency Tracker'
    },
    {
      id: 'pattern',
      categoryHi: 'पैटर्न पहचान (Pattern Reasoning)',
      categoryEn: 'Pattern Completion',
      titleHi: 'श्रृंखला पूरी करें (Complete the Pattern)',
      titleEn: 'Color & Motif Sequence',
      descHi: 'रंगों और आकारों की श्रृंखला को समझकर अगला सही चिन्ह चुनें।',
      descEn: 'Identify visual rhythm and complete the missing sequence element.',
      icon: <Shapes size={32} />,
      color: '#b45309',
      bg: '#fef3c7',
      levelBadge: 'Logical Reasoning'
    },
    {
      id: 'routine',
      categoryHi: 'दिनचर्या स्मरण (Daily Routine)',
      categoryEn: 'Temporal Routine Recall',
      titleHi: 'क्रमबद्ध दिनचर्या (Daily Life Chronology)',
      titleEn: 'Daily Living Sequence',
      descHi: 'नाश्ते, सैर और दवाइयों के सही समय और क्रम को याद करें।',
      descEn: 'Reinforce daily functional steps: morning walk, tea, breakfast, medications.',
      icon: <Clock size={32} />,
      color: '#7c3aed',
      bg: '#f3e8ff',
      levelBadge: 'Functional Living'
    },
    {
      id: 'sound',
      categoryHi: 'वस्तु व ध्वनि (Sound Recognition)',
      categoryEn: 'Audio-Visual Identification',
      titleHi: 'आवाज़ पहचानें (Identify the Sound)',
      titleEn: 'Sound & Object Matching',
      descHi: 'केतली, मंदिर की घंटी या बारिश की आवाज़ सुनकर सही वस्तु पहचानें।',
      descEn: 'Listen to comforting auditory cues and match to the correct sound source.',
      icon: <Volume2 size={32} />,
      color: '#c2410c',
      bg: '#ffedd5',
      levelBadge: 'Auditory Association'
    },
    {
      id: 'story',
      categoryHi: 'कहानी स्मरण (Auditory Memory)',
      categoryEn: 'Narrative Story Memory',
      titleHi: 'लोककथा स्मरण (Regional Story Recall)',
      titleEn: 'Narrative Auditory Memory',
      descHi: 'एक छोटी, सुंदर स्थानीय कहानी सुनें और अंत में आसान प्रश्नों के उत्तर दें।',
      descEn: 'Listen to a short narrated cultural story and answer gentle recall questions.',
      icon: <BookOpen size={32} />,
      color: '#0f766e',
      bg: '#ccfbf1',
      levelBadge: 'Contextual Retention'
    },
    {
      id: 'crossword',
      categoryHi: 'भाषा व शब्द स्मृति (Semantic Memory)',
      categoryEn: 'Crossword Cognitive Therapy',
      titleHi: 'शब्द पहेली (AI Crossword Memory Game)',
      titleEn: 'AI Crossword Memory Game',
      descHi: 'अनुसंधान आधारित (Khairunisa et al., 2024): 4 स्तरों में AI संकेतों के साथ स्वास्थ्य व सांस्कृतिक शब्द पहेली।',
      descEn: 'Research-backed (Khairunisa et al., 2024; Pillai et al., 2011): 4-level crossword puzzle with multi-tier AI hints to slow dementia progression.',
      icon: <Sparkles size={32} />,
      color: '#b45309',
      bg: '#fef3c7',
      levelBadge: 'Pillai et al. 2011 • AI Hints (Level 1-4)'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        boxShadow: '0 10px 30px rgba(27, 67, 50, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={16} /> 7 संज्ञानात्मक मॉड्यूल (7 Cognitive Domains with Crossword)
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.4rem' }}>
            {language === 'hi' ? 'संज्ञानात्मक खेल और मस्तिष्क अभ्यास' : 'Cognitive Games & Memory Modules'}
          </h2>
          <p style={{ color: '#d8f3dc', fontSize: '1.15rem' }}>
            {language === 'hi'
              ? `सांस्कृतिक रूप से परिचित सामग्री (${culturalPackName}) • तनावमुक्त और आनंदमय अनुभव`
              : `Culturally familiar (${culturalPackName}) • Stress-free, adaptive neuro-engagement`}
          </p>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '1rem 1.5rem',
          borderRadius: '18px',
          backdropFilter: 'blur(8px)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.9 }}>
            AI Difficulty Engine
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Dynamic Adaptation
          </div>
        </div>
      </div>

      {/* 6 Games Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {gamesList.map((g) => (
          <div
            key={g.id}
            className="card"
            style={{
              borderRadius: '24px',
              border: '2px solid #e2e8f0',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
            onClick={() => onSelectGame(g.id)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: g.bg,
                  color: g.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {g.icon}
                </div>
                <span style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {g.levelBadge}
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: g.color, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                {language === 'hi' ? g.categoryHi : g.categoryEn}
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                {language === 'hi' ? g.titleHi : g.titleEn}
              </h3>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.5 }}>
                {language === 'hi' ? g.descHi : g.descEn}
              </p>
            </div>

            <button
              style={{
                background: g.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '0.85rem 1.4rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                marginTop: 'auto',
                boxShadow: `0 4px 12px ${g.color}33`
              }}
            >
              <PlayCircle size={22} />
              {language === 'hi' ? 'खेलें (Play Now)' : 'Start Activity'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
