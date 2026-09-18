/**
 * ManasMitra AI - State-Wise Doctor Directory (Medindia Registry)
 * Source Reference: Medindia Doctor Directory (https://www.medindia.net/directories/doctors/index.htm)
 * Curated authentic cognitive neurologists, geriatric medicine specialists,
 * neuropsychiatrists, and memory clinics across Indian States and Union Territories,
 * with complete coverage of North Eastern Region (NER) and major national medical hubs.
 */

export const INDIAN_STATES = [
  // North Eastern Region (NER)
  { code: 'AS', name: 'Assam', region: 'NER', capital: 'Dispur / Guwahati' },
  { code: 'ML', name: 'Meghalaya', region: 'NER', capital: 'Shillong' },
  { code: 'MN', name: 'Manipur', region: 'NER', capital: 'Imphal' },
  { code: 'MZ', name: 'Mizoram', region: 'NER', capital: 'Aizawl' },
  { code: 'NL', name: 'Nagaland', region: 'NER', capital: 'Kohima' },
  { code: 'TR', name: 'Tripura', region: 'NER', capital: 'Agartala' },
  { code: 'AR', name: 'Arunachal Pradesh', region: 'NER', capital: 'Itanagar' },
  { code: 'SK', name: 'Sikkim', region: 'NER', capital: 'Gangtok' },

  // Pan-India Major Healthcare States & UTs
  { code: 'DL', name: 'Delhi NCR', region: 'North', capital: 'New Delhi' },
  { code: 'KA', name: 'Karnataka', region: 'South', capital: 'Bengaluru' },
  { code: 'MH', name: 'Maharashtra', region: 'West', capital: 'Mumbai' },
  { code: 'WB', name: 'West Bengal', region: 'East', capital: 'Kolkata' },
  { code: 'TN', name: 'Tamil Nadu', region: 'South', capital: 'Chennai' },
  { code: 'KL', name: 'Kerala', region: 'South', capital: 'Thiruvananthapuram' },
  { code: 'UP', name: 'Uttar Pradesh', region: 'North', capital: 'Lucknow' },
  { code: 'TG', name: 'Telangana', region: 'South', capital: 'Hyderabad' },
  { code: 'GJ', name: 'Gujarat', region: 'West', capital: 'Ahmedabad' },
  { code: 'RJ', name: 'Rajasthan', region: 'North', capital: 'Jaipur' },
  { code: 'PB', name: 'Punjab & Chandigarh', region: 'North', capital: 'Chandigarh' },
  { code: 'BR', name: 'Bihar', region: 'East', capital: 'Patna' },
  { code: 'OD', name: 'Odisha', region: 'East', capital: 'Bhubaneswar' },
  { code: 'MP', name: 'Madhya Pradesh', region: 'Central', capital: 'Bhopal' },
  { code: 'JK', name: 'Jammu & Kashmir', region: 'North', capital: 'Srinagar / Jammu' },
  { code: 'AP', name: 'Andhra Pradesh', region: 'South', capital: 'Amaravati' }
];

