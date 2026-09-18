import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, PlayCircle, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { offlineSyncEngine } from '../../services/offlineSyncEngine';

export default function JudgeDemoBar({ activeRole, setActiveRole, onLaunchGame, onOpenVoice }) {
  const [networkState, setNetworkState] = useState({
    isOnline: true,
    queueLength: 0,
    syncInProgress: false
  });
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [currentDemoStep, setCurrentDemoStep] = useState(0);

  useEffect(() => {
    const unsubscribe = offlineSyncEngine.subscribe(setNetworkState);
    return () => unsubscribe();
  }, []);

  const toggleNetwork = () => {
    offlineSyncEngine.setSimulatedNetworkStatus(!networkState.isOnline);
  };

  const manualSync = () => {
    if (networkState.isOnline) {
      offlineSyncEngine.syncQueuedEvents();
    }
  };

  const demoSteps = [
    {
      step: 1,
      title: 'Scene 1: Elder Voice Assistant (आवाज़ से संवाद)',
      tagline: 'Voice-First AI Assistant for Elderly Patients',
      description: 'The elderly user asks natural spoken queries in Hindi or English (e.g. "मुझे आज क्या करना है?" / "What is my schedule today?"). The assistant gives comforting audio replies and displays their daily routine.',
      actionLabel: 'Launch Voice Assistant Demo',
      onAction: () => {
        setIsDemoModalOpen(false);
        if (activeRole !== 'elder') setActiveRole('elder');
        if (onOpenVoice) onOpenVoice('मुझे आज क्या करना है?');
      }
    },
    {
      step: 2,
      title: 'Scene 2: Adaptive AI Difficulty Loop (अनुकूली AI कठिनाई स्तर)',
      tagline: 'Multi-Factor Neuro-Stimulation Algorithm',
      description: 'The elder plays "Remember the Objects" with Assam cultural artifacts (Japi, Tea Leaf, Bihu Dhol). Scoring >85% accuracy with low reaction latency triggers the AI to upgrade to Level 2 (Medium).',
      actionLabel: 'Play Memory Game (Adaptive AI)',
      onAction: () => {
        setIsDemoModalOpen(false);
        if (activeRole !== 'elder') setActiveRole('elder');
        if (onLaunchGame) onLaunchGame('memory');
      }
    },
    {
      step: 3,
      title: 'Scene 3: Offline Disconnection Simulation (ऑफलाइन मोड)',
      tagline: 'Remote Rural NER Connectivity Protection',
      description: 'Simulate entering a remote North-Eastern valley with zero mobile coverage. The system continues working 100% locally; game results and medication acknowledgments are safely queued in LocalStorage.',
      actionLabel: 'Simulate Offline Disconnection',
      onAction: () => {
        offlineSyncEngine.setSimulatedNetworkStatus(false);
        // Record a mock offline event to demonstrate queue
        offlineSyncEngine.recordEvent('GAME_COMPLETED', {
          game: 'Cultural Memory Objects',
          score: 95,
          accuracy: 95,
          level: 1,
          offlineTimestamp: new Date().toLocaleTimeString()
        });
      }
    },
    {
      step: 4,
      title: 'Scene 4: Reconnect & Smart Sync (पुनः कनेक्शन व सिंक)',
      tagline: 'Event Queue & Conflict-Free Cloud Synchronization',
      description: 'Internet connectivity is restored. ManasMitra AI automatically detects network recovery and flushes the encrypted sync queue to the cloud database with zero data loss.',
      actionLabel: 'Restore Network & Sync Now',
      onAction: () => {
        offlineSyncEngine.setSimulatedNetworkStatus(true);
      }
    },
    {
      step: 5,
      title: 'Scene 5: Caregiver & Healthcare Monitoring (केयरगिवर डैशबोर्ड)',
      tagline: 'Real-Time Insights Without Diagnostic Stigma',
      description: 'The caregiver and community healthcare worker view live 7-day cognitive performance trajectories, adherence %, priority alerts, and generate a downloadable clinical summary report.',
      actionLabel: 'Open Caregiver Dashboard',
      onAction: () => {
        setIsDemoModalOpen(false);
        setActiveRole('caregiver');
      }
    }
  ];

  return (
    <>
      <div className="judge-demo-banner">
        <div className="judge-demo-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="judge-badge">CST UP / SIH Evaluation Suite</span>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
              Problem #26003: AI Cognitive Companion for Elderly (NER)
            </span>
          </div>

          <div className="judge-controls">
            {/* Online / Offline Simulator Toggle */}
            <button
              onClick={toggleNetwork}
              className={`network-pill ${networkState.isOnline ? 'online' : 'offline'}`}
              title="Click to simulate losing or restoring internet connection"
            >
              {networkState.isOnline ? (
                <>
                  <Wifi size={14} /> Network: Online (कनेक्टेड)
                </>
              ) : (
                <>
                  <WifiOff size={14} /> Network: Offline (ऑफलाइन)
                </>
              )}
            </button>

            {/* Offline Sync Queue indicator */}
            <div className="sync-count-badge">
              {networkState.syncInProgress ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
                  <RefreshCw size={12} className="spin-icon" /> Syncing to Cloud...
                </span>
              ) : networkState.queueLength > 0 ? (
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                  ⚠️ {networkState.queueLength} Event(s) Queued Offline
                </span>
              ) : (
                <span style={{ color: '#4ade80' }}>
                  ✓ Cloud Synced
                </span>
              )}
            </div>

            {/* Manual Sync trigger if queued */}
            {networkState.isOnline && networkState.queueLength > 0 && (
              <button
                onClick={manualSync}
                className="acc-pill-btn"
                style={{ background: '#0284c7', color: 'white', border: 'none' }}
              >
                <RefreshCw size={12} /> Sync Queue Now
              </button>
            )}

            {/* Guided 5-Step Demo Tour Button */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="demo-story-btn"
              id="btn-run-judge-story"
            >
              <PlayCircle size={15} /> Run 5-Step Demo Story
            </button>
          </div>
        </div>
      </div>

      {/* Guided 5-Step Demo Modal */}
      {isDemoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles color="#d97706" size={24} />
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>ManasMitra AI: 5-Step Evaluator Story</h2>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                style={{ background: 'transparent', color: '#64748b', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Step Selector Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
              {demoSteps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setCurrentDemoStep(idx)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: currentDemoStep === idx ? '#1b4332' : '#f1f5f9',
                    color: currentDemoStep === idx ? '#ffffff' : '#475569',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Step {s.step}
                </button>
              ))}
            </div>

            {/* Current Step Content */}
            <div style={{
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.78rem',
                textTransform: 'uppercase'
              }}>
                {demoSteps[currentDemoStep].tagline}
              </span>
              <h3 style={{ fontSize: '1.3rem', margin: '0.75rem 0 0.5rem', color: '#0f172a' }}>
                {demoSteps[currentDemoStep].title}
              </h3>
              <p style={{ fontSize: '1rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {demoSteps[currentDemoStep].description}
              </p>

              <button
                onClick={demoSteps[currentDemoStep].onAction}
                style={{
                  background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
                  color: '#ffffff',
                  padding: '0.75rem 1.4rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(27, 67, 50, 0.25)'
                }}
              >
                <PlayCircle size={18} /> {demoSteps[currentDemoStep].actionLabel}
              </button>
            </div>

            {/* Modal Bottom Footer Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Step {currentDemoStep + 1} of {demoSteps.length}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {currentDemoStep > 0 && (
                  <button
                    onClick={() => setCurrentDemoStep((prev) => prev - 1)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      background: '#f1f5f9',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    Previous
                  </button>
                )}
                {currentDemoStep < demoSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentDemoStep((prev) => prev + 1)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      background: '#1b4332',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    Next Step <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsDemoModalOpen(false)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '8px',
                      background: '#15803d',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <CheckCircle2 size={16} /> Finish Tour
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
