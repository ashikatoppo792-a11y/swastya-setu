import React, { useEffect } from 'react';
import {
  BellRing,
  CheckCircle,
  Clock,
  Smartphone,
  Volume2,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedicineReminder, SupportedLanguage } from '../types';
import { soundManager } from '../utils/sound';
import { speakText, stopSpeaking } from '../utils/speech';

interface PillAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: MedicineReminder | null;
  timeSlot: string;
  currentLang: SupportedLanguage;
  onMarkTaken: (reminderId: string, timeSlot: string) => void;
  onViewPrescription?: (url: string) => void;
}

export const PillAlarmModal: React.FC<PillAlarmModalProps> = ({
  isOpen,
  onClose,
  reminder,
  timeSlot,
  currentLang,
  onMarkTaken,
  onViewPrescription,
}) => {
  useEffect(() => {
    if (isOpen && reminder) {
      // Play alarm chime
      soundManager.playTokenBell();

      // Regional & English spoken readout
      const speechText =
        currentLang === 'hi'
          ? `नमस्ते, यह दवाई का समय है। कृपया ${reminder.name}, ${timeSlot} में, ${reminder.mealTiming === 'After Food' ? 'खाने के बाद' : 'खाने से पहले'} लें।`
          : `Swastya Setu Pill Reminder. It is time to take your ${timeSlot} dose of ${reminder.name}. Take ${reminder.dosage} ${reminder.mealTiming}.`;

      speakText(speechText, currentLang);
    }

    return () => {
      stopSpeaking();
    };
  }, [isOpen, reminder, timeSlot, currentLang]);

  if (!isOpen || !reminder) return null;

  const handleTakePill = () => {
    stopSpeaking();
    onMarkTaken(reminder.id, timeSlot);
    onClose();
  };

  const handleSnooze = () => {
    stopSpeaking();
    soundManager.playSuccessChime();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, background: 'rgba(0, 0, 0, 0.75)' }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '95%',
          textAlign: 'center',
          padding: '28px',
          borderRadius: '20px',
          border: '2px solid #10b981',
          boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.35)',
          background: '#ffffff',
          animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Pulsing Alarm Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0c5a47',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              animation: 'pulse 1.5s infinite',
            }}
          >
            <BellRing size={30} />
          </div>
        </div>

        <span
          className="badge badge-success"
          style={{
            fontSize: '12px',
            padding: '4px 12px',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontWeight: 800,
          }}
        >
          ⏰ Scheduled Dose: {timeSlot}
        </span>

        <h3 style={{ fontSize: '22px', margin: '8px 0 4px 0', color: '#0f172a' }}>
          Time to take your medication!
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px 0' }}>
          Compare the photo below with your medicine strip before swallowing.
        </p>

        {/* Visual Medicine Photo Display */}
        {reminder.photoUrl ? (
          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              marginBottom: '18px',
              maxHeight: '220px',
              background: '#f8fafc',
            }}
          >
            <img
              src={reminder.photoUrl}
              alt={reminder.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: '#ffffff',
                padding: '12px 14px 8px 14px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{reminder.name}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {reminder.dosage} • {reminder.mealTiming}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              background: 'var(--bg-subtle)',
              borderRadius: '12px',
              marginBottom: '18px',
            }}
          >
            <strong style={{ fontSize: '18px', color: '#0f172a', display: 'block' }}>
              {reminder.name}
            </strong>
            <span style={{ fontSize: '13.5px', color: '#64748b' }}>
              {reminder.dosage} • {reminder.mealTiming}
            </span>
          </div>
        )}

        {/* Special Instructions Note */}
        {reminder.specialInstructions && (
          <div
            style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12.5px',
              color: '#1e40af',
              marginBottom: '18px',
              textAlign: 'left',
            }}
          >
            <strong>Doctor's Note:</strong> {reminder.specialInstructions}
          </div>
        )}

        {/* Caregiver Sync notice */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '20px',
          }}
        >
          <Smartphone size={15} color="#10b981" />
          <span>Caregiver WhatsApp (+91 98765 43210) will be automatically confirmed.</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleTakePill}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '10px',
              boxShadow: '0 4px 14px rgba(12, 90, 71, 0.35)',
            }}
          >
            <CheckCircle size={20} />
            I Have Taken This Pill ✓
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSnooze}
              className="btn btn-outline"
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Clock size={16} />
              Snooze 10 Mins
            </button>

            {reminder.prescriptionPhotoUrl && onViewPrescription && (
              <button
                onClick={() => onViewPrescription(reminder.prescriptionPhotoUrl!)}
                className="btn btn-outline"
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={16} />
                Original Rx
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
