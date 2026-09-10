import React, { useState } from 'react';
import {
  Building2,
  CalendarCheck,
  Stethoscope,
  Droplet,
  Menu,
  X,
  Pill,
  FolderLock,
  Heart,
  Accessibility,
  Mic,
  Bell,
  Phone,
  ChevronRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { NavTab, SupportedLanguage } from '../types';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenVoice: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

const languageOptions: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenVoice,
  onOpenNotifications,
  unreadCount,
  currentLang,
  onLanguageChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const t = translations[currentLang];

  const handleTabClick = (tab: NavTab) => {
    soundManager.playTokenBell();
    onSelectTab(tab);
    setIsDrawerOpen(false);
    // Smooth scroll down past hero on mobile
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const moreServices: { id: NavTab; label: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'medicine',
      label: t.tabs.medicine,
      desc: 'Pill alarms, refill tracker & OCR scan',
      icon: Pill,
      color: '#0284c7',
    },
    {
      id: 'records',
      label: t.tabs.records,
      desc: 'ABHA health records, labs & prescriptions',
      icon: FolderLock,
      color: '#7c3aed',
    },
    {
      id: 'womens',
      label: t.tabs.womens,
      desc: 'Maternal health, cycles & ASHA worker connect',
      icon: Heart,
      color: '#e11d48',
    },
    {
      id: 'elder',
      label: t.tabs.elder,
      desc: 'Senior caregiver sync & daily vitals log',
      icon: Accessibility,
      color: '#d97706',
    },
  ];

  const isMoreTabActive = ['medicine', 'records', 'womens', 'elder'].includes(activeTab);

  return (
    <>
      {/* Docked Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation Dock">
        {/* 1. Telehealth */}
        <button
          onClick={() => handleTabClick('telehealth')}
          className={`mobile-nav-item ${activeTab === 'telehealth' ? 'active' : ''}`}
          aria-label={t.tabs.telehealth}
        >
          <Building2 size={20} />
          <span>Telehealth</span>
        </button>

        {/* 2. OPD Appointments */}
        <button
          onClick={() => handleTabClick('appointments')}
          className={`mobile-nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
          aria-label={t.tabs.appointments}
        >
          <CalendarCheck size={20} />
          <span>OPD Book</span>
        </button>

        {/* 3. AI Triage */}
        <button
          onClick={() => handleTabClick('triage')}
          className={`mobile-nav-item ${activeTab === 'triage' ? 'active' : ''}`}
          aria-label={t.tabs.triage}
        >
          <Stethoscope size={20} />
          <span>Triage</span>
        </button>

        {/* 4. Blood & Camps */}
        <button
          onClick={() => handleTabClick('blood')}
          className={`mobile-nav-item ${activeTab === 'blood' ? 'active' : ''}`}
          aria-label={t.tabs.blood}
        >
          <Droplet size={20} />
          <span>Blood</span>
        </button>

        {/* 5. More Services Drawer Trigger */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`mobile-nav-item ${isMoreTabActive || isDrawerOpen ? 'active' : ''}`}
          aria-label="More Healthcare Services"
        >
          <Menu size={20} />
          <span>More</span>
          {isMoreTabActive && <span className="mobile-nav-badge" />}
        </button>
      </nav>

      {/* Slide-Up Mobile Services & Utilities Drawer */}
      {isDrawerOpen && (
        <div className="modal-overlay" onClick={() => setIsDrawerOpen(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-dialog mobile-drawer-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '88vh',
              overflowY: 'auto',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              padding: '16px 18px calc(24px + env(safe-area-inset-bottom, 16px)) 18px',
            }}
          >
            {/* Drawer Pull Handle */}
            <div
              style={{
                width: '40px',
                height: '5px',
                background: '#cbd5e1',
                borderRadius: '10px',
                margin: '0 auto 14px auto',
              }}
            />

            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '12px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                  All Healthcare Services
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Tap any service to jump directly
                </p>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Primary More Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '20px' }}>
              {moreServices.map((srv) => {
                const Icon = srv.icon;
                const isCurrent = activeTab === srv.id;

                return (
                  <div
                    key={srv.id}
                    onClick={() => handleTabClick(srv.id)}
                    style={{
                      background: isCurrent ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: `${srv.color}15`,
                          color: srv.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                          {srv.label}
                        </h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={18} color="var(--text-muted)" />
                  </div>
                );
              })}
            </div>

            {/* Quick Tools Row (Voice & Notifications) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenVoice();
                }}
                className="btn btn-outline"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)',
                  borderColor: 'rgba(245,158,11,0.3)',
                  color: '#b45309',
                }}
              >
                <Mic size={18} color="#d97706" />
                Voice Assistant
              </button>

              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenNotifications();
                }}
                className="btn btn-outline"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Bell size={18} color="var(--primary)" />
                Alerts {unreadCount > 0 && `(${unreadCount})`}
              </button>
            </div>

            {/* Mobile Language Switcher Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '8px',
                }}
              >
                <Globe size={14} /> Change App Language / भाषा बदलें:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {languageOptions.map((opt) => {
                  const isSelected = currentLang === opt.code;
                  return (
                    <button
                      key={opt.code}
                      onClick={() => {
                        onLanguageChange(opt.code);
                        soundManager.playSuccessChime();
                      }}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                        color: isSelected ? '#ffffff' : 'var(--text-main)',
                        fontSize: '12.5px',
                        fontWeight: isSelected ? 800 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {opt.native}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Emergency Toll-Free Helplines Dial Row */}
            <div
              style={{
                background: 'var(--crimson-subtle)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                borderRadius: '10px',
                padding: '12px 14px',
                fontSize: '12px',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: '#991b1b',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Phone size={14} color="#dc2626" />
                Emergency National Helplines (Toll-Free 24x7):
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href="tel:108"
                  className="btn btn-crimson btn-sm"
                  style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px', fontWeight: 800 }}
                >
                  🚑 Dial 108 Ambulance
                </a>
                <a
                  href="tel:104"
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px', color: '#991b1b', borderColor: '#fca5a5' }}
                >
                  📞 Dial 104 Health
                </a>
                <a
                  href="tel:1091"
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: 'none', padding: '6px 12px', fontSize: '12px', color: '#991b1b', borderColor: '#fca5a5' }}
                >
                  🛡️ 1091 Women
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