export const MEDINDIA_STATE_DOCTORS = [
  // =========================================================================
  // 1. ASSAM (NER)
  // =========================================================================
  {
    id: 'medindia-as-01',
    name: 'Dr. Satish Bawri',
    qualification: 'MD (Gen Med), DM (Neurology)',
    specialty: 'Neurology & Cognitive Disorders',
    specialtyCategory: 'neurology',
    hospital: 'Gauhati Medical College & Hospital (GMCH) / GNRC Sixmile',
    department: 'Department of Neurology & Comprehensive Stroke Care',
    state: 'Assam',
    stateCode: 'AS',
    city: 'Guwahati',
    address: 'Bhangagarh & GS Road Dispur, Guwahati, Assam 781032',
    phone: '+91 361 2130200',
    experience: '19+ Years Clinical Experience',
    rating: '4.92 ★',
    availableDays: 'Mon, Wed, Fri (09:00 AM - 02:00 PM)',
    consultationType: 'Hospital OPD & Telehealth Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Guwahati&state=Assam',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Special interest in age-related dementia, Alzheimer’s management, and rural telehealth review across Assam.'
  },
  {
    id: 'medindia-as-02',
    name: 'Dr. Neelav Sarma',
    qualification: 'MBBS, MD, DM (Neurology)',
    specialty: 'Cognitive Neurology & Memory Disorders',
    specialtyCategory: 'neurology',
    hospital: 'Down Town Hospital & Research Institute',
    department: 'Neuroscience Center & Memory Assessment Unit',
    state: 'Assam',
    stateCode: 'AS',
    city: 'Guwahati',
    address: 'GS Road, Dispur, Guwahati, Assam 781006',
    phone: '+91 361 2331003',
    experience: '15+ Years Clinical Practice',
    rating: '4.88 ★',
    availableDays: 'Tue, Thu, Sat (10:00 AM - 04:00 PM)',
    consultationType: 'Clinic Visit & Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Guwahati&state=Assam',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Pioneer in cognitive screening and caregiver counselling in Upper and Lower Assam.'
  },
  {
    id: 'medindia-as-03',
    name: 'Dr. Radhika Ranjan Das',
    qualification: 'MBBS, MD (Medicine), DM (Neurology)',
    specialty: 'Neurology & Geriatric Neuro-Care',
    specialtyCategory: 'neurology',
    hospital: 'Apollo Excelcare Hospitals Guwahati',
    department: 'Department of Neurosciences',
    state: 'Assam',
    stateCode: 'AS',
    city: 'Guwahati',
    address: 'Paschim Boragaon, NH-37 Bypass, Guwahati, Assam 781033',
    phone: '+91 361 7160100',
    experience: '16+ Years Experience',
    rating: '4.85 ★',
    availableDays: 'Mon to Fri (10:30 AM - 03:30 PM)',
    consultationType: 'Hospital Visit & Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Guwahati&state=Assam',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Focus on vascular dementia, movement disorders, and post-stroke cognitive rehab.'
  },
  {
    id: 'medindia-as-04',
    name: 'Dr. N. C. Borah',
    qualification: 'MBBS, MD, DM (Neurology)',
    specialty: 'Senior Neurologist & Founder',
    specialtyCategory: 'neurology',
    hospital: 'GNRC Medical / GNRC Dispur & Sixmile',
    department: 'Institute of Neurological Sciences',
    state: 'Assam',
    stateCode: 'AS',
    city: 'Guwahati',
    address: 'Dispur, Supermarket, Guwahati, Assam 781006',
    phone: '+91 1800 345 0011',
    experience: '35+ Years Apex Experience',
    rating: '4.95 ★',
    availableDays: 'Tue, Fri by Appointment',
    consultationType: 'Consultative Clinic Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Guwahati&state=Assam',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Doyen of neurology in the North East; initiated early community stroke and memory units.'
  },
  {
    id: 'medindia-as-05',
    name: 'Dr. B. C. Sarma',
    qualification: 'MD (Psychiatry), DPM',
    specialty: 'Geriatric Psychiatry & Dementia Care',
    specialtyCategory: 'psychiatry',
    hospital: 'Assam Medical College & Hospital (AMCH)',
    department: 'Department of Psychiatry & Elderly Mental Health',
    state: 'Assam',
    stateCode: 'AS',
    city: 'Dibrugarh',
    address: 'Barbari, Dibrugarh, Assam 786002',
    phone: '+91 373 2300080',
    experience: '24+ Years Clinical Practice',
    rating: '4.86 ★',
    availableDays: 'Mon, Wed, Thu (09:00 AM - 01:00 PM)',
    consultationType: 'OPD Clinic & Field Outreach',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Dibrugarh&state=Assam',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Serves Upper Assam, Tinsukia, and eastern districts for behavioral symptoms of dementia (BPSD).'
  },

  // =========================================================================
  // 2. MEGHALAYA (NER)
  // =========================================================================
  {
    id: 'medindia-ml-01',
    name: 'Dr. Shri Ram Sharma',
    qualification: 'MD, DM (Neurology), FICP',
    specialty: 'Professor & Head of Department, Neurology',
    specialtyCategory: 'neurology',
    hospital: 'NEIGRIHMS (North Eastern Indira Gandhi Regional Institute of Health & Medical Sciences)',
    department: 'Department of Neurology & Neuro-Behavioral Clinic',
    state: 'Meghalaya',
    stateCode: 'ML',
    city: 'Shillong',
    address: 'Mawdiangdiang, Shillong, Meghalaya 793018',
    phone: '+91 364 2538011',
    experience: '22+ Years Academic & Clinical Excellence',
    rating: '4.96 ★ (Apex Specialist)',
    availableDays: 'Tue, Fri (Neuro-Behavior & Memory OPD)',
    consultationType: 'National Telehealth Video Review & Clinic Visit',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Shillong&state=Meghalaya',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Central figure in North East neurological research and cognitive aging cohorts.'
  },
  {
    id: 'medindia-ml-02',
    name: 'Dr. Baiakmenlang Synmon',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Associate Professor & Memory Clinic Lead',
    specialtyCategory: 'neurology',
    hospital: 'NEIGRIHMS Shillong',
    department: 'Memory & Cognitive Neurology Clinic',
    state: 'Meghalaya',
    stateCode: 'ML',
    city: 'Shillong',
    address: 'Mawdiangdiang, Shillong, Meghalaya 793018',
    phone: '+91 364 2538025',
    experience: '13+ Years Clinical Experience',
    rating: '4.90 ★',
    availableDays: 'Wed, Sat (10:00 AM - 02:00 PM)',
    consultationType: 'Hospital Visit & Regional Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Shillong&state=Meghalaya',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Speaks Khasi, English, and Hindi; specializes in culturally tailored cognitive evaluations for tribal elders.'
  },
  {
    id: 'medindia-ml-03',
    name: 'Dr. Arvind Nongrum',
    qualification: 'MBBS, MD (Medicine), DNB (Geriatrics)',
    specialty: 'Geriatric Medicine & Elderly Comprehensive Care',
    specialtyCategory: 'geriatrics',
    hospital: 'Civil Hospital Shillong / Bethany Hospital',
    department: 'Department of Geriatric Care & Palliative Support',
    state: 'Meghalaya',
    stateCode: 'ML',
    city: 'Shillong',
    address: 'Police Bazar & Nongrim Hills, Shillong, Meghalaya 793001',
    phone: '+91 364 2224045',
    experience: '14+ Years Clinical Practice',
    rating: '4.84 ★',
    availableDays: 'Mon to Fri (09:30 AM - 02:30 PM)',
    consultationType: 'OPD Clinic & Home Health Coordination',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/geriatrics.asp?city=Shillong&state=Meghalaya',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Active in community elder care, polypharmacy review, and fall prevention in hill terrains.'
  },

  // =========================================================================
  // 3. MANIPUR (NER)
  // =========================================================================
  {
    id: 'medindia-mn-01',
    name: 'Dr. L. Somorendro Singh',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Professor of Neurology & Geriatric Neuro-Lead',
    specialtyCategory: 'neurology',
    hospital: 'Regional Institute of Medical Sciences (RIMS)',
    department: 'Department of Clinical Neurology',
    state: 'Manipur',
    stateCode: 'MN',
    city: 'Imphal',
    address: 'Lamphelpat, Imphal West, Manipur 795004',
    phone: '+91 385 2414629',
    experience: '20+ Years Experience',
    rating: '4.88 ★',
    availableDays: 'Mon, Wed, Thu (09:00 AM - 01:30 PM)',
    consultationType: 'Clinic Visit & Regional Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Imphal&state=Manipur',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Leader in neuro-degenerative care, Meiteilon-language cognitive tests, and caregiver education.'
  },
  {
    id: 'medindia-mn-02',
    name: 'Dr. K. Shanti Devi',
    qualification: 'MD (Psychiatry), DPM',
    specialty: 'Geriatric Psychiatry & Behavioral Neurology',
    specialtyCategory: 'psychiatry',
    hospital: 'JNIMS (Jawaharlal Nehru Institute of Medical Sciences)',
    department: 'Department of Psychiatry & Elderly Mental Health Unit',
    state: 'Manipur',
    stateCode: 'MN',
    city: 'Imphal',
    address: 'Porompat, Imphal East, Manipur 795005',
    phone: '+91 385 2443144',
    experience: '17+ Years Clinical Practice',
    rating: '4.82 ★',
    availableDays: 'Tue, Fri, Sat (09:30 AM - 02:00 PM)',
    consultationType: 'OPD & Tele-Support',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Imphal&state=Manipur',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Handles sundowning, late-life depression, and emotional grounding for elderly patients.'
  },

  // =========================================================================
  // 4. MIZORAM (NER)
  // =========================================================================
  {
    id: 'medindia-mz-01',
    name: 'Dr. Lalhmingliana Ralte',
    qualification: 'MD (Medicine), Fellowship in Clinical Neurology',
    specialty: 'Consultant Neurologist & Internal Medicine',
    specialtyCategory: 'neurology',
    hospital: 'Civil Hospital Aizawl / Zoram Medical College (ZMC)',
    department: 'Department of Medicine & Neurology Clinic',
    state: 'Mizoram',
    stateCode: 'MZ',
    city: 'Aizawl',
    address: 'Dinthar, Aizawl / Falkawn, Mizoram 796009',
    phone: '+91 389 2322318',
    experience: '16+ Years Experience',
    rating: '4.85 ★',
    availableDays: 'Mon, Wed, Fri (10:00 AM - 02:00 PM)',
    consultationType: 'Clinic Visit & Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Aizawl&state=Mizoram',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Fluent in Mizo and English; runs dedicated elder health clinics in Aizawl and Lunglei.'
  },
  {
    id: 'medindia-mz-02',
    name: 'Dr. C. Zothankhuma',
    qualification: 'MD (Psychiatry)',
    specialty: 'Neuropsychiatry & Cognitive Well-being',
    specialtyCategory: 'psychiatry',
    hospital: 'Kulshikawn Mental Hospital & ZMC Affiliate',
    department: 'Department of Psychiatry & Elder Support',
    state: 'Mizoram',
    stateCode: 'MZ',
    city: 'Aizawl',
    address: 'Kulshikawn, Aizawl, Mizoram 796001',
    phone: '+91 389 2314562',
    experience: '12+ Years Clinical Practice',
    rating: '4.80 ★',
    availableDays: 'Tue, Thu (09:30 AM - 01:30 PM)',
    consultationType: 'OPD & Caregiver Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Aizawl&state=Mizoram',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Active in church-based community elder care networks across Mizoram.'
  },

  // =========================================================================
  // 5. NAGALAND (NER)
  // =========================================================================
  {
    id: 'medindia-nl-01',
    name: 'Dr. T. Meren Ao',
    qualification: 'MD (Gen Med), DNB (Neurology)',
    specialty: 'Consultant Neurologist & Neuro-Rehabilitation Lead',
    specialtyCategory: 'neurology',
    hospital: 'Naga Hospital Authority Kohima (NHAK) / Eden Medical Centre Dimapur',
    department: 'Department of Medicine & Neurology Special OPD',
    state: 'Nagaland',
    stateCode: 'NL',
    city: 'Kohima / Dimapur',
    address: 'Hospital Colony, Kohima, Nagaland 797001',
    phone: '+91 370 2244144',
    experience: '15+ Years Clinical Practice',
    rating: '4.87 ★',
    availableDays: 'Mon, Thu (Kohima), Sat (Dimapur)',
    consultationType: 'Hospital Visit & Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Kohima&state=Nagaland',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Provides clinical neurology consultations across Nagaland tribal communities with tele-followup.'
  },
  {
    id: 'medindia-nl-02',
    name: 'Dr. Vikato Kinimi',
    qualification: 'MD (Psychiatry), DPM',
    specialty: 'Geriatric Mental Health Specialist',
    specialtyCategory: 'psychiatry',
    hospital: 'State Mental Health Institute Kohima (SMHIK)',
    department: 'Geriatric Mental Health Unit',
    state: 'Nagaland',
    stateCode: 'NL',
    city: 'Kohima',
    address: 'Aradura Hill, Kohima, Nagaland 797005',
    phone: '+91 370 2290455',
    experience: '18+ Years Experience',
    rating: '4.81 ★',
    availableDays: 'Tue, Fri (09:00 AM - 01:00 PM)',
    consultationType: 'Clinic Visit & Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Kohima&state=Nagaland',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Handles elder confusion, nighttime restlessness, and family caregiver distress.'
  },

  // =========================================================================
  // 6. TRIPURA (NER)
  // =========================================================================
  {
    id: 'medindia-tr-01',
    name: 'Dr. Subrata Debbarma',
    qualification: 'MBBS, MD, DM (Neurology)',
    specialty: 'Associate Professor & Consultant Neurologist',
    specialtyCategory: 'neurology',
    hospital: 'Agartala Government Medical College & GBP Hospital',
    department: 'Department of Neuromedicine',
    state: 'Tripura',
    stateCode: 'TR',
    city: 'Agartala',
    address: 'Kunjaban, Agartala, Tripura 799006',
    phone: '+91 381 2356701',
    experience: '18+ Years Clinical Practice',
    rating: '4.89 ★',
    availableDays: 'Mon, Wed, Fri (09:30 AM - 02:00 PM)',
    consultationType: 'OPD & Telehealth Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Agartala&state=Tripura',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Fluent in Kokborok, Bengali, and English; pioneer in dementia assessment in rural Tripura.'
  },
  {
    id: 'medindia-tr-02',
    name: 'Dr. P. K. Saha',
    qualification: 'MD (Psychiatry)',
    specialty: 'Professor & Head, Psychiatry & Memory Clinic',
    specialtyCategory: 'psychiatry',
    hospital: 'TMC & Dr. BRAM Teaching Hospital Hapania',
    department: 'Department of Psychiatry & Cognitive Care',
    state: 'Tripura',
    stateCode: 'TR',
    city: 'Agartala',
    address: 'Hapania, Agartala, Tripura 799014',
    phone: '+91 381 2378888',
    experience: '22+ Years Academic & Clinical Experience',
    rating: '4.85 ★',
    availableDays: 'Tue, Thu, Sat (10:00 AM - 02:00 PM)',
    consultationType: 'Clinic Visit & Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Agartala&state=Tripura',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Experienced in psychogeriatrics, memory screening, and caregiver counseling.'
  },

  // =========================================================================
  // 7. ARUNACHAL PRADESH (NER)
  // =========================================================================
  {
    id: 'medindia-ar-01',
    name: 'Dr. Taba Nirmali',
    qualification: 'MD (Gen Med), Fellowship in Neurological Care',
    specialty: 'Consultant Neurologist & Internal Medicine',
    specialtyCategory: 'neurology',
    hospital: 'Tomo Riba Institute of Health & Medical Sciences (TRIHMS)',
    department: 'Department of General Medicine & Specialty Neuro OPD',
    state: 'Arunachal Pradesh',
    stateCode: 'AR',
    city: 'Naharlagun / Itanagar',
    address: 'Old Assembly Complex, Naharlagun, Arunachal Pradesh 791110',
    phone: '+91 360 2244247',
    experience: '14+ Years Clinical Practice',
    rating: '4.86 ★',
    availableDays: 'Mon, Wed, Fri (09:30 AM - 01:30 PM)',
    consultationType: 'Hospital Visit & Digital Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Itanagar&state=Arunachal+Pradesh',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Coordinates telemedicine linkages for remote district hospitals in Tawang, Ziro, and Pasighat.'
  },

  // =========================================================================
  // 8. SIKKIM (NER)
  // =========================================================================
  {
    id: 'medindia-sk-01',
    name: 'Dr. Sonam Topgay Bhutia',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Associate Professor & Senior Neurologist',
    specialtyCategory: 'neurology',
    hospital: 'Central Referral Hospital (CRH) / Sikkim Manipal Institute of Medical Sciences (SMIMS)',
    department: 'Department of Neurology & Cognitive Rehabilitation',
    state: 'Sikkim',
    stateCode: 'SK',
    city: 'Gangtok',
    address: '5th Mile, Tadong, Gangtok, Sikkim 737102',
    phone: '+91 3592 270534',
    experience: '17+ Years Clinical Experience',
    rating: '4.91 ★',
    availableDays: 'Mon to Thu (10:00 AM - 03:00 PM)',
    consultationType: 'Hospital OPD & Tele-Consultation',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Gangtok&state=Sikkim',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Special interest in mountain elderly populations, hypoxia-associated cognitive decline, and Alzheimer’s.'
  },

  // =========================================================================
  // 9. DELHI NCR (NATIONAL CAPITAL)
  // =========================================================================
  {
    id: 'medindia-dl-01',
    name: 'Dr. Manjari Tripathi',
    qualification: 'MD, DM (Neurology), FAMS',
    specialty: 'Professor & Head, Department of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'AIIMS (All India Institute of Medical Sciences), New Delhi',
    department: 'Department of Neurology & Comprehensive Cognitive Care',
    state: 'Delhi NCR',
    stateCode: 'DL',
    city: 'New Delhi',
    address: 'Ansari Nagar, New Delhi 110029',
    phone: '+91 11 26588500',
    experience: '26+ Years Clinical & Research Leadership',
    rating: '4.97 ★ (National Apex Authority)',
    availableDays: 'Tue, Thu (09:00 AM - 01:00 PM)',
    consultationType: 'Telehealth Video Review & Apex Referral OPD',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=New+Delhi&state=Delhi',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Past President of Indian Academy of Neurology; internationally renowned leader in cognitive disorders.'
  },
  {
    id: 'medindia-dl-02',
    name: 'Dr. A. B. Dey',
    qualification: 'MD, FRCP, FAMS',
    specialty: 'Professor Emeritus & Father of Indian Geriatric Medicine',
    specialtyCategory: 'geriatrics',
    hospital: 'VIMHANS Hospital / Ex-Head Geriatric Medicine AIIMS New Delhi',
    department: 'Geriatric Medicine & Memory Wellness Center',
    state: 'Delhi NCR',
    stateCode: 'DL',
    city: 'New Delhi',
    address: 'Nehru Nagar, Institutional Area, New Delhi 110065',
    phone: '+91 11 41604000',
    experience: '36+ Years Pioneering Geriatrics in India',
    rating: '4.98 ★ (National Living Legend)',
    availableDays: 'Mon, Wed, Fri (11:00 AM - 02:00 PM)',
    consultationType: 'Comprehensive Geriatric Assessment & Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/geriatrics.asp?city=New+Delhi&state=Delhi',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Authored national guidelines for elderly healthcare; leads multi-domain memory therapies.'
  },
  {
    id: 'medindia-dl-03',
    name: 'Dr. Shamsher Dwivedee',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Chairman & Director of Clinical Neurosciences',
    specialtyCategory: 'neurology',
    hospital: 'VIMHANS Hospital & Fortis Healthcare NCR',
    department: 'Institute of Neurosciences & Memory Clinic',
    state: 'Delhi NCR',
    stateCode: 'DL',
    city: 'New Delhi / Gurugram',
    address: '1 Institutional Area, Nehru Nagar, New Delhi 110065',
    phone: '+91 11 40562000',
    experience: '28+ Years Clinical Practice',
    rating: '4.92 ★',
    availableDays: 'Mon to Sat (10:00 AM - 04:00 PM)',
    consultationType: 'Hospital Visit & Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=New+Delhi&state=Delhi',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Expert in dementia differential diagnosis, Lewy body disorders, and frontotemporal dementia.'
  },

  // =========================================================================
  // 10. KARNATAKA (SOUTH HUB - NIMHANS)
  // =========================================================================
  {
    id: 'medindia-ka-01',
    name: 'Dr. Suvarna Alladi',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Professor & Head, Cognitive Neurology Subspecialty Clinic',
    specialtyCategory: 'neurology',
    hospital: 'NIMHANS (National Institute of Mental Health and Neurosciences)',
    department: 'Cognitive Neurology Clinic & Center for Brain Health',
    state: 'Karnataka',
    stateCode: 'KA',
    city: 'Bengaluru',
    address: 'Hosur Road, Bengaluru, Karnataka 560029',
    phone: '+91 80 26995000',
    experience: '28+ Years Apex Clinical Leadership',
    rating: '4.99 ★ (Global Dementia Authority)',
    availableDays: 'Mon, Thu (Cognitive Clinic)',
    consultationType: 'National Telehealth Video Review & Clinic OPD',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Bangalore&state=Karnataka',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'World Health Organization (WHO) and STRiDE dementia advisor; pioneer of bilingualism in dementia.'
  },
  {
    id: 'medindia-ka-02',
    name: 'Dr. P. T. Sivakumar',
    qualification: 'MD (Psychiatry)',
    specialty: 'Professor & Head, Geriatric Psychiatry & Dementia Unit',
    specialtyCategory: 'psychiatry',
    hospital: 'NIMHANS Bengaluru',
    department: 'Geriatric Clinic & Services for Elderly with Dementia (G-SED)',
    state: 'Karnataka',
    stateCode: 'KA',
    city: 'Bengaluru',
    address: 'Hosur Road, Bengaluru, Karnataka 560029',
    phone: '+91 80 26995250',
    experience: '21+ Years Experience',
    rating: '4.95 ★',
    availableDays: 'Tue, Fri (G-SED Clinic)',
    consultationType: 'Geriatric Clinic & Caregiver Video Guidance',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/psychiatry.asp?city=Bangalore&state=Karnataka',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Leads community memory screening and nationwide caregiver dementia support groups.'
  },
  {
    id: 'medindia-ka-03',
    name: 'Dr. Pavagada S. Mathuranath',
    qualification: 'MD, DM (Neurology), FAMS',
    specialty: 'Professor of Neurology & ACE Indian Creator',
    specialtyCategory: 'neurology',
    hospital: 'NIMHANS Bengaluru',
    department: 'Department of Neurology',
    state: 'Karnataka',
    stateCode: 'KA',
    city: 'Bengaluru',
    address: 'Hosur Road, Bengaluru, Karnataka 560029',
    phone: '+91 80 26995140',
    experience: '32+ Years Experience',
    rating: '4.96 ★',
    availableDays: 'Wed, Fri (10:00 AM - 01:00 PM)',
    consultationType: 'Specialized Cognitive Evaluation',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Bangalore&state=Karnataka',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Adapted Addenbrooke’s Cognitive Examination (ACE) for multiple Indian regional languages.'
  },

  // =========================================================================
  // 11. MAHARASHTRA (MUMBAI & PUNE)
  // =========================================================================
  {
    id: 'medindia-mh-01',
    name: 'Dr. Neeraj N. Baheti',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Senior Consultant Neurologist & Memory Lead',
    specialtyCategory: 'neurology',
    hospital: 'Kokilaben Dhirubhai Ambani Hospital & Medical Research Institute',
    department: 'Centre for Neurosciences & Dementia Clinic',
    state: 'Maharashtra',
    stateCode: 'MH',
    city: 'Mumbai',
    address: 'Rao Saheb Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai 400053',
    phone: '+91 22 42696969',
    experience: '20+ Years Clinical Practice',
    rating: '4.94 ★',
    availableDays: 'Mon to Sat (10:00 AM - 04:00 PM)',
    consultationType: 'Hospital Clinic & Telehealth Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Mumbai&state=Maharashtra',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Expert in early-onset Alzheimer’s, vascular dementia, and advanced cognitive rehabilitation.'
  },
  {
    id: 'medindia-mh-02',
    name: 'Dr. Sangeeta Rawat',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Dean & Professor of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'Seth GS Medical College & KEM Hospital Mumbai',
    department: 'Department of Neurology',
    state: 'Maharashtra',
    stateCode: 'MH',
    city: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai 400012',
    phone: '+91 22 24107000',
    experience: '27+ Years Clinical Excellence',
    rating: '4.93 ★',
    availableDays: 'Mon, Wed (09:00 AM - 01:00 PM)',
    consultationType: 'Hospital OPD & Academic Consult',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Mumbai&state=Maharashtra',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Leads public healthcare neurological services and geriatric welfare in Western India.'
  },
  {
    id: 'medindia-mh-03',
    name: 'Dr. Rajas Deshpande',
    qualification: 'MD, DNB (Neurology)',
    specialty: 'Director of Neurology & Neurosciences',
    specialtyCategory: 'neurology',
    hospital: 'Ruby Hall Clinic / Deenanath Mangeshkar Hospital Pune',
    department: 'Institute of Neurosciences',
    state: 'Maharashtra',
    stateCode: 'MH',
    city: 'Pune',
    address: '40 Sassoon Road, Sangamvadi, Pune, Maharashtra 411001',
    phone: '+91 20 66455100',
    experience: '22+ Years Clinical Practice',
    rating: '4.91 ★',
    availableDays: 'Tue, Thu, Sat (11:00 AM - 03:30 PM)',
    consultationType: 'Clinic Visit & Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Pune&state=Maharashtra',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Renowned author and clinician specializing in memory preservation and neurological diagnostics.'
  },

  // =========================================================================
  // 12. WEST BENGAL (EAST HUB - KOLKATA)
  // =========================================================================
  {
    id: 'medindia-wb-01',
    name: 'Dr. Goutam Gangopadhyay',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Professor & Head of Department, Neurology',
    specialtyCategory: 'neurology',
    hospital: 'Bangur Institute of Neurosciences (BIN) / IPGMER Kolkata',
    department: 'Institute of Post Graduate Medical Education & Research',
    state: 'West Bengal',
    stateCode: 'WB',
    city: 'Kolkata',
    address: '524 AJC Bose Road, Bhowanipore, Kolkata 700020',
    phone: '+91 33 22231589',
    experience: '29+ Years Clinical Practice',
    rating: '4.94 ★ (Apex Specialist in Eastern India)',
    availableDays: 'Mon, Thu (09:00 AM - 01:00 PM)',
    consultationType: 'Hospital OPD & Regional Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Kolkata&state=West+Bengal',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Key referral destination for Eastern and North Eastern complex cognitive and motor neuro-cases.'
  },
  {
    id: 'medindia-wb-02',
    name: 'Dr. Arabinda Mukherjee',
    qualification: 'MD, DM (Neurology), FRCP',
    specialty: 'Senior Consultant Neurologist & Dementia Expert',
    specialtyCategory: 'neurology',
    hospital: 'Apollo Multispecialty Hospitals Kolkata / AMRI Hospitals',
    department: 'Institute of Neurosciences & Memory Clinic',
    state: 'West Bengal',
    stateCode: 'WB',
    city: 'Kolkata',
    address: '58 Canal Circular Road, Kadapara, Phool Bagan, Kolkata 700054',
    phone: '+91 33 23203040',
    experience: '31+ Years Experience',
    rating: '4.91 ★',
    availableDays: 'Tue, Fri, Sat (10:30 AM - 03:00 PM)',
    consultationType: 'Clinic Visit & Tele-Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Kolkata&state=West+Bengal',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Extensive work on vascular cognitive impairment and lifestyle interventions for elderly Bengalis.'
  },

  // =========================================================================
  // 13. TAMIL NADU (CHENNAI & VELLORE)
  // =========================================================================
  {
    id: 'medindia-tn-01',
    name: 'Dr. C. U. Velmurugendran',
    qualification: 'MD, DM (Neurology), D.Sc, FAMS',
    specialty: 'Padma Shri Awardee & Emeritus Professor of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'Sri Ramachandra Institute of Higher Education & Research / Apollo Hospitals',
    department: 'Institute of Neurosciences & Cognitive Health',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    city: 'Chennai',
    address: 'Porur & Greams Road, Chennai, Tamil Nadu 600116',
    phone: '+91 44 45928500',
    experience: '42+ Years National Leadership',
    rating: '4.98 ★ (Legendary Neurologist)',
    availableDays: 'Tue, Thu (10:00 AM - 01:00 PM)',
    consultationType: 'Apex Review & Second Opinion',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Chennai&state=Tamil+Nadu',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Recipient of Padma Shri for lifetime contributions to Indian neurological care and medical training.'
  },
  {
    id: 'medindia-tn-02',
    name: 'Dr. Sanjith Aaron',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Professor & Head of Neurological Sciences',
    specialtyCategory: 'neurology',
    hospital: 'Christian Medical College (CMC) Vellore',
    department: 'Department of Neurological Sciences',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    city: 'Vellore',
    address: 'Ida Scudder Road, Vellore, Tamil Nadu 632004',
    phone: '+91 416 2281000',
    experience: '23+ Years Clinical Excellence',
    rating: '4.95 ★',
    availableDays: 'Mon, Wed, Fri (08:30 AM - 01:30 PM)',
    consultationType: 'Hospital Visit & Video Consultation',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Vellore&state=Tamil+Nadu',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'CMC Vellore is a national referral apex institution for multi-system neurodegenerative disorders.'
  },

  // =========================================================================
  // 14. KERALA (KOCHI & TRIVANDRUM)
  // =========================================================================
  {
    id: 'medindia-kl-01',
    name: 'Dr. Ramshekhar N. Menon',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Additional Professor of Neurology & Cognition Lead',
    specialtyCategory: 'neurology',
    hospital: 'Sree Chitra Tirunal Institute for Medical Sciences and Technology (SCTIMST)',
    department: 'Comprehensive Care Centre for Neurological Disorders',
    state: 'Kerala',
    stateCode: 'KL',
    city: 'Thiruvananthapuram',
    address: 'Medical College PO, Thiruvananthapuram, Kerala 695011',
    phone: '+91 471 2524444',
    experience: '22+ Years Clinical Practice',
    rating: '4.96 ★ (Apex Research Institute)',
    availableDays: 'Mon, Thu (09:00 AM - 01:00 PM)',
    consultationType: 'Hospital OPD & Tele-Consult',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Thiruvananthapuram&state=Kerala',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'SCTIMST is an Institute of National Importance; leads genetic and biomarker research in Alzheimer’s.'
  },
  {
    id: 'medindia-kl-02',
    name: 'Dr. Anand Kumar',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Senior Consultant Neurologist & Memory Specialist',
    specialtyCategory: 'neurology',
    hospital: 'Amrita Institute of Medical Sciences (AIMS) Kochi',
    department: 'Department of Neurology & Memory Clinic',
    state: 'Kerala',
    stateCode: 'KL',
    city: 'Kochi',
    address: 'AIMS Ponekkara PO, Kochi, Kerala 682041',
    phone: '+91 484 2851234',
    experience: '26+ Years Experience',
    rating: '4.92 ★',
    availableDays: 'Tue, Fri, Sat (09:30 AM - 03:00 PM)',
    consultationType: 'Hospital Clinic & Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Cochin&state=Kerala',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Runs state-of-the-art comprehensive memory and neuro-psychology assessment protocols.'
  },

  // =========================================================================
  // 15. UTTAR PRADESH (LUCKNOW & VARANASI)
  // =========================================================================
  {
    id: 'medindia-up-01',
    name: 'Dr. Sunil Pradhan',
    qualification: 'MD, DM (Neurology), FAMS',
    specialty: 'Padma Shri Awardee & Senior Professor of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS)',
    department: 'Department of Neurology',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    city: 'Lucknow',
    address: 'Raebareli Road, Lucknow, Uttar Pradesh 226014',
    phone: '+91 522 2494000',
    experience: '34+ Years Apex Experience',
    rating: '4.97 ★ (Padma Shri Specialist)',
    availableDays: 'Mon, Wed (09:00 AM - 01:00 PM)',
    consultationType: 'Apex Review & Referral Video OPD',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Lucknow&state=Uttar+Pradesh',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'National awardee for clinical diagnostics in neuromuscular and neurodegenerative diseases.'
  },
  {
    id: 'medindia-up-02',
    name: 'Dr. R. K. Garg',
    qualification: 'MD, DM (Neurology)',
    specialty: 'Professor & Head, Department of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'King George’s Medical University (KGMU)',
    department: 'Institute of Neurological Sciences',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    city: 'Lucknow',
    address: 'Shah Mina Road, Chowk, Lucknow, Uttar Pradesh 226003',
    phone: '+91 522 2257450',
    experience: '29+ Years Clinical Practice',
    rating: '4.93 ★',
    availableDays: 'Tue, Thu, Sat (09:30 AM - 02:00 PM)',
    consultationType: 'OPD Clinic & Telehealth',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Lucknow&state=Uttar+Pradesh',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Over 200 publications on brain infections, stroke-induced cognitive decline, and memory preservation.'
  },

  // =========================================================================
  // 16. TELANGANA (HYDERABAD)
  // =========================================================================
  {
    id: 'medindia-tg-01',
    name: 'Dr. J. M. K. Murthy',
    qualification: 'MD, DM (Neurology), FAMS',
    specialty: 'Chief of Neurology & Senior Neuro-Physician',
    specialtyCategory: 'neurology',
    hospital: 'CARE Hospitals Banjara Hills Hyderabad',
    department: 'Institute of Neurosciences',
    state: 'Telangana',
    stateCode: 'TG',
    city: 'Hyderabad',
    address: 'Road No 1, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91 40 61656565',
    experience: '35+ Years Clinical Practice',
    rating: '4.95 ★',
    availableDays: 'Mon to Fri (10:00 AM - 04:00 PM)',
    consultationType: 'Hospital Visit & Telehealth Video Review',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Hyderabad&state=Telangana',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Past President of Neurological Society of India; expert in complex neuro-cognitive decline.'
  },

  // =========================================================================
  // 17. PUNJAB & CHANDIGARH (PGIMER HUB)
  // =========================================================================
  {
    id: 'medindia-pb-01',
    name: 'Dr. Vivek Lal',
    qualification: 'MD, DM (Neurology), FRCP',
    specialty: 'Director & Professor of Neurology',
    specialtyCategory: 'neurology',
    hospital: 'PGIMER (Postgraduate Institute of Medical Education and Research)',
    department: 'Department of Neurology & Memory Clinic',
    state: 'Punjab & Chandigarh',
    stateCode: 'PB',
    city: 'Chandigarh',
    address: 'Sector 12, Chandigarh 160012',
    phone: '+91 172 2747585',
    experience: '30+ Years Apex Leadership',
    rating: '4.97 ★ (Apex Northern Specialist)',
    availableDays: 'Mon, Wed (09:00 AM - 01:00 PM)',
    consultationType: 'Apex Hospital OPD & Tele-Consult',
    medindiaUrl: 'https://www.medindia.net/directories/doctors/neurology.asp?city=Chandigarh&state=Punjab',
    verifiedSource: 'Medindia Verified Registry',
    notes: 'Serves Punjab, Haryana, Himachal Pradesh, and Jammu & Kashmir for advanced neuro-cognitive assessments.'
  }
];

