import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  AlertOctagon,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  Printer,
  FileText,
  Info,
  ArrowRight,
  ShieldAlert,
  Pill,
  Clock,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Search,
  BellRing,
} from 'lucide-react';
import { SeverityLevel, TriageResult, SupportedLanguage, SuggestedMedicine, MedicineReminder } from '../types';
import { translations } from '../data/translations';
import { speakText, startListening } from '../utils/speech';
import { soundManager } from '../utils/sound';
import { storage } from '../utils/storage';
import {
  getSuggestedMedicinesForQuery,
  getLiveSymptomSuggestions,
} from '../data/symptomMedicines';

interface SymptomTriageProps {
  currentLang: SupportedLanguage;
  onEmergencySos: () => void;
  onNavigateToTelehealth: () => void;
  onNavigateToMedicine?: () => void;
  initialSymptom?: string | null;
  onClearInitialSymptom?: () => void;
}

const COMMON_SYMPTOM_CHIPS = [
  { label: 'High Fever & Chills', icon: '🌡️', query: 'High Fever with Chills (103°F)', medHint: 'Dolo 650, ORS' },
  { label: 'Persistent Cough', icon: '🫁', query: 'Persistent Cough with Phlegm', medHint: 'Cough Syrup, Lozenges' },
  { label: 'Severe Headache', icon: '⚡', query: 'Severe Headache & Dizziness', medHint: 'Paracetamol, Pain Balm' },
  { label: 'Diarrhea & Loose Motions', icon: '💧', query: 'Diarrhea & Loose Motions', medHint: 'ORS Electral, Zinc' },
  { label: 'Acidity & Heartburn', icon: '🔥', query: 'Acidity, Gas & Heartburn', medHint: 'Pantoprazole, Digene' },
  { label: 'Stomach Pain & Cramps', icon: '🩹', query: 'Severe Abdominal Pain & Cramps', medHint: 'Meftal-Spas' },
  { label: 'Skin Rash & Itching', icon: '🧴', query: 'Skin Rash with Itching', medHint: 'Calamine, Cetirizine' },
  { label: 'Joint & Knee Pain', icon: '🦵', query: 'Joint Pain & Muscle Sprain', medHint: 'Volini Gel, Paracetamol' },
  { label: 'Severe Chest Pain', icon: '🚨', query: 'Severe Chest Pain & Sweating', medHint: 'Emergency 108 SOS' },
];

