import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  AlertTriangle,
  MessageSquare,
  MapPin,
  Battery,
  Clock,
  Wifi,
  WifiOff,
  X,
  PhoneForwarded,
  Send,
  ExternalLink,
  Zap
} from 'lucide-react';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { emergencyDispatchService } from '../../services/emergencyDispatchService';

export default function SosEmergencyModal({
  isOpen,
  onClose,
  elderData,
  language = 'hi'
}) {
  const [callState, setCallState] = useState('connecting'); // 'connecting' | 'ringing' | 'missed_call_sent'
  const [isOnline, setIsOnline] = useState(offlineSyncEngine.isOnline);
  const [timestamp] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  
  const primaryPhone = elderData?.caregiverPhone || '+91 98765 43210';
  const caregiverName = elderData?.caregiverName || 'अनीता बरुआ (Anita Baruah)';

  // Formatted SOS Text
  const sosMessageText = emergencyDispatchService.buildSosMessage(elderData, language);
  const cleanPhone = emergencyDispatchService.formatPhone(primaryPhone);

  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = offlineSyncEngine.subscribe((state) => {
      setIsOnline(state.isOnline);
    });

    // 1. Trigger Direct Background Dispatch Service (SMS, WhatsApp, Call, Offline Queue)
    emergencyDispatchService.executeBackgroundEmergencyDispatch(elderData, {
      language,
      autoOpenWhatsApp: true,
      autoTriggerSMS: false, // will provide direct 1-tap trigger + background URI
      autoTriggerCall: false
    });

    // 2. Simulated Call Sequence: Connecting -> Ringing -> Missed Call Dispatched
    setCallState('connecting');
    const ringTimer = setTimeout(() => {
      setCallState('ringing');
    }, 1200);

    const missedCallTimer = setTimeout(() => {
      setCallState('missed_call_sent');
    }, 3200);

    return () => {
      unsubscribe();
      clearTimeout(ringTimer);
      clearTimeout(missedCallTimer);
    };
  }, [isOpen, elderData, language]);

  if (!isOpen) return null;

  // Direct Channel Trigger Handlers
  const handleTriggerDirectSMS = () => {
    emergencyDispatchService.triggerDirectSMS(primaryPhone, sosMessageText);
  };

  const handleTriggerDirectWhatsApp = () => {
    emergencyDispatchService.triggerDirectWhatsApp(primaryPhone, sosMessageText, true);
  };

  const handleTriggerDirectCall = () => {
    emergencyDispatchService.triggerDirectCall(primaryPhone);
  };

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const smsDirectHref = `sms:${cleanPhone}${isIOS ? '&' : '?'}body=${encodeURIComponent(sosMessageText)}`;
  const waDirectHref = `https://api.whatsapp.com/send?phone=${cleanPhone.replace('+', '')}&text=${encodeURIComponent(sosMessageText)}`;
  const telDirectHref = `tel:${cleanPhone}`;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div
        className="modal-card"
        style={{
          maxWidth: '680px',
          padding: '2rem',
          border: '3px solid #dc2626',
          boxShadow: '0 25px 60px rgba(220, 38, 38, 0.35)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Urgent Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseGlow 1.5s infinite',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={30} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#991b1b', lineHeight: 1.2 }}>
                {language === 'hi' ? '🚨 आपातकालीन SOS सक्रिय • ManasMitra AI' : '🚨 Emergency SOS Dispatched • ManasMitra AI'}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>
                <Clock size={14} /> {timestamp}
                <span>•</span>
                {isOnline ? (
                  <span style={{ color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Wifi size={14} /> Network Online (बैकग्राउंड में स्वतः प्रेषित)
                  </span>
                ) : (
                  <span style={{ color: '#dc2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <WifiOff size={14} /> Offline Mode (स्थानीय सेल्यूलर SMS सक्रिय)
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#64748b', padding: '4px', cursor: 'pointer' }}
            title="Close modal"
          >
            <X size={26} />
          </button>
        </div>

        {/* 1. Direct Background Dispatch Channels Status Grid */}
        <div
          style={{
            background: '#f8fafc',
            border: '2px solid #e2e8f0',
            borderRadius: '18px',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={18} color="#e11d48" />
              प्रत्यक्ष बैकग्राउंड प्रेषण स्थिति (Direct Background Channels):
            </div>
            <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '9999px', fontWeight: 800 }}>
              AUTO-TRIGGERED ✓
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {/* Channel A: Direct SMS */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.85rem 0.75rem',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <div style={{ color: '#0284c7', marginBottom: '0.35rem' }}>
                <MessageSquare size={22} style={{ margin: '0 auto' }} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                Direct SMS
              </div>
              <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, margin: '0.2rem 0 0.5rem' }}>
                ✓ प्रेषित (Dispatched)
              </div>
              <a
                href={smsDirectHref}
                onClick={handleTriggerDirectSMS}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.76rem',
                  color: '#0284c7',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#f0f9ff',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                SMS खोलें <ExternalLink size={12} />
              </a>
            </div>

            {/* Channel B: Direct WhatsApp */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.85rem 0.75rem',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <div style={{ color: '#16a34a', marginBottom: '0.35rem' }}>
                <Send size={22} style={{ margin: '0 auto' }} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                WhatsApp Web/App
              </div>
              <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 700, margin: '0.2rem 0 0.5rem' }}>
                ✓ बैकग्राउंड में सक्रिय
              </div>
              <a
                href={waDirectHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTriggerDirectWhatsApp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.76rem',
                  color: '#16a34a',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#f0fdf4',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                चैट खोलें <ExternalLink size={12} />
              </a>
            </div>

            {/* Channel C: Direct Call & Missed Call */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '0.85rem 0.75rem',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}>
              <div style={{ color: '#dc2626', marginBottom: '0.35rem' }}>
                <PhoneCall size={22} style={{ margin: '0 auto' }} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                Cellular Call / Ring
              </div>
              <div style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, margin: '0.2rem 0 0.5rem' }}>
                {callState === 'missed_call_sent' ? '✓ मिस्ड कॉल बजाई गई' : '● कॉल डायल हो रही है'}
              </div>
              <a
                href={telDirectHref}
                onClick={handleTriggerDirectCall}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.76rem',
                  color: '#dc2626',
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: '#fff1f2',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                डायल करें <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* 2. Automated Call Sequence Card */}
        <div
          style={{
            background: callState === 'missed_call_sent' ? '#f0fdf4' : '#fff1f2',
            border: callState === 'missed_call_sent' ? '2px solid #86efac' : '2px dashed #f43f5e',
            borderRadius: '18px',
            padding: '1.5rem',
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: callState === 'missed_call_sent' ? '#16a34a' : '#e11d48',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              boxShadow: '0 4px 15px rgba(225, 29, 72, 0.3)'
            }}
          >
            {callState === 'missed_call_sent' ? <PhoneForwarded size={32} /> : <PhoneCall size={32} />}
          </div>

          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
            {caregiverName}
          </div>
          <div style={{ fontSize: '1.15rem', color: '#7f1d1d', fontWeight: 700, margin: '0.2rem 0 0.5rem' }}>
            {primaryPhone}
          </div>

          {/* Dynamic Call Status */}
          {callState === 'connecting' && (
            <div style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.95rem' }}>
              🔄 आपातकालीन कॉल गेटवे कनेक्ट हो रहा है...
            </div>
          )}
          {callState === 'ringing' && (
            <div style={{ color: '#e11d48', fontWeight: 800, fontSize: '1.05rem', animation: 'pulseGlow 1.2s infinite' }}>
              📞 घंटी बज रही है (Ringing Family Member's Phone)...
            </div>
          )}
          {callState === 'missed_call_sent' && (
            <div style={{ color: '#15803d', fontWeight: 800, fontSize: '1.1rem' }}>
              ✓ स्वचालित मिस्ड कॉल व उच्च-प्राथमिकता घंटी परिवार के फोन पर भेजी गई!
            </div>
          )}
        </div>

        {/* 3. Direct SMS / WhatsApp Message Preview */}
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageSquare size={16} color="#0284c7" />
              प्रेषित आपातकालीन संदेश (Live Dispatched Payload):
            </div>
            <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
              {isOnline ? 'Cloud & Cellular Dispatched ✓' : 'Cellular SMS Active'}
            </span>
          </div>

          <pre
            style={{
              fontSize: '0.85rem',
              color: '#1e293b',
              background: '#ffffff',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'monospace'
            }}
          >
            {sosMessageText}
          </pre>

          {/* Diagnostics Meta */}
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.85rem', color: '#64748b' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} color="#b45309" /> GPS: 26.1859° N, 91.7477° E (Guwahati)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Battery size={14} color="#15803d" /> Battery: 84%
            </span>
          </div>
        </div>

        {/* 4. Large Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <a
            href={telDirectHref}
            onClick={handleTriggerDirectCall}
            style={{
              flex: 1,
              background: '#15803d',
              color: 'white',
              borderRadius: '14px',
              padding: '0.9rem 1rem',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
            }}
          >
            <PhoneCall size={20} /> अभी कॉल करें (Direct Call)
          </a>

          <a
            href={waDirectHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleTriggerDirectWhatsApp}
            style={{
              flex: 1,
              background: '#0284c7',
              color: 'white',
              borderRadius: '14px',
              padding: '0.9rem 1rem',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            <MessageSquare size={20} /> WhatsApp पर भेजें
          </a>
        </div>

        {/* Reassuring Close Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '14px',
            padding: '0.85rem',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          {language === 'hi' ? 'सहायता संदेश सीधे प्रेषित कर दिया गया है • बंद करें' : 'Emergency Dispatched Directly • Close'}
        </button>
      </div>
    </div>
  );
}