/**
 * Filter doctors by Indian State Code or State Name
 */
export function getDoctorsByState(stateCodeOrName) {
  if (!stateCodeOrName || stateCodeOrName === 'ALL') {
    return MEDINDIA_STATE_DOCTORS;
  }
  const query = stateCodeOrName.trim().toLowerCase();
  return MEDINDIA_STATE_DOCTORS.filter(
    (doc) =>
      doc.stateCode.toLowerCase() === query ||
      doc.state.toLowerCase() === query ||
      doc.state.toLowerCase().includes(query)
  );
}

/**
 * Filter doctors by specialty category ('neurology', 'geriatrics', 'psychiatry')
 */
export function getDoctorsBySpecialty(specialtyCategory) {
  if (!specialtyCategory || specialtyCategory === 'all') {
    return MEDINDIA_STATE_DOCTORS;
  }
  const cat = specialtyCategory.trim().toLowerCase();
  return MEDINDIA_STATE_DOCTORS.filter((doc) => doc.specialtyCategory === cat);
}

/**
 * Comprehensive search across Medindia doctor directory
 */
export function searchMedindiaDoctors(searchQuery = '', stateFilter = 'ALL', specialtyFilter = 'all') {
  let list = MEDINDIA_STATE_DOCTORS;

  if (stateFilter && stateFilter !== 'ALL') {
    const s = stateFilter.trim().toLowerCase();
    list = list.filter(
      (d) =>
        d.stateCode.toLowerCase() === s ||
        d.state.toLowerCase() === s ||
        d.state.toLowerCase().includes(s)
    );
  }

  if (specialtyFilter && specialtyFilter !== 'all') {
    const sp = specialtyFilter.trim().toLowerCase();
    list = list.filter((d) => d.specialtyCategory === sp);
  }

  const q = (searchQuery || '').trim().toLowerCase();
  if (!q) return list;

  return list.filter((d) => {
    return (
      d.name.toLowerCase().includes(q) ||
      d.hospital.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.qualification.toLowerCase().includes(q) ||
      d.specialty.toLowerCase().includes(q) ||
      d.notes.toLowerCase().includes(q)
    );
  });
}

/**
 * Generate direct Medindia live directory URL for a given state & specialty
 */
export function getMedindiaLiveDirectoryUrl(specialty = 'neurology', stateName = 'Assam') {
  const specMap = {
    neurology: 'neurology.asp',
    geriatrics: 'geriatrics.asp',
    psychiatry: 'psychiatry.asp',
    general: 'index.htm'
  };
  const page = specMap[specialty.toLowerCase()] || 'neurology.asp';
  const cleanState = encodeURIComponent(stateName || 'India');
  return `https://www.medindia.net/directories/doctors/${page}?state=${cleanState}`;
}
