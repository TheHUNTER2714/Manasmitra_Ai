import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Brain,
  MessageSquare,
  Activity,
  Heart,
  User,
  PhoneCall,
  Wifi,
  Stethoscope,
  CheckCircle2,
  Music,
  Languages,
  Film,
  Shield,
  Send,
  Droplet,
  Maximize2,
  Minimize2,
  Sprout,
  ArrowRight
} from 'lucide-react';
import { speechService } from '../../services/speechService';
import AiSahayakLogo from '../common/AiSahayakLogo';
import { INTRO_CHAPTERS, getChapterLocalized, getSpeechVoiceLang } from '../../data/introChaptersData';

const SECTION_LOCALES = {
  hi: {
    sectionBadge: '🎬 सजीव वीडियो रील • इंटरैक्टिव फीचर टूर',
    sectionTitle: 'मानस मित्र एआई की १२ प्रमुख विशेषताएं',
    sectionSub: 'असम जापी न्यूरो-गेम्स से लेकर एमआरआई रिपोर्ट विश्लेषण, २४x७ एआई सहायक और आपातकालीन एसओएस तक - सजीव वीडियो एनिमेशन के साथ देखें।',
    biophilicBadge: '🌱 स्मृति संवर्धन • BIOPHILIC COGNITIVE RECOVERY',
    biophilicTitle: 'जैसे कोमल हाथों में नन्हा पौधा पलता है, वैसे ही मानस मित्र बुजुर्गों की स्मृति को सहेजता है',
    biophilicSub: 'उत्तर-पूर्व के ८ राज्यों में डिमेंशिया और अल्जाइमर से प्रभावित बुजुर्गों के लिए सांस्कृतिक रूप से समावेशी डिजिटल थैराप्यूटिक मंच।',
    biophilicQuote: '“स्मृति खो सकती है, पर प्यार और संस्कृति कभी नहीं छूटती।”',
    scrollToExpand: 'नीचे स्क्रॉल करें • स्क्रीन विस्तार देखें ↓',
    expandedNotice: 'सिनेमैटिक कैनवास सक्रिय • 60 FPS AI Stream',
    toggleSprout: '🌱 स्मृति पौधा दृश्य',
    toggleTour: '🎬 १२-फीचर टूर',
    expandCanvas: 'स्क्रीन बड़ा करें',
    collapseCanvas: 'सामान्य आकार',
    openFullscreen: 'पूरा वीडियो टूर (२ मिनट) खोलें',
    jumpToModule: 'इस फीचर को अभी आजमाएं →',
    chimeOn: 'धुन चालू',
    chimeOff: 'धुन बंद',
    voiceOn: 'आवाज़ चालू',
    voiceOff: 'मौन'
  },
  en: {
    sectionBadge: '🎬 LIVE CINEMA REEL • INTERACTIVE TOUR',
    sectionTitle: 'Explore All 12 Core ManasMitra Features',
    sectionSub: 'From cultural Assam Jaapi neuro-gaming to brain MRI clinical scans, 24x7 AI Sahayak and emergency SOS - experienced through rich animated simulation.',
    biophilicBadge: '🌱 BIOPHILIC COGNITIVE CARE • NER HEALING',
    biophilicTitle: 'Nurturing Every Memory Like a Fragile Sprout in Caring Hands',
    biophilicSub: 'North East India’s first culturally inclusive digital therapeutic platform for dementia and cognitive longevity across 8 states.',
    biophilicQuote: '“Memories may wander, but culture and gentle care anchor the human spirit.”',
    scrollToExpand: 'Scroll Down to Expand Canvas ↓',
    expandedNotice: 'Cinematic 1080p Canvas Active • 60 FPS Stream',
    toggleSprout: '🌱 Biophilic Sprout View',
    toggleTour: '🎬 12-Feature Reel',
    expandCanvas: 'Expand Screen',
    collapseCanvas: 'Compact Card',
    openFullscreen: 'Open Fullscreen Video Tour (2 Min)',
    jumpToModule: 'Try This Module Now →',
    chimeOn: 'Harmonic Chime On',
    chimeOff: 'Chime Off',
    voiceOn: 'Voiceover Active',
    voiceOff: 'Muted'
  },
  as: {
    sectionBadge: '🎬 সজীৱ ভিডিঅ\' ৰীল • ১২ টা প্ৰধান বৈশিষ্ট্যাৱলী',
    sectionTitle: 'মানস মিত্ৰ এআইৰ ১২ টা প্ৰধান বৈশিষ্ট্যাৱলী',
    sectionSub: 'অসমীয়া জাপি খেলৰ পৰা আৰম্ভ কৰি মগজুৰ এমআৰআই স্কেন, এআই সহায়িকা আৰু জৰুৰীকালীন এছঅ\'এছলৈকে - সকলো সজীৱ ৰূপত চাওক।',
    biophilicBadge: '🌱 স্মৃতি সংৰক্ষণ আৰু যত্ন • অসম আৰু উত্তৰ-পূব',
    biophilicTitle: 'যেনেদৰে দুটি সযত্ন হাতে কোমল পুলি এটি পোহপাল দিয়ে, মানস মিত্ৰই তেনেদৰেই জ্যেষ্ঠজনৰ স্মৃতি সজীৱ ৰাখে',
    biophilicSub: 'উত্তৰ-পূবৰ ৮ খন ৰাজ্যৰ বাবে জ্যেষ্ঠজনৰ ডিমেনচিয়া আৰু স্মৃতি সহায়ক সাংস্কৃতিক প্ৰযুক্তি।',
    biophilicQuote: '“স্মৃতি ম্লান হ\'লেও আমাৰ স্নেহ আৰু সংস্কৃতি চিৰকাল সজীৱ।”',
    scrollToExpand: 'স্ক্ৰীণ ডাঙৰ কৰিবলৈ তললৈ স্ক্ৰল কৰক ↓',
    expandedNotice: 'চিনেমাহল শৈলী সক্ৰিয় • ৬০ এফপিএছ ৰীল',
    toggleSprout: '🌱 সেউজ পুলি দৃশ্য',
    toggleTour: '🎬 ১২টা ফিচাৰ ট্যুৰ',
    expandCanvas: 'স্ক্ৰীণ ডাঙৰ কৰক',
    collapseCanvas: 'সাধাৰণ আকাৰ',
    openFullscreen: 'সম্পূৰ্ণ ভিডিঅ\' ভ্ৰমণ (২ মিনিট) খোলক',
    jumpToModule: 'এইটো এতিয়াই চেষ্টা কৰক →',
    chimeOn: 'সুৰ অন',
    chimeOff: 'সুৰ অফ',
    voiceOn: 'কণ্ঠ সক্ৰিয়',
    voiceOff: 'মৌন'
  },
  bn: {
    sectionBadge: '🎬 লাইভ ভিডিও রিল • ১২টি মূল বৈশিষ্ট্য',
    sectionTitle: 'মানসমিত্র এআই-এর ১২টি মূল বৈশিষ্ট্য',
    sectionSub: 'আসাম জাপি মেমোরি গেম থেকে মস্তিষ্কের এমআরআই স্ক্যান, ২৪x৭ এআই সহায়ক এবং জরুরি এসওএস পর্যন্ত - সজীব অ্যানিমেশনে ঘুরে দেখুন।',
    biophilicBadge: '🌱 স্মৃতি পুনরুদ্ধার ও নিবিড় যত্ন • উত্তর-পূর্ব',
    biophilicTitle: 'যেমন কোমল হাতে সযত্নে বেড়ে ওঠে কচি চারাগাছ, তেমনি মানসমিত্র প্রবীণদের স্মৃতি লালন করে',
    biophilicSub: 'উত্তর-পূর্ব ভারতের ৮টি রাজ্যে ডিমেনশিয়া আক্রান্ত প্রবীণদের জন্য সাংস্কৃতিক ও ডিজিটাল থেরাপিউটিক যত্ন।',
    biophilicQuote: '“স্মৃতি ফিকে হলেও ভালোবাসা এবং সংস্কৃতির বন্ধন চির অম্লান।”',
    scrollToExpand: 'স্ক্রিন সম্প্রসারণের জন্য নিচে স্ক্রোল করুন ↓',
    expandedNotice: 'সিনেমাটিক ক্যানভাস সক্রিয় • ৬০ এফপিএস স্ট্রিম',
    toggleSprout: '🌱 সবুজ চারা দৃশ্য',
    toggleTour: '🎬 ১২টি ফিচার ট্যুর',
    expandCanvas: 'স্ক্রিন বড় করুন',
    collapseCanvas: 'সংক্ষিপ্ত আকার',
    openFullscreen: 'সম্পূর্ণ ভিডিও ট্যুর (২ মিনিট) খুলুন',
    jumpToModule: 'এই মডিউলটি এখনই ব্যবহার করুন →',
    chimeOn: 'সুর চালু',
    chimeOff: 'সুর বন্ধ',
    voiceOn: 'ভয়েস সক্রিয়',
    voiceOff: 'নীরব'
  },
  brx: {
    sectionBadge: '🎬 भिडिअ\' रिल • 12 टा गाहाय फिचारफोर',
    sectionTitle: 'मानस मित्र AI नि 12 टा गाहाय फिचारफोर',
    sectionSub: 'जापि गेलेनायनिफ्राय ब्रेन MRI रिपर्ट, AI हेफाजाब आरो जायखायनो SOS - गासैखौबो भिडिअ\' एनिमेशनजों नाय।',
    biophilicBadge: '🌱 गोसोखांथि सामलायनाय • BIOPHILIC RECOVERY',
    biophilicTitle: 'जेरै आखायाव गोजावनाय बिबार फिसाया सांग्रां जायो, एरैनो मानस मित्राया बैसो गोराफोरनि गोसोखौ सामलायो',
    biophilicSub: 'सा-सानजा भारतनि 8 टा राज्यफोराव बैसो गोराफोरनि गोसोखांथि आरो सावस्रि मन्च।',
    biophilicQuote: '“गोसोखांथिया थांनो हागौ, नाथाय अननाय आरो हारिमुवा जेब्लाबो थायो।”',
    scrollToExpand: 'गाहायाव स्क्रल खालाम ↓',
    expandedNotice: 'सिनेमाथार नुथाय जागायबाय',
    toggleSprout: '🌱 फिसा बिबार नुथाय',
    toggleTour: '🎬 12 टा फिचार',
    expandCanvas: 'गेदेर खालाम',
    collapseCanvas: 'फिसा खालाम',
    openFullscreen: 'गासै भिडिअ\' नाय (2 मिनित)',
    jumpToModule: 'दा नायनो →',
    chimeOn: 'सोदोब अन',
    chimeOff: 'सोदोब अफ़',
    voiceOn: 'राव अन',
    voiceOff: 'सिप'
  },
  kha: {
    sectionBadge: '🎬 LIVE VIDEO REEL • 12 TYLLI KI LAD JINGIARAP',
    sectionTitle: 'Peit ia ki 12 tylli ki Feature jong ka ManasMitra',
    sectionSub: 'Naduh ka Jaapi game haduh ka MRI scan, ka AI bad ka SOS jingiarap - peit bniah ha kane ka video.',
    biophilicBadge: '🌱 JINGSUMAR IA KI JINGMUT • NER CARE',
    biophilicTitle: 'Kumba ki kti kiba sumar ia u tnum ba dang lung, kumta ka ManasMitra ka kdup ia ki jingmut ki tymmen',
    biophilicSub: 'Ka lad digital therapeutic ban sumar ia ka jingklet bad ka koit ka khiah ha ki 8 tylli ki state jong ka North East.',
    biophilicQuote: '“Ki jingmut ki lah ban klet, hynrei ka jingieit bad ka riti synshar kim ju jah.”',
    scrollToExpand: 'Scroll shapoh ban pynheh ia ka screen ↓',
    expandedNotice: 'Cinematic Canvas Active • 60 FPS',
    toggleSprout: '🌱 Peit ia u Tnum Lung',
    toggleTour: '🎬 12 Tylli ki Feature',
    expandCanvas: 'Pynheh Screen',
    collapseCanvas: 'Pynrit Screen',
    openFullscreen: 'Plie Fullscreen Video (2 Min)',
    jumpToModule: 'Pyrshang ia kane Mynta →',
    chimeOn: 'Sur On',
    chimeOff: 'Sur Off',
    voiceOn: 'Kren On',
    voiceOff: 'Sngap'
  },
  grt: {
    sectionBadge: '🎬 LIVE VIDEO REEL • 12 FEATURES',
    sectionTitle: 'ManasMitra AI-ni 12 Core Features',
    sectionSub: 'Jaapi kal·ani, Brain MRI scan, AI dakchakgipa aro emergency SOS-ko ia video-o nie changbo.',
    biophilicBadge: '🌱 GISING KANG·ANI DAKCHAKGIPA • BIOPHILIC CARE',
    biophilicTitle: 'Jringrot jakrang chongipa bipangko dal·atgita, ManasMitra budepani gisingko rakkia',
    biophilicSub: 'North East-ni 8 state-o budepa aro me·chikma-rangna namgipa digital therapeutic dakchakani.',
    biophilicQuote: '“Gising gimaodeba, ka·saaniko aro chanchianiko jringrot chel·chakgipa.”',
    scrollToExpand: 'Screen-ko dal·atna gita skrol ka·bo ↓',
    expandedNotice: 'Cinematic Screen Active',
    toggleSprout: '🌱 Bipang Niani',
    toggleTour: '🎬 12 Features',
    expandCanvas: 'Dal·atbo',
    collapseCanvas: 'Chon·atbo',
    openFullscreen: 'Gimik Video Niani (2 Min)',
    jumpToModule: 'Da·alo Nibo →',
    chimeOn: 'Sur On',
    chimeOff: 'Sur Off',
    voiceOn: 'Ku·rang On',
    voiceOff: 'Jrip'
  },
  mni: {
    sectionBadge: '🎬 সজীব ভিদিও রীল • ফিচর ১২',
    sectionTitle: 'মানসমিত্র AI গী অখন্নবা ফিচর ১২',
    sectionSub: 'জাপী মেমোরি শান্নবদগী ব্রেন MRI নৈনবা, AI শায়াহক অমসুং ইমার্জেন্সী SOS ফাওবা - সজীব এনিমেশনদা য়েংবিয়ু।',
    biophilicBadge: '🌱 নিংশিং মপাঙ্গল কনখৎহনবা • BIOPHILIC CARE',
    biophilicTitle: 'খুৎনা কুপ্না হৌগৎলকপা উমচা অমা য়োকখৎপগুম, মানসমিত্রনা অহনশিংগী নিংশিংবা কনখৎহল্লি',
    biophilicSub: 'অৱাং নোংপোক ভারতকী রাজ্য ৮ দা ডিমেনসিয়া নারবা অহনশিংগীদমক অখন্নবা ডিজিটাল লায়েং মফম।',
    biophilicQuote: '“নিংশিংবা মাংবা য়াই, অদুবু চান্ন-হোন্নবা অমসুং নুংশিবা মতম চুপ্পদা লৈহৌগনি।”',
    scrollToExpand: 'স্ক্রিন পাকথোকহনবগীদমক মখাদা স্ক্রোল তৌবিয়ু ↓',
    expandedNotice: 'সিনেমেটিক স্ক্রিন এক্তিব • ৬০ এফপিএস',
    toggleSprout: '🌱 উমচা য়েংবা',
    toggleTour: '🎬 ফিচর ১২ গ্য তুর',
    expandCanvas: 'স্ক্রিন পাকথোকহনবা',
    collapseCanvas: 'মচা ওইহনবা',
    openFullscreen: 'পুংফাবা ভিদিও তুর (মিনিত ২) হাংদোকউ',
    jumpToModule: 'হৌজিক শিজিন্নবিয়ু →',
    chimeOn: 'শৈরেং থানবা',
    chimeOff: 'শৈরেং লেপপা',
    voiceOn: 'খোন্থোক থানবা',
    voiceOff: 'তূমীনবা'
  },
  lus: {
    sectionBadge: '🎬 LIVE VIDEO REEL • FEATURE 12 TE',
    sectionTitle: 'ManasMitra AI Feature Pawimawh 12 Te',
    sectionSub: 'Jaapi hriatna game aṭanga brain MRI scan, 24x7 AI ṭanpuitu leh emergency SOS thlengin video hmangin han en teh.',
    biophilicBadge: '🌱 HRIATREUNA ENKAWLNA • NER CARE',
    biophilicTitle: 'Kutin thlai to hlim duat taka a kuah angin, ManasMitra chuan tar te hriatreuna a vawng ṭha',
    biophilicSub: 'North East state 8-a tar dementia vei te tana culture mil zela siam digital damdawi inenkawlna.',
    biophilicQuote: '“Hriatreuna chu a ral mai thei, mahse inhmangaihna leh nunhlun erawh a cham reng.”',
    scrollToExpand: 'Screen zauh turin scroll thla rawh ↓',
    expandedNotice: 'Cinematic Canvas Active',
    toggleSprout: '🌱 Thlai To Hlim Enna',
    toggleTour: '🎬 Feature 12 Te',
    expandCanvas: 'Zauh Rawh',
    collapseCanvas: 'Tite Rawh',
    openFullscreen: 'Video Tour Puitling (2 Min) Hawng Rawh',
    jumpToModule: 'Hman Chhin Rawh →',
    chimeOn: 'Aw Mawi On',
    chimeOff: 'Aw Mawi Off',
    voiceOn: 'Aw On',
    voiceOff: 'Aw Off'
  },
  naga: {
    sectionBadge: '🎬 LIVE VIDEO REEL • 12 FEATURES',
    sectionTitle: 'ManasMitra AI laga 12 Core Features',
    sectionSub: 'Jaapi brain games pora brain MRI scans, 24x7 AI Sahayak aru emergency SOS tak - animation video pora sabo pare.',
    biophilicBadge: '🌱 DIMAAG SAMBHALI BOLE • BIOPHILIC CARE',
    biophilicTitle: 'Jene haat pora chotu gach sapling ke morom pora dhori ase, ene ManasMitra dangor manu laga dimaag ke sambhale',
    biophilicSub: 'North East laga 8 states te budha manu laga dementia aru memory bemari karone digital ilaaj.',
    biophilicQuote: '“Memory pahori jabo pare, kintu morom aru culture sob somoi thakibo.”',
    scrollToExpand: 'Screen dangor koribo karone niche scroll koribi ↓',
    expandedNotice: 'Cinema Screen Chalu Ase • 60 FPS',
    toggleSprout: '🌱 Chotu Gach View',
    toggleTour: '🎬 12 Feature Tour',
    expandCanvas: 'Screen Dangor Koribi',
    collapseCanvas: 'Chotu Koribi',
    openFullscreen: 'Full Video Tour (2 Min) Kholibi',
    jumpToModule: 'Etu Feature Try Koribi →',
    chimeOn: 'Sound On',
    chimeOff: 'Sound Off',
    voiceOn: 'Voice On',
    voiceOff: 'Mute'
  },
  trp: {
    sectionBadge: '🎬 LIVE VIDEO REEL • 12 FEATURES',
    sectionTitle: 'ManasMitra AI-ni 12 Core Features',
    sectionSub: 'Jaapi memory kal·ani, brain MRI scan, AI hamkrai te emergency SOS - abo video animation bisingtwi nai di.',
    biophilicBadge: '🌱 KHAPANG GWRWNGNAI • BIOPHILIC CARE',
    biophilicTitle: 'Jekhai yak bai buphang bwsabo khobo, abohai ManasMitra bwsagwrog songni tongthok hamkraino rwgwi tongo',
    biophilicSub: 'North East 8 state-ni bwsagwrog songni dementia rog hamkraini bagwi digital platform.',
    biophilicQuote: '“Uansukmung kwma khano, thw kisa hamjakma te hoda kwma ya.”',
    scrollToExpand: 'Screen kwbwrung khlainani bagwi scroll khlaidi ↓',
    expandedNotice: 'Cinematic Canvas Active',
    toggleSprout: '🌱 Buphang Bwsa Nai Di',
    toggleTour: '🎬 12 Features',
    expandCanvas: 'Kwbwrung Khlaidi',
    collapseCanvas: 'Kisa Khlaidi',
    openFullscreen: 'Video Tour Pura (2 Min) Khuladi',
    jumpToModule: 'Tabuk Nai Di →',
    chimeOn: 'Sur On',
    chimeOff: 'Sur Off',
    voiceOn: 'Khorang On',
    voiceOff: 'Jrip'
  }
};

