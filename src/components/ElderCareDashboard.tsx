import React, { useState } from 'react';
import {
  Accessibility,
  PhoneCall,
  Heart,
  Droplet,
  Footprints,
  Smile,
  Meh,
  Frown,
  Plus,
  Minus,
  CheckCircle2,
  Volume2,
  Bell,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';
import { ElderDailyLog, CaregiverAlert, SupportedLanguage } from '../types';
import { storage } from '../utils/storage';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';
import { speakText } from '../utils/speech';

interface ElderCareDashboardProps {
  currentLang: SupportedLanguage;
  onEmergencySos: () => void;
}

export const ElderCareDashboard: React.FC<ElderCareDashboardProps> = ({
  currentLang,
  onEmergencySos,
}) => {
  const t = translations[currentLang];
  const [elderLogs, setElderLogs] = useState<ElderDailyLog[]>(() => storage.getElderLogs());
  const [waterCount, setWaterCount] = useState(5);
  const [selectedMood, setSelectedMood] = useState<'great' | 'good' | 'neutral' | 'unwell'>('good');
  const [bpSystolic, setBpSystolic] = useState('130');
  const [bpDiastolic, setBpDiastolic] = useState('84');
  const [sugar, setSugar] = useState('138');
  const [walkMins, setWalkMins] = useState('20');
  const [checkinSaved, setCheckinSaved] = useState(false);

  const [caregiverAlerts] = useState<CaregiverAlert[]>([
    {
      id: 'ca1',
      timestamp: 'Today, 8:45 AM',
      type: 'APPOINTMENT',
      title: 'Morning Medicine Taken on Time',
      message: 'Rameshwar Sharma verified taking Metformin 500mg and Amlodipine 5mg.',
      isRead: true,
    },
    {
      id: 'ca2',
      timestamp: 'Yesterday, 6:30 PM',
      type: 'HIGH_BP',
      title: 'Blood Pressure Logged: 134/86 mmHg',
      message: 'Within acceptable elderly target range. Hydration good (7 glasses).',
      isRead: true,
    },
  ]);

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: ElderDailyLog = {
      id: `elog-${Date.now()}`,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: selectedMood,
      bpSystolic: parseInt(bpSystolic) || undefined,
      bpDiastolic: parseInt(bpDiastolic) || undefined,
      sugarLevel: parseInt(sugar) || undefined,
      waterGlasses: waterCount,
      walkMinutes: parseInt(walkMins) || 0,
      notes: `Daily wellness check-in: Feeling ${selectedMood}.`,
    };

    const updated = [newLog, ...elderLogs];
    setElderLogs(updated);
    storage.saveElderLogs(updated);

    soundManager.playSuccessChime();
    setCheckinSaved(true);
    setTimeout(() => setCheckinSaved(false), 3000);
  };

  const handleVoiceReadout = () => {
    const speech = `Namaste! Today you drank ${waterCount} glasses of water. Your blood pressure was logged as ${bpSystolic} over ${bpDiastolic}. Morning medicines were taken. Your daughter Priya has been updated. Stay healthy and hydrated.`;
    speakText(speech, currentLang);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>
              <Accessibility size={28} color="var(--primary)" />
              {t.tabs.elder}
            </h2>
            <p>{t.elderSubtitle}</p>
          </div>

          <button onClick={handleVoiceReadout} className="btn btn-outline btn-sm">
            <Volume2 size={16} color="var(--primary)" />
            Listen to Daily Health Routine
          </button>
        </div>
      </div>

      {/* 1-Touch Huge Emergency SOS Card for Seniors */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fef2f2 100%)',
          border: '2px solid #ef4444',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '28px',
          textAlign: 'center',
          boxShadow: '0 8px 20px rgba(220, 38, 38, 0.15)',
        }}
      >
        <h3 style={{ fontSize: '20px', color: '#991b1b', marginBottom: '8px' }}>
          🚨 Need Help Right Now?
        </h3>
        <p style={{ fontSize: '15px', color: '#7f1d1d', margin: '0 0 18px 0' }}>
          Press the big red button below to instantly alert 108 Ambulance and your family caregiver (Priya - +91 98765 43210).
        </p>

        <button
          onClick={onEmergencySos}
          className="pulse-emergency"
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '16px 28px',
            maxWidth: '100%',
            fontSize: 'clamp(14px, 4vw, 20px)',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.4)',
          }}
        >
          <PhoneCall size={24} />
          PRESS FOR EMERGENCY HELP (108 SOS)
        </button>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '24px' }}>
        {/* Daily Senior Check-in */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={20} color="var(--primary)" />
              Daily Health & Vitals Check-in
            </h3>
            {checkinSaved && (
              <span className="badge badge-success">Saved & Caregiver Synced ✓</span>
            )}
          </div>

          <form onSubmit={handleSaveCheckin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Mood selector */}
            <div>
              <label style={{ fontSize: '14px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                How are you feeling today?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'great', label: 'Very Happy', icon: Smile, color: '#10b981' },
                  { id: 'good', label: 'Good / Fine', icon: Smile, color: '#0284c7' },
                  { id: 'neutral', label: 'Tired / Weak', icon: Meh, color: '#f59e0b' },
                  { id: 'unwell', label: 'In Pain', icon: Frown, color: '#ef4444' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = selectedMood === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedMood(item.id as any)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSel ? `2px solid ${item.color}` : '1px solid var(--border)',
                        background: isSel ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={26} color={item.color} />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blood pressure inputs */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  BP (Upper / Systolic)
                </label>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  BP (Lower / Diastolic)
                </label>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '16px', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Sugar & Walk */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Sugar Level (mg/dL)
                </label>
                <input
                  type="number"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Walk Time (Minutes)
                </label>
                <input
                  type="number"
                  value={walkMins}
                  onChange={(e) => setWalkMins(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '16px', fontWeight: 700 }}
                />
              </div>
            </div>

            {/* Water intake counter with large buttons */}
            <div>
              <label style={{ fontSize: '13.5px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Water Intake Today
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => setWaterCount(Math.max(0, waterCount - 1))}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <Minus size={18} />
                </button>

                <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Droplet size={24} />
                  {waterCount} Glasses
                </div>

                <button
                  type="button"
                  onClick={() => setWaterCount(waterCount + 1)}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'var(--blue-subtle)',
                    color: 'var(--blue)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
              Save & Send to Caregiver
            </button>
          </form>
        </div>

        {/* Caregiver Remote Monitoring Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Caregiver sync badge card */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <UserCheck size={22} color="var(--primary)" />
              <h4 style={{ margin: 0, fontSize: '16px' }}>Caregiver Linked: Priya Sharma (Daughter)</h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Priya receives real-time SMS & WhatsApp alerts for medicine adherence, vitals readings, and emergency calls on <strong>+91 98765 43210</strong>.
            </p>
          </div>

          {/* Activity Alerts Log */}
          <div className="card">
            <h4 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={17} color="var(--primary)" />
              Recent Caregiver Activity & Alerts
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {caregiverAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    background: 'var(--bg-subtle)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{alert.title}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alert.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Vitals Logs */}
          <div className="card">
            <h4 style={{ fontSize: '15px', marginBottom: '12px' }}>Past Days Vitals History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {elderLogs.slice(0, 3).map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{log.date}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Mood: {log.mood} • Water: {log.waterGlasses} glasses
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {log.bpSystolic && (
                      <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                        BP: {log.bpSystolic}/{log.bpDiastolic}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
