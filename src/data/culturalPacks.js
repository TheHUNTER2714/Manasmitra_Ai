// ==========================================================================
// ManasMitra AI - Cultural Memory Packs & Regional Content
// Tailored for North Eastern Region (Assam, Meghalaya, Manipur) & Pan-India
// ==========================================================================

export const CULTURAL_PACKS = {
  assam: {
    id: 'assam',
    name: 'Assam & Brahmaputra Valley',
    regionalName: 'অসম (Assam)',
    greetingHindi: 'नमस्ते दादाजी! राम-राम',
    greetingRegional: 'নমস্কাৰ ককা (Nomoskar Koka)',
    badge: '🌿 Assam Heritage',
    objects: [
      { id: 'japi', name: 'जापी (Japi Hat)', regionalName: 'জাপী', emoji: '👒', category: 'Traditional Craft' },
      { id: 'tea', name: 'चाय की पत्ती (Assam Tea)', regionalName: 'চাহ পাত', emoji: '🍵', category: 'Daily Life' },
      { id: 'dhol', name: 'बिहू ढोल (Bihu Dhol)', regionalName: 'ঢোল', emoji: '🥁', category: 'Music' },
      { id: 'rhino', name: 'एक सींग वाला गैंडा (Rhino)', regionalName: 'এশিঙীয়া গঁড়', emoji: '🦏', category: 'Nature' },
      { id: 'gamusa', name: 'गमुसा (Gamusa)', regionalName: 'গামোচা', emoji: '🧣', category: 'Textile' },
      { id: 'pitha', name: 'तिल पीठा (Til Pitha)', regionalName: 'তিল পিঠা', emoji: '🥟', category: 'Food' }
    ],
    stories: [
      {
        id: 'assam-1',
        title: 'रवि की गुवाहाटी हाट की यात्रा',
        storyText: 'रविवार की सुबह रवि गुवाहाटी के उज़ान बाज़ार गया। उसने अपनी पोती के लिए ताज़े मीठे संतरे और बाग़ की ताज़ी हरी चाय की पत्तियां खरीदीं। लौटते समय उसने ब्रह्मपुत्र नदी के किनारे नौकाएं देखीं।',
        question: 'रवि ने बाज़ार में अपनी पोती के लिए क्या खरीदा?',
        options: ['ताज़े मीठे संतरे', 'खिलौना ढोल', 'नया जापी'],
        correctIndex: 0
      }
    ],
    routineSituations: [
      {
        id: 'r-assam-1',
        question: 'सुबह उठने और मुँह धोने के बाद असमिया घरों में सबसे पहले क्या बनता है?',
        options: ['गरमा-गरम लाल चाय (Lal Saah)', 'सोने की तैयारी', 'रात का खाना'],
        correctIndex: 0
      }
    ]
  },
  meghalaya: {
    id: 'meghalaya',
    name: 'Meghalaya & Khasi Hills',
    regionalName: 'মেঘালয় (Meghalaya)',
    greetingHindi: 'नमस्ते दादाजी! सुखद प्रभात',
    greetingRegional: 'Khublei (Khasi Greeting)',
    badge: '☁️ Cloud Abode',
    objects: [
      { id: 'rootbridge', name: 'लिविंग रूट ब्रिज', emoji: '🌉', category: 'Heritage' },
      { id: 'pine', name: 'चीड़ का पेड़ (Pine)', emoji: '🌲', category: 'Nature' },
      { id: 'drum', name: 'खासी पारंपरिक ढोल', emoji: '🪘', category: 'Music' },
      { id: 'orange', name: 'सोहरा संतरे', emoji: '🍊', category: 'Fruit' },
      { id: 'waterfall', name: 'नोहकलिकाई जलप्रपात', emoji: '🌊', category: 'Landmark' },
      { id: 'basket', name: 'बांस की टोकरी (Khoh)', emoji: '🧺', category: 'Craft' }
    ],
    stories: [
      {
        id: 'megh-1',
        title: 'शिलांग की धुंधली सुबह',
        storyText: 'शिलांग में आज हल्की धूप और बादलों की धुंध है। बाहा अपनी छोटी बहन के साथ चेरापूंजी के बाग से रसीले संतरे चुनकर लाया और शाम को दोनों ने गर्म कहवा पिया।',
        question: 'बाहा और उसकी बहन ने बाग से क्या चुना?',
        options: ['रसीले संतरे', 'लाल सेब', 'अखरोट'],
        correctIndex: 0
      }
    ],
    routineSituations: [
      {
        id: 'r-megh-1',
        question: 'सुबह की सैर से लौटने के बाद क्या करना स्वास्थ्य के लिए सबसे अच्छा है?',
        options: ['ताज़ा पानी पीना और विश्राम करना', 'तुरंत तेज़ धूप में दौड़ना', 'भारी वज़न उठाना'],
        correctIndex: 0
      }
    ]
  },
  manipur: {
    id: 'manipur',
    name: 'Manipur & Imphal Valley',
    regionalName: 'মণিপুর (Manipur)',
    greetingHindi: 'नमस्ते दादाजी! प्रणाम',
    greetingRegional: 'Khurumjari (Manipuri)',
    badge: '🌺 Jewel of India',
    objects: [
      { id: 'loktak', name: 'लोकटक झील (Loktak)', emoji: '🛶', category: 'Nature' },
      { id: 'flute', name: 'बांस की बांसुरी', emoji: '🪈', category: 'Music' },
      { id: 'shawl', name: 'मणिपुरी शॉल', emoji: '🧣', category: 'Textile' },
      { id: 'lotus', name: 'कमल का फूल', emoji: '🪷', category: 'Nature' },
      { id: 'deer', name: 'संगाई हिरण (Sangai)', emoji: '🦌', category: 'Fauna' },
      { id: 'pot', name: 'लोंगपी मिट्टी का बर्तन', emoji: '🏺', category: 'Craft' }
    ],
    stories: [
      {
        id: 'mani-1',
        title: 'मोइरांग की शाम',
        storyText: 'शाम को थम्बल अपने दादाजी के साथ लोकटक झील के किनारे बैठी। दूर तैरते हुए फूमदी पर सफेद बगुले उड़ रहे थे। दादाजी ने उसे बांस की मधुर बांसुरी बजाकर सुनाई।',
        question: 'दादाजी ने शाम को क्या बजाया?',
        options: ['बांस की बांसुरी', 'ढोल', 'सितार'],
        correctIndex: 0
      }
    ],
    routineSituations: [
      {
        id: 'r-mani-1',
        question: 'दोपहर का भोजन करने के 20 मिनट बाद क्या नियम रखना चाहिए?',
        options: ['हल्की चहलकदमी और दवा लेना', 'तुरंत गहरी दौड़ लगाना', 'आँखों पर धूप डालना'],
        correctIndex: 0
      }
    ]
  },
  panIndia: {
    id: 'panIndia',
    name: 'Pan-India & Awadh (Heritage Edition)',
    regionalName: 'उत्तर प्रदेश व भारत',
    greetingHindi: 'नमस्ते दादाजी! प्रणाम',
    greetingRegional: 'प्रणाम दादाजी',
    badge: '🏛️ Heritage & Awadh',
    objects: [
      { id: 'spectacles', name: 'चश्मा (Glasses)', emoji: '👓', category: 'Daily Item' },
      { id: 'diya', name: 'मिट्टी का दीया (Diya)', emoji: '🪔', category: 'Traditional' },
      { id: 'kettle', name: 'पीतल की केतली', emoji: '🫖', category: 'Household' },
      { id: 'stick', name: 'लाठी / छड़ी (Walking Stick)', emoji: '🦯', category: 'Assistance' },
      { id: 'marigold', name: 'गेंदे की माला (Marigold)', emoji: '🌼', category: 'Nature' },
      { id: 'clock', name: 'दीवार घड़ी (Clock)', emoji: '🕰️', category: 'Time' }
    ],
    stories: [
      {
        id: 'up-1',
        title: 'गोमती तट की सुबह',
        storyText: 'लखनऊ के गोमती तट पर आज सुबह सुगंधित ठंडी हवा चल रही थी। पंडित जी सुबह की सैर पूरी करके घर लौटे और तुलसी के पौधे में जल देकर अपनी सुबह की दवाई ली।',
        question: 'पंडित जी ने घर लौटकर सबसे पहले किस पौधे को जल दिया?',
        options: ['तुलसी के पौधे को', 'गुलाब के पौधे को', 'नीम के पेड़ को'],
        correctIndex: 0
      }
    ],
    routineSituations: [
      {
        id: 'r-up-1',
        question: 'नाश्ता करने के बाद डॉक्टर द्वारा दी गई सुबह की दवा कब लेनी चाहिए?',
        options: ['नाश्ते के ठीक बाद पानी के साथ', 'बिना नाश्ते के शाम को', 'तीन दिन बाद'],
        correctIndex: 0
      }
    ]
  }
};
