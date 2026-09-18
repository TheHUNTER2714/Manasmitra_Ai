import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';

export default function NetworkToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let lastStatus = offlineSyncEngine.isOnline;

    const unsubscribe = offlineSyncEngine.subscribe((state) => {
      if (state.lastTransition && state.isOnline !== lastStatus) {
        lastStatus = state.isOnline;
        if (state.isOnline) {
          setToast({
            type: 'online',
            title: 'इंटरनेट पुनः कनेक्टेड (Back Online)',
            message: 'क्लाउड डेटाबेस के साथ स्वतः सिंक सफल रहा। सभी स्थानीय घटनाएं प्रेषित की गईं।'
          });
        } else {
          setToast({
            type: 'offline',
            title: 'ऑफलाइन मोड सक्रिय (Offline Mode Active)',
            message: 'इंटरनेट कनेक्शन कट गया है। खेल, दवाइयां और आपातकालीन SOS स्थानीय मेमोरी में सुरक्षित रहेंगे।'
          });
        }

        // Auto-dismiss after 4.5 seconds
        const timer = setTimeout(() => {
          setToast(null);
        }, 4500);

        return () => clearTimeout(timer);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: toast.type === 'online' ? '#f0fdf4' : '#fff1f2',
        border: toast.type === 'online' ? '2px solid #86efac' : '2px solid #f87171',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        maxWidth: '420px',
        animation: 'fadeInUp 0.3s ease-out'
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: toast.type === 'online' ? '#16a34a' : '#e11d48',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {toast.type === 'online' ? <Wifi size={20} /> : <WifiOff size={20} />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: toast.type === 'online' ? '#166534' : '#991b1b' }}>
          {toast.title}
        </div>
        <div style={{ fontSize: '0.86rem', color: '#475569', marginTop: '0.2rem', lineHeight: 1.4 }}>
          {toast.message}
        </div>
      </div>

      <button
        onClick={() => setToast(null)}
        style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