export const SymptomTriage: React.FC<SymptomTriageProps> = ({
  currentLang,
  onEmergencySos,
  onNavigateToTelehealth,
  onNavigateToMedicine,
  initialSymptom,
  onClearInitialSymptom,
}) => {
  const t = translations[currentLang];
  const [symptomInput, setSymptomInput] = useState('');
  const [patientAge, setPatientAge] = useState('45');
  const [patientGender, setPatientGender] = useState('Female');
  const [durationDays, setDurationDays] = useState('2');
  const [isListening, setIsListening] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [addedReminderIds, setAddedReminderIds] = useState<{ [id: string]: boolean }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle initial symptom from search
  useEffect(() => {
    if (initialSymptom && initialSymptom.trim()) {
      setSymptomInput(initialSymptom);
      runClinicalTriage(initialSymptom);
      if (onClearInitialSymptom) {
        onClearInitialSymptom();
      }
    }
  }, [initialSymptom]);

  // Live symptom suggestions while user types
  const liveSuggestions = getLiveSymptomSuggestions(symptomInput);

  // Voice input handler
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    startListening(
      currentLang,
      (transcript) => {
        setSymptomInput((prev) => (prev ? `${prev}, ${transcript}` : transcript));
        setIsListening(false);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const runClinicalTriage = (input: string) => {
    const textToAnalyze = input || symptomInput;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();

      // Clinical triage engine rules
      let severity: SeverityLevel = 'SELFCARE';
      let title = '';
      let description = '';
      let immediateAction = '';

      // Match against clinical symptom & medicine knowledge base
      const matchedData = getSuggestedMedicinesForQuery(textToAnalyze);
      const { medicines, homeCareTips, redFlags } = matchedData;

      // 1. Critical Red Flag Conditions
      if (
        lower.includes('chest') ||
        lower.includes('heart') ||
        lower.includes('sweat') ||
        lower.includes('breath') ||
        lower.includes('stroke') ||
        lower.includes('unconscious') ||
        lower.includes('slur') ||
        lower.includes('bleeding heavily')
      ) {
        severity = 'EMERGENCY';
        soundManager.playEmergencyAlarm();
        title = 'CRITICAL: Potential Medical Emergency Detected';
        description =
          'Symptoms indicate high risk of acute cardiac distress, respiratory failure, or neurological emergency. Do not drive yourself.';
        immediateAction = 'Call Emergency 108 Ambulance immediately or rush to the nearest Emergency Department / District Hospital.';
      }
      // 2. Urgent conditions
      else if (
        lower.includes('high fever') ||
        lower.includes('chills') ||
        lower.includes('vomit') ||
        lower.includes('severe abdominal') ||
        lower.includes('dehydration') ||
        lower.includes('diarrhea') ||
        lower.includes('dast') ||
        parseInt(durationDays) >= 4
      ) {
        severity = 'URGENT';
        soundManager.playTokenBell();
        title = matchedData.matchedEntry
          ? `${matchedData.matchedEntry.symptomName} - Clinical Evaluation Advised`
          : 'Urgent Clinical Evaluation Advised';
        description =
          matchedData.matchedEntry?.clinicalSummary ||
          'Symptoms suggest active bacterial/viral infection, severe gastroenteritis, or acute inflammatory condition requiring physical examination today.';
        immediateAction = 'Visit the nearest Primary Health Centre (PHC) or Community Health Centre (CHC) within 2-4 hours.';
      }
      // 3. Telehealth conditions
      else if (
        lower.includes('cough') ||
        lower.includes('mild fever') ||
        lower.includes('headache') ||
        lower.includes('rash') ||
        lower.includes('joint') ||
        lower.includes('acidity') ||
        lower.includes('gas')
      ) {
        severity = 'TELECONSULT';
        soundManager.playSuccessChime();
        title = matchedData.matchedEntry
          ? `${matchedData.matchedEntry.symptomName} - Telehealth Guidance`
          : 'Non-Emergency: Telehealth Consultation Recommended';
        description =
          matchedData.matchedEntry?.clinicalSummary ||
          'Symptoms are stable and manageable via remote doctor video/audio consultation without hospital travel.';
        immediateAction = 'Connect with a government medical doctor via e-Sanjeevani or visit a Jan Aushadhi Kendra for relief.';
      }
      // 4. Self-care
      else {
        severity = 'SELFCARE';
        soundManager.playSuccessChime();
        title = 'Mild Symptoms: Home Care & Observation';
        description =
          'Mild discomfort that typically resolves with hydration, rest, and conservative home management.';
        immediateAction = 'Monitor symptoms over the next 24-48 hours. Rest well and maintain fluid intake.';
      }

      setTriageResult({
        id: `triage-${Date.now().toString().slice(-4)}`,
        query: textToAnalyze,
        detectedSymptoms: textToAnalyze.split(',').map((s) => s.trim()),
        severity,
        title,
        description,
        immediateAction,
        redFlags: redFlags.length > 0 ? redFlags : [
          'Symptoms worsening after 48 hours',
          'Development of fever > 102°F or severe localized pain',
        ],
        recommendedCare: matchedData.matchedEntry
          ? `Follow suggested medicine schedule below. ${matchedData.matchedEntry.clinicalSummary}`
          : 'Rest, hydration, and wholesome balanced diet with supportive medicine.',
        homeRemedies: homeCareTips,
        suggestedMedicines: medicines,
        printableSlipId: `SS-TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });

      setIsAnalyzing(false);
    }, 650);
  };

  const analyzeSymptoms = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    runClinicalTriage(symptomInput);
  };

  const handleReadAloud = () => {
    if (!triageResult) return;
    const medSummary = triageResult.suggestedMedicines && triageResult.suggestedMedicines.length > 0
      ? `Suggested medicines: ${triageResult.suggestedMedicines.map((m) => `${m.name}, ${m.dosage}`).join('. ')}`
      : '';
    const speechSummary = `${triageResult.title}. ${triageResult.immediateAction}. ${medSummary}`;
    speakText(speechSummary, currentLang);
  };

  // Add suggested medicine to active pill reminders
  const handleAddToReminders = (med: SuggestedMedicine) => {
    try {
      const existingReminders = storage.getReminders();
      const newReminder: MedicineReminder = {
        id: `rem-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency.includes('Twice')
          ? 'Twice daily'
          : med.frequency.includes('Thrice')
          ? 'Thrice daily'
          : med.frequency.includes('Once')
          ? 'Once daily'
          : 'As needed',
        timings: med.timings,
        mealTiming: med.mealTiming,
        startDate: new Date().toISOString().split('T')[0],
        durationDays: 5,
        totalPills: 10,
        remainingPills: 10,
        isTakenToday: {},
        colorTag: med.category === 'OTC' ? '#10b981' : med.category === 'FIRST_AID' ? '#dc2626' : '#0284c7',
        specialInstructions: `${med.purpose}. ${med.safetyWarning}`,
        detectedFromPrescription: false,
      };

      storage.saveReminders([newReminder, ...existingReminders]);
      setAddedReminderIds((prev) => ({ ...prev, [med.id]: true }));
      soundManager.playSuccessChime();

      setToastMessage(`✓ ${med.name} added to your Pill Reminders!`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Failed to save reminder:', err);
    }
  };

  // Read medicine details out loud in regional language
  const handleReadMedicineAloud = (med: SuggestedMedicine) => {
    const text = `Medicine: ${med.name}. Dosage: ${med.dosage}, taken ${med.mealTiming.toLowerCase()}. Frequency: ${med.frequency}. Purpose: ${med.purpose}. Caution: ${med.safetyWarning}`;
    speakText(text, currentLang);
  };

  return (
    <div>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0c5a47 0%, #064e3b 100%)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: 600,
            border: '1px solid #10b981',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <BellRing size={18} color="#f59e0b" />
          <span>{toastMessage}</span>
          {onNavigateToMedicine && (
            <button
              onClick={onNavigateToMedicine}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700,
                marginLeft: '8px',
              }}
            >
              View in Reminders ➔
            </button>
          )}
        </div>
      )}

      {/* Section Header */}
      <div className="section-header">
        <h2>
          <Stethoscope size={28} color="var(--primary)" />
          {t.tabs.triage}
        </h2>
        <p>AI-assisted symptom checker, medicine suggestions & clinical red-flag emergency detection</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: '24px' }}>
        {/* Input Form Column */}
        <div className="card">
          <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" />
            Describe Patient Symptoms
          </h3>

          <form onSubmit={analyzeSymptoms}>
            {/* Vitals row */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '100px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Age
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '110px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Gender
                </label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Child">Child (&lt;12y)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '110px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Duration
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                >
                  <option value="1">Less than 24h</option>
                  <option value="2">1 - 2 Days</option>
                  <option value="4">3 - 5 Days</option>
                  <option value="7">More than 1 week</option>
                </select>
              </div>
            </div>

            {/* Symptom text input with Mic */}
            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>Type or Speak Symptoms:</span>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 500 }}>
                  Supports regional Indian languages
                </span>
              </label>

              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. High fever with chills, body ache, dry cough, severe headache..."
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    outline: 'none',
                    resize: 'vertical',
                    fontSize: '14px',
                  }}
                />

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  title="Click to speak symptoms"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isListening ? '#ef4444' : 'var(--bg-subtle)',
                    color: isListening ? '#ffffff' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                  }}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              {isListening && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: '#dc2626', fontSize: '12px', fontWeight: 600 }}>
                  <span className="pulse-emergency" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
                  Listening... speak clearly now in your language.
                </div>
              )}

              {/* Instant Live Autocomplete & Suggested Medicines Preview */}
              {liveSuggestions.length > 0 && (
                <div
                  style={{
                    marginTop: '8px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Sparkles size={14} />
                    Live Medicine Suggestions Detected:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {liveSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--bg-surface)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                          fontSize: '12.5px',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>{item.symptomTitle}</strong>
                          <span style={{ display: 'block', fontSize: '11.5px', color: '#0c5a47', fontWeight: 600 }}>
                            💊 First Relief: {item.suggestedPillPreview}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSymptomInput(item.symptomTitle);
                            runClinicalTriage(item.symptomTitle);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '11px', padding: '4px 8px', whiteSpace: 'nowrap' }}
                        >
                          Check Dosages ➔
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Symptom Chips with Instant Medicine Hints */}
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                Tap Common Symptoms to Suggest Medicines:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {COMMON_SYMPTOM_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => {
                      setSymptomInput(chip.query);
                      runClinicalTriage(chip.query);
                    }}
                    style={{
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-full)',
                      padding: '6px 12px',
                      fontSize: '12px',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{chip.icon}</span>
                    <span style={{ fontWeight: 600 }}>{chip.label}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', borderLeft: '1px solid var(--border)', paddingLeft: '6px' }}>
                      {chip.medHint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing || !symptomInput.trim()}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            >
              {isAnalyzing ? 'Analyzing Clinical Risk & Medicines...' : 'Check Symptoms & Suggest Medicines'}
            </button>
          </form>
        </div>

        {/* Output / Triage Result Column */}
        <div>
          {triageResult ? (
            <div
              className={`card printable-area`}
              style={{
                borderTop: `6px solid ${
                  triageResult.severity === 'EMERGENCY'
                    ? '#dc2626'
                    : triageResult.severity === 'URGENT'
                    ? '#ea580c'
                    : triageResult.severity === 'TELECONSULT'
                    ? '#0284c7'
                    : '#10b981'
                }`,
              }}
            >
              {/* Slip Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span
                    className={`badge ${
                      triageResult.severity === 'EMERGENCY'
                        ? 'badge-emergency'
                        : triageResult.severity === 'URGENT'
                        ? 'badge-urgent'
                        : triageResult.severity === 'TELECONSULT'
                        ? 'badge-teleconsult'
                        : 'badge-success'
                    }`}
                  >
                    {triageResult.severity} PRIORITY
                  </span>
                  <h3 style={{ fontSize: '18px', margin: '6px 0 2px 0' }}>{triageResult.title}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Slip ID: {triageResult.printableSlipId} • Generated: {triageResult.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={handleReadAloud}
                    title="Read instructions out loud in your language"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 8px' }}
                  >
                    <Volume2 size={16} color="var(--primary)" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    title="Print Triage Summary Slip"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 8px' }}
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                {triageResult.description}
              </p>

              {/* Immediate Action Banner */}
              <div
                style={{
                  background:
                    triageResult.severity === 'EMERGENCY'
                      ? 'var(--crimson-subtle)'
                      : triageResult.severity === 'URGENT'
                      ? 'var(--accent-subtle)'
                      : 'var(--primary-subtle)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: `1px solid ${
                    triageResult.severity === 'EMERGENCY'
                      ? 'rgba(220, 38, 38, 0.3)'
                      : 'rgba(16, 185, 129, 0.3)'
                  }`,
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Immediate Required Action:
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>
                  {triageResult.immediateAction}
                </div>
              </div>

              {/* Emergency SOS Escalation CTA if Critical */}
              {triageResult.severity === 'EMERGENCY' && (
                <div style={{ marginBottom: '18px' }}>
                  <button
                    onClick={onEmergencySos}
                    className="btn btn-crimson pulse-emergency"
                    style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 800 }}
                  >
                    <PhoneCall size={20} />
                    Dial Emergency 108 Ambulance Dispatch
                  </button>
                </div>
              )}

              {triageResult.severity === 'TELECONSULT' && (
                <div style={{ marginBottom: '18px' }}>
                  <button
                    onClick={onNavigateToTelehealth}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: '14.5px' }}
                  >
                    <ArrowRight size={18} />
                    Connect with Free Telehealth Doctor Now
                  </button>
                </div>
              )}

              {/* ======================================================= */}
              {/* SUGGESTED MEDICINES & PHARMACY GUIDANCE SECTION         */}
              {/* ======================================================= */}
              <div
                style={{
                  marginBottom: '18px',
                  background: 'linear-gradient(180deg, rgba(2, 132, 199, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  border: '1.5px solid rgba(2, 132, 199, 0.25)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Pill size={20} color="#0284c7" />
                    <h4 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      Suggested Medicines & Symptom Relief
                    </h4>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#e0f2fe',
                      color: '#0369a1',
                      padding: '3px 8px',
                      borderRadius: '12px',
                    }}
                  >
                    Jan Aushadhi PMBI Verified
                  </span>
                </div>

                {triageResult.suggestedMedicines && triageResult.suggestedMedicines.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {triageResult.suggestedMedicines.map((med) => {
                      const isAdded = addedReminderIds[med.id];

                      return (
                        <div
                          key={med.id}
                          style={{
                            background: 'var(--bg-surface)',
                            border: `1px solid ${
                              med.category === 'FIRST_AID'
                                ? 'rgba(220, 38, 38, 0.4)'
                                : med.category === 'PRESCRIPTION_ONLY'
                                ? 'rgba(234, 88, 12, 0.3)'
                                : 'var(--border)'
                            }`,
                            borderRadius: '8px',
                            padding: '12px 14px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          {/* Medicine Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
                                  {med.name}
                                </span>
                                {med.brandExamples && (
                                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                                    ({med.brandExamples})
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {med.genericName}
                              </span>
                            </div>

                            {/* Classification Badge */}
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '3px 8px',
                                borderRadius: '6px',
                                textTransform: 'uppercase',
                                background:
                                  med.category === 'FIRST_AID'
                                    ? '#fee2e2'
                                    : med.category === 'PRESCRIPTION_ONLY'
                                    ? '#ffedd5'
                                    : '#d1fae5',
                                color:
                                  med.category === 'FIRST_AID'
                                    ? '#b91c1c'
                                    : med.category === 'PRESCRIPTION_ONLY'
                                    ? '#c2410c'
                                    : '#047857',
                              }}
                            >
                              {med.category === 'FIRST_AID'
                                ? 'Emergency First Aid'
                                : med.category === 'PRESCRIPTION_ONLY'
                                ? 'Prescription Advised'
                                : 'OTC - Safe Home Relief'}
                            </span>
                          </div>

                          {/* Dosage & Timing Badges */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0' }}>
                            <span style={{ fontSize: '11.5px', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                              <strong>Form:</strong> {med.form}
                            </span>
                            <span style={{ fontSize: '11.5px', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                              <strong>Dose:</strong> {med.dosage}
                            </span>
                            <span style={{ fontSize: '11.5px', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                              <strong>Frequency:</strong> {med.frequency}
                            </span>
                            <span style={{ fontSize: '11.5px', background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                              <strong>Timing:</strong> {med.mealTiming}
                            </span>
                          </div>

                          {/* Clinical Purpose */}
                          <p style={{ fontSize: '12.5px', color: 'var(--text-main)', margin: '6px 0', lineHeight: 1.4 }}>
                            <strong>Why it helps:</strong> {med.purpose}
                          </p>

                          {/* Safety Warning */}
                          {med.safetyWarning && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '6px',
                                background: '#fef3c7',
                                color: '#92400e',
                                padding: '6px 8px',
                                borderRadius: '5px',
                                fontSize: '11.5px',
                                marginTop: '6px',
                              }}
                            >
                              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{med.safetyWarning}</span>
                            </div>
                          )}

                          {/* Jan Aushadhi Generic Savings Notice */}
                          {med.janAushadhiPrice && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0c5a47', fontWeight: 600 }}>
                                <ShieldCheck size={14} />
                                {med.janAushadhiPrice}
                              </span>
                              {med.isGovtFree && (
                                <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10.5px' }}>
                                  Free at Govt PHC
                                </span>
                              )}
                            </div>
                          )}

                          {/* Action Buttons: Set Reminder & Audio Readout */}
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed var(--border)' }}>
                            <button
                              type="button"
                              onClick={() => handleAddToReminders(med)}
                              disabled={isAdded}
                              className={`btn btn-sm ${isAdded ? 'btn-outline' : 'btn-primary'}`}
                              style={{
                                flex: 1,
                                fontSize: '12px',
                                padding: '6px 12px',
                                background: isAdded ? '#10b981' : undefined,
                                color: isAdded ? '#ffffff' : undefined,
                                borderColor: isAdded ? '#10b981' : undefined,
                              }}
                            >
                              {isAdded ? (
                                <>
                                  <Check size={14} /> Added to Pill Reminders
                                </>
                              ) : (
                                <>
                                  <Clock size={14} /> Add to Pill Reminders
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReadMedicineAloud(med)}
                              title="Listen to medicine dosage instructions"
                              className="btn btn-outline btn-sm"
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                            >
                              <Volume2 size={15} color="var(--primary)" />
                            </button>

                            {med.category === 'PRESCRIPTION_ONLY' && (
                              <button
                                type="button"
                                onClick={onNavigateToTelehealth}
                                title="Consult doctor for digital e-prescription"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '6px 10px', fontSize: '12px', color: '#0284c7', borderColor: '#0284c7' }}
                              >
                                Consult Doctor ➔
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    No specific medicine required. Continue supportive hydration and rest.
                  </p>
                )}

                {/* Jan Aushadhi & PHC Pharmacy Assistance Banner */}
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '11.5px',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>
                    💡 Save 50-90% on generic medications at <strong>Pradhan Mantri Bhartiya Janaushadhi Kendras</strong> or ask your nearest PHC pharmacist.
                  </span>
                  {onNavigateToMedicine && (
                    <button
                      onClick={onNavigateToMedicine}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '11.5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        paddingLeft: '8px',
                      }}
                    >
                      View Reminders <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Red Flags warning box */}
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', marginBottom: '6px' }}>
                  <AlertTriangle size={15} />
                  Red Flag Warning Signs:
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {triageResult.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Care & Home Guidance */}
              <div>
                <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CheckCircle2 size={15} color="var(--primary)" />
                  Clinical Advice & Guidance:
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 8px 0' }}>
                  {triageResult.recommendedCare}
                </p>

                {triageResult.homeRemedies && triageResult.homeRemedies.length > 0 && (
                  <div style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: '6px', marginTop: '8px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Safe Supportive Home Care:
                    </span>
                    <ul style={{ paddingLeft: '18px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {triageResult.homeRemedies.map((rem, i) => (
                        <li key={i}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 20px',
                borderStyle: 'dashed',
              }}
            >
              <ShieldAlert size={48} color="var(--text-light)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '17px', margin: '0 0 6px 0' }}>AI Triage & Medicine Guide Ready</h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '380px' }}>
                Fill symptoms on the left or tap common complaints to receive an instant medical triage slip with suggested medicines, safe dosages, and emergency red-flag checking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