const WEBSITE_DETAILS = {
  en: {
    badge: '🌿 MANASMITRA AI • NORTH EAST COGNITIVE MISSION (MDoNER)',
    title: 'Culturally Rooted Digital Therapeutic Ecosystem for Dementia & Elder Longevity',
    subtitle: 'Connecting elders, family caregivers, and clinical neurologists across all 8 Northeastern states with 100% offline resilience and native dialects.',
    explorePortalsHeader: 'EXPLORE THE 3 CONNECTED MODULES OF MANASMITRA',
    portals: [
      {
        id: 'elder',
        tag: 'COGNITIVE THERAPY',
        tagColor: '#bef226',
        icon: '👴',
        title: 'Elder Neuro-Care & Memory Hub',
        desc: 'Therapeutic brain exercises & culturally localized stimulation designed for seniors.',
        features: [
          '7+ NE Neuro-Games: Assam Jaapi Memory, Birdsound Match, Daily Timeline & Crosswords',
          '24x7 Mitra Sahayak Multilingual Voice AI Companion (Speaks Native Dialects)',
          'Gentle Routine Orientation: Sunrise/Sunset visual cues & soothing voice prompts'
        ],
        actionLabel: 'Launch Elder Portal',
        actionType: 'elder'
      },
      {
        id: 'caregiver',
        tag: 'FAMILY NETWORK',
        tagColor: '#38bdf8',
        icon: '👨‍👩‍👧',
        title: 'Caregiver & Family Telemetry',
        desc: 'Real-time cognitive trajectory tracking, emergency distress alerts & family coordination.',
        features: [
          'Live Cognitive Trajectory, Sleep Trends & Daily Wellness Score graphs',
          'Automated Family SOS Missed Call System (Operates with Zero Internet)',
          'Medication Schedules, Wander-Risk Geofence & Emergency Broadcasts'
        ],
        actionLabel: 'Open Caregiver Portal',
        actionType: 'caregiver'
      },
      {
        id: 'clinical',
        tag: 'SPECIALIST CARE',
        tagColor: '#a7f3d0',
        icon: '👩‍⚕️',
        title: 'Clinical & Neurologist Network',
        desc: 'Clinical cognitive screening, diagnostic biomarker decoder & verified specialist tele-consults.',
        features: [
          'AI-Powered MMSE / MoCA Cognitive Screening & Brain MRI/CT scan visualizer',
          'Smart Prescription OCR Scanner with regional drug-safety checks',
          'Direct Tele-Consults with Verified Medindia Neurologists across NER'
        ],
        actionLabel: 'Consult Specialists',
        actionType: 'healthcare'
      }
    ],
    techHighlights: [
      { icon: '🌿', label: '8 NER States', sub: 'Assam to Sikkim' },
      { icon: '🌐', label: '11 Native Dialects', sub: 'Voice & text AI support' },
      { icon: '⚡', label: '100% Offline-First', sub: 'IndexedDB edge sync in hills' },
      { icon: '🚨', label: 'Automated SOS Call', sub: 'Instant family broadcast' },
      { icon: '🛡️', label: 'DPDP & ABDM Safe', sub: 'Encrypted privacy-first care' }
    ]
  },
  hi: {
    badge: '🌿 मानसमित्र एआई • उत्तर-पूर्व संज्ञानात्मक स्वास्थ्य मिशन (MDoNER)',
    title: 'डिमेंशिया व बुजुर्गों की स्मृति रक्षा हेतु सांस्कृतिक डिजिटल थैराप्यूटिक मंच',
    subtitle: '८ उत्तर-पूर्वी राज्यों के बुजुर्गों, परिवार के देखभालकर्ताओं और न्यूरोलॉजिस्ट विशेषज्ञों को १००% ऑफलाइन सहायता और क्षेत्रीय भाषाओं से जोड़ना।',
    explorePortalsHeader: 'मानसमित्र के ३ मुख्य इंटरैक्टिव पोर्टल्स देखें',
    portals: [
      {
        id: 'elder',
        tag: 'संज्ञानात्मक थैरेपी',
        tagColor: '#bef226',
        icon: '👴',
        title: 'बुजुर्ग न्यूरो-केयर एवं मेमोरी हब',
        desc: 'बुजुर्गों के लिए सांस्कृतिक रूप से अनुकूलित मस्तिष्क व्यायाम व सुखद अनुभव।',
        features: [
          '७+ सांस्कृतिक खेल: असम जापी मेमोरी, पक्षी ध्वनि पहचान, दैनिक टाइमलाइन व शब्द पहेली',
          '२४x७ मित्र सहायक बहुभाषी वॉयस एआई साथी (स्थानीय बोलियों में बात करे)',
          'सौम्य दैनिक रूटीन मार्गदर्शन: सूर्योदय/सूर्यास्त संकेत व सुखद ऑडियो रिमाइंडर'
        ],
        actionLabel: 'बुजुर्ग पोर्टल शुरू करें',
        actionType: 'elder'
      },
      {
        id: 'caregiver',
        tag: 'पारिवारिक नेटवर्क',
        tagColor: '#38bdf8',
        icon: '👨‍👩‍👧',
        title: 'केयरगिवर एवं फैमिली टेलीमेट्री',
        desc: 'स्मृति स्थिति का लाइव ट्रैकिंग ग्राफ, आपातकालीन अलर्ट एवं पारिवारिक समन्वय।',
        features: [
          'दैनिक संज्ञानात्मक स्वास्थ्य स्कोर, नींद व मनोदशा का लाइव ग्राफ',
          'स्वचालित फैमिली एसओएस मिस्ड कॉल सिस्टम (बिना इंटरनेट के भी सक्रिय)',
          'दवा समय सारिणी, भटकाव जोखिम एवं बहु-सदस्यीय फैमिली केयर सर्कल'
        ],
        actionLabel: 'केयरगिवर पोर्टल खोलें',
        actionType: 'caregiver'
      },
      {
        id: 'clinical',
        tag: 'विशेषज्ञ चिकित्सा',
        tagColor: '#a7f3d0',
        icon: '👩‍⚕️',
        title: 'क्लीनिकल एवं डॉक्टर नेटवर्क',
        desc: 'स्क्रीनिंग परीक्षण, एमआरआई रिपोर्ट विश्लेषण एवं प्रमाणित न्यूरोलॉजिस्ट परामर्श।',
        features: [
          'एआई आधारित MMSE / MoCA संज्ञानात्मक स्क्रीनिंग एवं मस्तिष्क MRI रिपोर्ट इंटरप्रेटर',
          'स्मार्ट प्रिस्क्रिप्शन ओसीआर स्कैनर व क्षेत्रीय दवा सुरक्षा जांच',
          'गुवाहाटी, शिलांग सहित NER के सत्यापित मेडइंडिया न्यूरोलॉजिस्ट से सीधा परामर्श'
        ],
        actionLabel: 'विशेषज्ञ परामर्श देखें',
        actionType: 'healthcare'
      }
    ],
    techHighlights: [
      { icon: '🌿', label: '८ पूर्वोत्तर राज्य', sub: 'असम, मेघालय, मणिपुर आदि' },
      { icon: '🌐', label: '११ देशी भाषाएं', sub: 'वॉयस व टेक्स्ट एआई' },
      { icon: '⚡', label: '१००% ऑफलाइन-सक्षम', sub: 'पहाड़ी क्षेत्रों में बिना रुकावट' },
      { icon: '🚨', label: 'ऑटोमेटेड SOS कॉल', sub: 'तत्काल पारिवारिक अलर्ट' },
      { icon: '🛡️', label: 'ABDM व DPDP सुरक्षित', sub: 'पूर्ण डेटा गोपनीयता' }
    ]
  },
  as: {
    badge: '🌿 মানস মিত্ৰ এআই • উত্তৰ-পূব স্মৃতি আৰু মানসিক যত্ন অভিযান (MDoNER)',
    title: 'উত্তৰ-পূবৰ জ্যেষ্ঠজনৰ ডিমেনচিয়া প্ৰতিৰোধৰ সাংস্কৃতিক ডিজিটেল চিকিৎসা মঞ্চ',
    subtitle: 'উত্তৰ-পূবৰ ৮ খন ৰাজ্যৰ জ্যেষ্ঠ নাগৰিক, পৰিয়ালৰ যত্ন লওঁতা আৰু বিশেষজ্ঞ চিকিৎসকক ১০০% অফলাইন আৰু স্থানীয় ভাষাৰে সংযোগ কৰে।',
    explorePortalsHeader: 'মানস মিত্ৰৰ ৩ টা প্ৰধান পৰ্টেল চাওক',
    portals: [
      {
        id: 'elder',
        tag: 'স্মৃতি সংৰক্ষণ',
        tagColor: '#bef226',
        icon: '👴',
        title: 'জ্যেষ্ঠজনৰ নিউৰো-কেয়াৰ পৰ্টেল',
        desc: 'জ্যেষ্ঠজনৰ স্মৃতি সজীৱ ৰাখিবলৈ সাংস্কৃতিক খেল আৰু মৰমীয়াল এআই সহায়িকা।',
        features: [
          '৭+ থলুৱা খেল: অসমীয়া জাপি মেমৰি, চৰাইৰ মাত চিনাক্তকৰণ, দৈনিক ৰুটিন আৰু শব্দ খেল',
          '২৪x৭ মিত্ৰ সহায়ক কণ্ঠ এআই সংগী (অসমীয়া আৰু থলুৱা উপভাষাত কথা কয়)',
          'নিয়মীয়া সময় নিৰ্ধাৰণ: সূৰ্যোদয়/সূৰ্যাস্তৰ সংকেত আৰু ঔষধি মনত পেলোৱাৰ ব্যৱস্থা'
        ],
        actionLabel: 'জ্যেষ্ঠ পৰ্টেল খোলক',
        actionType: 'elder'
      },
      {
        id: 'caregiver',
        tag: 'পৰিয়ালৰ সুৰক্ষা',
        tagColor: '#38bdf8',
        icon: '👨‍👩‍👧',
        title: 'কেয়াৰগিভাৰ আৰু পৰিয়াল নেটৱৰ্ক',
        desc: 'জ্যেষ্ঠজনৰ স্মৃতিৰ অগ্ৰগতি নিৰীক্ষণ, জৰুৰীকালীন সতৰ্কবাণী আৰু পৰিয়ালৰ যত্ন।',
        features: [
          'দৈনিক স্মৃতি স্বাস্থ্যৰ স্ক\'ৰ, টোপনি আৰু মনোভাৱৰ লাইভ গ্ৰাফ',
          'স্বয়ংক্ৰিয় পৰিয়াল এছঅ\'এছ মিছড কল ব্যৱস্থা (ইণ্টাৰনেট নোহোৱাকৈও কাম কৰে)',
          'ঔষধ খোৱাৰ তালিকা, পথ হেৰোৱা প্ৰতিৰোধ আৰু জৰুৰীকালীন সতৰ্কবাণী'
        ],
        actionLabel: 'কেয়াৰগিভাৰ পৰ্টেল খোলক',
        actionType: 'caregiver'
      },
      {
        id: 'clinical',
        tag: 'চিকিৎসক নেটৱৰ্ক',
        tagColor: '#a7f3d0',
        icon: '👩‍⚕️',
        title: 'ক্লিনিকেল আৰু বিশেষজ্ঞ পৰ্টেল',
        desc: 'এমএমএছই পৰীক্ষা, এমআৰআই স্কেন বিশ্লেষণ আৰু বিশেষজ্ঞ নিউৰোলজিস্টৰ পৰামৰ্শ।',
        features: [
          'এআই আধাৰিত MMSE / MoCA টেষ্ট আৰু মগজুৰ MRI স্কেন বিশ্লেষণ',
          'প্ৰেচক্ৰিপচন OCR স্কেনাৰ আৰু ঔষধি সুৰক্ষা নিৰীক্ষণ',
          'গুৱাহাটী, শ্বিলং আদিৰ অভিজ্ঞ মেডিণ্ডিয়া নিউৰোলজিস্টৰ সৈতে পৰামৰ্শ'
        ],
        actionLabel: 'বিশেষজ্ঞৰ পৰামৰ্শ লওক',
        actionType: 'healthcare'
      }
    ],
    techHighlights: [
      { icon: '🌿', label: '৮ খন উত্তৰ-পূব ৰাজ্য', sub: 'অসমৰ পৰা চিকিমলৈ' },
      { icon: '🌐', label: '১১ টা থলুৱা ভাষা', sub: 'কণ্ঠ আৰু পাঠ্য এআই' },
      { icon: '⚡', label: '১০০% অফলাইন সুবিধা', sub: 'দুৰ্গম পাহাৰতো চলিব' },
      { icon: '🚨', label: 'স্বয়ংক্ৰিয় এছঅ\'এছ কল', sub: 'তাৎক্ষণিক পৰিয়ালৰ সতৰ্কবাণী' },
      { icon: '🛡️', label: 'সম্পূৰ্ণ গোপনীয়তা', sub: 'DPDP আৰু ABDM সুৰক্ষিত' }
    ]
  },
  bn: {
    badge: '🌿 মানসমিত্র এআই • উত্তর-পূর্ব মেমোরি কেয়ার মিশন (MDoNER)',
    title: 'প্রবীণদের ডিমেনশিয়া প্রতিরোধ ও স্মৃতি সুরক্ষায় সাংস্কৃতিক ডিজিটাল থেরাপিউটিক মঞ্চ',
    subtitle: 'উত্তর-পূর্ব ভারতের ৮টি রাজ্যের প্রবীণ, পরিবারের সেবাদানকারী ও বিশেষজ্ঞ ডাক্তারদের ১০০% অফলাইন ও স্থানীয় ভাষায় সংযুক্ত করে।',
    explorePortalsHeader: 'মানসমিত্র প্ল্যাটফর্মের ৩টি মূল পোর্টাল দেখুন',
    portals: [
      {
        id: 'elder',
        tag: 'জ্ঞানীয় যত্ন',
        tagColor: '#bef226',
        icon: '👴',
        title: 'প্রবীণ নিউরো-কেয়ার ও মেমোরি হাব',
        desc: 'প্রবীণদের স্মৃতি পুনরুজ্জীবিত করতে সাংস্কৃতিক খেলাধুলা ও সহানুভূতিশীল ভয়েস এআই।',
        features: [
          '৭+ স্থানীয় খেলা: আসাম জাপি মেমরি, পাখির ডাক মেলানো, রুটিন টাইমলাইন ও শব্দ ধাঁধা',
          '২৪x৭ মিত্র সহায়ক বহুভাষিক ভয়েস এআই সঙ্গী (স্থানীয় ভাষায় কথা বলে)',
          'দৈনন্দিন রুটিন পরিচালনা: সূর্যোদয়/সূর্যাস্ত সংকেত ও নরম অডিও রিমাইন্ডার'
        ],
        actionLabel: 'প্রবীণ পোর্টাল খুলুন',
        actionType: 'elder'
      },
      {
        id: 'caregiver',
        tag: 'পারিবারিক নেটওয়ার্ক',
        tagColor: '#38bdf8',
        icon: '👨‍👩‍👧',
        title: 'কেয়ারগিভার ও ফ্যামিলি টেলিমেট্রি',
        desc: 'স্মৃতি স্বাস্থ্যের অগ্রগতি ট্র্যাকিং, জরুরি এসওএস সতর্কতা ও পারিবারিক যত্ন সমন্বয়।',
        features: [
          'দৈনিক জ্ঞানীয় স্বাস্থ্য স্কোর, ঘুম ও মেজাজের লাইভ ট্র্যাকিং গ্রাফ',
          'স্বয়ংক্রিয় ফ্যামিলি এসওএস মিসড কল সিস্টেম (ইন্টারনেট ছাড়াও কাজ করে)',
          'ওষুধের সময়সূচী, পথ হারানো প্রতিরোধ ও পরিবারের সকলের যৌথ সমন্বয়'
        ],
        actionLabel: 'কেয়ারগিভার পোর্টাল খুলুন',
        actionType: 'caregiver'
      },
      {
        id: 'clinical',
        tag: 'চিকিৎসক নেটওয়ার্ক',
        tagColor: '#a7f3d0',
        icon: '👩‍⚕️',
        title: 'ক্লিনিক্যাল ও বিশেষজ্ঞ ডাক্তার পোর্টাল',
        desc: 'ক্লিনিক্যাল স্ক্রিনিং, এমআরআই রিপোর্ট ইন্টারপ্রিটেশন ও বিশেষজ্ঞ নিউরোলজিস্ট পরামর্শ।',
        features: [
          'এআই চালিত MMSE / MoCA স্ক্রিনিং ও মস্তিষ্কের MRI স্ক্যান ইন্টারপ্রিটার',
          'স্মার্ট প্রেসক্রিপশন ওসিআর স্ক্যানার ও ওষুধের সুরক্ষা যাচাই',
          'গুয়াহাটি, শিলং সহ সমগ্র উত্তর-পূর্বের মেডইন্ডিয়া নিউরোলজিস্টদের সাথে পরামর্শ'
        ],
        actionLabel: 'বিশেষজ্ঞদের সাথে যোগাযোগ',
        actionType: 'healthcare'
      }
    ],
    techHighlights: [
      { icon: '🌿', label: '৮টি উত্তর-পূর্ব রাজ্য', sub: 'আসাম থেকে সিকিম' },
      { icon: '🌐', label: '১১টি আঞ্চলিক ভাষা', sub: 'ভয়েস ও টেক্সট এআই' },
      { icon: '⚡', label: '১০০% অফলাইন সমর্থন', sub: 'পাহাড়েও কার্যকর' },
      { icon: '🚨', label: 'অটোমেটেড এসওএস কল', sub: 'জরুরি মিসড কল অ্যালার্ট' },
      { icon: '🛡️', label: 'সম্পূর্ণ গোপনীয়তা', sub: 'DPDP ও ABDM সুরক্ষিত' }
    ]
  }
};

