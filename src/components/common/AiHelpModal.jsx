import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { speechService, adaptSpeechPronunciation, stripEmojis } from '../../services/speechService';
import AiSahayakLogo from './AiSahayakLogo';

// Multilingual AI Knowledge Base for all 11 Pan-India & North Eastern Languages (No Emojis)
const AI_KNOWLEDGE = {
  // 1. DEMENTIA & MEMORY CARE SIGNS
  dementia_signs: {
    keywords: ['लक्षण', 'symptom', 'sign', 'dementia', 'alzheimer', 'भूलना', 'स्मृति', 'পাহৰা', 'ভুলে', 'बावगारनाय', 'klet', 'gualani', 'কাউবা', 'theihnghilh', 'pahori'],
    hi: `डिमेंशिया व अल्जाइमर के प्रारंभिक लक्षण:
1. हालिया घटनाओं को भूलना: कुछ मिनट पहले की बात भूल जाना जबकि पुरानी बातें याद रहना।
2. रोजमर्रा के कार्यों में कठिनाई: चाय बनाना, दवाइयां लेना या चाबी-पैसे संभालना भूलना।
3. समय व स्थान का भ्रम: अपने ही मोहल्ले या घर में दिशा भूल जाना।
4. भाषा व नाम भूलना: परिचित परिजनों या वस्तुओं के सामान्य नाम याद न आना।
5. मूड व व्यवहार में बदलाव: शाम के समय अचानक बेचैनी (सनडाउनिंग) या चिड़चिड़ापन।

सलाह: यदि ये लक्षण 6 महीने से अधिक समय से दिख रहे हैं, तो तुरंत कॉग्निटिव न्यूरोलॉजिस्ट से परामर्श लें।`,
    en: `Early Signs of Dementia and Alzheimer's:
1. Recent Memory Loss: Forgetting recent conversations while recalling distant past events.
2. Difficulty with Familiar Tasks: Struggling with daily routines like cooking, taking medications, or handling money.
3. Disorientation in Time and Space: Losing track of dates, seasons, or familiar neighborhood routes.
4. Word-Finding Challenges: Forgetting names of common household objects or close relatives.
5. Mood and Behavioral Shifts: Increased agitation or confusion during late afternoon and evening.

Guidance: If symptoms persist for over 6 months, schedule an evaluation with a certified cognitive neurologist.`,
    as: `ডিমেঞ্চিয়া আৰু এলঝেইমাৰৰ প্ৰাথমিক লক্ষণসমূহ:
১. শেহতীয়া কথা পাহৰি যোৱা: অলপ সময় আগৰ কথা পাহৰি যোৱা কিন্তু পুৰণি কথা মনত থকা।
২. দৈনন্দিন কামত অসুবিধা: চাহ বনোৱা, নিয়মীয়াকৈ ঔষধ খোৱা বা ধন-টকা চম্ভালিব নোৱাৰা।
৩. সময় আৰু স্থানৰ বিভ্ৰান্তি: নিজৰ চিনাকি বাট-পথ বা ঘৰত দিশ হেৰুৱাই পেলোৱা।
৪. ভাষা আৰু নাম পাহৰা: চিনাকি আত্মীয় বা ঘৰুৱা বস্তুৰ সাধাৰণ নাম মনত নপৰা।
৫. মন আৰু আচৰণৰ পৰিৱৰ্তন: আবেলি বা গধূলি সময়ত অস্বস্তি বা খং উঠা।

পৰামৰ্শ: এই লক্ষণসমূহ ৬ মাহৰ অধিক সময় থাকিলে স্নায়ুৰোগ বিশেষজ্ঞৰ পৰামৰ্শ লওক।`,
    bn: `ডিমেনশিয়া ও অ্যালঝাইমারের প্রাথমিক লক্ষণসমূহ:
১. সাম্প্রতিক ঘটনা ভুলে যাওয়া: কিছুক্ষণ আগের কথা ভুলে গেলেও পুরোনো স্মৃতি স্পষ্ট থাকা।
২. দৈনন্দিন কাজে অসুবিধা: রান্না করা, নিয়মিত ওষুধ খাওয়া বা টাকা পয়সা সামলাতে সমস্যা হওয়া।
৩. সময় ও স্থানের বিভ্রান্তি: পরিচিত রাস্তা বা নিজের এলাকাতেই পথ হারিয়ে ফেলা।
৪. ভাষা ও নাম ভুলে যাওয়া: পরিচিত পরিজন বা নিত্যব্যবহার্য জিনিসের নাম মনে করতে না পারা।
৫. মেজাজ ও আচরণের পরিবর্তন: বিকেল বা সন্ধ্যার দিকে অস্থিরতা বেড়ে যাওয়া।

পরামর্শ: এই লক্ষণগুলো ৬ মাসের বেশি স্থায়ী হলে দ্রুত কগনিটিভ নিউরোলজিস্টের পরামর্শ নিন।`,
    brx: `दिमेन्सिया आरो एलजाइमारनि गिबि दिन्थि:
१. बावैसोनि जाथायखौ बावगारनाय: एसेल' समनि सिगांनि बाथ्राखौ बावगारनाय नाथाय गोजावनि बाथ्राखौ गोसोखांनाय।
२. सानफ्रोमबोनि खामानि मावनायाव जेंना: सा बानायनाय, मुलि जानाय एबा रां-रुफा सामलायनायाव गोरोन्थि जानाय।
३. सम आरो जायगानि गोरोन्थि: गावनि गामि एबा न'नि लामाखौनो बावगारनाय।
४. राव आरो मुं बावनाय: सोमोन्दो गोनां सुबुं एबा न'नि मुवाफोरनि मुंखौ गोसो खांनो हायै जानाय।
५. आखल आरो बिहेवियाराव सोलायनाय: बेलासिनि समाव दावराव-दावसि जानाय।

सुबुरुन: बेफोरबादि दिन्थिया ६ दाना बासिनो थायोब्ला डाक्टरनो दिन्थिनांगौ।`,
    kha: `Ki Dak kiba Nyngkong jong ka Jingtlot ka Jingmut (Dementia & Alzheimer's):
1. Klet ia kiei kiei kiba dang shu jia: Klet kloi ia ki jingiakren hynrei kynmaw pat ia ki por mynshwa.
2. Shem jingeh ha ki kam ba man ka sngi: Leh shitom ban shet ja, dih dawai thik ha ka por, lane khein pisa.
3. Jah lynti ha ka por bad ka jaka: Jah lynti wat ha ki shnong lajong lane ha jan iing.
4. Klet ia ki kyrteng: Klet ia ki kyrteng jong ki briew kiba jan lane ki tiar ba pyndonkam man ka sngi.
5. Kylla ka rukom long: Bitar kloi lane sngew khuslai palat ha ki por janmiet.

Jingsneng: Lada kine ki dak ki sah palat 6 bnai, leit iakynduh kloi ia u doktor neurologist.`,
    grt: `Dementia aro Alzheimer-ni A·bachenggipa Chinrang:
1. Da·ororoni kamrangko gualani: Ru·utgijani agangiminrangko gualahaoba, gitcham salrangkoba gisik ra·kuani.
2. Salantinni kamrangko dakna neng·nikani: Cha·ringani, sam ringani ba tangka-paisako hisap ka·na neng·nikani.
3. Somoi aro biapko gualani: An·tangni song ba dongchakgipa biapchinaba rama gualani.
4. Kattarang aro bimingrangko gualani: Nokgiparangni ba songdonggiparangni bimingko gisik ra·na amgijani.
5. Kakketgijagipa cholon: Attamchinchi jajaani aro ka·onangani baridapani.

Ku·pattiani: Iandakgipa chinrang ja 6-na batte donggenchimode, cognitive neurologist baksa grongbo.`,
    mni: `দিমেন্সিয়া অমসুং অলঝাইমরগী অহানবা মশকশিং:
১. হন্দক থোকখিবা থৌদোকশিং কাউবা: খরগী মমাংদা ফোংদোকখিবা ৱাফম কাউবা অদুবু অরিবা ৱাফমশিং নিংশিংবা।
২. নোংমগী থবকশিং তৌবদা অৱাবা থোকপা: চেহ শেম্বা, মতম চানা হিদাক চাবা নত্রগা শেল-থুম শেম্বদা খুদোংচাদবা।
৩. মতম অমসুং মফম খঙদবা: মশাগী লম্বী নত্রগা য়ুমদসু লম্বী মাঙবা।
৪. ৱাহৈ অমসুং মিং কাউবা: চনবা মীওইশিংগী মিং নত্রগা পোৎলমগী মিং নিংশিংবা ঙমদবা।
৫. ৱাখল অমসুং মশক হোংদোকপা: নুমিৎ তাথরকপদা অৱাবা নত্রগা শাউবা হেনগৎলকপা।

পাউতাক: মসিগী মশকশিং অসি থা ৬ দগী হেন্না লৈরবদি নিউরোলজিস্তকা তান্নবীয়ু।`,
    lus: `Hriatna Hloh (Dementia & Alzheimer's) Hriattirna Hmasate:
1. Thil thleng hnai theihnghilh: Thil thleng zo chiah theihnghilh nghal zung zung, mahse thil hlui erawh hriat reng si.
2. Nitin khawsaknaa harsatna: Chaw chhum, damdawi ei hun theihnghilh, leh pawisa chhiar thiam loh.
3. Hmun leh hun hriat pawlh: Mahni chenna vengah pawh kalkawng bo.
4. Hming leh tawngkam theihnghilh: Chhungte hming leh hmanraw hming theihnghilh fo.
5. Mizia inthlak: Tlai lamah chiai leh thinur thut thut.

Thurawn: He thil hi thla 6 aia rei a awm chuan doctor rawn vat ang che.`,
    naga: `Dementia aru Alzheimer laga poila lakshan:
1. Etya laga kotha pahori jowa: Alop agete kotha kowa pahori jai kintu purana kotha bhal para yaad thake.
2. Din-din laga kaam te dukh powa: Chai banabole, dawai thik time te khabole, nohole poisa hisap koribole dukh powa.
3. Time aru rasta pahori jowa: Nijor ghor usor laga rasta bhi pahori jai.
4. Naam aru kotha pahori jowa: Ghor manu aru bostu laga naam yaad nahowa.
5. Mizaaj bodli powa: Beli dhalia time te beya lagibo aru khong uthibo.

Salah: Eneka lakshan 6 mohina pora beshi thakile doctor logote dikhabole lage.`,
    trp: `Dementia tei Alzheimer-ni bisingtwi phungjak samung:
1. Tabukni kothama ma-phaoano: Asuk sakha samung ma-phaoano kiphil skangni samung tong-khorong.
2. Salbrum-salbrum samungo jwngno: Cha sonani, bwsak thik khwlai bwsak nani akhe rang samlai ma-phaoano.
3. Sal tei thuk ma-phaoano: Boni nok rwgwi lamano ma-phaoano.
4. Kok tei mung ma-phaoano: Khonok borokrok tei nokni mungsuk ma-phaoano.
5. Mokol tei khorok sohorlai: Sanari belano bokhrok khorang kiphil.

Upodesh: Omo 6 talni bisingo tongkhe Doctor-no phunukdi.`
  },

  // 2. SUNDOWNING & EVENING AGITATION
  sundowning: {
    keywords: ['सनडाउनिंग', 'sundowning', 'शाम', 'बेचैनी', 'रात', 'agitation', 'evening', 'wandering', 'भटकना', 'আবেলি', 'সন্ধ্যা', 'बेलासिनि', 'janmiet', 'attam'],
    hi: `सनडाउनिंग (शाम की बेचैनी) से निपटने के उपाय:
1. प्रकाश व्यवस्था: शाम 4:30 बजे से ही कमरों में पर्याप्त गर्म पीली रोशनी चालू करें ताकि परछाइयां न बनें।
2. शांत वातावरण: शाम के समय तेज आवाज वाला टीवी बंद करें; धीमा बांसुरी या क्षेत्रीय शांत संगीत चलाएं।
3. कैफीन से परहेज: दोपहर 2 बजे के बाद चाय, कॉफी या अधिक मीठा पेय न दें।
4. सहानुभूतिपूर्ण स्पर्श: बुजुर्ग का हाथ थामकर शांत आवाज में कहें: आप सुरक्षित हैं, मैं आपके साथ हूँ।
5. संवेदी खेल: मानस मित्र का 'ऑब्जेक्ट साउंड' या 'पैटर्न गेम' उन्हें मानसिक सुकून देता है।`,
    en: `Managing Sundowning and Evening Agitation:
1. Lighting Control: Turn on warm indoor lights by 4:30 PM to eliminate confusing shadows and dim corners.
2. Calm Environment: Turn off loud televisions; play gentle regional flute music or soothing ambient nature sounds.
3. Limit Afternoon Stimulants: Avoid tea, coffee, or high-sugar snacks after 2:00 PM.
4. Reassurance: Gently hold their hand and speak calmly: You are safe at home, and I am right here with you.
5. Grounding Activities: Engage them in ManasMitra's Object Sound or Daily Routine matching game to redirect anxiety.`,
    as: `সন্ধ্যা সময়ৰ অস্বস্তি (চানডাউনিং) প্ৰতিৰোধৰ উপায়:
১. পোহৰৰ ব্যৱস্থা: আবেলি ৪:৩০ বজাৰ পৰাই ঘৰৰ কোঠাত উজ্জ্বল হালধীয়া পোহৰ দিয়ক যাতে ছাঁ নপৰে।
২. শান্ত পৰিৱেশ: সন্ধিয়া সময়ত টিভিৰ উচ্চ শব্দ বন্ধ ৰাখক; শান্ত বাঁহীৰ সুৰ বা ভজন শুনাওক।
৩. চাহ-কফিৰ পৰা বিৰত থাকক: দুপৰীয়া ২ বজাৰ পিছত চাহ বা কফি নিদিব।
৪. মৰমৰ আশ্বাস: হাতখন ধৰি কওক: আপুনি সম্পূৰ্ণ সুৰক্ষিত, মই আপোনাৰ লগতে আছোঁ।
৫. মনঃসংযোগ খেল: মানস মিত্ৰৰ শব্দ খেল খেলি মন শান্ত কৰক।`,
    bn: `সানডাউনিং (সন্ধ্যার অস্বস্তি) সামলানোর উপায়:
১. আলোর ব্যবস্থা: বিকেল সাড়ে চারটে থেকেই ঘরে নরম আলো জ্বালিয়ে দিন যাতে বিভ্রান্তিকর ছায়া না পড়ে।
২. শান্ত পরিবেশ: সন্ধ্যার সময় টিভির তীব্র শব্দ বন্ধ রাখুন; মৃদু সুর বা ভক্তিমূলক সঙ্গীত বাজান।
৩. ক্যাফিন এড়িয়ে চলুন: দুপুর ২টোর পর চা, কফি বা অতিরিক্ত মিষ্টি খাবার দেবেন না।
৪. আশ্বস্ত করুন: হাত ধরে শান্ত গলায় বলুন: আপনি সম্পূর্ণ নিরাপদে আছেন, আমি আপনার পাশেই আছি।
৫. মনঃসংযোগের খেলা: মানস মিত্রের শান্ত মেমরি গেম খেলান।`,
    brx: `बेलासिनि दावराव-दावसि सामलायनाय:
१. सोरांनि बेबस्था: बेलासि ४:३० रिंगायावनो नफोराव मोजां सोरां खालामना हो।
२. गोजोन अबस्था: बेलासिनि समाव टिभिनि गोख्रों सोदोबखौ बन्द खालाम; सिफुंनि सुवात खौनाय सोदोब हो।
३. सा-कफीनिफ्राय गोजानाव: सानजुफानि २ रिंगानि उनाव सा एबा कफी दा हो।
४. अननायनि राव: आखाय हमनानै बुं: नोंथाङा मोजाङै दं, आं नोंथांनि लोगोआवनो दं।`,
    kha: `Ban pynduna ia ka jingkhuslai ha ka por janmiet:
1. Bsiat jingshai: Pynmeh ia ki sharak ha ki kamra naduh 4:30 janmiet ban lait na ki syrngiew ba itriem.
2. Ka jaka kaba jem jai: Pynsngap ia ka jingriew bajem jong ka besli lane ki jingrwai kynmaw blei.
3. Ki jingdih ba pynkiew bor: Kyntait ia ka sha lane coffee hadien 2 baje nohsngi.
4. Kren pyntngen: Bat ia ka kti bad kren: Phi long kiba shngain, nga don lang bad phi.`,
    grt: `Attamni jajaani aro jajrenganiko champengani:
1. Seng·atgipa seng·aniko on·ani: Attam 4:30 bajioni noko seng·aniko on·bo jedakode andalgipa biaprang donga jani.
2. Tom·tomgipa biap: Attamchinchi TV-ko gam·bee chalai nabo; ka·singipa ring·anirangko ring·atbo.
3. Cha aro Coffee: Saljatchi 2 bajina ja·man cha aro coffee ring·at nabo.
4. Ka·dimeatgipa katta: Jakko rim·e aganbo: Na·a chel·chakanio donga, anga nang·baksa donga.`,
    mni: `নুমিৎ তাথরকপগী অৱাবা হন্থহনবগী পাম্বৈ:
১. মঙাল থাবা: নুমিৎ তাথরকপদা অমুম্বা লৈতনা পুম্নমক্তা মঙাল ফনা থাবীয়ু।
২. তোপ-তোপ্না লৈবা: নুমিৎ তাথরকপদা টিভীগী ৱাফম হন্থহল্লু; শান্তিগী ঈশৈ তান্নবীয়ু।
৩. চেহ অমসুং কোফি: নুমিৎ য়ুংবা মতুংদা চেহ নত্রগা কোফি পীগনু।
৪. নুংশিনা ৱা ঙাংবা: খুৎ পায়দুনা হায়বীয়ু: অদোম শাফনা লৈরি, ঐহাক অদোমগা লোয়নরি।`,
    lus: `Tlai lam buaina (Sundowning) enkawl dan:
1. Eng tha tawk: Tlai dar 4:30 vel atangin pindan chhung eng tha takin chhit rawh.
2. Hmun reh nuam: TV ring lutuk thih la, rimawi dam diai play rawh.
3. Thingpui leh coffee: Chhun dar 2 hnu lamah thingpui leh coffee in tir suh.
4. Thlamuanna pek: Kut vuanin sawi rawh: I him e, i bulah ka awm tlat a nia tiin thlamuan rawh.`,
    naga: `Beli dhalia time laga beya laga kotha thik koribole:
1. Bati jolai dibi: Beli dhalia time 4:30 baje pora bati bhal para jolai kene andhera thakibo nidibi.
2. Shanti jagah: TV laga awaz bishi dangor thakile bondh kori dibi; bhal banshi gana bajabi.
3. Chai-coffee: Dopohor 2 baje pichete chai nohole coffee khabole nidibi.
4. Morom para kotha kobi: Haat dhori kene kobi: Apuni bhal ase, ami apuni logote ase.`,
    trp: `Sanari belani bokhrok khorang samlaini:
1. Kothoma phung: Sanari 4:30 baje o nokni bisingo bwtang bwsakdi.
2. Khapang khumpui: TV khorang kotor khwlaidi; banshi kok rwngdi.
3. Cha-Coffee: Saljilani 2 bajini ulo cha kwthwng da ridi.
4. Hamjakmwi kok: Yakhrai thumwi saidi: Nwng kaham tongu, ang nini logio tongu.`
  },

  // 3. NORTH EAST REGION DOCTORS
  doctors_ner: {
    keywords: ['doctor', 'ner', 'assam', 'meghalaya', 'shillong', 'guwahati', 'অসম', 'মেঘालय', 'शिलांग', 'गुवाहाटी', 'डॉक्टर', 'মনিপুর', 'hospital', 'ডাक्टर'],
    hi: `उत्तर-पूर्व भारत (NER) के प्रमुख न्यूरोलॉजिस्ट व अस्पताल:
1. मेघालय (शिलांग):
   Dr. Shri Ram Sharma (विभागाध्यक्ष, न्यूरोलॉजी, NEIGRIHMS शिलांग) - फोन: +91 364 2538011
   Dr. Baiakmenlang Synmon (मेमोरी क्लिनिक प्रमुख, NEIGRIHMS)
2. असम (गुवाहाटी व डिब्रूगढ़):
   Dr. Satish Bawri (वरिष्ठ न्यूरोलॉजिस्ट, GMCH / GNRC) - फोन: +91 361 2130200
   Dr. Neelav Sarma (डाउन टाउन अस्पताल, गुवाहाटी)
   Dr. Radhika Ranjan Das (अपोलो एक्सेलकेयर गुवाहाटी)
   Dr. B. C. Sarma (जेरियाट्रिक मनोरोग, AMCH डिब्रूगढ़)
3. मणिपुर (इम्फाल):
   Dr. L. Somorendro Singh (प्रोफेसर, RIMS इम्फाल) - फोन: +91 385 2414629

आप सीधे डॉक्टर रिमाइंडर मॉड्यूल से Medindia डायरेक्टरी देख सकते हैं और अपॉइंटमेंट रिमाइंडर सेट कर सकते हैं।`,
    en: `Premier Cognitive Neurologists & Hospitals in North East India:
1. Meghalaya (Shillong):
   Dr. Shri Ram Sharma (Prof & Head of Neurology, NEIGRIHMS Shillong) - Phone: +91 364 2538011
   Dr. Baiakmenlang Synmon (Memory Clinic Lead, NEIGRIHMS)
2. Assam (Guwahati & Dibrugarh):
   Dr. Satish Bawri (Senior Neurologist, GMCH / GNRC Guwahati) - Phone: +91 361 2130200
   Dr. Neelav Sarma (Down Town Hospital Guwahati)
   Dr. Radhika Ranjan Das (Apollo Excelcare Hospitals Guwahati)
   Dr. B. C. Sarma (Geriatric Psychiatry, AMCH Dibrugarh)
3. Manipur (Imphal):
   Dr. L. Somorendro Singh (Clinical Neurology, RIMS Imphal) - Phone: +91 385 2414629

You can browse verified doctors state-by-state via the Doctor Reminder module linked with Medindia.net.`,
    as: `উত্তৰ-পূব ভাৰতৰ (NER) বিশিষ্ট স্নায়ুৰোগ বিশেষজ্ঞ আৰু চিকিৎসালয়:
১. মেঘালয় (শ্বিলং):
   Dr. Shri Ram Sharma (মুৰব্বী, নিউৰোলজী বিভাগ, NEIGRIHMS শ্বিলং) - ফোন: +91 364 2538011
   Dr. Baiakmenlang Synmon (মেমৰি ক্লিনিক, NEIGRIHMS)
২. অসম (গুৱাহাটী আৰু ডিব্ৰুগড়):
   Dr. Satish Bawri (জ্যেষ্ঠ স্নায়ুৰোগ বিশেষজ্ঞ, GMCH / GNRC) - ফোন: +91 361 2130200
   Dr. Neelav Sarma (ডাউন টাউন হাস্পতাল, গুৱাহাটী)
   Dr. Radhika Ranjan Das (এপ'ল' এক্সেলকেয়াৰ, গুৱাহাটী)
   Dr. B. C. Sarma (জেৰিয়াট্ৰিক চাইকিয়াট্ৰী, AMCH ডিব্ৰুগড়)
৩. মণিপুৰ (ইম্ফল):
   Dr. L. Somorendro Singh (প্ৰফেচাৰ, RIMS ইম্ফল) - ফোন: +91 385 2414629`,
    bn: `উত্তর-পূর্ব ভারতের (NER) বিশিষ্ট নিউরোলজিস্ট ও হাসপাতাল:
১. মেঘালয় (শিলং):
   Dr. Shri Ram Sharma (বিভাগীয় প্রধান, নিউরোলজি, NEIGRIHMS শিলং) - ফোন: +91 364 2538011
   Dr. Baiakmenlang Synmon (মেমরি ক্লিনিক প্রধান, NEIGRIHMS)
২. আসাম (গুয়াহাটি ও ডিব্রুগড়):
   Dr. Satish Bawri (সিনিয়র নিউরোলজিস্ট, GMCH / GNRC) - ফোন: +91 361 2130200
   Dr. Neelav Sarma (ডাউন টাউন হাসপাতাল, গুয়াহাটি)
   Dr. Radhika Ranjan Das (অ্যাপোলো এক্সেলকেয়ার গুয়াহাটি)
   Dr. B. C. Sarma (জেরিয়াট্রিক সাইকিয়াট্রি, AMCH ডিব্রুগড়)
৩. মণিপুর (ইম্ফল):
   Dr. L. Somorendro Singh (প্রফেসর, RIMS ইম্ফল) - ফোন: +91 385 2414629`
  },

  // 4. COGNITIVE TEST SCORES (MMSE & MOCA)
  mmse_moca: {
    keywords: ['mmse', 'moca', 'score', 'रिपोर्ट', 'स्कोर', 'test', 'परीक्षण', 'cdr', 'mri', 'ৰিপোৰ্ট', 'রিপোর্ট'],
    hi: `कॉग्निटिव टेस्ट स्कोर का अर्थ (MMSE व MoCA):
1. MMSE (Mini-Mental State Exam) - कुल 30 अंक:
   - 24 से 30: सामान्य संज्ञानात्मक स्तर (Normal)
   - 19 से 23: हल्का संज्ञानात्मक ह्रास (MCI)
   - 10 से 18: मध्यम डिमेंशिया (Moderate)
   - 10 से कम: गंभीर डिमेंशिया (Severe)

2. MoCA (Montreal Cognitive Assessment) - कुल 30 अंक:
   - 26 से 30: सामान्य स्तर
   - 26 से कम: प्रारंभिक स्मृति या मानसिक एकाग्रता में गिरावट का संकेत।

3. ब्रेन MRI फाइंडिंग्स:
   - हिप्पोकैम्पल एट्रोफी: स्मृति केंद्र का सिकुड़ना (अल्जाइमर सूचक)।`,
    en: `Understanding Cognitive Test Scores (MMSE & MoCA):
1. MMSE (Mini-Mental State Examination) - Max 30 points:
   - 24 to 30: Normal cognitive baseline.
   - 19 to 23: Mild Cognitive Impairment (MCI).
   - 10 to 18: Moderate cognitive impairment / Dementia.
   - Below 10: Advanced or severe stage.

2. MoCA (Montreal Cognitive Assessment) - Max 30 points:
   - 26 to 30: Normal baseline.
   - Below 26: Early indicator of mild cognitive changes requiring medical follow-up.

3. Brain MRI Findings:
   - Hippocampal Atrophy: Shrinkage in memory processing lobes.`,
    as: `কগনিটিভ পৰীক্ষাৰ নম্বৰৰ অৰ্থ (MMSE আৰু MoCA):
১. MMSE (Mini-Mental State Examination) - মুঠ ৩০ নম্বৰ:
   - ২৪ ৰ পৰা ৩০: স্বাভাৱিক মানুহৰ স্মৃতিশক্তি (Normal)
   - ১৯ ৰ পৰা ২৩: মৃদু স্মৃতি হ্ৰাস (MCI)
   - ১০ ৰ পৰা ১৮: মধ্যমীয়া ডিমেনচিয়া (Moderate)
   - ১০ তকৈ কম: গুৰুতৰ ডিমেনচিয়া (Severe)

২. MoCA (Montreal Cognitive Assessment) - মুঠ ৩০ নম্বৰ:
   - ২৬ ৰ পৰা ৩০: সম্পূৰ্ণ স্বাভাৱিক
   - ২৬ তকৈ কম: প্ৰাৰম্ভিক স্মৃতি হ্ৰাসৰ লক্ষণ।`,
    bn: `কগনিটিভ টেস্ট স্কোরের অর্থ (MMSE ও MoCA):
১. MMSE (Mini-Mental State Exam) - মোট ৩০ নম্বর:
   - ২৪ থেকে ৩০: স্বাভাবিক মানসিক স্তর (Normal)
   - ১৯ থেকে ২৩: মৃদু স্মৃতিশক্তি হ্রাস (MCI)
   - ১০ থেকে ১৮: মাঝারি ডিমেনশিয়া (Moderate)
   - ১০ এর নিচে: গুরুতর ডিমেনশিয়া (Severe)

২. MoCA (Montreal Cognitive Assessment) - মোট ৩০ নম্বর:
   - ২৬ থেকে ৩০: সম্পূর্ণ স্বাভাবিক
   - ২৬ এর নিচে: প্রাথমিক স্মৃতি হ্রাসের ইঙ্গিত।`
  },

  // 5. APP GUIDE & SMS
  app_guide: {
    keywords: ['app', 'use', 'kaise', 'कैसे', 'sms', 'मैसेज', 'reminder', 'sos', 'गेम', 'এপ', 'ব্যবহার'],
    hi: `मानस मित्र ऐप का उपयोग कैसे करें:
1. संज्ञानात्मक खेल: एल्डर मोड में जाएं और मेमोरी ऑब्जेक्ट्स, रूटीन या साउंड मैच खेलें।
2. परिवार को संदेश व SMS: ऊपर संदेश बटन पर क्लिक करें। बोलकर या लिखकर संदेश भेजें। SMS भेजें बटन सीधे मोबाइल ऐप खोलता है।
3. डॉक्टर रिमाइंडर: डॉक्टर रिमाइंडर मॉड्यूल खोलें। यहां से 1-क्लिक में अपॉइंटमेंट का एसएमएस भी भेजा जा सकता है।
4. आपातकालीन SOS: लाल SOS बटन दबाने पर परिजनों को मिस्ड कॉल और लाइव जीपीएस लोकेशन एसएमएस प्रसारित होता है।`,
    en: `How to Use ManasMitra AI:
1. Cognitive Games: Open Elder Mode to play cultural memory objects, daily routine, or sound recall games.
2. Family Messaging & SMS: Click the Family Message button in the top navigation. Dictate or type thoughts. Tapping Send SMS opens your mobile SMS app.
3. Doctor Reminders: Open the Doctor Reminder scheduler to browse verified specialists and save appointment alerts.
4. Emergency SOS: Tapping the red SOS Call button triggers automated missed calls and live GPS location transmission to family.`,
    as: `মানস মিত্ৰ এপৰ ব্যৱহাৰৰ নিৰ্দেশনা:
১. স্মৃতি খেল: জ্যেষ্ঠজন মডলৈ যাওক আৰু মেমৰি গেম আৰু দৈনন্দিন দিনলিপি খেলক।
২. পৰিয়াললৈ বাৰ্তা: ওপৰৰ বাৰ্তা বুটামত ক্লিক কৰক। কওক বা লিখক আৰু এছএমএছ প্ৰেৰণ কৰক।
৩. ডাক্তৰ ৰিমাইণ্ডাৰ: জৰুৰী ডাক্তৰৰ তালিকা চাওক আৰু সময় নিৰ্ধাৰণ কৰক।
৪. জৰুৰীকালীন SOS: ৰঙা SOS বুটাম টিপিলে পৰিয়াললৈ লাইভ লোকেচন আৰু কল যাব।`,
    bn: `মানস মিত্র অ্যাপ ব্যবহারের নির্দেশিকা:
১. স্মৃতির খেলা: প্রবীণ মোডে গিয়ে মেমরি গেম খেলুন যা মস্তিষ্কের কর্মক্ষমতা সচল রাখে।
২. পরিবারের সাথে বার্তা: বার্তা বোতামে ক্লিক করে কথা বলে বা লিখে এসএমএস পাঠান।
৩. ডাক্তারের রিমাইন্ডার: যাচাইকৃত চিকিৎসকদের তালিকা দেখুন এবং অ্যাপয়েন্টমেন্ট রিমাইন্ডার সেট করুন।
৪. জরুরি SOS: লাল এসওএস বোতাম চাপলেই পরিবারের কাছে লাইভ জিপিএস লোকেশন চলে যাবে।`
  }
};

