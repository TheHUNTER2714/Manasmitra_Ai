# ManasMitra AI (मानस मित्र)

> **Adaptive Cognitive Gaming, Memory Assistance & Emergency Caregiver Lifeline for Elderly Dementia Patients in the North Eastern Region (NER)**

---

## 🌟 Overview
**ManasMitra AI** is a comprehensive, non-invasive digital therapeutic companion designed specifically for elderly individuals experiencing mild cognitive impairment (MCI) and early-stage dementia across the North-Eastern Region (NER) of India. 

The platform combines culturally attuned neuro-gaming, multilingual voice assistance (Hindi, English, Assamese, Khasi, Manipuri), an automated background emergency lifeline (SMS, WhatsApp, and Call), and a caregiver clinical monitoring dashboard.

---

## 🚀 Key Capabilities

### 1. 🚨 Automated Direct Emergency SOS: SMS, WhatsApp & Cellular Call
- **Background Execution:** When the senior presses the SOS button, the system initiates a 3-channel background dispatch:
  1. **Direct Native SMS (`sms:`):** Pre-populates the registered family member's phone number with live GPS coordinates (`26.1859° N, 91.7477° E`), current timestamp, elder age, cognitive condition, and device battery level (`84%`).
  2. **Direct WhatsApp Emergency API (`wa.me`):** Formats and opens an immediate WhatsApp distress chat directed at the family caregiver.
  3. **Direct Cellular Call & Automated Missed Call (`tel:`):** Automatically triggers the cellular dialer to generate an emergency priority ring on the family member's phone.
- **Audible & Vocal Calming:** Plays soothing Web Audio chimes and comforting voice guidance in Hindi and English.
- **Offline Reliability:** If internet connectivity is down, the system continues to operate locally, dispatching via cellular SMS and queueing all emergency events in an offline queue for automatic synchronization when reconnected.

### 2. 🎬 Cinematic Animated Logo Reveal
- Concentric expanding halo rings and ambient energy glow.
- 3D elastic spring-scaled Heart & Brain emblem with gentle heartbeat animation and golden orbiting sparkles.
- Shimmering typography reveal (*"ManasMitra AI | मानस मित्र"*).
- 3-second auto-transition with instant *"Enter Platform"* button and top navigation replay capability.

### 3. 📝 First-Time Elder & Family SOS Registration Flow
- Captures elder details (name, preferred calling name, age, NER location, dementia condition stage).
- Registers primary family caregiver name, relationship, and **Primary Emergency SOS Mobile Number**.
- Includes 1-click **"⚡ Quick Demo Fill"** button for evaluators and judges.
- Persisted locally in `localStorage` across sessions.

### 4. 🌐 Dribbble-Inspired Senior Care Landing Page
- High-contrast typography with coral accents: *"We Empower & Protect Seniors with ManasMitra AI"*.
- Interactive Action Search Pill with NER region switcher and registered caregiver SOS preview.
- Dark obsidian contrast section: *"What is Cognitive Care in Place?"*.
- 6 interactive cognitive game cards.
- 3 persona launchpads: **Elder Mode**, **Caregiver Dashboard**, and **Health Worker Portal**.

### 5. 🧠 6 Adaptive Cognitive Games
1. **Memory & Objects:** Cultural item retention (Assam Jaapi, Bihu Dhol, Tea Leaves, Rhino).
2. **Attention & Target:** Visual field scanning and target tracking.
3. **Pattern Sequence:** Rhythmic visual and numerical sequence extrapolation.
4. **Daily Routine Flow:** Procedural chronological orientation (morning walk, medications, meals).
5. **Sound & Object Match:** Auditory association matching acoustic cues (temple bell, kettle whistle, birds).
6. **Regional Story Recall:** Auditory retention and folklore comprehension.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Modular Vanilla CSS with design tokens (Obsidian `#0b132b`, Coral `#f43f5e`, Forest `#1b4332`)
- **Icons:** Lucide React
- **Audio & Speech:** Web Audio API + SpeechSynthesis / Web Speech API
- **Offline Engine:** Local Storage & Offline-First Event Queue

---

---

## ⚡ How to Run Directly (Windows)

