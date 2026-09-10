import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Video,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  WifiOff,
  Search,
  Filter,
  User,
  ShieldCheck,
} from 'lucide-react';
import { HealthcareCenter, TelehealthDoctor, SupportedLanguage } from '../types';
import { mockCenters, mockDoctors } from '../data/mockData';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';

interface TelehealthFinderProps {
  currentLang: SupportedLanguage;
}

export const TelehealthFinder: React.FC<TelehealthFinderProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [only24x7, setOnly24x7] = useState(false);
  const [onlyAyushman, setOnlyAyushman] = useState(false);
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState(false);

  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState<TelehealthDoctor | null>(null);
  const [bookingName, setBookingName] = useState('Rameshwar Sharma');
  const [bookingAge, setBookingAge] = useState('64');
  const [bookingProblem, setBookingProblem] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredCenters = mockCenters.filter((center) => {
    const matchesQuery =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'ALL' || center.type === filterType;
    const matches24x7 = !only24x7 || center.isEmergency24x7;
    const matchesAyushman = !onlyAyushman || center.ayushmanEmpaneled;

    return matchesQuery && matchesType && matches24x7 && matchesAyushman;
  });

  const handleBookConsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    soundManager.playSuccessChime();
    setBookingSuccess(
      `Appointment confirmed with ${selectedDoctor.name} for ${selectedDoctor.nextSlot}. Low-bandwidth audio/video link generated!`
    );
    setTimeout(() => {
      setSelectedDoctor(null);
      setBookingSuccess(null);
      setBookingProblem('');
    }, 3500);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <h2>
          <Building2 size={28} color="var(--primary)" />
          {t.tabs.telehealth}
        </h2>
        <p>{t.telehealthSubtitle}</p>
      </div>

      {/* Low-Bandwidth Mode Alert / Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isLowBandwidthMode ? 'var(--blue-subtle)' : 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '10px',
              borderRadius: '10px',
              background: isLowBandwidthMode ? '#0284c7' : 'var(--primary-subtle)',
              color: isLowBandwidthMode ? '#ffffff' : 'var(--primary)',
            }}
          >
            <WifiOff size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px' }}>
              Rural Connectivity: 2G / Low-Bandwidth Audio Mode
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
              {isLowBandwidthMode
                ? 'Active: Consumes 85% less data. High-resolution streams disabled.'
                : 'Optimizes consultations and maps for unstable rural internet.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsLowBandwidthMode(!isLowBandwidthMode)}
          className={`btn ${isLowBandwidthMode ? 'btn-primary' : 'btn-outline'} btn-sm`}
        >
          {isLowBandwidthMode ? '✓ Low Data Mode Enabled' : 'Enable Low Data Mode'}
        </button>
      </div>

      {/* Telehealth Doctors Highlight Row */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={20} color="var(--primary)" />
            Online Doctors Available for Instant Rural Tele-Consultation
          </h3>
          <span className="badge badge-success">Free Govt Initiative (e-Sanjeevani)</span>
        </div>

        <div className="grid-4">
          {mockDoctors.map((doc) => (
            <div key={doc.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '2px solid var(--primary-light)' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '15.5px', margin: '0 0 2px 0' }}>{doc.name}</h4>
                    <p style={{ fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600, margin: 0 }}>
                      {doc.specialty}
                    </p>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {doc.qualification} • {doc.experienceYears}y exp
                    </p>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  <strong>Languages:</strong> {doc.languages.join(', ')}
                </div>

                <div
                  style={{
                    background: 'var(--bg-subtle)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '14px',
                  }}
                >
                  <Clock size={14} color="var(--primary)" />
                  <span>{doc.nextSlot}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedDoctor(doc)}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Video size={16} />
                {t.common.bookNow}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Nearest Healthcare Center Locator Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={20} color="var(--crimson)" />
          Find Nearest Primary Health Centres (PHCs) & Hospitals
        </h3>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by PHC name, village or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'PHC', 'CHC', 'DistrictHospital', 'SubCenter'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-outline'}`}
              >
                {type === 'ALL' ? 'All Centers' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox filters */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '16px', fontSize: '13.5px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={only24x7}
              onChange={(e) => setOnly24x7(e.target.checked)}
            />
            <span>24x7 Emergency Services Only</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={onlyAyushman}
              onChange={(e) => setOnlyAyushman(e.target.checked)}
            />
            <span>Ayushman Bharat (PM-JAY) Empaneled</span>
          </label>
        </div>

        {/* Centers Grid */}
        <div className="grid-2">
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                background: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <span className="badge badge-neutral" style={{ marginBottom: '6px' }}>
                      {center.type}
                    </span>
                    <h4 style={{ fontSize: '16px', margin: '4px 0' }}>{center.name}</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} />
                      {center.address}, {center.district}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>
                      {center.distanceKm} km
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>from current village</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {center.isEmergency24x7 && (
                    <span className="badge badge-emergency">24x7 Emergency</span>
                  )}
                  {center.ayushmanEmpaneled && (
                    <span className="badge badge-success">
                      <ShieldCheck size={12} />
                      Ayushman Empaneled
                    </span>
                  )}
                  <span className="badge badge-neutral">
                    {center.availableBeds} / {center.totalBeds} Beds Free
                  </span>
                  <span className="badge badge-neutral">
                    {center.doctorsCount} Doctors on Duty
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                <a
                  href={`tel:${center.phone}`}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <Phone size={14} color="var(--primary)" />
                  {t.common.callNow}
                </a>
                <a
                  href={`https://maps.google.com/?q=${center.latitude},${center.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, textDecoration: 'none' }}
                >
                  <Navigation size={14} />
                  {t.common.direction}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="modal-overlay" onClick={() => setSelectedDoctor(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>
              Confirm Telehealth Consultation
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Free National Telehealth Service (e-Sanjeevani). Connect from your phone with minimal data.
            </p>

            <div
              style={{
                background: 'var(--bg-subtle)',
                padding: '14px',
                borderRadius: '8px',
                marginBottom: '18px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>{selectedDoctor.name}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                  {selectedDoctor.specialty}
                </p>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Slot: {selectedDoctor.nextSlot}
                </span>
              </div>
            </div>

            {bookingSuccess ? (
              <div
                style={{
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  padding: '16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={24} style={{ marginBottom: '6px', display: 'inline-block' }} />
                <div>{bookingSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleBookConsult} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Patient Age
                  </label>
                  <input
                    type="number"
                    required
                    value={bookingAge}
                    onChange={(e) => setBookingAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Chief Complaint / Symptoms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe fever, cough, stomach pain, dizziness..."
                    value={bookingProblem}
                    onChange={(e) => setBookingProblem(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setSelectedDoctor(null)} className="btn btn-outline" style={{ flex: 1 }}>
                    {t.common.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                    <Video size={16} />
                    Confirm & Start Audio/Video
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
