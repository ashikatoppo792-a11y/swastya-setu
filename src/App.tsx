import React, { useState, useEffect } from 'react';
import {
  Building2,
  Stethoscope,
  Pill,
  Droplet,
  FolderLock,
  Heart,
  Accessibility,
  Mic,
  Shield,
  HeartPulse,
  CalendarCheck,
} from 'lucide-react';
import { NavTab, SupportedLanguage } from './types';
import { translations } from './data/translations';
import { SearchResultItem } from './utils/searchIndex';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TelehealthFinder } from './components/TelehealthFinder';
import { DoctorAppointmentBooking } from './components/DoctorAppointmentBooking';
import { SymptomTriage } from './components/SymptomTriage';
import { MedicineReminders } from './components/MedicineReminders';
import { BloodDonorNetwork } from './components/BloodDonorNetwork';
import { DigitalHealthRecord } from './components/DigitalHealthRecord';
import { WomensHealth } from './components/WomensHealth';
import { ElderCareDashboard } from './components/ElderCareDashboard';
import { VoiceModal } from './components/VoiceModal';
import { NotificationsModal, AppNotification } from './components/NotificationsModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export const App: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem('swastya_lang');
      return (saved as SupportedLanguage) || 'en';
    } catch {
      return 'en';
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('telehealth');

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // System Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Pill Reminder: Metformin 500mg',
      message: 'Scheduled for Bedtime (After Food). Tap to mark as taken.',
      timestamp: '15 mins ago',
      type: 'medicine',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Emergency Blood Match: O-',
      message: '1 volunteer donor (Manish Varma) responded to the district broadcast.',
      timestamp: '30 mins ago',
      type: 'blood',
      read: false,
    },
    {
      id: 'notif-4',
      title: 'e-Sanjeevani Teleconsultation Confirmed',
      message: 'Consultation with Dr. Ananya Sharma booked for 2:30 PM today.',
      timestamp: '2 hours ago',
      type: 'telehealth',
      read: true,
    },
  ]);

  // Clean up any legacy sahayak-mode class from body
  useEffect(() => {
    document.body.classList.remove('sahayak-mode');
    localStorage.removeItem('swastya_elder_mode');
  }, []);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('swastya_lang', currentLang);
  }, [currentLang]);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLang(lang);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const t = translations[currentLang];

  const navItems: { id: NavTab; label: string; icon: any }[] = [
    { id: 'telehealth', label: t.tabs.telehealth, icon: Building2 },
    { id: 'appointments', label: t.tabs.appointments, icon: CalendarCheck },
    { id: 'triage', label: t.tabs.triage, icon: Stethoscope },
    { id: 'medicine', label: t.tabs.medicine, icon: Pill },
    { id: 'blood', label: t.tabs.blood, icon: Droplet },
    { id: 'records', label: t.tabs.records, icon: FolderLock },
    { id: 'womens', label: t.tabs.womens, icon: Heart },
    { id: 'elder', label: t.tabs.elder, icon: Accessibility },
  ];

  const [selectedSymptomForTriage, setSelectedSymptomForTriage] = useState<string | null>(null);

  // Direct search result selector from live autocomplete
  const handleSelectSearchResult = (result: SearchResultItem) => {
    if (result.targetTab === 'triage') {
      setSelectedSymptomForTriage(result.actionPayload?.symptomText || result.title);
    }
    setActiveTab(result.targetTab);
    // Smooth scroll down past the hero to the target service
    setTimeout(() => {
      const scrollEl = document.querySelector('.nav-scroll-wrapper');
      if (scrollEl) {
        scrollEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Quick fallback search resolver
  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('book') || lower.includes('opd') || lower.includes('slot')) {
      setActiveTab('appointments');
    } else if (lower.includes('blood') || lower.includes('donor')) {
      setActiveTab('blood');
    } else if (lower.includes('fever') || lower.includes('symptom') || lower.includes('pain') || lower.includes('cough') || lower.includes('breath') || lower.includes('chills')) {
      setSelectedSymptomForTriage(query);
      setActiveTab('triage');
    } else if (lower.includes('medicine') || lower.includes('pill') || lower.includes('remind') || lower.includes('dose') || lower.includes('metformin') || lower.includes('amlodipine')) {
      setActiveTab('medicine');
    } else if (lower.includes('record') || lower.includes('abha') || lower.includes('report') || lower.includes('lab') || lower.includes('discharge')) {
      setActiveTab('records');
    } else if (lower.includes('women') || lower.includes('maternal') || lower.includes('period') || lower.includes('pregnancy') || lower.includes('asha') || lower.includes('anm') || lower.includes('gynecologist')) {
      setActiveTab('womens');
    } else if (lower.includes('elder') || lower.includes('senior') || lower.includes('caregiver') || lower.includes('sugar') || lower.includes('bp')) {
      setActiveTab('elder');
    } else {
      setActiveTab('telehealth');
    }

    setTimeout(() => {
      const scrollEl = document.querySelector('.nav-scroll-wrapper');
      if (scrollEl) {
        scrollEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Top Global Navigation Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
      />

      <main className="main-content">
        {/* Hero Banner with Voice Search & Quick Jump Cards */}
        <HeroBanner
          currentLang={currentLang}
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenVoice={() => setIsVoiceModalOpen(true)}
          onSearch={handleSearch}
          onSelectSearchResult={handleSelectSearchResult}
        />

        {/* 8-Tab Navigation Scroll Strip */}
        <div className="nav-scroll-wrapper">
          <nav className="nav-tabs" aria-label="Main service navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Views corresponding directly to the 8 problem areas */}
        <section>
          {activeTab === 'telehealth' && <TelehealthFinder currentLang={currentLang} />}
          {activeTab === 'appointments' && (
            <DoctorAppointmentBooking
              currentLang={currentLang}
              onNavigateToTelehealth={() => setActiveTab('telehealth')}
            />
          )}
          {activeTab === 'triage' && (
            <SymptomTriage
              currentLang={currentLang}
              onEmergencySos={() => { window.location.href = 'tel:108'; }}
              onNavigateToTelehealth={() => setActiveTab('telehealth')}
              onNavigateToMedicine={() => setActiveTab('medicine')}
              initialSymptom={selectedSymptomForTriage}
              onClearInitialSymptom={() => setSelectedSymptomForTriage(null)}
            />
          )}
          {activeTab === 'medicine' && <MedicineReminders currentLang={currentLang} />}
          {activeTab === 'blood' && <BloodDonorNetwork currentLang={currentLang} />}
          {activeTab === 'records' && <DigitalHealthRecord currentLang={currentLang} />}
          {activeTab === 'womens' && <WomensHealth currentLang={currentLang} />}
          {activeTab === 'elder' && (
            <ElderCareDashboard
              currentLang={currentLang}
              onEmergencySos={() => { window.location.href = 'tel:108'; }}
            />
          )}
        </section>
      </main>

      {/* Floating Action Button for quick Voice */}
      <div className="floating-voice-container">
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          title="Speak in your regional language"
          className="floating-voice-btn"
          aria-label="Regional Voice Assistant"
        >
          <Mic size={24} color="#f59e0b" />
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar (Docked on Mobile <= 768px) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Emergency Helpline Footer */}
      <footer
        style={{
          background: '#072e24',
          color: '#ffffff',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '36px 20px 80px 20px',
          marginTop: '40px',
        }}
      >
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '28px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <HeartPulse size={24} color="#f59e0b" />
                <h3 style={{ fontSize: '18px', margin: 0 }}>Swastya Setu (स्वास्थ्य सेतु)</h3>
              </div>
              <p style={{ fontSize: '13px', opacity: 0.8, maxWidth: '400px', lineHeight: 1.5, margin: 0 }}>
                Universal Health Platform addressing rural accessibility, AI symptom triage, medicine reminders, blood availability, ABHA digital records, women's health privacy, elder care, and hospital token queues.
              </p>
            </div>

            {/* National Toll-Free Helplines */}
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Official National Health Helplines (24x7 Free)
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12.5px', opacity: 0.9 }}>
                <div>🚑 <strong>108</strong> - Emergency Ambulance</div>
                <div>🤰 <strong>102</strong> - Free Pregnant Mother & Child Transport</div>
                <div>🩺 <strong>104</strong> - National Health Advice & Tele-help</div>
                <div>👵 <strong>14567</strong> - Senior Citizen Elder Helpline</div>
                <div>👩 <strong>181</strong> - Women in Distress Helpline</div>
                <div>🧒 <strong>1098</strong> - Childline Emergency Helpline</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '12px', opacity: 0.7 }}>
            <div>© 2026 Swastya Setu. Built for Public Health Empowerment across Bharat.</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy & Patient Dignity Protected</span>
              <span>Ayushman Bharat Digital Mission (ABDM) Compatible</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLang={currentLang}
        onNavigate={(tab) => setActiveTab(tab)}
        onEmergencySos={() => { window.location.href = 'tel:108'; }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
      />
    </div>
  );
};

export default App;
