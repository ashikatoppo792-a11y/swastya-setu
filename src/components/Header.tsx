import React from 'react';
import {
  HeartPulse,
  Languages,
  Mic,
  Bell,
  Volume2,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenVoice: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
}

const languageOptions: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenVoice,
  onOpenNotifications,
  unreadNotificationsCount,
}) => {
  const t = translations[currentLang];

  return (
    <header className="header-bar">
      <div className="header-container">
        {/* Brand Logo & Name */}
        <div className="header-brand">
          <div className="header-logo-badge">
            <HeartPulse size={24} color="#0c5a47" strokeWidth={2.6} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 className="header-title">
                {t.appName}
              </h1>
              <span className="header-bharat-tag">
                BHARAT
              </span>
            </div>
            <p className="header-tagline">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Language Switcher */}
          <div className="header-lang-wrapper">
            <Languages size={16} style={{ marginRight: '4px', opacity: 0.85, flexShrink: 0 }} />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              aria-label={t.changeLanguage}
              className="header-lang-select"
            >
              {languageOptions.map((opt) => (
                <option key={opt.code} value={opt.code} style={{ background: '#0c5a47', color: '#ffffff' }}>
                  {opt.native} ({opt.label})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Assistant Launcher */}
          <button
            onClick={onOpenVoice}
            title="Open Regional Voice Assistant"
            className="header-voice-btn"
          >
            <Mic size={17} color="#f59e0b" />
            <span className="header-btn-text">{t.voiceAssistant}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="header-bell-btn"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="header-bell-badge">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
