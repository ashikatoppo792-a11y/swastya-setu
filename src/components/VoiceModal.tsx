import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, ArrowRight } from 'lucide-react';
import { SupportedLanguage, NavTab } from '../types';
import { startListening, speakText, stopSpeaking } from '../utils/speech';
import { soundManager } from '../utils/sound';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onNavigate: (tab: NavTab) => void;
  onEmergencySos: () => void;
}

const VOICE_HINTS: Record<SupportedLanguage, string[]> = {
  en: [
    '"Book a doctor consultation"',
    '"Check high fever and cough symptoms"',
    '"Find O negative blood donor"',
    '"Check my hospital OPD queue token"',
    '"Call emergency 108 ambulance"',
  ],
  hi: [
    '"डॉक्टर से बात करनी है"',
    '"तेज़ बुखार और सीने में दर्द की जांच करो"',
    '"O+ रक्तदाता खोजें"',
    '"दवाई का समय बताओ"',
    '"108 एम्बुलेंस बुलाओ"',
  ],
  bn: [
    '"ডাক্তারের সাথে কথা বলতে চাই"',
    '"জ্বর এবং কাশির পরীক্ষা করুন"',
    '"রক্তদাতা খুঁজুন"',
    '"১০৮ এম্বুলেন্স ডাকুন"',
  ],
  te: [
    '"డాక్టర్‌తో మాట్లాడాలి"',
    '"జ్వరం మరియు దగ్గును తనిఖీ చేయండి"',
    '"రక్తదాతను కనుగొనండి"',
    '"108 అంబులెన్స్ పిలవండి"',
  ],
  ta: [
    '"மருத்துவரிடம் பேச வேண்டும்"',
    '"காய்ச்சல் மற்றும் இருமல் பரிசோதனை"',
    '"இரத்த கொடையாளரை தேடுங்கள்"',
    '"108 அவசர ஊர்தி அழையுங்கள்"',
  ],
  mr: [
    '"डॉक्टरांचा सल्ला हवा आहे"',
    '"ताप आणि खोकल्याची तपासणी करा"',
    '"रक्तदाता शोधा"',
    '"१०८ रुग्णवाहिका बोलवा"',
  ],
};

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onNavigate,
  onEmergencySos,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [listeningController, setListeningController] = useState<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleStartListening();
      const greeting =
        currentLang === 'hi'
          ? 'नमस्ते, आप क्या खोजना चाहते हैं? बोलिए।'
          : currentLang === 'bn'
          ? 'নমস্কার, আপনি কি জানতে চান? বলুন।'
          : currentLang === 'te'
          ? 'నమస్కారం, మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు? చెప్పండి.'
          : currentLang === 'ta'
          ? 'வணக்கம், உங்களுக்கு என்ன உதவி வேண்டும்? பேசுங்கள்.'
          : currentLang === 'mr'
          ? 'नमस्कार, तुम्हाला काय माहिती हवी आहे? बोला.'
          : 'Hello! What can I help you find today? Please speak.';
      speakText(greeting, currentLang);
    } else {
      stopSpeaking();
      if (listeningController) {
        listeningController.stop();
      }
      setIsListening(false);
    }
  }, [isOpen]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('');
    setFeedback('Listening... please speak now');

    const ctrl = startListening(
      currentLang,
      (text) => {
        setTranscript(text);
        processVoiceCommand(text);
      },
      (err) => {
        setFeedback(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    setListeningController(ctrl);
  };

  const processVoiceCommand = (text: string) => {
    const lower = text.toLowerCase();
    soundManager.playSuccessChime();

    if (lower.includes('ambulance') || lower.includes('108') || lower.includes('emergency') || lower.includes('आपातकाल') || lower.includes('एम्बुलेंस')) {
      setFeedback('Triggering Emergency 108 SOS dispatch...');
      setTimeout(() => {
        onClose();
        onEmergencySos();
      }, 1000);
      return;
    }

    if (lower.includes('doctor') || lower.includes('telehealth') || lower.includes('hospital') || lower.includes('phc') || lower.includes('अस्पताल') || lower.includes('डॉक्टर')) {
      setFeedback('Opening Telehealth & Nearest Healthcare Centers...');
      setTimeout(() => {
        onNavigate('telehealth');
        onClose();
      }, 1000);
      return;
    }

    if (lower.includes('fever') || lower.includes('cough') || lower.includes('chest') || lower.includes('symptom') || lower.includes('लक्षण') || lower.includes('बुखार')) {
      setFeedback('Opening AI Symptom Triage Checker...');
      setTimeout(() => {
        onNavigate('triage');
        onClose();
      }, 1000);
      return;
    }

    if (lower.includes('medicine') || lower.includes('pill') || lower.includes('remind') || lower.includes('दवाई') || lower.includes('औषध')) {
      setFeedback('Opening Medicine & Follow-up Reminders...');
      setTimeout(() => {
        onNavigate('medicine');
        onClose();
      }, 1000);
      return;
    }

    if (lower.includes('blood') || lower.includes('donor') || lower.includes('खून') || lower.includes('रक्त')) {
      setFeedback('Opening Emergency Blood & Donor Locator...');
      setTimeout(() => {
        onNavigate('blood');
        onClose();
      }, 1000);
      return;
    }

    if (lower.includes('elder') || lower.includes('senior') || lower.includes('बुजुर्ग') || lower.includes('सहारा') || lower.includes('sahayak')) {
      setFeedback('Opening Sahayak Elder & Caregiver Dashboard...');
      setTimeout(() => {
        onNavigate('elder');
        onClose();
      }, 1000);
      return;
    }

    if (lower.includes('record') || lower.includes('abha') || lower.includes('prescription') || lower.includes('पर्चा') || lower.includes('रिपोर्ट')) {
      setFeedback('Opening ABHA Digital Health Locker...');
      setTimeout(() => {
        onNavigate('records');
        onClose();
      }, 1000);
      return;
    }

    setFeedback(`Heard: "${text}". Please tap one of the modules below or speak again.`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '30px 24px',
          textAlign: 'center',
          maxWidth: '520px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <h3 style={{ fontSize: '22px', margin: '4px 0 6px 0', color: 'var(--primary)' }}>
          Regional Voice Guide (वाणी सेतु)
        </h3>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '24px' }}>
          Speak naturally in your mother tongue to book doctors, check symptoms, or find emergency blood.
        </p>

        {/* Animated Audio Visualizer Circle */}
        <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 24px auto' }}>
          <div
            onClick={isListening ? () => setIsListening(false) : handleStartListening}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: isListening
                ? 'linear-gradient(135deg, #10b981 0%, #0c5a47 100%)'
                : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isListening ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              boxShadow: isListening ? '0 10px 30px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {isListening ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '36px' }}>
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
                <span className="voice-wave-bar" />
              </div>
            ) : (
              <Mic size={42} />
            )}
          </div>
        </div>

        {/* Status text */}
        <div style={{ minHeight: '44px', marginBottom: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
            {transcript ? `"${transcript}"` : feedback}
          </div>
          {transcript && (
            <div style={{ fontSize: '12.5px', color: 'var(--primary)', marginTop: '4px' }}>
              {feedback}
            </div>
          )}
        </div>

        {/* Hints */}
        <div style={{ background: 'var(--bg-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'left' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Try Saying Examples:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {(VOICE_HINTS[currentLang] || VOICE_HINTS.en).map((hint, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setTranscript(hint.replace(/"/g, ''));
                  processVoiceCommand(hint);
                }}
                style={{
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {hint}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
