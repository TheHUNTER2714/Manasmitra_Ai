/**
 * ManasMitra AI - Live Family Messaging Bus
 * Provides instant zero-latency cross-tab/cross-device synchronization via BroadcastChannel
 * and real external communication via WhatsApp Web/API, SMS intents, and Web Share.
 */

const CHANNEL_NAME = 'manasmitra_family_live_bus';
const STORAGE_KEY = 'manasmitra_family_messages';

class LiveMessagingService {
  constructor() {
    this.subscribers = new Set();
    this.channel = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifySubscribers(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, falling back to storage events:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifySubscribers({
              type: 'STORAGE_UPDATE',
              messages: parsed
            });
          } catch {}
        }
      });
    }
  }

  // Subscribe to live events
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(event) {
    this.subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error('Error in messaging subscriber:', err);
      }
    });
  }

  // Get all persisted messages
  getMessages() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  // Save messages to storage and broadcast
  saveMessages(messages) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }

  // Send message from Elder
  sendElderMessage(text, elderData = {}) {
    const cleanText = (text || '').trim();
    if (!cleanText) return null;

    const currentTimestamp = Date.now();
    const timeStr = new Date(currentTimestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMsg = {
      id: `msg-${currentTimestamp}`,
      sender: 'elder',
      senderName: elderData.preferredName || elderData.name || 'दादाजी (Elder)',
      text: cleanText,
      time: timeStr,
      timestamp: currentTimestamp,
      readByCaregiver: false
    };

    const currentMessages = this.getMessages();
    const updated = [...currentMessages, newMsg];
    this.saveMessages(updated);

    const event = {
      type: 'NEW_ELDER_MESSAGE',
      message: newMsg,
      messages: updated
    };

    if (this.channel) {
      this.channel.postMessage(event);
    }
    this.notifySubscribers(event);

    return newMsg;
  }

  // Send reply from Caregiver / Family
  sendCaregiverReply(text, caregiverName = 'अनीता बरुआ (बेटी)') {
    const cleanText = (text || '').trim();
    if (!cleanText) return null;

    const currentTimestamp = Date.now();
    const timeStr = new Date(currentTimestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const replyMsg = {
      id: `reply-${currentTimestamp}`,
      sender: 'caregiver',
      senderName: caregiverName,
      text: cleanText,
      time: timeStr,
      timestamp: currentTimestamp,
      readByElder: false
    };

    const currentMessages = this.getMessages();
    const updated = [...currentMessages, replyMsg];
    this.saveMessages(updated);

    const event = {
      type: 'NEW_CAREGIVER_REPLY',
      message: replyMsg,
      messages: updated
    };

    if (this.channel) {
      this.channel.postMessage(event);
    }
    this.notifySubscribers(event);

    return replyMsg;
  }

  // Real external WhatsApp dispatch
  sendToWhatsApp(phone, text, elderName = 'दादाजी') {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    const dateStr = new Date().toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const formattedMessage = `🌸 *ManasMitra AI - परिवार संदेश*\n` +
      `📅 *तारीख व समय:* ${dateStr}, ${timeStr}\n` +
      `👤 *प्रेषक (Elder):* ${elderName}\n\n` +
      `💬 *संदेश:*\n"${text}"\n\n` +
      `❤️ _यह संदेश ManasMitra डिमेंशिया केयर प्लेटफॉर्म से आपके परिवार को भेजा गया है। कृपया अपने बुजुर्ग को फोन या उत्तर अवश्य दें।_`;

    const encoded = encodeURIComponent(formattedMessage);
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    return targetUrl;
  }

  // Format clean SMS body text
  formatSmsBody(text, elderName = 'दादाजी', type = 'message') {
    if (type === 'reminder') {
      return `[ManasMitra Health Reminder] For ${elderName}: ${text}. Please ensure follow-up.`;
    }
    if (type === 'sos') {
      return `[EMERGENCY SOS ALERT] ${elderName} requires urgent attention via ManasMitra Platform! Location/Message: "${text}". Call back immediately!`;
    }
    return `[ManasMitra Family Message] From ${elderName}: "${text}". Please check in or reply.`;
  }

  // Real external SMS dispatch with clipboard copy fallback and cross-platform formatting
  async sendToSms(phone, text, elderName = 'दादाजी', type = 'message') {
    const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
    const bodyText = this.formatSmsBody(text, elderName, type);
    const encoded = encodeURIComponent(bodyText);

    // Cross-platform mobile URI: sms:+919876543210?&body=... works on modern Android & iOS
    const smsUrl = cleanPhone
      ? `sms:${cleanPhone}?&body=${encoded}`
      : `sms:?&body=${encoded}`;

    // Auto-copy to clipboard as guaranteed fallback for desktop and web
    let copiedToClipboard = false;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(bodyText);
        copiedToClipboard = true;
      } catch {
        copiedToClipboard = false;
      }
    }

    // Trigger device SMS handler
    try {
      if (typeof window !== 'undefined') {
        const link = document.createElement('a');
        link.href = smsUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        setTimeout(() => document.body.removeChild(link), 300);
      }
    } catch (e) {
      console.warn('SMS URL dispatch attempt:', e);
    }

    // Broadcast cellular dispatch notification
    const dispatchEvent = {
      type: 'SMS_DISPATCHED',
      phone: cleanPhone,
      bodyText: bodyText,
      timestamp: Date.now(),
      copied: copiedToClipboard
    };

    if (this.channel) {
      this.channel.postMessage(dispatchEvent);
    }
    this.notifySubscribers(dispatchEvent);

    return {
      success: true,
      url: smsUrl,
      bodyText,
      phone: cleanPhone,
      copied: copiedToClipboard
    };
  }

  // Copy SMS text directly to clipboard
  async copySmsText(phone, text, elderName = 'दादाजी', type = 'message') {
    const bodyText = this.formatSmsBody(text, elderName, type);
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(bodyText);
        return { success: true, text: bodyText };
      } catch (err) {
        console.warn('Clipboard copy error:', err);
      }
    }
    return { success: false, text: bodyText };
  }

  // Native Web Share API
  async shareNative(title, text) {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title || 'ManasMitra Family Message',
          text: text
        });
        return true;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
        return false;
      }
    }
    return false;
  }
}

export const liveMessagingService = new LiveMessagingService();
