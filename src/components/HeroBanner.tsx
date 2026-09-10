import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Building2,
  Stethoscope,
  Pill,
  Droplet,
  FolderLock,
  Heart,
  Accessibility,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  X,
  ArrowRight,
  User,
  Activity,
  CalendarCheck,
  Calendar,
  Flame,
} from 'lucide-react';
import { NavTab, SupportedLanguage } from '../types';
import { translations } from '../data/translations';
import { searchAllEntities, SearchResultItem } from '../utils/searchIndex';
import { startListening } from '../utils/speech';
import { soundManager } from '../utils/sound';
import { storage } from '../utils/storage';

interface HeroBannerProps {
  currentLang: SupportedLanguage;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenVoice: () => void;
  onSearch: (query: string) => void;
  onSelectSearchResult?: (result: SearchResultItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  activeTab,
  onSelectTab,
  onOpenVoice,
  onSearch,
  onSelectSearchResult,
}) => {
  const t = translations[currentLang];
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update live search results as user types
  useEffect(() => {
    if (query.trim().length >= 1) {
      const results = searchAllEntities(query);
      setSearchResults(results);
      setSelectedIndex(-1);
      setIsDropdownOpen(true);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
      setIsDropdownOpen(false);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (searchResults.length > 0) {
      const targetItem = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      handleItemClick(targetItem);
    } else {
      onSearch(query.trim());
      setIsDropdownOpen(false);
    }
  };

  const handleItemClick = (item: SearchResultItem) => {
    soundManager.playSuccessChime();
    setIsDropdownOpen(false);
    if (onSelectSearchResult) {
      onSelectSearchResult(item);
    } else {
      onSelectTab(item.targetTab);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    setIsDropdownOpen(false);
  };

  const handleQuickTagClick = (tagQuery: string) => {
    setQuery(tagQuery);
    const results = searchAllEntities(tagQuery);
    setSearchResults(results);
    setSelectedIndex(-1);
    setIsDropdownOpen(true);
  };

  // Direct Speech Recognition on the search bar mic
  const handleMicClick = () => {
    if (isMicListening) {
      setIsMicListening(false);
      return;
    }

    setIsMicListening(true);
    soundManager.playSuccessChime();

    startListening(
      currentLang,
      (transcript) => {
        setQuery(transcript);
        setIsMicListening(false);
        const results = searchAllEntities(transcript);
        setSearchResults(results);
        setIsDropdownOpen(true);
      },
      (error) => {
        console.warn('Speech search error:', error);
        setIsMicListening(false);
      },
      () => {
        setIsMicListening(false);
      }
    );
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'hospital':
        return <Building2 size={16} color="#0c5a47" />;
      case 'doctor':
        return <User size={16} color="#0284c7" />;
      case 'symptom':
        return <Stethoscope size={16} color="#dc2626" />;
      case 'medicine':
        return <Pill size={16} color="#10b981" />;
      case 'blood':
        return <Droplet size={16} color="#dc2626" />;
      case 'womens':
        return <Heart size={16} color="#ec4899" />;
      default:
        return <Activity size={16} color="var(--primary)" />;
    }
  };

  const serviceShortcuts: { id: NavTab; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'appointments',
      label: t.tabs.appointments,
      icon: CalendarCheck,
      color: '#059669',
      desc: 'Book Advance OPD Doctor Slot',
    },
    {
      id: 'telehealth',
      label: t.tabs.telehealth,
      icon: Building2,
      color: '#0c5a47',
      desc: 'Nearest PHCs & Online Doctors',
    },
    {
      id: 'triage',
      label: t.tabs.triage,
      icon: Stethoscope,
      color: '#0284c7',
      desc: 'Symptom Checker & Red Flags',
    },
    {
      id: 'medicine',
      label: t.tabs.medicine,
      icon: Pill,
      color: '#10b981',
      desc: 'Pill Reminders & Family Alert',
    },
    {
      id: 'blood',
      label: t.tabs.blood,
      icon: Droplet,
      color: '#dc2626',
      desc: 'Live Blood Stock & Donors',
    },
    {
      id: 'records',
      label: t.tabs.records,
      icon: FolderLock,
      color: '#7c3aed',
      desc: 'ABHA Health Locker & QR Pass',
    },
    {
      id: 'womens',
      label: t.tabs.womens,
      icon: Heart,
      color: '#ec4899',
      desc: 'Private Guidance & ASHA Help',
    },
    {
      id: 'elder',
      label: t.tabs.elder,
      icon: Accessibility,
      color: '#f59e0b',
      desc: 'Simple Large UI & 1-Touch SOS',
    },
  ];

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Govt Health Mission Announcement Strip */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0c5a47 0%, #064e3b 100%)',
          color: '#ffffff',
          borderRadius: '10px',
          padding: '8px 16px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12.5px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#f59e0b" />
          <span>
            <strong>National Rural Health Support:</strong> 24x7 Free Tele-Consultation (e-Sanjeevani) • 108 Emergency Service Active
          </span>
        </div>
        <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
          Ayushman Bharat Empaneled
        </span>
      </div>

      {/* Overcrowded Hospital & Advance Booking Alert Strip */}
      <div
        style={{
          background: 'linear-gradient(90deg, #fef2f2 0%, #fff1f2 100%)',
          border: '1.5px solid #fecaca',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🔴</span>
          <div>
            <strong style={{ color: '#991b1b', fontSize: '13px' }}>
              District Hospital OPD Rush Alert:
            </strong>
            <span style={{ color: '#b91c1c', fontSize: '12.5px', marginLeft: '6px' }}>
              Walk-in OPD waiting time is approx. ~90 minutes. <strong>Book 2+ days in advance</strong> to skip the queue and get a priority consultation pass!
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onSelectTab('appointments')}
          className="btn btn-sm"
          style={{
            background: '#dc2626',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            padding: '5px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Book Advance Slot ➔
        </button>
      </div>

      {/* Main Search & Voice Action Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-subtle) 100%)',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-main)' }}>
            How can Swastya Setu assist your family today?
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Instant search across government health centers, clinical symptoms, emergency blood, medicines, and family care.
          </p>

          {/* Interactive Search Container with Dropdown Popover */}
          <div ref={searchContainerRef} style={{ position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} className="hero-search-form" style={{ display: 'flex', gap: '8px', position: 'relative' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => {
                    if (query.trim().length >= 1) setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (!isDropdownOpen || searchResults.length === 0) return;
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
                    } else if (e.key === 'Enter') {
                      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
                        e.preventDefault();
                        handleItemClick(searchResults[selectedIndex]);
                      }
                    } else if (e.key === 'Escape') {
                      setIsDropdownOpen(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 76px 12px 40px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '15px',
                    background: '#ffffff',
                    color: '#0f172a',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'border-color 0.2s',
                  }}
                />

                {/* Clear button */}
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear search query"
                    style={{
                      position: 'absolute',
                      right: '46px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Direct Mic Speech Search button */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  title={isMicListening ? 'Listening now...' : 'Click to speak search query'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isMicListening ? '#ef4444' : '#ecfdf5',
                    color: isMicListening ? '#ffffff' : '#0c5a47',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    cursor: 'pointer',
                    boxShadow: isMicListening ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none',
                  }}
                >
                  {isMicListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary hero-search-btn"
              >
                Search
              </button>
            </form>

            {/* Quick Popular Health Query Chips */}
            <div
              style={{
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '12px',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Quick search:</span>
              {[
                { label: '🚑 Chest Pain', q: 'chest pain' },
                { label: '🏕️ Blood Camps', q: 'camp' },
                { label: '🩸 O- Blood', q: 'O-' },
                { label: '🏥 PHC Mogar', q: 'PHC Mogar' },
                { label: '💊 Metformin', q: 'Metformin' },
                { label: '🩺 Fever Check', q: 'fever' },
              ].map((chip) => (
                <button
                  key={chip.q}
                  type="button"
                  onClick={() => handleQuickTagClick(chip.q)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.background = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.color = '#334155';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Direct Advance OPD Appointment Action Banner */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => onSelectTab('appointments')}
                className="btn btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 14px rgba(12, 90, 71, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  maxWidth: '100%',
                }}
              >
                <CalendarCheck size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <span>Book Doctor Appointment (Skip OPD Queue)</span>
              </button>
            </div>

            {/* Mic Listening Prompt */}
            {isMicListening && (
              <div
                style={{
                  marginTop: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: '#991b1b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                <span className="pulse-emergency" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626' }} />
                Listening now... speak symptoms, hospital, blood group or medicines.
              </div>
            )}

            {/* Live Autocomplete Dropdown Popover */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 20px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.08)',
                  zIndex: 1000,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  textAlign: 'left',
                  animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <div
                  style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Matching Healthcare Results ({searchResults.length})</span>
                  <span>Use ↑↓ keys & Enter</span>
                </div>

                {searchResults.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      No exact matches found for "{query}"
                    </div>
                    <div>
                      Try searching: <em>fever</em>, <em>chest pain</em>, <em>O- blood</em>, <em>Civil Hospital</em>, or <em>Metformin</em>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '6px' }}>
                    {searchResults.map((item, idx) => {
                      const isSelected = idx === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleItemClick(item)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            gap: '12px',
                            background: isSelected ? '#ecfdf5' : 'transparent',
                            border: isSelected ? '1px solid #a7f3d0' : '1px solid transparent',
                          }}
                          onMouseEnter={(e) => {
                            setSelectedIndex(idx);
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '8px',
                                background: isSelected ? '#ffffff' : '#f8fafc',
                                border: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {getCategoryIcon(item.category)}
                            </div>

                            <div>
                              <h5 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                                {item.title}
                              </h5>
                              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                {item.subtitle}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.badge && (
                              <span
                                className={`badge ${
                                  item.badgeType === 'emergency'
                                    ? 'badge-emergency'
                                    : item.badgeType === 'urgent'
                                    ? 'badge-urgent'
                                    : item.badgeType === 'teleconsult'
                                    ? 'badge-teleconsult'
                                    : 'badge-success'
                                }`}
                                style={{ fontSize: '10.5px' }}
                              >
                                {item.badge}
                              </span>
                            )}
                            <ArrowRight size={15} color={isSelected ? '#0c5a47' : '#94a3b8'} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 9 Functional Shortcuts Grid */}
      <div className="shortcuts-grid">
        {serviceShortcuts.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeTab === sc.id;

          return (
            <div
              key={sc.id}
              onClick={() => onSelectTab(sc.id)}
              className="card card-interactive"
              style={{
                padding: '16px',
                cursor: 'pointer',
                borderTop: `4px solid ${sc.color}`,
                background: isActive ? 'var(--primary-bg)' : 'var(--bg-surface)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: sc.color,
                  flexShrink: 0,
                }}
              >
                <Icon size={22} />
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)' }}>{sc.label}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {sc.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