export default function ScrollingIntroShowcase({
  language = 'hi',
  onOpenFullscreenTour,
  onLaunchElderMode,
  onLaunchCaregiver,
  onLaunchHealthcare,
  onTriggerSos,
  onOpenDoctorReminder,
  onOpenAiHelp,
  onOpenFamilyMessage
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Paused by default so intro images/slides do not keep changing automatically
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState('next');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('sprout'); // Default to 21st.dev biophilic sprout scroll reveal animation

  const audioCtxRef = useRef(null);
  const reelScrollRef = useRef(null);
  const containerRef = useRef(null);

  const locSection = SECTION_LOCALES[language] || SECTION_LOCALES['en'];
  const currentWebsiteDetails = WEBSITE_DETAILS[language] || WEBSITE_DETAILS['en'];
  const chapter = INTRO_CHAPTERS[currentIdx] || INTRO_CHAPTERS[0];
  const activeLoc = getChapterLocalized(chapter, language);

  // 21st.dev Scroll Reveal Image scroll-driven progress observer
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          const rect = containerRef.current.getBoundingClientRect();
          const vh = window.innerHeight || document.documentElement.clientHeight;
          const startTrigger = vh * 0.95;
          const fullTrigger = vh * 0.28;
          const raw = (startTrigger - rect.top) / (startTrigger - fullTrigger);
          const clamped = Math.min(Math.max(raw, 0), 1);
          setScrollProgress(clamped);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const playHarmonicChime = () => {
    if (!chimeEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // AudioContext fallback
    }
  };

  const selectChapter = (newIdx, dir = 'next') => {
    setSlideDir(dir);
    setIsTransitioning(true);
    setCurrentIdx(newIdx);
    setProgress(0);
    playHarmonicChime();
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);

    // Smoothly scroll active chapter pill into view
    if (reelScrollRef.current) {
      const activeEl = reelScrollRef.current.children[newIdx];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Auto-progress ticker & voiceover
  useEffect(() => {
    let timerVoice = null;
    if (voiceEnabled && activeLoc?.narration) {
      const voiceLang = getSpeechVoiceLang(language);
      speechService.stop();
      timerVoice = setTimeout(() => {
        speechService.speak(activeLoc.narration, voiceLang);
      }, 350);
    }

    // Only auto-advance if user explicitly started playback, is in reel mode, and is not hovering over the card
    if (!isPlaying || activeViewMode !== 'reel' || isHovered) return;

    const chapterDurationMs = (chapter.duration || 9) * 1000;
    const intervalMs = 100;
    const stepIncrement = (intervalMs / chapterDurationMs) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIdx = (currentIdx + 1) % INTRO_CHAPTERS.length;
          selectChapter(nextIdx, 'next');
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      clearInterval(interval);
      if (timerVoice) clearTimeout(timerVoice);
      speechService.stop();
    };
  }, [currentIdx, isPlaying, activeViewMode, isHovered, voiceEnabled, chimeEnabled, language]);

  const handleActionClick = () => {
    if (chapter.targetRole === 'elder' && onLaunchElderMode) onLaunchElderMode();
    else if (chapter.targetRole === 'caregiver' && onLaunchCaregiver) onLaunchCaregiver();
    else if (chapter.targetRole === 'healthcare' && onLaunchHealthcare) onLaunchHealthcare();
    else if (chapter.targetAction === 'open_sos' && onTriggerSos) onTriggerSos();
    else if (chapter.targetAction === 'open_doctor_modal' && onOpenDoctorReminder) onOpenDoctorReminder();
    else if (chapter.targetAction === 'open_ai_help' && onOpenAiHelp) onOpenAiHelp();
    else if (chapter.targetAction === 'open_family_message' && onOpenFamilyMessage) onOpenFamilyMessage();
    else if (chapter.targetAction === 'restart_tour') selectChapter(0, 'prev');
    else if (onOpenFullscreenTour) onOpenFullscreenTour();
  };

  const elapsedSeconds = INTRO_CHAPTERS.slice(0, currentIdx).reduce((acc, c) => acc + (c.duration || 9), 0) +
    Math.floor((progress / 100) * (chapter.duration || 9));
  const totalSeconds = INTRO_CHAPTERS.reduce((acc, c) => acc + (c.duration || 9), 0);
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const effectiveProgress = isManuallyExpanded ? 1 : scrollProgress;
  const widthPercent = Math.round(72 + effectiveProgress * 28);
  const cardBorderRadius = Math.round(42 - effectiveProgress * 26);
  const cardScale = (0.92 + effectiveProgress * 0.08).toFixed(3);
  const imageScale = (1.20 - effectiveProgress * 0.16).toFixed(3);

  return (
    <section
      id="site-intro-reel"
      ref={containerRef}
      style={{
        padding: '3.5rem 1.25rem 4.5rem',
        maxWidth: '1440px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Section Header with Dual View Mode Selector */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(190, 242, 38, 0.15)',
          border: '1.5px solid rgba(190, 242, 38, 0.45)',
          color: '#052e26',
          padding: '0.35rem 1.1rem',
          borderRadius: '9999px',
          fontSize: '0.84rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          marginBottom: '0.75rem',
          boxShadow: '0 2px 12px rgba(190, 242, 38, 0.2)'
        }}>
          {activeViewMode === 'sprout' ? <Sprout size={16} color="#047857" /> : <Film size={15} color="#047857" />}
          <span>{activeViewMode === 'sprout' ? locSection.biophilicBadge : locSection.sectionBadge}</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(2rem, 3.8vw, 2.75rem)',
          fontWeight: 800,
          color: '#052e26',
          letterSpacing: '-0.03em',
          lineHeight: 1.18,
          marginBottom: '0.65rem'
        }}>
          {activeViewMode === 'sprout' ? locSection.biophilicTitle : locSection.sectionTitle}
        </h2>

        <p style={{
          fontSize: '1.05rem',
          color: '#33443b',
          maxWidth: '760px',
          margin: '0 auto 1.25rem',
          lineHeight: 1.58,
          fontWeight: 500
        }}>
          {activeViewMode === 'sprout' ? locSection.biophilicSub : locSection.sectionSub}
        </p>

        {/* View Mode Switcher Pill */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(5, 46, 38, 0.08)',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid rgba(5, 46, 38, 0.15)',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveViewMode('sprout')}
            style={{
              background: activeViewMode === 'sprout' ? '#052e26' : 'transparent',
              color: activeViewMode === 'sprout' ? '#bef226' : '#134e4a',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1.15rem',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activeViewMode === 'sprout' ? '0 2px 10px rgba(5, 46, 38, 0.25)' : 'none'
            }}
          >
            <Sprout size={14} />
            <span>{locSection.toggleSprout}</span>
          </button>

          <button
            onClick={() => setActiveViewMode('reel')}
            style={{
              background: activeViewMode === 'reel' ? '#052e26' : 'transparent',
              color: activeViewMode === 'reel' ? '#bef226' : '#134e4a',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.45rem 1.15rem',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: activeViewMode === 'reel' ? '0 2px 10px rgba(5, 46, 38, 0.25)' : 'none'
            }}
          >
            <Film size={14} />
            <span>{locSection.toggleTour}</span>
          </button>
        </div>
      </div>

      {/* 21st.dev Style Scroll Reveal Image Hero Container */}
      <div className="scroll-reveal-outer-wrap">
        <div
          className="scroll-reveal-viewport-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: `${widthPercent}%`,
            borderRadius: `${cardBorderRadius}px`,
            transform: `scale(${cardScale})`,
            boxShadow: `0 ${Math.round(18 + effectiveProgress * 24)}px ${Math.round(55 + effectiveProgress * 35)}px rgba(0, 0, 0, ${(0.45 + effectiveProgress * 0.25).toFixed(2)}), 0 0 ${Math.round(25 + effectiveProgress * 45)}px rgba(190, 242, 38, ${(0.15 + effectiveProgress * 0.25).toFixed(2)})`,
            border: `2px solid rgba(190, 242, 38, ${Math.min(0.35 + effectiveProgress * 0.45, 0.8).toFixed(2)})`,
            transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease'
          }}
        >
          {/* Background Sprout Image with Scroll Parallax Zoom */}
          <img
            src="/assets/intro_nurture_sprout.jpg"
            alt="Hands nurturing seedling sprout - ManasMitra Biophilic Cognitive Care"
            className="scroll-reveal-img-bg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://cdn.21st.dev/assets/mirror/c4/c48702475dc62d18bff61e34fb6b240e41d0e33808066607c819abc51c708de5.jpg';
            }}
            style={{
              transform: `scale(${imageScale})`,
              filter: activeViewMode === 'sprout' ? 'contrast(1.08) brightness(0.92)' : 'contrast(1.05) brightness(0.36) saturate(1.2)'
            }}
          />

          {/* Biophilic Dark Vignette Overlay */}
          <div
            className="scroll-reveal-vignette-overlay"
            style={{
              background: activeViewMode === 'sprout'
                ? 'linear-gradient(180deg, rgba(2, 18, 12, 0.72) 0%, rgba(2, 18, 12, 0.35) 45%, rgba(2, 18, 12, 0.88) 100%)'
                : 'linear-gradient(180deg, rgba(2, 18, 12, 0.88) 0%, rgba(2, 18, 12, 0.75) 40%, rgba(2, 18, 12, 0.94) 100%)'
            }}
          />

          {/* Top Cinema Stream Status Bar */}
          <div style={{
            position: 'relative',
            zIndex: 4,
            padding: '0.65rem 1.5rem',
            background: 'rgba(2, 14, 10, 0.88)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            backdropFilter: 'blur(8px)'
          }}>
            {/* Left: Live indicator & timecode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: isPlaying ? 'rgba(239, 68, 68, 0.15)' : 'rgba(190, 242, 38, 0.15)',
                  border: isPlaying ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(190, 242, 38, 0.4)',
                  color: isPlaying ? '#ef4444' : '#bef226',
                  borderRadius: '9999px',
                  padding: '3px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  fontSize: '0.76rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title={isPlaying ? 'Click to Pause' : 'Click to Play'}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isPlaying ? '#ef4444' : '#bef226',
                  boxShadow: isPlaying ? '0 0 8px #ef4444' : '0 0 8px #bef226',
                  animation: isPlaying ? 'pulseGlow 1s infinite' : 'none'
                }} />
                {isPlaying ? '● PLAYING REEL' : (activeViewMode === 'sprout' ? '🌱 BIOPHILIC CANVAS' : '▶ PAUSED (PLAY)')}
              </button>

              <span style={{
                color: '#cbd5e1',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                {formatTime(elapsedSeconds)} / {formatTime(totalSeconds)}
              </span>

              <span style={{
                background: 'rgba(190, 242, 38, 0.15)',
                color: '#bef226',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                border: '1px solid rgba(190, 242, 38, 0.3)'
              }}>
                1080p 60fps AI Stream
              </span>
            </div>

            {/* Right: Mode quick switcher & expand button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Canvas Expand / Compact Toggle */}
              <button
                onClick={() => setIsManuallyExpanded(!isManuallyExpanded)}
                style={{
                  background: isManuallyExpanded ? 'rgba(190, 242, 38, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: isManuallyExpanded ? '1px solid #bef226' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: isManuallyExpanded ? '#bef226' : '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                title={isManuallyExpanded ? locSection.collapseCanvas : locSection.expandCanvas}
              >
                {isManuallyExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                <span>{isManuallyExpanded ? locSection.collapseCanvas : locSection.expandCanvas}</span>
              </button>

              {/* Audio Spectrum Equalizer */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2.5px', height: '14px' }}>
                {[40, 75, 50, 95, 65, 85, 45, 90].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '3px',
                      height: `${isPlaying ? h : 20}%`,
                      background: isPlaying ? chapter.highlightColor : '#64748b',
                      borderRadius: '2px',
                      animation: isPlaying ? `eqBarPulse 0.55s infinite alternate ${i * 0.07}s` : 'none',
                      transition: 'height 0.2s'
                    }}
                  />
                ))}
              </div>

              {/* Expand to Fullscreen Tour Modal Button */}
              <button
                onClick={onOpenFullscreenTour}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                title={locSection.openFullscreen}
              >
                <Maximize2 size={13} />
                <span>{locSection.openFullscreen}</span>
              </button>
            </div>
          </div>

          {/* Viewport Stage: Dual Mode (Sprout Awakening vs 12-Chapter Reel) */}
          {activeViewMode === 'sprout' ? (
            /* Mode 1: Biophilic Sprout Stage with Comprehensive Website Details */
            <div style={{
              position: 'relative',
              width: '100%',
              minHeight: '560px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.4rem 1.25rem 2rem',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              {/* Sprout Breathing Glow Aura */}
              <div style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: '#bef226',
                filter: 'blur(150px)',
                opacity: 0.16,
                pointerEvents: 'none'
              }} />

              <div style={{ position: 'relative', zIndex: 3, maxWidth: '1140px', width: '100%' }}>
                {/* Platform Mission Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(5, 46, 38, 0.9)',
                  border: '1.5px solid #bef226',
                  color: '#bef226',
                  padding: '0.42rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  marginBottom: '0.85rem',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 0 25px rgba(190, 242, 38, 0.35)',
                  animation: 'sproutBreathe 3s ease-in-out infinite'
                }}>
                  <Sprout size={16} />
                  <span>{currentWebsiteDetails.badge}</span>
                </div>

                {/* Main Headline */}
                <h3 style={{
                  fontSize: 'clamp(1.55rem, 3.2vw, 2.35rem)',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.22,
                  marginBottom: '0.65rem',
                  textShadow: '0 3px 16px rgba(0,0,0,0.92)'
                }}>
                  {currentWebsiteDetails.title}
                </h3>

                {/* Platform Mission Subtitle */}
                <p style={{
                  fontSize: '1rem',
                  color: '#e2e8f0',
                  margin: '0 auto 1.35rem',
                  maxWidth: '820px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  fontWeight: 500,
                  lineHeight: 1.55
                }}>
                  {currentWebsiteDetails.subtitle}
                </p>

                {/* 5 Core Platform Feature Badges */}
                <div style={{
                  display: 'flex',
                  gap: '0.55rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginBottom: '1.6rem'
                }}>
                  {currentWebsiteDetails.techHighlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(2, 20, 14, 0.78)',
                        border: '1px solid rgba(190, 242, 38, 0.35)',
                        borderRadius: '9999px',
                        padding: '0.38rem 0.95rem',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                      }}
                    >
                      <span style={{ fontSize: '0.95rem' }}>{h.icon}</span>
                      <span style={{ color: '#bef226' }}>{h.label}</span>
                      <span style={{ opacity: 0.7, fontSize: '0.72rem', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '0.4rem' }}>{h.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Section Header: The 3 Connected Modules of the Website */}
                <div style={{
                  fontSize: '0.76rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#bef226',
                  textTransform: 'uppercase',
                  marginBottom: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem'
                }}>
                  <span style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, transparent, #bef226)' }} />
                  <span>{currentWebsiteDetails.explorePortalsHeader}</span>
                  <span style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, #bef226, transparent)' }} />
                </div>

                {/* 3 Interactive Portal Cards Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.1rem',
                  marginBottom: '1.8rem',
                  textAlign: 'left'
                }}>
                  {currentWebsiteDetails.portals.map((portal) => (
                    <div
                      key={portal.id}
                      className="portal-showcase-card"
                      style={{
                        background: 'rgba(2, 22, 16, 0.84)',
                        border: '1.5px solid rgba(190, 242, 38, 0.28)',
                        borderRadius: '18px',
                        padding: '1.3rem 1.2rem',
                        backdropFilter: 'blur(14px)',
                        boxShadow: '0 10px 32px rgba(0, 0, 0, 0.55)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Top Accent Gradient Line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${portal.tagColor}, transparent)`
                      }} />

                      <div>
                        {/* Header: Tag + Icon */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <span style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: `1px solid ${portal.tagColor}55`,
                            color: portal.tagColor,
                            borderRadius: '9999px',
                            padding: '0.2rem 0.65rem',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em'
                          }}>
                            {portal.tag}
                          </span>
                          <span style={{ fontSize: '1.45rem' }}>{portal.icon}</span>
                        </div>

                        {/* Title */}
                        <h4 style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: '#ffffff',
                          marginBottom: '0.4rem',
                          lineHeight: 1.3
                        }}>
                          {portal.title}
                        </h4>

                        {/* Description */}
                        <p style={{
                          fontSize: '0.82rem',
                          color: '#94a3b8',
                          lineHeight: 1.48,
                          marginBottom: '0.95rem',
                          fontWeight: 500
                        }}>
                          {portal.desc}
                        </p>

                        {/* Feature Bullet Points */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.25rem' }}>
                          {portal.features.map((feat, fIdx) => (
                            <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                              <CheckCircle2 size={13} color={portal.tagColor} style={{ flexShrink: 0, marginTop: '3px' }} />
                              <span style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45, fontWeight: 500 }}>
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Direct 1-Click Action CTA Button */}
                      <button
                        onClick={() => {
                          if (portal.actionType === 'elder') onLaunchElderMode?.();
                          else if (portal.actionType === 'caregiver') onLaunchCaregiver?.();
                          else if (portal.actionType === 'healthcare') onLaunchHealthcare?.();
                        }}
                        className="portal-card-btn"
                        style={{
                          width: '100%',
                          background: portal.tagColor === '#bef226'
                            ? '#bef226'
                            : (portal.tagColor === '#38bdf8' ? '#0284c7' : '#059669'),
                          color: portal.tagColor === '#bef226' ? '#052e26' : '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '0.65rem 1rem',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.45rem',
                          boxShadow: `0 4px 18px ${portal.tagColor}44`
                        }}
                      >
                        <span>{portal.actionLabel}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bottom Cinema Controls & Navigation Bar */}
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  background: 'rgba(2, 18, 13, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '9999px',
                  padding: '0.55rem 1.25rem',
                  backdropFilter: 'blur(10px)',
                  maxWidth: 'fit-content',
                  margin: '0 auto'
                }}>
                  <button
                    onClick={() => {
                      setActiveViewMode('reel');
                      playHarmonicChime();
                    }}
                    style={{
                      background: '#bef226',
                      color: '#052e26',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '0.55rem 1.3rem',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 15px rgba(190, 242, 38, 0.4)'
                    }}
                  >
                    <Film size={15} />
                    <span>{locSection.toggleTour} →</span>
                  </button>

                  <button
                    onClick={onOpenFullscreenTour}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '9999px',
                      padding: '0.55rem 1.2rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Play size={14} />
                    <span>{locSection.openFullscreen}</span>
                  </button>

                  <button
                    onClick={() => {
                      setChimeEnabled(!chimeEnabled);
                      if (!chimeEnabled) playHarmonicChime();
                    }}
                    style={{
                      background: chimeEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: chimeEnabled ? '#38bdf8' : '#cbd5e1',
                      border: chimeEnabled ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '9999px',
                      padding: '0.55rem 1.1rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Music size={14} />
                    <span>{chimeEnabled ? locSection.chimeOff : locSection.chimeOn}</span>
                  </button>

                  {onTriggerSos && (
                    <button
                      onClick={onTriggerSos}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239, 68, 68, 0.45)',
                        borderRadius: '9999px',
                        padding: '0.55rem 1.1rem',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      title="Test Automated Emergency SOS Telephony"
                    >
                      <PhoneCall size={13} color="#ef4444" />
                      <span>SOS Emergency</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: 16:9 Viewport Stage with Dynamic Chapter Animations */
            <div style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              minHeight: '340px',
              maxHeight: '440px',
              background: 'radial-gradient(ellipse at 50% 45%, rgba(8, 45, 36, 0.85) 0%, rgba(3, 19, 14, 0.94) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.75rem',
              overflow: 'hidden'
            }}>
              {/* Ambient Glowing Aura */}
              <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: chapter.highlightColor,
                filter: 'blur(120px)',
                opacity: 0.16,
                pointerEvents: 'none',
                transition: 'background 0.5s ease'
              }} />

          {/* Dynamic Scene Stage with Slide Transitions */}
          <div
            key={`${chapter.id}-${language}`}
            style={{
              position: 'relative',
              zIndex: 3,
              textAlign: 'center',
              maxWidth: '720px',
              width: '100%',
              animation: isTransitioning
                ? (slideDir === 'next' ? 'slideOutLeft 0.38s ease forwards' : 'slideOutRight 0.38s ease forwards')
                : (slideDir === 'next' ? 'slideInRight 0.45s cubic-bezier(0.16, 1, 0.3, 1)' : 'slideInLeft 0.45s cubic-bezier(0.16, 1, 0.3, 1)')
            }}
          >
            {/* Custom Scene Visualizer Stage */}
            <div style={{
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              {/* 1. Overview */}
              {chapter.visualKey === 'overview' && (
                <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px dashed rgba(190, 242, 38, 0.45)',
                    animation: 'spinSlow 12s linear infinite'
                  }} />
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #bef226 0%, #052e26 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 25px rgba(190, 242, 38, 0.5)'
                  }}>
                    <Languages size={30} color="#ffffff" />
                  </div>
                </div>
              )}

              {/* 2. Elder Mode */}
              {chapter.visualKey === 'elder_mode' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.18)',
                    border: '2px solid #10b981',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    animation: 'floatSlow 2.5s ease-in-out infinite',
                    boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)'
                  }}>
                    <span style={{ fontSize: '1.8rem' }}>👒</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>অসম জাপি / Jaapi Memory</div>
                      <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Cultural Cognitive Play</div>
                    </div>
                  </div>
                  <div style={{
                    background: 'rgba(56, 189, 248, 0.2)',
                    border: '2px solid #38bdf8',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'pulseGlow 1.8s infinite'
                  }}>
                    <Droplet size={24} color="#38bdf8" />
                  </div>
                </div>
              )}

              {/* 3. Caregiver */}
              {chapter.visualKey === 'family_caregiver' && (
                <div style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)'
                }}>
                  <Activity size={32} color="#38bdf8" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>Daily Emotion Telemetry</div>
                    <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '20px', marginTop: '3px' }}>
                      {[40, 70, 55, 90, 85, 95].map((h, i) => (
                        <div
                          key={i}
                          style={{
                            width: '7px',
                            height: `${h}%`,
                            background: '#38bdf8',
                            borderRadius: '2px',
                            animation: `eqBarPulse 0.6s infinite alternate ${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <CheckCircle2 size={22} color="#10b981" />
                </div>
              )}

              {/* 4. Healthcare Portal */}
              {chapter.visualKey === 'healthcare_portal' && (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.14)',
                  border: '1.5px solid #f43f5e',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 30px rgba(244, 63, 94, 0.3)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: '#f43f5e',
                    boxShadow: '0 0 15px #f43f5e',
                    animation: 'scanLaser 2s linear infinite'
                  }} />
                  <Brain size={36} color="#f43f5e" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f43f5e' }}>Brain MRI AI Risk Analysis</div>
                    <div style={{ fontSize: '0.72rem', color: '#e2e8f0', display: 'flex', gap: '0.4rem', marginTop: '2px' }}>
                      <span style={{ background: 'rgba(244, 63, 94, 0.3)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>MMSE 28/30</span>
                      <span style={{ color: '#86efac', fontWeight: 700 }}>Optimal</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Online Status */}
              {chapter.visualKey === 'online_status' && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '2px solid #22c55e',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  boxShadow: '0 0 25px rgba(34, 197, 94, 0.35)'
                }}>
                  <Wifi size={28} color="#22c55e" style={{ animation: 'pulseGlow 1.5s infinite' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#22c55e' }}>Offline-First Auto Sync</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>IndexedDB Encrypted Local Storage</div>
                  </div>
                </div>
              )}

              {/* 6. Profile & SOS */}
              {chapter.visualKey === 'profile_sos' && (
                <div style={{
                  background: 'rgba(167, 139, 250, 0.15)',
                  border: '2px solid #a78bfa',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 0 25px rgba(167, 139, 250, 0.35)'
                }}>
                  <User size={32} color="#a78bfa" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#a78bfa' }}>Elder Profile & ASHA Links</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Emergency SOS Contacts</div>
                  </div>
                  <Shield size={22} color="#bef226" />
                </div>
              )}

              {/* 7. Video Tour */}
              {chapter.visualKey === 'video_tour' && (
                <div style={{
                  background: 'rgba(251, 191, 36, 0.14)',
                  border: '2px solid #fbbf24',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 0 30px rgba(251, 191, 36, 0.3)'
                }}>
                  <Film size={32} color="#fbbf24" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fbbf24' }}>C5-E5-G5-C6 Celestial Chimes</div>
                    <div style={{ fontSize: '0.7rem', color: '#e2e8f0' }}>Harmonic Chord Progression</div>
                  </div>
                </div>
              )}

              {/* 8. AI Sahayak */}
              {chapter.visualKey === 'ai_sahayak' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'rgba(190, 242, 38, 0.15)',
                    border: '2px solid #bef226',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 25px rgba(190, 242, 38, 0.4)'
                  }}>
                    <AiSahayakLogo size="sm" isSpeaking={true} />
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '6px 12px',
                    textAlign: 'left',
                    border: '1px solid rgba(190, 242, 38, 0.3)'
                  }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#bef226' }}>24x7 AI Sahayak Assistant</div>
                    <div style={{ fontSize: '0.7rem', color: '#e2e8f0' }}>Dual Voices (Trisha & Rahul)</div>
                  </div>
                </div>
              )}

              {/* 9. Doctor Medindia */}
              {chapter.visualKey === 'doctor_medindia' && (
                <div style={{
                  background: 'rgba(14, 165, 233, 0.15)',
                  border: '2px solid #0ea5e9',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 0 30px rgba(14, 165, 233, 0.35)'
                }}>
                  <Stethoscope size={32} color="#0ea5e9" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0ea5e9' }}>Medindia Verified Doctors</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Appointment Reminders</div>
                  </div>
                </div>
              )}

              {/* 10. Family Message */}
              {chapter.visualKey === 'family_message' && (
                <div style={{
                  background: 'rgba(251, 146, 60, 0.15)',
                  border: '2px solid #fb923c',
                  borderRadius: '20px',
                  padding: '8px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  boxShadow: '0 0 30px rgba(251, 146, 60, 0.35)'
                }}>
                  <MessageSquare size={30} color="#fb923c" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fb923c' }}>Live Family SMS & WhatsApp</div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Voice-to-Text Instant Transmission</div>
                  </div>
                  <Send size={18} color="#bef226" />
                </div>
              )}

              {/* 11. Emergency SOS */}
              {chapter.visualKey === 'emergency_sos' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '2px solid #ef4444',
                  borderRadius: '20px',
                  padding: '8px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  animation: 'pulseGlow 1.2s infinite',
                  boxShadow: '0 0 35px rgba(239, 68, 68, 0.5)'
                }}>
                  <PhoneCall size={32} color="#ef4444" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 900, color: '#f87171' }}>🚨 Emergency Lifeline (SOS)</div>
                    <div style={{ fontSize: '0.72rem', color: '#ffffff' }}>Auto Missed Call + Live GPS SMS</div>
                  </div>
                </div>
              )}

              {/* 12. Multilingual */}
              {chapter.visualKey === 'multilingual' && (
                <div style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '2px solid #34d399',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Languages size={16} />
                    <span>11 Native Languages Supported</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['हिन्दी', 'অসমীয়া', 'বাংলা', 'Bodo', 'Khasi', 'Garo', 'মৈতৈলোন্', 'Mizo', 'English', 'Nagamese', 'Kokborok'].map((l, i) => (
                      <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Headline (Localized) */}
            <h3 style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 0.5rem 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.7)'
            }}>
              {activeLoc.title}
            </h3>

            {/* Narration Script Banner (Localized) */}
            <p style={{
              fontSize: '0.94rem',
              lineHeight: 1.55,
              color: '#e2e8f0',
              margin: '0 auto 1.2rem auto',
              background: 'rgba(0, 0, 0, 0.58)',
              padding: '0.65rem 1.2rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              maxWidth: '650px'
            }}>
              {activeLoc.narration}
            </p>

            {/* CTA Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleActionClick}
                style={{
                  background: chapter.highlightColor,
                  color: '#052e26',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.6rem 1.35rem',
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: `0 4px 18px ${chapter.highlightColor}55`,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                title={locSection.jumpToModule}
              >
                <span>{activeLoc.actionText}</span>
                <ExternalLink size={14} />
              </button>

              <button
                onClick={onOpenFullscreenTour}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '9999px',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s'
                }}
              >
                <span>▶ {locSection.openFullscreen}</span>
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Bottom Cinema Controls & Timeline Scrubber Bar */}
        <div style={{
          padding: '0.75rem 1.5rem 0.65rem',
          background: 'rgba(3, 17, 13, 0.96)'
        }}>
          {/* Segmented 12-Chapter Progress Bar */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.65rem' }}>
            {INTRO_CHAPTERS.map((ch, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div
                  key={ch.id}
                  onClick={() => selectChapter(idx, idx > currentIdx ? 'next' : 'prev')}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '9999px',
                    background: isPast
                      ? '#bef226'
                      : isCurrent
                      ? '#10b981'
                      : 'rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                  title={`Chapter ${idx + 1}: ${getChapterLocalized(ch, language).badge}`}
                >
                  {isCurrent && (
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: '#bef226',
                      transition: 'width 0.1s linear'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Transport Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {/* Playback Transport buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => selectChapter(Math.max(0, currentIdx - 1), 'prev')}
                disabled={currentIdx === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: currentIdx === 0 ? '#475569' : '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Previous Module"
              >
                <SkipBack size={15} />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: '#bef226',
                  color: '#052e26',
                  border: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  boxShadow: '0 0 14px rgba(190, 242, 38, 0.4)'
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={() => selectChapter((currentIdx + 1) % INTRO_CHAPTERS.length, 'next')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Next Module"
              >
                <SkipForward size={15} />
              </button>

              <button
                onClick={() => selectChapter(0, 'prev')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.76rem'
                }}
                title="Replay from Beginning"
              >
                <RotateCcw size={13} />
                <span>Replay</span>
              </button>
            </div>

            {/* Audio & Voice Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setChimeEnabled(!chimeEnabled);
                  if (!chimeEnabled) playHarmonicChime();
                }}
                style={{
                  background: chimeEnabled ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  border: chimeEnabled ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: chimeEnabled ? '#38bdf8' : '#94a3b8',
                  borderRadius: '9999px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title="Toggle Celestial Chord Chimes (C5-E5-G5-C6)"
              >
                <Music size={12} />
                <span>{chimeEnabled ? locSection.chimeOn : locSection.chimeOff}</span>
              </button>

              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  if (voiceEnabled) speechService.stop();
                }}
                style={{
                  background: voiceEnabled ? 'rgba(190, 242, 38, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                  border: voiceEnabled ? '1px solid #bef226' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: voiceEnabled ? '#bef226' : '#94a3b8',
                  borderRadius: '9999px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                title="Toggle Spoken Voiceover"
              >
                {voiceEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
                <span>{voiceEnabled ? locSection.voiceOn : locSection.voiceOff}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Scroll-Reveal Progress Indicator Pill */}
        <div
          className="scroll-reveal-indicator-pill"
          style={{
            borderColor: effectiveProgress >= 0.82 ? '#bef226' : 'rgba(190, 242, 38, 0.45)',
            color: effectiveProgress >= 0.82 ? '#bef226' : '#ffffff'
          }}
        >
          {effectiveProgress < 0.82 ? `↓ ${locSection.scrollToExpand}` : `● ${locSection.expandedNotice}`}
        </div>
      </div>
      </div>

      {/* Horizontal Film Strip Chapter Track (Scrollable 12 Chapters) */}
      <div
        ref={reelScrollRef}
        style={{
          display: 'flex',
          gap: '0.65rem',
          overflowX: 'auto',
          paddingTop: '1.5rem',
          paddingBottom: '0.9rem',
          marginTop: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {INTRO_CHAPTERS.map((ch, idx) => {
          const isActive = idx === currentIdx;
          const chLoc = getChapterLocalized(ch, language);
          return (
            <button
              key={ch.id}
              onClick={() => {
                setActiveViewMode('reel');
                selectChapter(idx, idx > currentIdx ? 'next' : 'prev');
              }}
              style={{
                flexShrink: 0,
                background: isActive ? '#052e26' : '#ffffff',
                color: isActive ? '#bef226' : '#1e293b',
                border: isActive ? `2px solid ${ch.highlightColor}` : '1.5px solid #e2e8f0',
                borderRadius: '16px',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                cursor: 'pointer',
                boxShadow: isActive ? `0 6px 20px ${ch.highlightColor}44` : '0 2px 8px rgba(0,0,0,0.04)',
                transform: isActive ? 'translateY(-2px)' : 'none',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              title={chLoc.title}
            >
              <span style={{ fontSize: '1.15rem' }}>{ch.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  opacity: 0.8,
                  color: isActive ? ch.highlightColor : '#64748b'
                }}>
                  CH {idx + 1}
                </div>
                <div style={{
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}>
                  {chLoc.badge}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
