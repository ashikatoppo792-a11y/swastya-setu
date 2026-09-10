import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  CheckCircle,
  X,
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { DetectedMedication, PrescriptionPreset, MedicineReminder } from '../types';
import { samplePrescriptionPresets } from '../data/mockData';
import { scanPrescriptionImage } from '../utils/prescriptionScanner';
import { soundManager } from '../utils/sound';

interface PrescriptionPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMedications: (meds: MedicineReminder[]) => void;
}

export const PrescriptionPhotoModal: React.FC<PrescriptionPhotoModalProps> = ({
  isOpen,
  onClose,
  onImportMedications,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [doctorInfo, setDoctorInfo] = useState<{ doctorName?: string; facilityName?: string; prescriptionDate?: string }>({});
  const [detectedMeds, setDetectedMeds] = useState<DetectedMedication[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setSelectedImage(dataUrl);
        setImageFileName(file.name);
        runScanner(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: PrescriptionPreset) => {
    setSelectedImage(preset.imageUrl);
    setImageFileName(preset.title);
    runScanner(preset.imageUrl, preset.title);
  };

  const runScanner = async (imgSource: string, fName: string) => {
    setIsScanning(true);
    setScanStep('Analyzing optical image contrast & text lines...');
    soundManager.playSuccessChime();

    setTimeout(() => {
      setScanStep('Detecting clinical medicine shorthand (OD, BD, TDS, AC, PC)...');
    }, 350);

    setTimeout(() => {
      setScanStep('Cross-referencing National Essential Medicines database...');
    }, 600);

    try {
      const result = await scanPrescriptionImage(imgSource, fName);
      setDoctorInfo({
        doctorName: result.doctorName,
        facilityName: result.facilityName,
        prescriptionDate: result.prescriptionDate,
      });
      setDetectedMeds(result.medications);
      soundManager.playSuccessChime();
    } catch (err) {
      console.error('Scan failed', err);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const toggleMedSelection = (id: string) => {
    setDetectedMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const toggleMedTiming = (medId: string, time: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    setDetectedMeds((prev) =>
      prev.map((m) => {
        if (m.id !== medId) return m;
        const exists = m.timings.includes(time);
        if (exists && m.timings.length === 1) return m; // keep at least 1
        const nextTimings = exists ? m.timings.filter((t) => t !== time) : [...m.timings, time];
        return {
          ...m,
          timings: nextTimings,
          frequency:
            nextTimings.length === 1
              ? 'Once daily'
              : nextTimings.length === 2
              ? 'Twice daily'
              : 'Thrice daily',
        };
      })
    );
  };

  const handleMealChange = (medId: string, meal: 'Before Food' | 'After Food' | 'With Food') => {
    setDetectedMeds((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, mealTiming: meal } : m))
    );
  };

  const handleConfirmImport = () => {
    const selected = detectedMeds.filter((m) => m.selected);
    if (selected.length === 0) return;

    const newReminders: MedicineReminder[] = selected.map((m, idx) => ({
      id: `rx-${Date.now()}-${idx}`,
      name: m.name,
      dosage: m.dosage,
      frequency: m.frequency,
      timings: m.timings,
      mealTiming: m.mealTiming,
      startDate: new Date().toISOString().split('T')[0],
      durationDays: m.durationDays,
      totalPills: m.totalPills,
      remainingPills: m.totalPills,
      isTakenToday: {},
      caregiverPhone: '+91 98765 43210',
      colorTag: ['#0284c7', '#10b981', '#f59e0b', '#7c3aed', '#ec4899'][idx % 5],
      photoUrl: m.photoUrl,
      prescriptionPhotoUrl: selectedImage || undefined,
      specialInstructions: m.notes,
      detectedFromPrescription: true,
    }));

    soundManager.playSuccessChime();
    onImportMedications(newReminders);
    onClose();
  };

  const selectedCount = detectedMeds.filter((m) => m.selected).length;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '850px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          overflowY: 'auto',
          borderRadius: '16px',
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#ecfdf5',
                  color: '#0c5a47',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Camera size={20} />
              </div>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)' }}>
                Prescription & Medicine Photo Scanner
              </h3>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              Snap or upload a photo of your doctor's slip or medicine packaging. AI will extract pill schedules automatically.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Prescription Input Area */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: selectedImage ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Uploader Box */}
          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
            />
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#e0f2fe',
                color: '#0284c7',
                margin: '0 auto 12px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Upload size={22} />
            </div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>
              Upload Prescription or Snap Camera Photo
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
              Supports JPG, PNG, mobile camera snapshots, and medicine blister packs
            </p>
          </div>

          {/* Image Preview & Scanning Beam */}
          {selectedImage && (
            <div
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: '#000000',
                height: '210px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={selectedImage}
                alt="Prescription preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isScanning ? 0.75 : 1,
                  transition: 'opacity 0.2s',
                }}
              />

              {/* Laser Scanning Line Animation */}
              {isScanning && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #10b981, #3b82f6, #10b981)',
                    boxShadow: '0 0 15px #10b981, 0 0 30px #3b82f6',
                    animation: 'scanLaser 1.2s ease-in-out infinite alternate',
                    zIndex: 2,
                  }}
                />
              )}

              {/* Scanning status banner overlay */}
              {isScanning && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 3,
                  }}
                >
                  <Sparkles size={16} color="#10b981" />
                  <span>{scanStep}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Sample Prescriptions Preset Strip */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
            OR TEST WITH A SAMPLE CLINICAL PRESCRIPTION:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
            {samplePrescriptionPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = '#f0fdf4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = '#ffffff';
                }}
              >
                <img
                  src={preset.imageUrl}
                  alt={preset.title}
                  style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {preset.title}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{preset.doctorName}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Extracted Medications Section */}
        {detectedMeds.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="#10b981" />
                  Detected Medicines & Recommended Schedule ({detectedMeds.length})
                </h4>
                {doctorInfo.doctorName && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Prescribed by {doctorInfo.doctorName} • {doctorInfo.facilityName}
                  </p>
                )}
              </div>

              <span className="badge badge-success" style={{ fontSize: '11.5px' }}>
                {selectedCount} selected for reminder import
              </span>
            </div>

            {/* List of Detected Medications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {detectedMeds.map((med) => (
                <div
                  key={med.id}
                  style={{
                    border: med.selected ? '1.5px solid #10b981' : '1px solid var(--border)',
                    background: med.selected ? '#f0fdf4' : 'var(--bg-surface)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <input
                        type="checkbox"
                        checked={!!med.selected}
                        onChange={() => toggleMedSelection(med.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0c5a47' }}
                      />

                      {med.photoUrl && (
                        <img
                          src={med.photoUrl}
                          alt={med.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid var(--border)',
                          }}
                        />
                      )}

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '14.5px', color: '#0f172a' }}>{med.name}</strong>
                          <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                            {med.confidence}% Match
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {med.dosage} • Supply: {med.totalPills} pills ({med.durationDays} days)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={med.mealTiming}
                        onChange={(e) => handleMealChange(med.id, e.target.value as any)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          background: '#ffffff',
                          fontSize: '12px',
                          color: '#0f172a',
                        }}
                      >
                        <option value="Before Food">Before Food</option>
                        <option value="After Food">After Food</option>
                        <option value="With Food">With Food</option>
                      </select>
                    </div>
                  </div>

                  {/* Timings selector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                      <Clock size={14} color="#64748b" />
                      <span style={{ color: '#475569', fontWeight: 600 }}>Daily Times:</span>
                      {(['Morning', 'Afternoon', 'Evening', 'Bedtime'] as const).map((slot) => {
                        const isScheduled = med.timings.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleMedTiming(med.id, slot)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: isScheduled ? '1px solid #0c5a47' : '1px solid #cbd5e1',
                              background: isScheduled ? '#0c5a47' : '#ffffff',
                              color: isScheduled ? '#ffffff' : '#475569',
                            }}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    {med.notes && (
                      <div style={{ fontSize: '11.5px', color: '#047857', fontStyle: 'italic' }}>
                        ℹ️ {med.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmation Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={selectedCount === 0}
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontWeight: 700 }}
              >
                Add {selectedCount} Medication{selectedCount === 1 ? '' : 's'} to Pill Reminders
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 0; }
          100% { top: calc(100% - 4px); }
        }
      `}</style>
    </div>
  );
};
