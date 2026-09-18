// ==========================================================================
// ManasMitra AI - Voice Assistant NLP Intent Engine ("ManasMitra Vani")
// Matches Hindi & English spoken queries to contextual actions and spoken replies
// ==========================================================================

export const VOICE_INTENTS = [
  {
    intent: 'check_medication',
    patterns: [
      'dawai', 'medicine', 'dawa', 'goli', 'दवाई', 'दवा', 'गोली',
      'when is medicine', 'medicine time', 'meri dawai kab hai'
    ],
    action: 'open_reminders',
    spokenResponseHindi: 'दादाजी, आपकी अगली दवाई दोपहर 1:30 बजे रक्तचाप नियंत्रण के लिए है। सुबह की दवाई आप समय पर ले चुके हैं।',
    spokenResponseEnglish: 'Dadaji, your next medicine is Telmisartan at 1:30 PM after lunch. You already took your morning medicine.'
  },
  {
    intent: 'play_game',
    patterns: [
      'game', 'khel', 'khelna', 'play', 'खेल', 'खेलना', 'याददाश्त', 'स्मृति',
      'chalo game', 'start game', 'mind game'
    ],
    action: 'open_games',
    spokenResponseHindi: 'बहुत बढ़िया दादाजी! चलिए आज का स्मृति खेल शुरू करते हैं।',
    spokenResponseEnglish: 'Wonderful Dadaji! Let us start today\'s memory exercise.'
  },
  {
    intent: 'check_water',
    patterns: [
      'pani', 'water', 'pyas', 'पानी', 'प्यास', 'जल', 'hydration', 'water reminder'
    ],
    action: 'open_reminders',
    spokenResponseHindi: 'दादाजी, आज आपने 5 गिलास पानी पी लिया है। बहुत अच्छा! 1 गिलास ताज़ा पानी और पी लीजिए।',
    spokenResponseEnglish: 'Dadaji, you have logged 5 glasses of water today. Having one more fresh glass would be great.'
  },
  {
    intent: 'check_appointment',
    patterns: [
      'doctor', 'appointment', 'aspatal', 'hospital', 'डॉक्टर', 'अस्पताल', 'checkup'
    ],
    action: 'open_reminders',
    spokenResponseHindi: 'डॉक्टर बरुआ के साथ आपका मासिक परामर्श गुरुवार सुबह 11:30 बजे गुवाहाटी न्यूरो केयर क्लिनिक में है।',
    spokenResponseEnglish: 'Your monthly consultation with Dr. Baruah is on Thursday at 11:30 AM.'
  },
  {
    intent: 'check_date_time',
    patterns: [
      'samay', 'time', 'din', 'tarikh', 'date', 'दिन', 'समय', 'तारीख', 'aaj kaun sa din hai'
    ],
    action: 'none',
    spokenResponseHindi: 'आज बहुत सुंदर दिन है। समय सुबह के 10:30 बज रहे हैं। मौसम सुहावना है।',
    spokenResponseEnglish: 'Today is a pleasant morning. The time is 10:30 AM.'
  },
  {
    intent: 'mood_help',
    patterns: [
      'achha nahi', 'sad', 'udas', 'ghabrahat', 'dard', 'उदासी', 'घबराहट', 'अच्छा नहीं लग रहा', 'help'
    ],
    action: 'open_mood',
    spokenResponseHindi: 'दादाजी, चिंता बिल्कुल मत कीजिए। हम सब आपके साथ हैं। चलिए गहरी सांस लीजिए और एक मधुर लोकधुन सुनते हैं।',
    spokenResponseEnglish: 'Do not worry at all Dadaji. We are with you. Let us take a deep breath and relax.'
  },
  {
    intent: 'call_caregiver',
    patterns: [
      'call', 'anita', 'beti', 'phone', 'फोन', 'कॉल', 'अनीता', 'केयरगिवर'
    ],
    action: 'call_caregiver',
    spokenResponseHindi: 'आपकी बेटी अनीता को संदेश भेज दिया गया है। वह शीघ्र ही आपसे बात करेंगी।',
    spokenResponseEnglish: 'A notification has been sent to your caregiver Anita.'
  },
  {
    intent: 'message_family',
    patterns: [
      'message', 'sandesh', 'chat', 'parivar', 'family', 'संदेश', 'मैसेज', 'परिवार', 'बात करनी है'
    ],
    action: 'open_family_messages',
    spokenResponseHindi: 'परिवार को संदेश भेजने के लिए चैट खोली जा रही है। आप बोलकर या 1-टैप से संदेश भेज सकते हैं।',
    spokenResponseEnglish: 'Opening direct family messages. You can type or speak your message to family.'
  }
];

export function parseVoiceIntent(transcript) {
  if (!transcript || typeof transcript !== 'string') {
    return null;
  }
  const lower = transcript.toLowerCase().trim();

  for (const item of VOICE_INTENTS) {
    for (const pattern of item.patterns) {
      if (lower.includes(pattern.toLowerCase())) {
        return item;
      }
    }
  }

  // Fallback friendly conversation response
  return {
    intent: 'general_friendly',
    action: 'none',
    spokenResponseHindi: `मैंने सुना: "${transcript}"। मैं मानस मित्र हूँ, आपका सहायक। क्या आप खेल खेलना चाहते हैं या दवाई का समय देखना चाहते हैं?`,
    spokenResponseEnglish: `I heard: "${transcript}". I am ManasMitra. Would you like to play a game or check your medicine?`
  };
}