export default function AiHelpModal({
  isOpen,
  onClose,
  language = 'hi',
  _onNavigateAction
}) {
  const [voiceGender, setVoiceGender] = useState(() => speechService.getVoiceGender());
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  // Generate localized, gender-appropriate welcome text (Zero emojis)
  const getWelcomeText = (gender, lang) => {
    const isFemale = gender === 'female';
    const cleanLang = (lang || 'hi').toLowerCase().split('-')[0];

    const localizedWelcomes = {
      hi: isFemale
        ? 'नमस्ते! मैं आपकी मानस मित्र AI सहायिका हूँ। मैं डिमेंशिया देखभाल, भारत व उत्तर-पूर्व के राज्य-वार डॉक्टर, MMSE/MoCA टेस्ट रिपोर्ट और ऐप के उपयोग में आपकी 24 घंटे मदद कर सकती हूँ। आप बोलकर या लिखकर कुछ भी पूछ सकती हैं!'
        : 'नमस्ते! मैं आपका मानस मित्र AI सहायक हूँ। मैं डिमेंशिया देखभाल, भारत व उत्तर-पूर्व के राज्य-वार डॉक्टर, MMSE/MoCA टेस्ट रिपोर्ट और ऐप के उपयोग में आपकी 24 घंटे मदद कर सकता हूँ। आप बोलकर या लिखकर कुछ भी पूछ सकते हैं!',
      en: isFemale
        ? 'Hello! I am your ManasMitra AI Care Companion. I can assist you with dementia care, state-wise neurologists across India, cognitive test reports (MMSE/MoCA), and app guidance. Ask me anything via voice or text.'
        : 'Hello! I am your ManasMitra AI Care Assistant. I can assist you with dementia care, state-wise neurologists across India, cognitive test reports (MMSE/MoCA), and app guidance. Ask me anything via voice or text.',
      as: isFemale
        ? 'নমস্কাৰ! মই আপোনাৰ মানস মিত্ৰ AI সহায়িকা। মই ডিমেনচিয়া পৰিচৰ্যা, অসম তথা উত্তৰ-পূবৰ চিকিৎসকৰ তথ্য, MMSE টেষ্ট ৰিপোৰ্ট আৰু এপৰ ব্যৱহাৰত আপোনাক সহায় কৰিবলৈ সাজু। আপুনি কথা কৈ বা লিখি সুধিব পাৰে!'
        : 'নমস্কাৰ! মই আপোনাৰ মানস মিত্ৰ AI সহায়ক। মই ডিমেনচিয়া পৰিচৰ্যা, অসম তথা উত্তৰ-পূবৰ চিকিৎসকৰ তথ্য, MMSE টেষ্ট ৰিপোৰ্ট আৰু এপৰ ব্যৱহাৰত আপোনাক সহায় কৰিবলৈ সাজু। আপুনি কথা কৈ বা লিখি সুধিব পাৰে!',
      bn: isFemale
        ? 'নমস্কার! আমি আপনার মানস মিত্র AI সহায়িকা। ডিমেনশিয়া যত্ন, বিশেষজ্ঞ চিকিৎসক তালিকা, MMSE রিপোর্ট এবং অ্যাপ ব্যবহারে আপনাকে সাহায্য করতে প্রস্তুত। আপনি কথা বলে বা লিখে প্রশ্ন করতে পারেন!'
        : 'নমস্কার! আমি আপনার মানস মিত্র AI সহায়ক। ডিমেনশিয়া যত্ন, বিশেষজ্ঞ চিকিৎসক তালিকা, MMSE রিপোর্ট এবং অ্যাপ ব্যবহারে আপনাকে সাহায্য করতে প্রস্তুত। আপনি কথা বলে বা লিখে প্রশ্ন করতে পারেন!',
      brx: isFemale
        ? 'खुलुमबाय! आं नोंथांनि मानस मित्र AI हेफाजाबगिरि। आं दिमेन्सिया नायसामनाय, डाक्टरफोरनि अनजिमा आरो रिपोर्ट आनजाद खालामनायाव हेफाजाब होनो हागौ।'
        : 'खुलुमबाय! आं नोंथांनि मानस मित्र AI हेफाजाबगिरि। आं दिमेन्सिया नायसामनाय, डाक्टरफोरनि अनजिमा आरो रिपोर्ट आनजाद खालामनायाव हेफाजाब होनो हागौ।',
      kha: isFemale
        ? 'Khublei! Nga dei ka ManasMitra AI iarap jong phi. Nga lah ban iarap ia phi shaphang ka jingsumar dementia, ki doctor ha Meghalaya bad NER, bad ki MMSE report.'
        : 'Khublei! Nga dei u ManasMitra AI iarap jong phi. Nga lah ban iarap ia phi shaphang ka jingsumar dementia, ki doctor ha Meghalaya bad NER, bad ki MMSE report.',
      grt: isFemale
        ? 'Mitela! Anga nang·ni ManasMitra AI dakchakgipa ong·a. Anga dementia sanna-banani, doctor-rangni biming, aro MMSE report-ko ma·sina dakchakna amgen.'
        : 'Mitela! Anga nang·ni ManasMitra AI dakchakgipa ong·a. Anga dementia sanna-banani, doctor-rangni biming, aro MMSE report-ko ma·sina dakchakna amgen.',
      mni: isFemale
        ? 'খুরুমজরি! ঐহাক নহাক্কী মানস মিত্র AI মতেং পাংবীনি। ঐহাক্না দিমেন্সিয়া য়েংশিনবা, দোক্করশিং অমসুং MMSE রিপোর্ত খঙবদা মতেং পাংবা ঙমগনি।'
        : 'খুরুমজরি! ঐহাক নহাক্কী মানস মিত্র AI মতেং পাংবনি। ঐহাক্না দিমেন্সিয়া য়েংশিনবা, দোক্করশিং অমসুং MMSE রিপোর্ত খঙবদা মতেং পাংবা ঙমগনি।',
      lus: isFemale
        ? 'Chibai! I ManasMitra AI puihtu ka ni e. Dementia enkawl dan, doctor-te chanchin, leh MMSE report chungchangah ka pui thei che.'
        : 'Chibai! I ManasMitra AI puihtu ka ni e. Dementia enkawl dan, doctor-te chanchin, leh MMSE report chungchangah ka pui thei che.',
      naga: isFemale
        ? 'Namaste! Ami apuni laga ManasMitra AI sahayak ase. Dementia bimari laga bhal kotha, doctor laga khobor, aru MMSE report te modot koribo paribo.'
        : 'Namaste! Ami apuni laga ManasMitra AI sahayak ase. Dementia bimari laga bhal kotha, doctor laga khobor, aru MMSE report te modot koribo paribo.',
      trp: isFemale
        ? 'Khulumkha! Ang nini ManasMitra AI chubagwlak tongu. Dementia samung, doctor-rokni mung, tei MMSE report-o nwngno chuba rwno man-ano.'
        : 'Khulumkha! Ang nini ManasMitra AI chubagwlak tongu. Dementia samung, doctor-rokni mung, tei MMSE report-o nwngno chuba rwno man-ano.'
    };

    return localizedWelcomes[cleanLang] || localizedWelcomes.hi;
  };

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'ai',
      text: getWelcomeText(speechService.getVoiceGender(), language),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Update initial welcome message when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === 'welcome-1'
          ? { ...m, text: getWelcomeText(voiceGender, language) }
          : m
      )
    );
  }, [language]);

  if (!isOpen) return null;

  // Handle switching voice gender persona
  const handleSwitchGender = (newGender) => {
    if (newGender === voiceGender) return;
    setVoiceGender(newGender);
    speechService.setVoiceGender(newGender);
    speechService.playChime('tap');

    // Adapt welcome message and existing AI responses
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.sender === 'ai') {
          if (msg.id === 'welcome-1') {
            return { ...msg, text: getWelcomeText(newGender, language) };
          }
          return {
            ...msg,
            text: adaptSpeechPronunciation(msg.text, newGender, language)
          };
        }
        return msg;
      })
    );

    // Audio preview of selected voice in active language
    setIsSpeaking(true);
    speechService.previewVoice(newGender, language, () => {
      setIsSpeaking(false);
    });
  };

  // Answer matching engine across all 11 languages (Zero emojis)
  const findAnswer = (query) => {
    const q = (query || '').toLowerCase().trim();
    const cleanLang = (language || 'hi').toLowerCase().split('-')[0];
    let rawAnswer = '';

    const getTopicAnswer = (topicKey) => {
      const topic = AI_KNOWLEDGE[topicKey];
      if (!topic) return '';
      return topic[cleanLang] || topic.hi || topic.en;
    };

    if (q.includes('sundown') || q.includes('सनडाउन') || q.includes('शाम') || q.includes('evening') || q.includes('আবেলি') || q.includes('সন্ধ্যা') || q.includes('বেলাসिनि') || q.includes('janmiet')) {
      rawAnswer = getTopicAnswer('sundowning');
    } else if (q.includes('ner') || q.includes('assam') || q.includes('shillong') || q.includes('guwahati') || q.includes('অসম') || q.includes('মেঘालय') || q.includes('शिलांग') || q.includes('গুৱাহাটী') || q.includes('manipur') || q.includes('ইম্ফল') || q.includes('doctor') || q.includes('ডাক্তৰ') || q.includes('ডাক্তার') || q.includes('डाक्टर')) {
      rawAnswer = getTopicAnswer('doctors_ner');
    } else if (q.includes('mmse') || q.includes('moca') || q.includes('score') || q.includes('स्कोर') || q.includes('रिपोर्ट') || q.includes('mri') || q.includes('test') || q.includes('ৰিপোৰ্ট') || q.includes('রিপোর্ট')) {
      rawAnswer = getTopicAnswer('mmse_moca');
    } else if (q.includes('app') || q.includes('use') || q.includes('kaise') || q.includes('कैसे') || q.includes('sms') || q.includes('मैसेज') || q.includes('reminder') || q.includes('sos') || q.includes('गेम') || q.includes('এপ')) {
      rawAnswer = getTopicAnswer('app_guide');
    } else if (q.includes('लक्षण') || q.includes('symptom') || q.includes('sign') || q.includes('dementia') || q.includes('alzheimer') || q.includes('भूलना') || q.includes('স্মৃতি') || q.includes('পাহৰা') || q.includes('ভুলে') || q.includes('klet')) {
      rawAnswer = getTopicAnswer('dementia_signs');
    } else {
      // Default intelligent guidance in active language (Zero emojis)
      const defaultGuidance = {
        hi: `मानस मित्र AI मार्गदर्शन:
आपके प्रश्न "${query}" के संदर्भ में:
- यदि यह स्मृति ह्रास या भटकाव से संबंधित है, तो प्रतिदिन संज्ञानात्मक अभ्यास और पर्याप्त नींद सुनिश्चित करें।
- आप डॉक्टर रिमाइंडर मॉड्यूल से अपने राज्य के प्रमाणित न्यूरोलॉजिस्ट देख सकते हैं।
- किसी भी आपात स्थिति में सीधे आपातकालीन SOS बटन दबाएं या परिवार को SMS संदेश भेजें।`,
        en: `ManasMitra AI Guidance:
Regarding your query "${query}":
- For memory loss or confusion, consistent daily cognitive stimulation and structured routine are clinically proven to help.
- You can search certified cognitive specialists by state via the Doctor Reminder modal.
- For immediate emergencies, use the SOS Call button or send an instant family SMS.`,
        as: `মানস মিত্ৰ AI পৰামৰ্শ:
আপোনাৰ প্ৰশ্ন "${query}" ৰ উত্তৰত:
- স্মৃতিশক্তিৰ সমস্যাৰ বাবে নিয়মিত কগনিটিভ খেল আৰু পৰ্যাপ্ত টোপনি প্ৰয়োজন।
- আপুনি ডাক্তৰ ৰিমাইণ্ডাৰৰ জৰিয়তে নিজৰ ৰাজ্যৰ বিশেষজ্ঞ ডাক্তৰ বিচাৰিব পাৰে।
- জৰুৰী অৱস্থাত SOS বুটাম বা পৰিয়াললৈ SMS ব্যৱহাৰ কৰক।`,
        bn: `মানস মিত্র AI পরামর্শ:
আপনার প্রশ্ন "${query}" এর প্রেক্ষিতে:
- স্মৃতিশক্তি হ্রাস বা বিভ্রান্তির জন্য প্রতিদিন মানসিক ব্যায়াম ও পর্যাপ্ত ঘুম নিশ্চিত করুন।
- ডাক্তার মডিউল থেকে আপনার রাজ্যের বিশেষজ্ঞ চিকিৎসকদের তালিকা দেখতে পারেন।
- যেকোনো জরুরি অবস্থায় সরাসরি SOS বোতাম ব্যবহার করুন বা পরিবারকে এসএমএস পাঠান।`
      };

      rawAnswer = defaultGuidance[cleanLang] || defaultGuidance.hi;
    }

    // Strip any emoji and adapt pronunciation according to active voice gender
    return adaptSpeechPronunciation(stripEmojis(rawAnswer), voiceGender, cleanLang);
  };

  const handleSendQuery = (textToSend = inputText) => {
    const cleanText = stripEmojis((textToSend || '').trim());
    if (!cleanText) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    speechService.playChime('tap');

    setTimeout(() => {
      const answer = findAnswer(cleanText);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: stripEmojis(answer),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsThinking(false);
      setMessages((prev) => [...prev, aiMsg]);
      speechService.playChime('success');
    }, 500);
  };

  // Voice recognition (Speech-to-Text) with resolved language
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    try {
      const started = speechService.startListening(
        language,
        (transcript) => {
          const clean = stripEmojis(transcript);
          setInputText(clean);
          setIsListening(false);
          handleSendQuery(clean);
        },
        () => {
          setIsListening(false);
        }
      );

      if (started) {
        setIsListening(true);
      }
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-Speech playback in the ACTIVE LANGUAGE with NO EMOJIS
  const handleSpeakResponse = (msgId, text) => {
    if (isSpeaking && speakingMsgId === msgId) {
      speechService.stop();
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    speechService.stop();
    setIsSpeaking(true);
    setSpeakingMsgId(msgId);

    // Speak in the exact active language!
    speechService.speak(
      stripEmojis(text),
      language,
      () => {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      },
      voiceGender
    );
  };

  const handleCopyText = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(stripEmojis(text));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Quick Prompts for active language without any emojis
  const getQuickPrompts = () => {
    const cleanLang = (language || 'hi').toLowerCase().split('-')[0];
    const promptsMap = {
      hi: [
        { label: 'डिमेंशिया के लक्षण', q: 'डिमेंशिया के शुरुआती लक्षण क्या हैं?' },
        { label: 'असम व NER के डॉक्टर', q: 'असम और शिलांग में कौनसे न्यूरोलॉजिस्ट उपलब्ध हैं?' },
        { label: 'शाम की बेचैनी (सनडाउनिंग)', q: 'सनडाउनिंग बेचैनी कैसे संभालें?' },
        { label: 'MMSE व MoCA स्कोर', q: 'MMSE और MoCA स्कोर का क्या मतलब है?' },
        { label: 'परिवार को SMS कैसे भेजें', q: 'परिवार को SMS और संदेश कैसे भेजें?' },
        { label: 'NIMHANS व AIIMS डॉक्टर', q: 'NIMHANS और AIIMS के डिमेंशिया विशेषज्ञ कौन हैं?' }
      ],
      en: [
        { label: 'Early Dementia Signs', q: 'What are the early signs of dementia?' },
        { label: 'Doctors in Assam & NER', q: 'Which neurologists are available in Assam and Shillong?' },
        { label: 'Sundowning Care', q: 'How to manage sundowning evening restlessness?' },
        { label: 'MMSE / MoCA Scores', q: 'What do MMSE and MoCA scores mean?' },
        { label: 'How to Send Family SMS', q: 'How do I send SMS and message to family?' },
        { label: 'NIMHANS & AIIMS Doctors', q: 'Who are the dementia specialists at NIMHANS and AIIMS?' }
      ],
      as: [
        { label: 'ডিমেঞ্চিয়াৰ লক্ষণ', q: 'ডিমেঞ্চিয়াৰ প্ৰাৰম্ভিক লক্ষণসমূহ কি কি?' },
        { label: 'অসম আৰু NER ৰ চিকিৎসক', q: 'অসম আৰু শ্বিলঙত কোন স্নায়ুৰোগ বিশেষজ্ঞ আছে?' },
        { label: 'সন্ধ্যা সময়ৰ অস্বস্তি', q: 'সন্ধ্যা সময়ৰ অস্বস্তি কেনেকৈ চম্ভালিব?' },
        { label: 'MMSE টেষ্ট স্কোৰ', q: 'MMSE নম্বৰৰ অৰ্থ কি?' },
        { label: 'পৰিয়াললৈ SMS প্ৰেৰণ', q: 'পৰিয়াললৈ বাৰ্তা কেনেকৈ পঠিয়াব?' }
      ],
      bn: [
        { label: 'ডিমেনশিয়ার লক্ষণ', q: 'ডিমেনশিয়ার প্রাথমিক লক্ষণ কি কি?' },
        { label: 'আসাম ও উত্তর-পূর্বের ডাক্তার', q: 'আসাম ও শিলংয়ে কোন নিউরোলজিস্ট আছেন?' },
        { label: 'সানডাউনিং পরিচর্যা', q: 'সন্ধ্যার অস্থিরতা কিভাবে দূর করব?' },
        { label: 'MMSE ও MoCA স্কোর', q: 'MMSE স্কোরের অর্থ কি?' },
        { label: 'পরিবারকে SMS প্রেরণ', q: 'পরিবারকে কিভাবে বার্তা পাঠাব?' }
      ]
    };

    return promptsMap[cleanLang] || promptsMap.hi;
  };

  const isFemale = voiceGender === 'female';
  const cleanLang = (language || 'hi').toLowerCase().split('-')[0];

  const getLocalizedTitle = () => {
    if (cleanLang === 'hi') {
      return isFemale ? 'मानस मित्र AI सहायिका' : 'मानस मित्र AI सहायक';
    }
    if (cleanLang === 'as') {
      return isFemale ? 'মানস মিত্ৰ AI সহায়িকা' : 'মানস মিত্ৰ AI সহায়ক';
    }
    if (cleanLang === 'bn') {
      return isFemale ? 'মানস মিত্র AI সহায়িকা' : 'মানস মিত্র AI সহায়ক';
    }
    return isFemale ? 'ManasMitra AI Companion' : 'ManasMitra AI Assistant';
  };

  const getLocalizedSubtitle = () => {
    if (cleanLang === 'as') {
      return 'ডিমেনচিয়া পৰামৰ্শ • চিকিৎসকৰ তথ্য • টেষ্ট ৰিপোৰ্ট বিশ্লেষণ • কণ্ঠ সেৱা';
    }
    if (cleanLang === 'bn') {
      return 'ডিমেনশিয়া পরামর্শ • চিকিৎসক তালিকা • টেস্ট রিপোর্ট • ভয়েস সহায়তা';
    }
    if (cleanLang === 'hi') {
      return 'डिमेंशिया परामर्श • राज्य-वार डॉक्टर डायरेक्टरी • टेस्ट रिपोर्ट विश्लेषण • आवाज़ सेवा';
    }
    return 'Dementia Guidance • State-Wise Doctors • Test Report Analysis • Voice Assistant';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'rgba(5, 26, 21, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '850px',
        borderRadius: '28px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        flexDirection: 'column',
        height: '92vh',
        maxHeight: '780px',
        overflow: 'hidden'
      }}>
        {/* Header (No Emojis) */}
        <div style={{
          background: 'linear-gradient(135deg, #052e26 0%, #064e3b 100%)',
          color: '#ffffff',
          padding: '1rem 1.6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid rgba(190, 242, 38, 0.35)',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <AiSahayakLogo
              size="md"
              isSpeaking={isSpeaking}
              gender={voiceGender}
              animated={true}
            />

            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <span>{getLocalizedTitle()}</span>
                <span style={{
                  fontSize: '0.72rem',
                  background: isFemale ? 'rgba(190, 242, 38, 0.25)' : 'rgba(56, 189, 248, 0.25)',
                  color: isFemale ? '#bef226' : '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  border: isFemale ? '1px solid rgba(190, 242, 38, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)'
                }}>
                  {isFemale
                    ? (cleanLang === 'hi' ? 'महिला आवाज़' : cleanLang === 'as' ? 'মহিলা কণ্ঠ' : cleanLang === 'bn' ? 'মহিলা কণ্ঠ' : 'Female Voice')
                    : (cleanLang === 'hi' ? 'पुरुष आवाज़' : cleanLang === 'as' ? 'পুৰুষ কণ্ঠ' : cleanLang === 'bn' ? 'পুরুষ কণ্ঠ' : 'Male Voice')}
                </span>
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#a7f3d0', margin: '2px 0 0' }}>
                {getLocalizedSubtitle()}
              </div>
            </div>
          </div>

          {/* Right Header Controls: Voice Persona Switcher & Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Male / Female Voice Selector Pill Group (No Emojis) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.35)',
              padding: '3px 4px',
              borderRadius: '9999px',
              border: '1.5px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              {/* Female Voice Button */}
              <button
                type="button"
                onClick={() => handleSwitchGender('female')}
                style={{
                  background: isFemale ? '#bef226' : 'transparent',
                  color: isFemale ? '#052e26' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease',
                  boxShadow: isFemale ? '0 2px 10px rgba(190, 242, 38, 0.45)' : 'none'
                }}
                title="Select Female Voice"
              >
                <span>{cleanLang === 'hi' ? 'महिला आवाज़' : cleanLang === 'as' ? 'মহিলা কণ্ঠ' : cleanLang === 'bn' ? 'মহিলা কণ্ঠ' : 'Female'}</span>
              </button>

              {/* Male Voice Button */}
              <button
                type="button"
                onClick={() => handleSwitchGender('male')}
                style={{
                  background: !isFemale ? '#38bdf8' : 'transparent',
                  color: !isFemale ? '#052e26' : '#e2e8f0',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.2s ease',
                  boxShadow: !isFemale ? '0 2px 10px rgba(56, 189, 248, 0.45)' : 'none'
                }}
                title="Select Male Voice"
              >
                <span>{cleanLang === 'hi' ? 'पुरुष आवाज़' : cleanLang === 'as' ? 'পুৰুষ কণ্ঠ' : cleanLang === 'bn' ? 'পুরুষ কণ্ঠ' : 'Male'}</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              title="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips (No Emojis) */}
        <div style={{
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.6rem 1.25rem',
          display: 'flex',
          gap: '0.45rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {getQuickPrompts().map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuery(item.q)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '9999px',
                padding: '0.35rem 0.8rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Message Scroll View (No Emojis) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: '#fafaf9'
        }}>
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            const isThisSpeaking = isSpeaking && speakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: isAi ? 'flex-start' : 'flex-end',
                  gap: '0.65rem'
                }}
              >
                {isAi && (
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <AiSahayakLogo
                      size="xs"
                      isSpeaking={isThisSpeaking}
                      gender={voiceGender}
                      animated={true}
                    />
                  </div>
                )}

                <div style={{
                  maxWidth: '78%',
                  background: isAi ? '#ffffff' : '#052e26',
                  color: isAi ? '#0f172a' : '#ffffff',
                  padding: '0.9rem 1.2rem',
                  borderRadius: isAi ? '4px 20px 20px 20px' : '20px 4px 20px 20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: isAi ? (isThisSpeaking ? (isFemale ? '1.5px solid #bef226' : '1.5px solid #38bdf8') : '1.5px solid #e2e8f0') : 'none',
                  fontSize: '0.92rem',
                  lineHeight: '1.55',
                  whiteSpace: 'pre-line',
                  transition: 'border-color 0.2s'
                }}>
                  <div>{stripEmojis(msg.text)}</div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.5rem',
                    paddingTop: '0.4rem',
                    borderTop: isAi ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.15)',
                    fontSize: '0.72rem',
                    color: isAi ? '#94a3b8' : '#a7f3d0'
                  }}>
                    <span>{msg.timestamp}</span>

                    {isAi && (
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          onClick={() => handleSpeakResponse(msg.id, msg.text)}
                          style={{
                            background: isThisSpeaking ? (isFemale ? 'rgba(190, 242, 38, 0.2)' : 'rgba(56, 189, 248, 0.2)') : 'transparent',
                            border: isThisSpeaking ? (isFemale ? '1px solid #84cc16' : '1px solid #0ea5e9') : 'none',
                            borderRadius: '6px',
                            color: isThisSpeaking ? (isFemale ? '#4d7c0f' : '#0284c7') : '#059669',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontWeight: 700,
                            padding: '2px 7px'
                          }}
                          title={`Listen in ${isFemale ? 'Female' : 'Male'} Voice in ${language}`}
                        >
                          {isThisSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                          <span>{isThisSpeaking ? (cleanLang === 'hi' ? 'रोकें' : 'Stop') : (cleanLang === 'hi' ? 'सुनें' : cleanLang === 'as' ? 'শুনক' : cleanLang === 'bn' ? 'শুনুন' : 'Listen')}</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            padding: '2px 6px'
                          }}
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <div style={{ flexShrink: 0 }}>
                <AiSahayakLogo
                  size="xs"
                  isSpeaking={true}
                  gender={voiceGender}
                  animated={true}
                />
              </div>
              <div style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                padding: '0.65rem 1rem',
                borderRadius: '4px 18px 18px 18px',
                fontSize: '0.85rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <Sparkles size={14} className="animate-spin" color={isFemale ? '#84cc16' : '#0ea5e9'} />
                <span>
                  {cleanLang === 'hi'
                    ? (isFemale ? 'AI सहायिका उत्तर तैयार कर रही हैं...' : 'AI सहायक उत्तर तैयार कर रहा है...')
                    : cleanLang === 'as'
                    ? 'AI সহায়কে উত্তৰ প্ৰস্তুত কৰি আছে...'
                    : cleanLang === 'bn'
                    ? 'AI সহায়ক উত্তর প্রস্তুত করছে...'
                    : 'AI Sahayak is analyzing...'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar with Voice Recognition & Quick Send (No Emojis) */}
        <div style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(stripEmojis(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            placeholder={
              cleanLang === 'hi'
                ? 'यहाँ अपना प्रश्न पूछें (जैसे असम के डॉक्टर, सनडाउनिंग, MMSE स्कोर)...'
                : cleanLang === 'as'
                ? 'ইয়াত প্ৰশ্ন সোধক (যেনে অসমৰ ডাক্তৰ, চানডাউনিং, MMSE স্কোৰ)...'
                : cleanLang === 'bn'
                ? 'এখানে প্রশ্ন জিজ্ঞাসা করুন (যেমন আসামের ডাক্তার, সানডাউনিং, MMSE স্কোর)...'
                : 'Ask anything (e.g. Doctors in Assam, Sundowning, MMSE score)...'
            }
            style={{
              flex: 1,
              padding: '0.75rem 1.15rem',
              borderRadius: '14px',
              border: '1.5px solid #cbd5e1',
              fontSize: '0.92rem',
              outline: 'none',
              background: '#f8fafc'
            }}
          />

          {/* Voice Input Microphone */}
          <button
            onClick={handleVoiceInput}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: isListening ? '#ef4444' : '#f1f5f9',
              color: isListening ? '#ffffff' : '#334155',
              border: isListening ? 'none' : '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              animation: isListening ? 'pulseGlow 1.5s infinite' : 'none'
            }}
            title="Speak your question in active language"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            onClick={() => handleSendQuery()}
            disabled={!inputText.trim()}
            style={{
              background: inputText.trim() ? '#052e26' : '#cbd5e1',
              color: inputText.trim() ? (isFemale ? '#bef226' : '#38bdf8') : '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '0.75rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: inputText.trim() ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: inputText.trim() ? '0 4px 12px rgba(5, 46, 38, 0.25)' : 'none'
            }}
          >
            <Send size={16} />
            <span>{cleanLang === 'hi' ? 'पूछें' : cleanLang === 'as' ? 'সোধক' : cleanLang === 'bn' ? 'পাঠান' : 'Ask'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
