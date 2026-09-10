import React, { useState } from 'react';
import {
  FolderLock,
  FileText,
  UploadCloud,
  QrCode,
  Share2,
  CheckCircle,
  Plus,
  Eye,
  Download,
  AlertTriangle,
  User,
  Heart,
  Calendar,
  Activity,
} from 'lucide-react';
import { HealthRecord, RecordCategory, UserProfile, SupportedLanguage } from '../types';
import { initialUserProfile, initialRecords } from '../data/mockData';
import { storage } from '../utils/storage';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';

interface DigitalHealthRecordProps {
  currentLang: SupportedLanguage;
}

export const DigitalHealthRecord: React.FC<DigitalHealthRecordProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [records, setRecords] = useState<HealthRecord[]>(() => storage.getRecords());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<HealthRecord | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // New record form state
  const [recTitle, setRecTitle] = useState('');
  const [recCategory, setRecCategory] = useState<RecordCategory>('Prescription');
  const [recDoctor, setRecDoctor] = useState('');
  const [recNotes, setRecNotes] = useState('');
  const [recBp, setRecBp] = useState('');
  const [recSugar, setRecSugar] = useState('');

  const handleUploadRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle.trim()) return;

    const newRecord: HealthRecord = {
      id: `rec-${Date.now()}`,
      title: recTitle.trim(),
      category: recCategory,
      doctorOrLab: recDoctor.trim() || 'PHC Medical Officer',
      date: new Date().toISOString().split('T')[0],
      notes: recNotes.trim(),
      vitalsSnapshot:
        recBp || recSugar
          ? {
              bp: recBp ? `${recBp} mmHg` : undefined,
              sugar: recSugar ? `${recSugar} mg/dL` : undefined,
            }
          : undefined,
    };

    const updated = [newRecord, ...records];
    setRecords(updated);
    storage.saveRecords(updated);

    soundManager.playSuccessChime();
    setIsUploadModalOpen(false);
    setRecTitle('');
    setRecDoctor('');
    setRecNotes('');
    setRecBp('');
    setRecSugar('');
  };

  const filteredRecords = records.filter(
    (r) => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>
              <FolderLock size={28} color="var(--primary)" />
              {t.tabs.records}
            </h2>
            <p>{t.recordsSubtitle}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setShowQrModal(true)} className="btn btn-outline btn-sm">
              <QrCode size={16} />
              Hospital Scan & Share QR
            </button>
            <button onClick={() => setIsUploadModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              Upload Medical Document
            </button>
          </div>
        </div>
      </div>

      {/* ABHA Digital Health Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0c5a47 0%, #064032 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: '#f59e0b',
                  color: '#0c5a47',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}
              >
                ABHA • AYUSHMAN BHARAT
              </span>
              <span style={{ fontSize: '12px', opacity: 0.85 }}>National Digital Health Mission</span>
            </div>

            <h3 style={{ fontSize: '22px', margin: '4px 0 6px 0' }}>{profile.name}</h3>
            <div style={{ fontSize: '15px', letterSpacing: '1px', opacity: 0.9, fontFamily: 'monospace' }}>
              ABHA ID: {profile.abhaId}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap', fontSize: '13px', opacity: 0.95 }}>
              <div>
                <strong>Age / Gender:</strong> {profile.age}y • {profile.gender}
              </div>
              <div>
                <strong>Blood Group:</strong> {profile.bloodGroup}
              </div>
              <div>
                <strong>Emergency Contact:</strong> {profile.emergencyContact}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                background: '#ffffff',
                padding: '6px',
                borderRadius: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              }}
            >
              <QrCode size={62} color="#0c5a47" />
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>Scan for OPD fast-track</div>
          </div>
        </div>

        {/* Medical Alerts & Vitals Snapshot */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.18)',
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '12.5px',
          }}
        >
          <div>
            <span style={{ opacity: 0.75, display: 'block' }}>Critical Allergies:</span>
            <span style={{ fontWeight: 600, color: '#fca5a5' }}>
              {profile.allergies.join(', ')}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0.75, display: 'block' }}>Chronic Conditions:</span>
            <span style={{ fontWeight: 600, color: '#fde047' }}>
              {profile.chronicConditions.join(', ')}
            </span>
          </div>
          <div>
            <span style={{ opacity: 0.75, display: 'block' }}>Caregiver Linked:</span>
            <span style={{ fontWeight: 600 }}>{profile.caregiverName}</span>
          </div>
        </div>
      </div>

      {/* Categories Tabs & Document List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['ALL', 'Prescription', 'LabReport', 'Vaccination', 'Imaging'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              >
                {cat === 'ALL' ? 'All Medical Records' : cat}
              </button>
            ))}
          </div>

          <span className="badge badge-success">{filteredRecords.length} Documents Secured</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                background: 'var(--bg-surface)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background:
                      record.category === 'Prescription'
                        ? 'var(--primary-subtle)'
                        : record.category === 'LabReport'
                        ? 'var(--blue-subtle)'
                        : 'var(--accent-subtle)',
                    color:
                      record.category === 'Prescription'
                        ? 'var(--primary)'
                        : record.category === 'LabReport'
                        ? 'var(--blue)'
                        : 'var(--accent-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      {record.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {record.date}
                    </span>
                  </div>
                  <h4 style={{ margin: '4px 0 2px 0', fontSize: '15px' }}>{record.title}</h4>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    Issued by: {record.doctorOrLab}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {record.vitalsSnapshot && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {record.vitalsSnapshot.bp && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        BP: {record.vitalsSnapshot.bp}
                      </span>
                    )}
                    {record.vitalsSnapshot.sugar && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        {record.vitalsSnapshot.sugar}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setPreviewRecord(record)}
                  className="btn btn-outline btn-sm"
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Preview Modal */}
      {previewRecord && (
        <div className="modal-overlay" onClick={() => setPreviewRecord(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-primary">{previewRecord.category}</span>
                <h3 style={{ fontSize: '18px', margin: '6px 0 2px 0' }}>{previewRecord.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Date: {previewRecord.date} • {previewRecord.doctorOrLab}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <h5 style={{ margin: '0 0 6px 0', fontSize: '13px' }}>Doctor's Notes & Findings:</h5>
              <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5 }}>
                {previewRecord.notes}
              </p>
            </div>

            {previewRecord.vitalsSnapshot && (
              <div style={{ marginBottom: '18px' }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>Recorded Health Vitals:</h5>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {Object.entries(previewRecord.vitalsSnapshot).map(([key, val]) => (
                    <div
                      key={key}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12.5px',
                      }}
                    >
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-muted)' }}>{key}: </span>
                      <strong>{val}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setPreviewRecord(null)} className="btn btn-outline" style={{ flex: 1 }}>
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Download size={15} />
                Download / Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Fast-track Modal */}
      {showQrModal && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '19px', marginBottom: '6px' }}>ABHA Scan & Share</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Present this QR code at any Government or Empaneled Hospital OPD counter for instant paperless registration.
            </p>

            <div
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto 16px auto',
                background: '#ffffff',
                border: '2px solid var(--primary)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <QrCode size={160} color="#0c5a47" />
            </div>

            <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace', marginBottom: '4px' }}>
              {profile.abhaId}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Linked to {profile.name} • Blood Group: {profile.bloodGroup}
            </div>

            <button onClick={() => setShowQrModal(false)} className="btn btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* Upload Record Modal */}
      {isUploadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>Upload Medical Record to ABHA</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Prescriptions, diagnostic test reports, immunization slips are encrypted and securely stored.
            </p>

            <form onSubmit={handleUploadRecord} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultrasound Pelvis, Blood Pressure Prescription"
                  value={recTitle}
                  onChange={(e) => setRecTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value as RecordCategory)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="LabReport">Lab Report</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="DischargeSummary">Discharge Summary</option>
                    <option value="Imaging">Imaging (X-Ray/ECG)</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Doctor or Lab Center
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PHC Mogar / Civil Lab"
                    value={recDoctor}
                    onChange={(e) => setRecDoctor(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Doctor's Instructions or Diagnosis
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes, dosages prescribed, follow-up advice..."
                  value={recNotes}
                  onChange={(e) => setRecNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Blood Pressure (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={recBp}
                    onChange={(e) => setRecBp(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Blood Sugar / HbA1c (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="130"
                    value={recSugar}
                    onChange={(e) => setRecSugar(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                  <UploadCloud size={16} />
                  Save to ABHA Locker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
