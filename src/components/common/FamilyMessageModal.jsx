import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Send,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Share2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Copy
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';
import { liveMessagingService } from '../../services/liveMessagingService';

const DEFAULT_FAMILY_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'caregiver',
    senderName: 'अनीता बरुआ (बेटी)',
    text: 'नमस्ते दादाजी! हमने देखा कि आपने सुबह की दवा ले ली है। अपना ख्याल रखिएगा, शाम 6 बजे आपके लिए पसंदीदा फल लेकर आते हैं ❤️',
    time: 'सुबह 09:30 AM',
    timestamp: Date.now() - 3600000
  }
];

export default function FamilyMessageModal({
  isOpen,
  onClose,
  elderData,
  language = 'hi'
}) {
  const [messages, setMessages] = useState(() => {
    const saved = liveMessagingService.getMessages();
    return saved.length > 0 ? saved : DEFAULT_FAMILY_MESSAGES;
  });

  const [inputMsg, setInputMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSentSuccess, setIsSentSuccess] = useState(false);
  const [lastSentText, setLastSentText] = useState('');
  const [autoWhatsApp, setAutoWhatsApp] = useState(true);

  // Expandable Family Live Reply Window (Allows family to reply on-screen or in live demo)
  const [showFamilyReplyPanel, setShowFamilyReplyPanel] = useState(false);
  const [familyReplyInput, setFamilyReplyInput] = useState('');

  // Subscribe to live BroadcastChannel for genuine incoming caregiver replies
  useEffect(() => {
    const unsubscribe = liveMessagingService.subscribe((event) => {
      if (event.type === 'NEW_CAREGIVER_REPLY') {
        const allMsgs = liveMessagingService.getMessages();
        setMessages(allMsgs);
        speechService.playChime('notification');
        const replyText = event.message?.text || '';
        speechService.speak(
          language === 'hi'
            ? `आपके परिवार से नया संदेश आया है: ${replyText}`
            : `New reply from family: ${replyText}`,
          language === 'hi' ? 'hi-IN' : 'en-IN'
        );
      } else if (event.type === 'NEW_ELDER_MESSAGE' || event.type === 'STORAGE_UPDATE') {
        setMessages(liveMessagingService.getMessages());
      }
    });

    return unsubscribe;
  }, [language]);

  const caregiverName = elderData?.caregiverName || 'अनीता बरुआ (बेटी)';
  const caregiverPhone = elderData?.caregiverPhone || '+91 98765 43210';

  const quickTemplates = [
    {
      emoji: '😊',
      textHi: 'नमस्ते बेटा! मैं यहाँ बहुत अच्छा महसूस कर रहा हूँ।',
      textEn: 'Hello! I am feeling very well here.'
    },
    {
      emoji: '💊',
      textHi: 'मैंने समय पर अपनी दवाइयां और भरपूर पानी पी लिया है।',
      textEn: 'I have taken all my medicines and drank water on time.'
    },
    {
      emoji: '📞',
      textHi: 'जब भी आपको फुर्सत मिले, मुझे एक बार फोन करना।',
      textEn: 'Please give me a call whenever you get free time.'
    },
    {
      emoji: '❤️',
      textHi: 'आप सभी को मेरा बहुत सारा प्यार व ढेर सारा आशीर्वाद!',
      textEn: 'Sending you all lots of love and warm blessings!'
    },
    {
      emoji: '🏡',
      textHi: 'क्या आप आज शाम समय पर घर आ रहे हैं?',
      textEn: 'Are you coming home on time this evening?'
    },
    {
      emoji: '🍵',
      textHi: 'मैंने शाम की चाय पी ली है और थोड़ा टहल भी लिया है।',
      textEn: 'I had my evening tea and took a refreshing walk.'
    }
  ];

  const quickFamilyReplies = [
    'नमस्ते दादाजी, मैं सुन रही हूँ। सब बिल्कुल ठीक है ❤️',
    'दवाइयाँ समय पर ले लीं ना? पानी भी पीते रहना।',
    'मैं शाम 6 बजे पसंदीदा फल लेकर पहुँच रही हूँ!',
    'आप आराम करें, मैं 10 मिनट में आपको फोन करती हूँ।'
  ];

  const handleSendMessage = useCallback((textToSend = inputMsg) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    // Send via live messaging bus (BroadcastChannel + LocalStorage)
    const newMsg = liveMessagingService.sendElderMessage(cleanText, elderData);
    if (!newMsg) return;

    setMessages(liveMessagingService.getMessages());
    setInputMsg('');
    setLastSentText(cleanText);
    setIsSentSuccess(true);
    setTimeout(() => setIsSentSuccess(false), 3000);

    speechService.playChime('success');
    speechService.speak(
      language === 'hi' ? 'संदेश आपके परिवार को भेज दिया गया है।' : 'Message sent to family.',
      language === 'hi' ? 'hi-IN' : 'en-IN'
    );

    // Sync via offline sync engine
    offlineSyncEngine.recordEvent('FAMILY_DIRECT_MESSAGE_SENT', {
      recipient: caregiverName,
      phone: caregiverPhone,
      text: cleanText,
      timestamp: new Date().toISOString()
    });

    // If auto-WhatsApp is enabled, directly dispatch via WhatsApp Web/App
    if (autoWhatsApp) {
      liveMessagingService.sendToWhatsApp(caregiverPhone, cleanText, elderData?.preferredName || 'दादाजी');
    }
  }, [autoWhatsApp, caregiverName, caregiverPhone, elderData, inputMsg, language]);

  const handleSendFamilyReply = (replyText = familyReplyInput) => {
    const cleanText = (replyText || '').trim();
    if (!cleanText) return;

    liveMessagingService.sendCaregiverReply(cleanText, caregiverName);
    setMessages(liveMessagingService.getMessages());
    setFamilyReplyInput('');
  };

  const handleVoiceDictate = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please type or use quick messages.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSpeakText = (text) => {
    speechService.speak(text, language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const [smsDeliveryToast, setSmsDeliveryToast] = useState('');

  const handleWhatsAppManual = (text = inputMsg || lastSentText) => {
    const msgToSend = text || 'नमस्ते बेटा! मानस मित्र से संदेश भेज रहा हूँ।';
    liveMessagingService.sendToWhatsApp(caregiverPhone, msgToSend, elderData?.preferredName || 'दादाजी');
  };

  const handleSmsManual = async (text = inputMsg || lastSentText) => {
    const msgToSend = text || 'नमस्ते बेटा! मानस मित्र से संदेश।';
    const result = await liveMessagingService.sendToSms(caregiverPhone, msgToSend, elderData?.preferredName || 'दादाजी', 'message');
    if (result.copied) {
      setSmsDeliveryToast('✓ SMS ऐप सक्रिय हुआ व संदेश क्लिपबोर्ड पर कॉपी हो गया!');
    } else {
      setSmsDeliveryToast('✓ SMS ऐप सक्रिय किया गया!');
    }
    setTimeout(() => setSmsDeliveryToast(''), 5000);
  };

  const handleCopySmsManual = async (text = inputMsg || lastSentText) => {
    const msgToSend = text || 'नमस्ते बेटा! मानस मित्र से संदेश।';
    await liveMessagingService.copySmsText(caregiverPhone, msgToSend, elderData?.preferredName || 'दादाजी', 'message');
    setSmsDeliveryToast('✓ SMS टेक्स्ट सफलतापूर्वक क्लिपबोर्ड पर कॉपी हो गया!');
    setTimeout(() => setSmsDeliveryToast(''), 4000);
  };

  const handleNativeShare = async (text = inputMsg || lastSentText) => {
    const msgToSend = text || 'नमस्ते बेटा! मानस मित्र से संदेश।';
    await liveMessagingService.shareNative('ManasMitra Family Message', msgToSend);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '820px',
        borderRadius: '32px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '94vh'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0b132b 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
            }}>
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{language === 'hi' ? 'परिवार को सीधा संदेश' : 'Direct Family Message'}</span>
                <span style={{ fontSize: '0.72rem', background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                  ● Live Sync
                </span>
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '3px 0 0' }}>
                {caregiverName} • <strong style={{ color: '#ffffff' }}>{caregiverPhone}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Direct Phone Call */}
            <a
              href={`tel:${caregiverPhone}`}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none'
              }}
              title="Direct Telephone Call"
            >
              <PhoneCall size={14} /> Call
            </a>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Quick-Touch Senior Message Chips */}
          <div>
            <div style={{
              fontSize: '0.86rem',
              fontWeight: 800,
              color: '#334155',
              marginBottom: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={16} color="#059669" />
                <span>{language === 'hi' ? '1-टैप त्वरित संदेश (1-Tap Quick Messages)' : '1-Tap Quick Messages'}</span>
              </div>
              <label style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={autoWhatsApp}
                  onChange={(e) => setAutoWhatsApp(e.target.checked)}
                />
                <span>भेजते ही सीधे WhatsApp पर भेजें</span>
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.55rem' }}>
              {quickTemplates.map((t, idx) => {
                const text = language === 'hi' ? t.textHi : t.textEn;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(text)}
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '0.65rem 0.9rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10b981';
                      e.currentTarget.style.background = '#ecfdf5';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{t.emoji}</span>
                    <span style={{ flex: 1, lineHeight: 1.35 }}>{text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Message Stream */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '20px',
            padding: '1.1rem',
            minHeight: '180px',
            maxHeight: '230px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '0.76rem', color: '#64748b', textAlign: 'center', fontWeight: 700 }}>
              सुरक्षित पारिवारिक चैट • {caregiverName} ({caregiverPhone}) के साथ
            </div>

            {messages.map((m) => {
              const isElder = m.sender === 'elder';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isElder ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isElder ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#64748b',
                    marginBottom: '2px',
                    fontWeight: 700,
                    padding: '0 4px'
                  }}>
                    {m.senderName} • {m.time}
                  </div>
                  <div style={{
                    background: isElder ? 'linear-gradient(135deg, #10b981, #059669)' : '#ffffff',
                    color: isElder ? '#ffffff' : '#0f172a',
                    border: isElder ? 'none' : '1.5px solid #cbd5e1',
                    borderRadius: isElder ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    padding: '0.75rem 1.1rem',
                    fontSize: '0.95rem',
                    lineHeight: 1.45,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    position: 'relative'
                  }}>
                    {m.text}

                    {/* Listen Audio Button */}
                    <button
                      onClick={() => handleSpeakText(m.text)}
                      style={{
                        marginLeft: '0.6rem',
                        background: isElder ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        verticalAlign: 'middle',
                        color: isElder ? '#ffffff' : '#334155'
                      }}
                      title="Listen audio"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Sent Success Banner */}
          {isSentSuccess && (
            <div style={{
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#15803d',
              padding: '0.55rem 1rem',
              borderRadius: '12px',
              fontSize: '0.88rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>संदेश परिवार को सफलतापूर्वक प्रेषित! परिवार के उत्तर का लाइव इंतजार...</span>
              </div>
              <button
                onClick={() => handleWhatsAppManual()}
                style={{
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.3rem 0.7rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <span>WhatsApp पर देखें</span>
                <ExternalLink size={12} />
              </button>
            </div>
          )}

          {/* Custom Message Input Bar with Voice & Multiple Real Send Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.55rem', alignItems: 'center' }}>
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={language === 'hi' ? 'यहाँ अपना संदेश लिखें या बोलें...' : 'Type or speak your message here...'}
                style={{
                  flex: 1,
                  padding: '0.8rem 1.15rem',
                  borderRadius: '14px',
                  border: '2px solid #cbd5e1',
                  fontSize: '0.98rem',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
              />

              {/* Voice Dictation Button */}
              <button
                onClick={handleVoiceDictate}
                style={{
                  background: isListening ? '#ef4444' : '#f1f5f9',
                  color: isListening ? '#ffffff' : '#334155',
                  border: isListening ? 'none' : '1.5px solid #cbd5e1',
                  borderRadius: '14px',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  animation: isListening ? 'pulseGlow 1.5s infinite' : 'none'
                }}
                title="Speak message into microphone"
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Send In-App & Auto-Broadcast */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMsg.trim()}
                style={{
                  background: inputMsg.trim() ? '#10b981' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '0.8rem 1.3rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: inputMsg.trim() ? 'pointer' : 'not-allowed',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: inputMsg.trim() ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none'
                }}
              >
                <Send size={18} />
                <span>भेजें</span>
              </button>
            </div>

            {/* External Real Dispatch Bar (WhatsApp, SMS, Share) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                💡 परिवार सीधे <strong>Caregiver Portal</strong> या <strong>WhatsApp</strong> से उत्तर दे सकता है।
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleWhatsAppManual()}
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Send via WhatsApp to family phone number"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp पर भेजें</span>
                </button>

                <button
                  onClick={() => handleSmsManual()}
                  style={{
                    background: '#052e26',
                    color: '#bef226',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Send as standard mobile SMS text"
                >
                  <Send size={13} />
                  <span>SMS भेजें</span>
                </button>

                <button
                  onClick={() => handleCopySmsManual()}
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Copy SMS text to clipboard"
                >
                  <Copy size={13} />
                  <span>SMS कॉपी</span>
                </button>

                <button
                  onClick={() => handleNativeShare()}
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Share via other family apps"
                >
                  <Share2 size={13} />
                  <span>शेयर</span>
                </button>
              </div>
            </div>

            {/* SMS Feedback / Delivery Toast */}
            {smsDeliveryToast && (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #86efac',
                color: '#15803d',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginTop: '0.3rem',
                animation: 'fadeIn 0.2s ease'
              }}>
                {smsDeliveryToast}
              </div>
            )}
          </div>

          {/* Expandable Family Live Reply Window (Allows family to reply on-screen or in live demo) */}
          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '0.75rem',
            marginTop: '0.25rem'
          }}>
            <button
              onClick={() => setShowFamilyReplyPanel(!showFamilyReplyPanel)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#475569',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>👨‍👩‍👧 परिवार लाइव उत्तर विंडो (Family Live Reply Window)</span>
              {showFamilyReplyPanel ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {showFamilyReplyPanel && (
              <div style={{
                background: '#f1f5f9',
                border: '1.5px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1rem',
                marginTop: '0.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}>
                <div style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Heart size={14} color="#e11d48" />
                  <span>परिवार (अनीता बरुआ) के रूप में वास्तविक उत्तर लिखें:</span>
                </div>

                {/* Quick Caring Reply Chips */}
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {quickFamilyReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => handleSendFamilyReply(reply)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #94a3b8',
                        borderRadius: '9999px',
                        padding: '0.3rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        cursor: 'pointer'
                      }}
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={familyReplyInput}
                    onChange={(e) => setFamilyReplyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendFamilyReply();
                    }}
                    placeholder="परिवार का वास्तविक उत्तर टाइप करें..."
                    style={{
                      flex: 1,
                      padding: '0.55rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleSendFamilyReply()}
                    disabled={!familyReplyInput.trim()}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.55rem 1rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: familyReplyInput.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    उत्तर भेजें
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
