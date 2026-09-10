import React, { useState } from 'react';
import {
  Pill,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  BellRing,
  Send,
  Calendar,
  Sparkles,
  Smartphone,
  Trash2,
  Camera,
  Image as ImageIcon,
  FileText,
  Eye,
  X,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MedicineReminder, SupportedLanguage } from '../types';
import { initialReminders } from '../data/mockData';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/sound';
import { translations } from '../data/translations';
import { PrescriptionPhotoModal } from './PrescriptionPhotoModal';
import { PillAlarmModal } from './PillAlarmModal';

interface MedicineRemindersProps {
  currentLang: SupportedLanguage;
}

export const MedicineReminders: React.FC<MedicineRemindersProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [reminders, setReminders] = useState<MedicineReminder[]>(() => storage.getReminders());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [whatsAppSimulatedAlert, setWhatsAppSimulatedAlert] = useState<string | null>(null);

  // Photo viewer lightbox state
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);

  // Pill Alarm simulator modal state
  const [alarmModalState, setAlarmModalState] = useState<{
    isOpen: boolean;
    reminder: MedicineReminder | null;
    timeSlot: string;
  }>({
    isOpen: false,
    reminder: null,
    timeSlot: 'Morning',
  });

  // New manual reminder form state
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 Tablet');
  const [mealTiming, setMealTiming] = useState<'Before Food' | 'After Food' | 'With Food'>('After Food');
  const [selectedTimings, setSelectedTimings] = useState<('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[]>([
    'Morning',
  ]);
  const [totalPills, setTotalPills] = useState('30');
  const [caregiverPhone, setCaregiverPhone] = useState('+91 98765 43210');
  const [medPhotoUrl, setMedPhotoUrl] = useState<string>('');

  const toggleTiming = (time: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    if (selectedTimings.includes(time)) {
      if (selectedTimings.length > 1) {
        setSelectedTimings(selectedTimings.filter((t) => t !== time));
      }
    } else {
      setSelectedTimings([...selectedTimings, time]);
    }
  };

  const handleMarkTaken = (reminderId: string, timeSlot: string) => {
    const updated = reminders.map((rem) => {
      if (rem.id === reminderId) {
        const nextState = !rem.isTakenToday[timeSlot];
        const newTaken = { ...rem.isTakenToday, [timeSlot]: nextState };
        const newRemaining = nextState ? Math.max(0, rem.remainingPills - 1) : rem.remainingPills + 1;
        return {
          ...rem,
          isTakenToday: newTaken,
          remainingPills: newRemaining,
        };
      }
      return rem;
    });

    setReminders(updated);
    storage.saveReminders(updated);

    // Audio & celebratory visual reward
    soundManager.playSuccessChime();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#0c5a47', '#10b981', '#f59e0b'],
    });

    // Auto simulate caregiver WhatsApp dispatch
    const targetMed = reminders.find((r) => r.id === reminderId);
    if (targetMed && targetMed.caregiverPhone) {
      setWhatsAppSimulatedAlert(
        `WhatsApp dispatched to ${targetMed.caregiverPhone}: "Swastya Setu Alert: Patient just took their ${targetMed.name} (${timeSlot} dose). Adherence confirmed!"`
      );
      setTimeout(() => setWhatsAppSimulatedAlert(null), 5000);
    }
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const newReminder: MedicineReminder = {
      id: `med-${Date.now()}`,
      name: medName.trim(),
      dosage: medDosage,
      frequency:
        selectedTimings.length === 1
          ? 'Once daily'
          : selectedTimings.length === 2
          ? 'Twice daily'
          : 'Thrice daily',
      timings: selectedTimings,
      mealTiming,
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 30,
      totalPills: parseInt(totalPills) || 30,
      remainingPills: parseInt(totalPills) || 30,
      isTakenToday: {},
      caregiverPhone,
      colorTag: ['#0284c7', '#10b981', '#f59e0b', '#7c3aed'][Math.floor(Math.random() * 4)],
      photoUrl: medPhotoUrl.trim() || undefined,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    storage.saveReminders(updated);

    soundManager.playSuccessChime();
    setIsAddModalOpen(false);
    setMedName('');
    setMedPhotoUrl('');
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    storage.saveReminders(updated);
  };

  const handleImportFromPrescription = (newReminders: MedicineReminder[]) => {
    const updated = [...reminders, ...newReminders];
    setReminders(updated);
    storage.saveReminders(updated);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0c5a47', '#10b981', '#3b82f6'],
    });

    setWhatsAppSimulatedAlert(
      `✓ Successfully scanned and imported ${newReminders.length} medications from prescription into your routine!`
    );
    setTimeout(() => setWhatsAppSimulatedAlert(null), 6000);
  };

  const handleTriggerTestAlarm = () => {
    const target = reminders[0] || initialReminders[0];
    const nextSlot = target.timings[0] || 'Morning';
    setAlarmModalState({
      isOpen: true,
      reminder: target,
      timeSlot: nextSlot,
    });
  };

  // Calculate adherence
  const totalSlots = reminders.reduce((acc, curr) => acc + curr.timings.length, 0);
  const takenSlots = reminders.reduce((acc, curr) => {
    return acc + curr.timings.filter((slot) => curr.isTakenToday[slot]).length;
  }, 0);
  const adherenceRate = totalSlots > 0 ? Math.round((takenSlots / totalSlots) * 100) : 100;

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2>
              <Pill size={28} color="var(--primary)" />
              {t.tabs.medicine}
            </h2>
            <p>{t.medicineSubtitle}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsScannerModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{
                background: 'linear-gradient(135deg, #0c5a47 0%, #047857 100%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                boxShadow: '0 4px 14px rgba(12, 90, 71, 0.25)',
                fontWeight: 700,
              }}
            >
              <Camera size={17} />
              Scan Prescription / Medicine Photo
            </button>

            <button
              onClick={handleTriggerTestAlarm}
              className="btn btn-outline btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderColor: '#10b981',
                color: '#065f46',
                background: '#ecfdf5',
                fontWeight: 600,
              }}
              title="Test the audio, visual, and voice pill reminder alarm"
            >
              <BellRing size={16} color="#10b981" />
              Test Live Pill Alarm
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              Add Manually
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp / Notification Dispatch Banner */}
      {whatsAppSimulatedAlert && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-md)',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#065f46',
            fontSize: '13.5px',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <Smartphone size={22} color="#10b981" />
          <div style={{ flex: 1 }}>{whatsAppSimulatedAlert}</div>
          <span className="badge badge-success">Caregiver Synced</span>
        </div>
      )}

      {/* Adherence & Routine Summary Card */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--primary-bg) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '17px',
                boxShadow: '0 4px 12px rgba(12, 90, 71, 0.25)',
              }}
            >
              <span>{adherenceRate}%</span>
            </div>
            <div>
              <h3 style={{ fontSize: '18px', margin: 0 }}>Today's Medicine Adherence</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                {takenSlots} of {totalSlots} doses completed for today
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span className="badge badge-success">
              <Sparkles size={12} />
              Caregiver WhatsApp Synced (+91 98765 43210)
            </span>
            <span className="badge badge-neutral">Photo Verification Active</span>
          </div>
        </div>
      </div>

      {/* Time-of-Day Slots Grid */}
      <div className="grid-4" style={{ marginBottom: '28px' }}>
        {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((slot) => {
          const medsInSlot = reminders.filter((r) => r.timings.includes(slot));

          return (
            <div
              key={slot}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{slot}</span>
                <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                  {medsInSlot.length} Pills
                </span>
              </div>

              {medsInSlot.length === 0 ? (
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center' }}>
                  No medicines scheduled
                </div>
              ) : (
                medsInSlot.map((med) => {
                  const isTaken = !!med.isTakenToday[slot];

                  return (
                    <div
                      key={`${med.id}-${slot}`}
                      style={{
                        borderLeft: `4px solid ${med.colorTag}`,
                        background: isTaken ? 'var(--primary-bg)' : 'var(--bg-subtle)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        {/* Pill Image Thumbnail */}
                        {med.photoUrl ? (
                          <div
                            onClick={() => setViewingPhotoUrl(med.photoUrl!)}
                            title="Click to inspect medicine photo"
                            style={{
                              position: 'relative',
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: '1.5px solid #cbd5e1',
                              flexShrink: 0,
                              background: '#ffffff',
                            }}
                          >
                            <img
                              src={med.photoUrl}
                              alt={med.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(0,0,0,0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                            >
                              <Eye size={14} color="#ffffff" />
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              background: '#ffffff',
                              border: '1.5px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: med.colorTag,
                              flexShrink: 0,
                            }}
                          >
                            <Pill size={20} />
                          </div>
                        )}

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong
                            style={{
                              fontSize: '13.5px',
                              textDecoration: isTaken ? 'line-through' : 'none',
                              color: isTaken ? 'var(--text-muted)' : 'var(--text-main)',
                              display: 'block',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {med.name}
                          </strong>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            {med.dosage} • {med.mealTiming}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        {med.prescriptionPhotoUrl && (
                          <button
                            type="button"
                            onClick={() => setViewingPhotoUrl(med.prescriptionPhotoUrl!)}
                            title="View Original Doctor's Prescription Slip"
                            style={{
                              fontSize: '10.5px',
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <FileText size={11} />
                            Doctor's Rx
                          </button>
                        )}

                        {med.remainingPills <= 5 && (
                          <span className="badge badge-urgent" style={{ fontSize: '10px', padding: '2px 6px', marginLeft: 'auto' }}>
                            Refill: {med.remainingPills} left
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleMarkTaken(med.id, slot)}
                        className={`btn btn-sm ${isTaken ? 'btn-outline' : 'btn-primary'}`}
                        style={{
                          width: '100%',
                          fontSize: '12px',
                          padding: '6px',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {isTaken ? (
                          <>
                            <CheckCircle size={14} color="var(--primary)" />
                            Taken ✓
                          </>
                        ) : (
                          <>
                            <Clock size={14} />
                            Mark Taken
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          );
        })}
      </div>

      {/* Manage Active Prescription Reminders Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '17px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--primary)" />
            Active Medicine Regimens & Photo Attachments
          </h3>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Total {reminders.length} medicines registered
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Photo / Medicine</th>
                <th style={{ padding: '10px' }}>Frequency & Schedule</th>
                <th style={{ padding: '10px' }}>Meal Timing</th>
                <th style={{ padding: '10px' }}>Remaining Supply</th>
                <th style={{ padding: '10px' }}>Prescription Slip</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((rem) => (
                <tr key={rem.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Photo Thumbnail */}
                      {rem.photoUrl ? (
                        <img
                          src={rem.photoUrl}
                          alt={rem.name}
                          onClick={() => setViewingPhotoUrl(rem.photoUrl!)}
                          title="Click to view full photo"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '6px',
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: rem.colorTag,
                            flexShrink: 0,
                          }}
                        >
                          <Pill size={18} />
                        </div>
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: rem.colorTag }} />
                          <span>{rem.name}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {rem.dosage}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {rem.timings.map((t) => (
                        <span key={t} className="badge badge-neutral" style={{ fontSize: '11px' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>{rem.mealTiming}</td>

                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: rem.remainingPills <= 5 ? '#dc2626' : 'var(--text-main)',
                      }}
                    >
                      {rem.remainingPills} / {rem.totalPills} pills
                    </span>
                    {rem.remainingPills <= 5 && (
                      <span style={{ fontSize: '11px', display: 'block', color: '#dc2626' }}>
                        Low stock alert!
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    {rem.prescriptionPhotoUrl ? (
                      <button
                        onClick={() => setViewingPhotoUrl(rem.prescriptionPhotoUrl!)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '3px 8px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <FileText size={12} />
                        View Rx
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Manual entry</span>
                    )}
                  </td>

                  <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      title="Delete reminder"
                      style={{ color: '#ef4444', padding: '6px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optical Prescription Photo Scanner Modal */}
      <PrescriptionPhotoModal
        isOpen={isScannerModalOpen}
        onClose={() => setIsScannerModalOpen(false)}
        onImportMedications={handleImportFromPrescription}
      />

      {/* Active Pill Alarm Simulator Modal */}
      <PillAlarmModal
        isOpen={alarmModalState.isOpen}
        onClose={() => setAlarmModalState({ isOpen: false, reminder: null, timeSlot: 'Morning' })}
        reminder={alarmModalState.reminder}
        timeSlot={alarmModalState.timeSlot}
        currentLang={currentLang}
        onMarkTaken={handleMarkTaken}
        onViewPrescription={(url) => setViewingPhotoUrl(url)}
      />

      {/* Photo Lightbox Viewer Modal */}
      {viewingPhotoUrl && (
        <div className="modal-overlay" onClick={() => setViewingPhotoUrl(null)} style={{ zIndex: 1300 }}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '95%',
              padding: '24px',
              textAlign: 'center',
              borderRadius: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="var(--primary)" />
                <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>
                  Medicine & Prescription Photo Viewer
                </h4>
              </div>
              <button
                onClick={() => setViewingPhotoUrl(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                maxHeight: '70vh',
                overflowY: 'auto',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                background: '#000000',
              }}
            >
              <img
                src={viewingPhotoUrl}
                alt="Medicine or Prescription slip"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Reminder Modal with Optional Photo Attachment */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', maxWidth: '580px' }}>
            <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>Add Medicine or Follow-up Schedule</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Create an automated alarm and caregiver notification schedule.
            </p>

            <form onSubmit={handleAddReminder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Medicine Name & Strength
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 650mg, Telmisartan 40mg"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>

              {/* Optional Photo Attachment */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Attach Photo of Medicine Strip / Box (Optional)
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setMedPhotoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ fontSize: '12px', flex: 1 }}
                  />
                  {medPhotoUrl && (
                    <img
                      src={medPhotoUrl}
                      alt="Preview"
                      style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Meal Timing
                  </label>
                  <select
                    value={mealTiming}
                    onChange={(e) => setMealTiming(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                  >
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                    <option value="With Food">With Food</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Select Daily Times
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTiming(time)}
                      className={`btn btn-sm ${selectedTimings.includes(time) ? 'btn-primary' : 'btn-outline'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Total Pills / Supply
                  </label>
                  <input
                    type="number"
                    value={totalPills}
                    onChange={(e) => setTotalPills(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Caregiver WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    value={caregiverPhone}
                    onChange={(e) => setCaregiverPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
