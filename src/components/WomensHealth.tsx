import React, { useState } from 'react';
import {
  Heart,
  EyeOff,
  Eye,
  Shield,
  Calendar,
  Phone,
  MessageCircle,
  Sparkles,
  Send,
  HelpCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { WomensHealthTip, FemaleSpecialist, SupportedLanguage } from '../types';
import { mockWomensTips, mockSpecialists } from '../data/mockData';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';

interface WomensHealthProps {
  currentLang: SupportedLanguage;
}

export const WomensHealth: React.FC<WomensHealthProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [isPrivacyShieldActive, setIsPrivacyShieldActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'tracker' | 'specialists' | 'anonymous_qa'>('tips');

  // Menstrual Tracker State
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-08-22');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  // Anonymous Q&A State
  const [anonymousQuery, setAnonymousQuery] = useState('');
  const [qaThread, setQaThread] = useState<
    { id: string; question: string; answer: string; answeredBy: string; time: string }[]
  >([
    {
      id: 'qa1',
      question: 'Is spotting between menstrual cycles normal or should I be concerned?',
      answer:
        'Occasional light spotting during ovulation is common. However, if accompanied by pelvic pain, odor, or occurs after intercourse, please consult your nearest ANM or gynecologist for a gentle pelvic check.',
      answeredBy: 'Dr. Sunita Deshmukh (Gynecologist)',
      time: '2 hours ago',
    },
    {
      id: 'qa2',
      question: 'How many Iron Folic Acid (IFA) tablets should I take during my 5th month of pregnancy?',
      answer:
        'Under the National Health Mission, 1 red IFA tablet daily after meals (paired with citrus/lemon water) is recommended starting from the 4th month (14th week) through delivery and 180 days postpartum.',
      answeredBy: 'Rekhaben Parmar (Senior ASHA)',
      time: 'Yesterday',
    },
  ]);

  // Compute cycle estimates
  const getNextPeriodDate = () => {
    try {
      const date = new Date(lastPeriodDate);
      date.setDate(date.getDate() + Number(cycleLength));
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  const getFertileWindow = () => {
    try {
      const date = new Date(lastPeriodDate);
      const ovulationDay = Number(cycleLength) - 14;
      const start = new Date(date);
      start.setDate(date.getDate() + ovulationDay - 4);
      const end = new Date(date);
      end.setDate(date.getDate() + ovulationDay + 1);

      return `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
    } catch {
      return 'N/A';
    }
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonymousQuery.trim()) return;

    const newQa = {
      id: `qa-${Date.now()}`,
      question: anonymousQuery.trim(),
      answer:
        'Thank you for reaching out confidentially. Your query has been received by the rural women welfare medical panel and will be reviewed shortly.',
      answeredBy: 'Swastya Setu Women Welfare Panel',
      time: 'Just now',
    };

    setQaThread([newQa, ...qaThread]);
    soundManager.playSuccessChime();
    setAnonymousQuery('');
  };

  return (
    <div>
      {/* Section Header with Privacy Shield Toggle */}
      <div className="section-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>
              <Heart size={28} color="#ec4899" />
              {t.tabs.womens}
            </h2>
            <p>{t.womensSubtitle}</p>
          </div>

          <button
            onClick={() => setIsPrivacyShieldActive(!isPrivacyShieldActive)}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: isPrivacyShieldActive ? '#ec4899' : 'var(--border)',
              background: isPrivacyShieldActive ? '#fdf2f8' : 'var(--bg-surface)',
              color: isPrivacyShieldActive ? '#be185d' : 'var(--text-main)',
              fontWeight: 700,
            }}
          >
            {isPrivacyShieldActive ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{isPrivacyShieldActive ? 'Privacy Blur Active (Click to Reveal)' : '1-Click Privacy Shield'}</span>
          </button>
        </div>
      </div>

      {/* Main Container with Privacy Blur support */}
      <div className={isPrivacyShieldActive ? 'privacy-blurred' : ''}>
        {/* Navigation tabs inside Women's Health */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { id: 'tips', label: 'Maternal & Reproductive Guides' },
            { id: 'tracker', label: 'Cycle & Ovulation Tracker' },
            { id: 'specialists', label: 'Nearby Female Doctors & ASHA Workers' },
            { id: 'anonymous_qa', label: 'Anonymous Q&A Forum' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Maternal & Reproductive Health Guides */}
        {activeTab === 'tips' && (
          <div className="grid-2">
            {mockWomensTips.map((tip) => (
              <div key={tip.id} className="card" style={{ borderLeft: '4px solid #ec4899' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge" style={{ background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8' }}>
                    {tip.stageBadge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Medical Guide</span>
                </div>

                <h4 style={{ fontSize: '16px', margin: '4px 0 8px 0' }}>{tip.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {tip.summary}
                </p>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.5 }}>
                  {tip.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Cycle & Ovulation Tracker */}
        {activeTab === 'tracker' && (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div className="card">
              <h3 style={{ fontSize: '17px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#ec4899" />
                Configure Menstrual Cycle
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    First Day of Last Period
                  </label>
                  <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Average Cycle Length (Days)
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={45}
                      value={cycleLength}
                      onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Period Bleeding Duration
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={periodLength}
                      onChange={(e) => setPeriodLength(parseInt(e.target.value) || 5)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '10px', borderRadius: '6px' }}>
                  🔒 100% Local & Private: Your reproductive health data is stored strictly on this device and never shared with third parties.
                </div>
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)', border: '1px solid #fecdd3' }}>
              <h3 style={{ fontSize: '17px', color: '#be185d', marginBottom: '16px' }}>
                Your Estimated Cycle Milestones
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Next Period:</span>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#be185d', marginTop: '2px' }}>
                    {getNextPeriodDate()}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated Fertile & Ovulation Window:</span>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#0c5a47', marginTop: '2px' }}>
                    {getFertileWindow()}
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Highest probability for conception
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Nearby Female Specialists & ASHA Workers */}
        {activeTab === 'specialists' && (
          <div className="grid-3">
            {mockSpecialists.map((spec) => (
              <div
                key={spec.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: '4px solid #ec4899',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span className="badge" style={{ background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8' }}>
                      {spec.role}
                    </span>
                    <span className="badge badge-success">Available</span>
                  </div>

                  <h4 style={{ fontSize: '16px', margin: '4px 0 2px 0' }}>{spec.name}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                    {spec.facilityName}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 10px 0' }}>
                    {spec.experience} • Speaks {spec.languages.join(', ')}
                  </p>
                </div>

                <a
                  href={`tel:${spec.phone}`}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                >
                  <Phone size={14} color="#ec4899" />
                  Call Directly ({spec.phone})
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Anonymous Q&A Forum */}
        {activeTab === 'anonymous_qa' && (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Ask Question Box */}
            <div className="card">
              <h3 style={{ fontSize: '17px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#ec4899" />
                Ask Confidentially & Anonymously
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                No name or phone number is ever published. Verified female doctors and senior ASHA workers answer your health concerns.
              </p>

              <form onSubmit={handlePostQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  rows={4}
                  required
                  placeholder="Ask about irregular periods, pregnancy symptoms, white discharge, contraception, anemia..."
                  value={anonymousQuery}
                  onChange={(e) => setAnonymousQuery(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }}
                />

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Send size={15} />
                  Submit Anonymous Question
                </button>
              </form>
            </div>

            {/* Q&A Thread */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {qaThread.map((item) => (
                <div key={item.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                      Anonymous Question
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
                  </div>

                  <h5 style={{ fontSize: '14.5px', margin: '4px 0 10px 0', color: 'var(--text-main)' }}>
                    "{item.question}"
                  </h5>

                  <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Award size={14} color="var(--primary)" />
                      <strong style={{ fontSize: '12px', color: 'var(--primary)' }}>
                        {item.answeredBy}
                      </strong>
                    </div>
                    <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.45, color: 'var(--text-main)' }}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
