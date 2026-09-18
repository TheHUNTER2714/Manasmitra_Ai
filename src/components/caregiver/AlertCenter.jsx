import React from 'react';
import { AlertTriangle, CheckCircle, Bell, Clock, Info } from 'lucide-react';

export default function AlertCenter({ alerts = [] }) {
  const getAlertStyle = (level) => {
    switch (level) {
      case 'high':
        return {
          className: 'alert-item-card high',
          icon: <AlertTriangle size={24} color="#dc2626" />
        };
      case 'medium':
        return {
          className: 'alert-item-card medium',
          icon: <Clock size={24} color="#b45309" />
        };
      case 'normal':
      default:
        return {
          className: 'alert-item-card normal',
          icon: <CheckCircle size={24} color="#15803d" />
        };
    }
  };

  return (
    <div className="card" style={{ border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '1.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bell size={22} color="#1b4332" />
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b' }}>
            इंटेलिजेंट अलर्ट और सूचनाएं (Alerts Center)
          </h3>
        </div>
        <span style={{
          background: '#fef3c7',
          color: '#b45309',
          padding: '3px 10px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {alerts.length} एक्टिव
        </span>
      </div>

      <div className="alerts-list">
        {alerts.map((al) => {
          const styleConfig = getAlertStyle(al.level);
          return (
            <div key={al.id} className={styleConfig.className}>
              <div className="alert-icon-wrap">
                {styleConfig.icon}
              </div>
              <div>
                <div className="alert-title">{al.title}</div>
                <div className="alert-body">{al.description}</div>
                <div className="alert-time">🕒 {al.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsible AI Disclaimer */}
      <div style={{
        marginTop: '1.5rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem',
        fontSize: '0.8rem',
        color: '#64748b'
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>नैतिक AI दिशानिर्देश:</strong> अलर्ट केवल दैनिक गतिविधियों व प्रतिक्रिया समय के प्रेक्षण पर आधारित हैं। यह प्रणाली किसी भी प्रकार का चिकित्सीय निदान (Clinical Diagnosis) नहीं करती।
        </span>
      </div>
    </div>
  );
}