### 🥇 Method 1: 1-Click Double-Click (Recommended)
Simply double-click **`start.bat`** (or **`run.bat`**) in the project folder:
- Automatically verifies your Node.js installation.
- Automatically installs `node_modules` on first run if missing.
- Starts the local Vite development server via `npm.cmd` (bypassing Windows PowerShell `npm.ps1` script restriction policies).
- Automatically opens your default browser to **`http://localhost:5173`**.

### 🥈 Method 2: Command Line (PowerShell or Command Prompt)
Run with `npm.cmd` rather than `npm` to prevent Windows execution policy restrictions:

```cmd
# 1. Install dependencies (if not already installed)
npm.cmd install

# 2. Start development server
npm.cmd run dev

# 3. Build production bundle (tested with 0 errors)
npm.cmd run build
```

> **💡 PowerShell Script Restriction Note:**
> If running `npm` outputs `npm.ps1 cannot be loaded because running scripts is disabled on this system`, either run `npm.cmd run dev` or run PowerShell as Administrator once and execute:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

---

## 🩺 Doctor Consultation & Reminder Alerts
Elders and caregivers can schedule appointments with top senior geriatric & cognitive specialists and configure proactive reminders:
- **Interactive Doctor Roster:** AIIMS / NEIGRIHMS certified neurologists, dementia therapists, and geriatric specialists.
- **Customizable Reminder Lead Times:** 15 minutes before, 1 hour before (recommended), 1 day before, or exact time.
- **Auditory Chimes & Voice Reminders:** Spoken alerts in Hindi/English announcing doctor name and time so seniors never miss an appointment.
- **Family Notification:** Automatic WhatsApp and SMS alert dispatch to family members.
- **Custom Instructions & Prescription Notes:** Specific notes (e.g. *Keep prescription & previous MRI reports ready*).
- **Interactive Alarm Test:** Live test audio button (`आवाज टेस्ट करें`) to verify speaker loudness.
- **Live Sync:** Appointments and reminder badges appear directly on the Elder Home screen (`ReminderWidget.jsx`) and the Caregiver Dashboard (`CaregiverDashboard.jsx`).

---

## 💬 Direct Family Messaging (परिवार को संदेश)
Direct, senior-accessible messaging channel bridging elders with their family caregivers:
- **Large 1-Tap Preset Messages:** Quick emotional and practical updates (*"I took my medicines"*, *"Feeling cheerful today"*, *"Call me when free"*, *"Had evening tea"*).
- **Microphone Voice Dictation:** Web Speech API continuous dictation allowing elders to speak rather than type.
- **Text-to-Speech Audio Readout:** Tap the speaker icon to listen to any message spoken aloud in natural Hindi or English.
- **Direct WhatsApp Bridge:** 1-tap button to open native WhatsApp pre-populated with the typed or dictated message.
- **Bidirectional Live Sync:** Real-time synchronization between Elder Mode and the Caregiver Portal via persistent local storage and storage events. Caregivers can send replies from their dashboard, which immediately appear in the elder's message thread.

---

## 🎨 Impressive Animated Brand Logo & Celestial Splash
- **Synaptic Mind-Heart Emblem:** Hand-crafted SVG featuring dual neural hemispheres, pulsating heart core, orbital quantum rings, and regional tea leaf accents.
- **Interactive Micro-Animations:** Breathing ambient glow, orbital particle tracks, and smooth hover elevation.
- **Harmonic Celestial Chime:** Multi-tone Web Audio synthesis (C5–E5–G5–C6 chord progression) sounding when the emblem locks into place.
- **Holographic Typography:** Shimmering gradient heading with MDoNER senior healthcare affiliation subtitle.
- **Custom Animated Favicon:** Embedded dynamic SVG favicon displayed on the browser tab.

---

## 🛠️ Tech Stack
- **Frontend Framework:** React 19 + Vite 8
- **Styling:** Modular Vanilla CSS with design tokens (Obsidian `#0b132b`, Coral `#f43f5e`, Forest `#1b4332`, Lime `#bef226`)
- **Icons:** Lucide React
- **Audio & Speech:** Web Audio API (harmonics, chimes) + SpeechSynthesis / Web Speech API (bilingual voice synthesis and recognition)
- **Offline Engine:** Local Storage & Offline-First Event Queue

---

## 📄 License
Non-invasive digital cognitive therapeutic companion platform developed for the North-Eastern Region Senior Health Initiative.
link - https://manasmitra-ai.onrender.com

