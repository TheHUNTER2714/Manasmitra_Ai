// ==========================================================================
// ManasMitra AI - Mock Data & Clinical State Management
// ==========================================================================

export const INITIAL_ELDER_PROFILE = {
  id: 'NER-PAT-001',
  name: 'राज कुमार बरुआ (Raj Kumar Baruah)',
  preferredName: 'दादाजी (Dadaji)',
  age: 74,
  location: 'Guwahati, Kamrup Metro, Assam',
  primaryLanguage: 'Hindi / Assamese',
  caregiverName: 'अनीता बरुआ (Anita Baruah - Daughter)',
  caregiverPhone: '+91 98765 43210',
  healthWorkerAssigned: 'सुनीता शर्मा (ASHA Worker, PHC Uzanbazar)',
  activeCulturalPack: 'assam',
  cognitiveBaseline: {
    memoryScore: 78,
    attentionScore: 65,
    patternScore: 82,
    recallScore: 70,
    auditoryScore: 74
  },
  waterGlassesToday: 5,
  waterGoal: 8,
  todayMood: '🙂',
  todayMoodText: 'अच्छा महसूस कर रहे हैं (Good)',
  medications: [
    {
      id: 'med-1',
      name: 'डोनापेज़िल (Donepezil 5mg)',
      purpose: 'स्मृति व एकाग्रता सहारा (Memory Support)',
      timing: '09:00 AM (सुबह)',
      withFood: 'नाश्ते के बाद',
      taken: true,
      timeTaken: '09:12 AM'
    },
    {
      id: 'med-2',
      name: 'टेलमिसार्टन (Telmisartan 40mg)',
      purpose: 'रक्तचाप नियंत्रण (Blood Pressure)',
      timing: '01:30 PM (दोपहर)',
      withFood: 'दोपहर भोजन के बाद',
      taken: false,
      timeTaken: null
    },
    {
      id: 'med-3',
      name: 'मल्टीविटामिन व कैल्शियम',
      purpose: 'हड्डियों व सामान्य स्वास्थ्य',
      timing: '08:30 PM (रात)',
      withFood: 'रात के खाने के बाद',
      taken: false,
      timeTaken: null
    }
  ],
  appointments: [
    {
      id: 'app-1',
      doctor: 'डॉ. एन. बरुआ (वरिष्ठ न्यूरोलॉजिस्ट)',
      facility: 'गुवाहाटी न्यूरो केयर क्लिनिक',
      datetime: 'गुरुवार, सुबह 11:30 AM',
      type: 'मासिक संज्ञानात्मक परामर्श (Monthly Checkup)'
    }
  ],
  weeklyTrends: [
    { day: 'सोम (Mon)', memory: 72, attention: 60, reactionTime: 2200, gamesPlayed: 3, adherence: 100 },
    { day: 'मंगल (Tue)', memory: 75, attention: 62, reactionTime: 2100, gamesPlayed: 4, adherence: 100 },
    { day: 'बुध (Wed)', memory: 74, attention: 58, reactionTime: 2350, gamesPlayed: 2, adherence: 67 },
    { day: 'गुरु (Thu)', memory: 80, attention: 68, reactionTime: 1950, gamesPlayed: 4, adherence: 100 },
    { day: 'शुक्र (Fri)', memory: 78, attention: 66, reactionTime: 2050, gamesPlayed: 3, adherence: 100 },
    { day: 'शनि (Sat)', memory: 82, attention: 70, reactionTime: 1880, gamesPlayed: 4, adherence: 100 },
    { day: 'आज (Today)', memory: 84, attention: 72, reactionTime: 1820, gamesPlayed: 3, adherence: 67 }
  ],
  alerts: [
    {
      id: 'al-1',
      level: 'medium',
      title: 'दोपहर की रक्तचाप दवा का समय निकट (1:30 PM)',
      description: 'दादाजी ने सुबह की दवा समय पर ली। दोपहर की दवा अभी लंबित है।',
      time: '35 मिनट पहले'
    },
    {
      id: 'al-2',
      level: 'normal',
      title: 'संज्ञानात्मक स्मृति अभ्यास में उत्कृष्ट प्रदर्शन (+6%)',
      description: 'याददाश्त खेल में 92% शुद्धता दर्ज हुई। AI इंजन ने स्वतः स्तर 2 (Medium) अनुशंसित किया।',
      time: 'आज सुबह 10:15 AM'
    }
  ]
};

export const MOCK_HEALTHCARE_COHORT = [
  {
    id: 'NER-PAT-001',
    name: 'Raj Kumar Baruah (राज कुमार)',
    age: 74,
    district: 'Kamrup Metro (Assam)',
    caregiver: 'Anita Baruah (Daughter)',
    lastActive: '12 mins ago',
    memoryAvg: 84,
    attentionAvg: 72,
    adherenceRate: 92,
    statusPriority: 'Stable 🟢',
    recommendedIntervention: 'Continue adaptive cognitive modules'
  },
  {
    id: 'NER-PAT-002',
    name: 'Hemanta Gogoi (हेमंत गोगोई)',
    age: 78,
    district: 'Jorhat (Assam)',
    caregiver: 'Biren Gogoi (Son)',
    lastActive: '4 hours ago',
    memoryAvg: 61,
    attentionAvg: 54,
    adherenceRate: 64,
    statusPriority: 'Attention Needed 🟡',
    recommendedIntervention: 'Caregiver reminder follow-up for afternoon medication'
  },
  {
    id: 'NER-PAT-003',
    name: 'Baha Mary Khonglah (बाहा खोंगलाह)',
    age: 71,
    district: 'East Khasi Hills (Meghalaya)',
    caregiver: 'Daphne Khonglah (Granddaughter)',
    lastActive: 'Yesterday',
    memoryAvg: 76,
    attentionAvg: 69,
    adherenceRate: 88,
    statusPriority: 'Stable 🟢',
    recommendedIntervention: 'Story recall auditory practice'
  },
  {
    id: 'NER-PAT-004',
    name: 'Thambal Devi (थम्बल देवी)',
    age: 82,
    district: 'Imphal West (Manipur)',
    caregiver: 'Sanamacha Singh (Son)',
    lastActive: '2 days ago',
    memoryAvg: 52,
    attentionAvg: 48,
    adherenceRate: 40,
    statusPriority: 'High Priority 🔴',
    recommendedIntervention: 'ASHA home visit required; missed 4 routine check-ins'
  }
];
