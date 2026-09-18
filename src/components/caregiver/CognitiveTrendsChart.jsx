import React from 'react';

export default function CognitiveTrendsChart({ weeklyData, baseline }) {
  // SVG Chart Dimensions
  const width = 600;
  const height = 220;
  const padding = 35;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points for Memory and Attention lines
  const daysCount = weeklyData.length;
  const xStep = chartWidth / (daysCount - 1);

  // Normalize scores (range 40 to 100)
  const minY = 40;
  const maxY = 100;

  const getY = (val) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return height - padding - ((clamped - minY) / (maxY - minY)) * chartHeight;
  };

  const memoryPoints = weeklyData.map((d, i) => `${padding + i * xStep},${getY(d.memory)}`).join(' ');
  const attentionPoints = weeklyData.map((d, i) => `${padding + i * xStep},${getY(d.attention)}`).join(' ');

  const cognitiveDomains = [
    { name: 'कार्यशील स्मृति (Working Memory)', value: baseline.memoryScore || 82, color: '#16a34a' },
    { name: 'एकाग्रता व ध्यान (Visual Attention)', value: baseline.attentionScore || 68, color: '#0284c7' },
    { name: 'पैटर्न व तर्क (Pattern Reasoning)', value: baseline.patternScore || 80, color: '#b45309' },
    { name: 'दिनचर्या स्मरण (Routine Recall)', value: baseline.recallScore || 72, color: '#7c3aed' },
    { name: 'श्रवण स्मृति (Auditory Memory)', value: baseline.auditoryScore || 75, color: '#0f766e' }
  ];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">
            7-दिवसीय संज्ञानात्मक गतिविधि रुझान (Cognitive Trends)
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
            सक्रिय भागीदारी और प्रतिक्रिया गति का निरंतर विश्लेषण
          </p>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#16a34a' }}></span>
            <span>स्मृति (Memory %)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#0284c7' }}></span>
            <span>एकाग्रता (Attention %)</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Line Chart */}
      <div className="svg-chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          {/* Horizontal grid guide lines */}
          {[50, 75, 100].map((val) => (
            <g key={val}>
              <line
                x1={padding}
                y1={getY(val)}
                x2={width - padding}
                y2={getY(val)}
                className="chart-axis-line"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={getY(val) + 4}
                fill="#94a3b8"
                fontSize="11"
                textAnchor="end"
                fontWeight="600"
              >
                {val}%
              </text>
            </g>
          ))}

          {/* Lines */}
          <polyline points={memoryPoints} className="chart-line-memory" />
          <polyline points={attentionPoints} className="chart-line-attention" />

          {/* Dots and Day Labels */}
          {weeklyData.map((d, i) => {
            const x = padding + i * xStep;
            const yMem = getY(d.memory);
            const yAtt = getY(d.attention);
            return (
              <g key={i}>
                {/* Memory circle */}
                <circle cx={x} cy={yMem} r="5" stroke="#16a34a" className="chart-dot" />
                {/* Attention circle */}
                <circle cx={x} cy={yAtt} r="5" stroke="#0284c7" className="chart-dot" />
                {/* X Axis Day Label */}
                <text
                  x={x}
                  y={height - 8}
                  fill="#475569"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.day.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 5 Cognitive Domain Progress Bars */}
      <div className="skills-bars-card">
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          व्यक्तिगत संज्ञानात्मक प्रोफ़ाइल (Domain Profile)
        </div>

        {cognitiveDomains.map((domain, i) => (
          <div key={i} className="skill-bar-row">
            <div className="skill-bar-label-group">
              <span>{domain.name}</span>
              <span style={{ color: domain.color }}>{domain.value}%</span>
            </div>
            <div className="skill-bar-track">
              <div
                className="skill-bar-fill"
                style={{ width: `${domain.value}%`, background: domain.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
