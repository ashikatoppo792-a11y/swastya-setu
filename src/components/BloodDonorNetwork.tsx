import React, { useState } from 'react';
import {
  Droplet,
  Phone,
  Radio,
  UserPlus,
  Search,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  HeartHandshake,
  MapPin,
  Share2,
  Calendar,
  Award,
  QrCode,
  Printer,
  Check,
  X,
  PlusCircle,
  Filter,
  Users,
  Sparkles,
  Info,
  ExternalLink,
  FileText,
  Building2,
  Activity,
} from 'lucide-react';
import {
  BloodGroup,
  BloodBankStock,
  BloodDonor,
  EmergencyBloodRequest,
  BloodDonationCamp,
  CampRegistration,
  SupportedLanguage,
} from '../types';
import { mockBloodBanks, mockDonors } from '../data/mockData';
import { translations } from '../data/translations';
import { soundManager } from '../utils/sound';
import { storage } from '../utils/storage';

interface BloodDonorNetworkProps {
  currentLang: SupportedLanguage;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DISTRICT_OPTIONS = ['ALL', 'Anand', 'Vadodara', 'Ahmedabad', 'Kheda'];

type BloodSectionView = 'camps' | 'passes' | 'inventory' | 'donors';

export const BloodDonorNetwork: React.FC<BloodDonorNetworkProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [activeView, setActiveView] = useState<BloodSectionView>('camps');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [bloodBanks] = useState<BloodBankStock[]>(mockBloodBanks);
  const [donors, setDonors] = useState<BloodDonor[]>(mockDonors);
  const [bloodRequests, setBloodRequests] = useState<EmergencyBloodRequest[]>(() =>
    storage.getBloodRequests()
  );

  // Camps and user registrations
  const [camps, setCamps] = useState<BloodDonationCamp[]>(() => storage.getBloodCamps());
  const [registrations, setRegistrations] = useState<CampRegistration[]>(() =>
    storage.getCampRegistrations()
  );

  // Filter state for camps
  const [campSearch, setCampSearch] = useState('');
  const [campDistrict, setCampDistrict] = useState('ALL');
  const [urgentOnly, setUrgentOnly] = useState(false);

  // Modals state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isDonorRegisterOpen, setIsDonorRegisterOpen] = useState(false);
  const [selectedCampForReg, setSelectedCampForReg] = useState<BloodDonationCamp | null>(null);
  const [activePassModal, setActivePassModal] = useState<CampRegistration | null>(null);
  const [isHostCampOpen, setIsHostCampOpen] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const [hostSuccessMsg, setHostSuccessMsg] = useState<string | null>(null);

  // Broadcast form state
  const [broadcastPatient, setBroadcastPatient] = useState('Govind Patel');
  const [broadcastGroup, setBroadcastGroup] = useState<BloodGroup>('O-');
  const [broadcastHospital, setBroadcastHospital] = useState('District Civil Hospital Anand');
  const [broadcastUnits, setBroadcastUnits] = useState('2');
  const [broadcastPhone, setBroadcastPhone] = useState('+91 94280 88912');

  // Donor volunteer register form state
  const [regName, setRegName] = useState('');
  const [regGroup, setRegGroup] = useState<BloodGroup>('O+');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState('25');
  const [regDistrict, setRegDistrict] = useState('Anand');

  // Camp registration form state
  const [campDonorName, setCampDonorName] = useState('Rameshwar Sharma');
  const [campDonorPhone, setCampDonorPhone] = useState('+91 98765 43210');
  const [campDonorAge, setCampDonorAge] = useState('42');
  const [campDonorGender, setCampDonorGender] = useState('Male');
  const [campDonorGroup, setCampDonorGroup] = useState<BloodGroup>('B+');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [agreeWeightAge, setAgreeWeightAge] = useState(true);
  const [agreeLastDonated, setAgreeLastDonated] = useState(true);
  const [agreeHealthy, setAgreeHealthy] = useState(true);
  const [agreeLightMeal, setAgreeLightMeal] = useState(true);

  // Host a camp form state
  const [hostTitle, setHostTitle] = useState('');
  const [hostOrganizer, setHostOrganizer] = useState('');
  const [hostHospital, setHostHospital] = useState('');
  const [hostVenue, setHostVenue] = useState('');
  const [hostAddress, setHostAddress] = useState('');
  const [hostDistrict, setHostDistrict] = useState('Anand');
  const [hostDate, setHostDate] = useState('');
  const [hostStartTime, setHostStartTime] = useState('09:00 AM');
  const [hostEndTime, setHostEndTime] = useState('05:00 PM');
  const [hostTarget, setHostTarget] = useState('100');
  const [hostPhone, setHostPhone] = useState('');
  const [hostUrgentGroups, setHostUrgentGroups] = useState<BloodGroup[]>(['O-', 'B-']);

  // Calculate total units across all blood banks for selected group
  const calculateTotalStock = (group: BloodGroup) => {
    return bloodBanks.reduce((sum, bank) => sum + (bank.stock[group] || 0), 0);
  };

  const handleBroadcastSOS = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq: EmergencyBloodRequest = {
      id: `req-${Date.now()}`,
      patientName: broadcastPatient,
      bloodGroup: broadcastGroup,
      unitsNeeded: parseInt(broadcastUnits) || 1,
      hospitalName: broadcastHospital,
      district: 'Anand',
      urgency: 'CRITICAL',
      contactPhone: broadcastPhone,
      createdAt: 'Just now',
      status: 'BROADCASTED',
      donorsResponded: 0,
    };

    const updated = [newReq, ...bloodRequests];
    setBloodRequests(updated);
    storage.saveBloodRequests(updated);

    soundManager.playEmergencyAlarm();
    setBroadcastSuccess(
      `Emergency SOS Broadcasted! Sent urgent SMS & App notification to 18 verified ${broadcastGroup} donors in Anand district.`
    );

    // Simulate donor response after 3 seconds
    setTimeout(() => {
      const simulated = updated.map((r) =>
        r.id === newReq.id ? { ...r, donorsResponded: 2, status: 'DONOR_FOUND' as const } : r
      );
      setBloodRequests(simulated);
      storage.saveBloodRequests(simulated);
    }, 4000);

    setTimeout(() => {
      setIsBroadcastModalOpen(false);
      setBroadcastSuccess(null);
    }, 3500);
  };

  const handleRegisterVolunteerDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;

    const newDonor: BloodDonor = {
      id: `don-${Date.now()}`,
      name: regName.trim(),
      bloodGroup: regGroup,
      age: parseInt(regAge) || 25,
      gender: 'Other',
      district: regDistrict,
      phone: regPhone.trim(),
      lastDonated: 'Never (First-time Donor)',
      isAvailable: true,
      distanceKm: 1.8,
    };

    const updated = [newDonor, ...donors];
    setDonors(updated);
    soundManager.playSuccessChime();
    setIsDonorRegisterOpen(false);
    setRegName('');
    setRegPhone('');
  };

  // Open camp registration modal
  const openCampRegistration = (camp: BloodDonationCamp) => {
    setSelectedCampForReg(camp);
    setSelectedTimeSlot(camp.timeSlots[0] || '09:00 AM - 10:30 AM');
    // Default group to first urgent group if available, else B+
    if (camp.urgentBloodGroups && camp.urgentBloodGroups.length > 0) {
      setCampDonorGroup(camp.urgentBloodGroups[0]);
    }
  };

  // Submit camp registration
  const handleConfirmCampRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampForReg) return;

    if (!agreeWeightAge || !agreeLastDonated || !agreeHealthy || !agreeLightMeal) {
      alert('Please review and confirm all health eligibility criteria before registering.');
      return;
    }

    const passCode = `SS-CAMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReg: CampRegistration = {
      id: `reg-${Date.now()}`,
      campId: selectedCampForReg.id,
      campTitle: selectedCampForReg.title,
      campVenue: `${selectedCampForReg.venue}, ${selectedCampForReg.district}`,
      campDate: selectedCampForReg.date,
      organizer: selectedCampForReg.organizer,
      donorName: campDonorName.trim() || 'Anonymous Lifesaver',
      bloodGroup: campDonorGroup,
      donorAge: parseInt(campDonorAge) || 30,
      donorGender: campDonorGender,
      donorPhone: campDonorPhone.trim(),
      timeSlot: selectedTimeSlot || selectedCampForReg.timeSlots[0],
      passCode,
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'CONFIRMED',
      healthChecklistAgreed: true,
    };

    // Increment donor count in camp
    const updatedCamps = camps.map((c) =>
      c.id === selectedCampForReg.id
        ? { ...c, registeredDonorsCount: c.registeredDonorsCount + 1 }
        : c
    );
    setCamps(updatedCamps);
    storage.saveBloodCamps(updatedCamps);

    // Save registration
    const updatedRegs = [newReg, ...registrations];
    setRegistrations(updatedRegs);
    storage.saveCampRegistrations(updatedRegs);

    soundManager.playSuccessChime();
    setSelectedCampForReg(null);
    setActivePassModal(newReg);
  };

  // Cancel camp registration
  const handleCancelRegistration = (regId: string, campId: string) => {
    if (
      window.confirm(
        'Are you sure you want to cancel your donation camp registration? You can re-register anytime.'
      )
    ) {
      const updatedRegs = registrations.map((r) =>
        r.id === regId ? { ...r, status: 'CANCELLED' as const } : r
      );
      setRegistrations(updatedRegs);
      storage.saveCampRegistrations(updatedRegs);

      const updatedCamps = camps.map((c) =>
        c.id === campId ? { ...c, registeredDonorsCount: Math.max(0, c.registeredDonorsCount - 1) } : c
      );
      setCamps(updatedCamps);
      storage.saveBloodCamps(updatedCamps);
    }
  };

  // Submit Host Camp
  const handleHostCampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostTitle.trim() || !hostVenue.trim() || !hostPhone.trim()) return;

    const newCamp: BloodDonationCamp = {
      id: `camp-${Date.now()}`,
      title: hostTitle.trim(),
      organizer: hostOrganizer.trim() || 'Community Lifesavers Alliance',
      hospitalPartner: hostHospital.trim() || 'Local District Hospital Blood Bank',
      venue: hostVenue.trim(),
      address: hostAddress.trim() || hostVenue.trim(),
      district: hostDistrict,
      state: 'Gujarat',
      date: hostDate || '2026-09-20',
      startTime: hostStartTime,
      endTime: hostEndTime,
      targetUnits: parseInt(hostTarget) || 100,
      registeredDonorsCount: 0,
      timeSlots: [
        '09:00 AM - 10:30 AM',
        '10:30 AM - 12:00 PM',
        '12:00 PM - 01:30 PM',
        '02:00 PM - 03:30 PM',
        '03:30 PM - 05:00 PM',
      ],
      perks: [
        'Official Donor Appreciation Certificate',
        'Free Hemoglobin & Health Vitals Checkup',
        'Nutrition & Juice Refreshments Kit',
      ],
      urgentBloodGroups: hostUrgentGroups.length > 0 ? hostUrgentGroups : ['O-', 'B-'],
      contactPhone: hostPhone.trim(),
      status: 'UPCOMING',
    };

    const updated = [newCamp, ...camps];
    setCamps(updated);
    storage.saveBloodCamps(updated);

    soundManager.playSuccessChime();
    setHostSuccessMsg(
      `Blood Donation Camp "${newCamp.title}" is successfully registered & published! Community donors can now sign up.`
    );

    setTimeout(() => {
      setIsHostCampOpen(false);
      setHostSuccessMsg(null);
      setActiveView('camps');
      setHostTitle('');
      setHostOrganizer('');
      setHostHospital('');
      setHostVenue('');
      setHostAddress('');
      setHostPhone('');
    }, 2200);
  };

  // Copy or share pass details
  const handleCopyPass = (reg: CampRegistration) => {
    const text = `🩸 *SWASTYA SETU BLOOD DONOR CAMP PASS* 🩸\nPass ID: ${reg.passCode}\nDonor: ${reg.donorName} (${reg.bloodGroup})\nCamp: ${reg.campTitle}\nVenue: ${reg.campVenue}\nDate: ${reg.campDate} • Slot: ${reg.timeSlot}\nStatus: CONFIRMED\nPlease carry a Govt Photo ID and hydrate well!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2500);
    }
  };

  // Filtered camps
  const filteredCamps = camps.filter((camp) => {
    const matchesSearch =
      camp.title.toLowerCase().includes(campSearch.toLowerCase()) ||
      camp.venue.toLowerCase().includes(campSearch.toLowerCase()) ||
      camp.organizer.toLowerCase().includes(campSearch.toLowerCase()) ||
      camp.district.toLowerCase().includes(campSearch.toLowerCase());

    const matchesDistrict = campDistrict === 'ALL' || camp.district === campDistrict;

    const matchesUrgent =
      !urgentOnly ||
      (camp.urgentBloodGroups && camp.urgentBloodGroups.some((g) => ['O-', 'A-', 'B-', 'AB-'].includes(g)));

    return matchesSearch && matchesDistrict && matchesUrgent;
  });

  const filteredDonors = donors.filter(
    (d) => selectedGroup === 'ALL' || d.bloodGroup === selectedGroup
  );

  const activeRegistrations = registrations.filter((r) => r.status === 'CONFIRMED');

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2>
              <Droplet size={28} color="#dc2626" />
              {t.tabs.blood} & Donation Camps
            </h2>
            <p>
              Discover organized blood donation camps, register for donor passes, find live blood stock, or broadcast emergency SOS.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsHostCampOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
            >
              <PlusCircle size={16} />
              Organize / Host a Camp
            </button>

            <button onClick={() => setIsDonorRegisterOpen(true)} className="btn btn-outline btn-sm">
              <UserPlus size={16} />
              Become a Volunteer Donor
            </button>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="btn btn-crimson btn-sm pulse-emergency"
            >
              <Radio size={16} />
              Emergency SOS Blood Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '14px',
          marginBottom: '22px',
          overflowX: 'auto',
        }}
      >
        <button
          onClick={() => setActiveView('camps')}
          className={`btn btn-sm ${activeView === 'camps' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Calendar size={16} />
          Donation Camps
          <span
            style={{
              background: activeView === 'camps' ? 'rgba(255,255,255,0.3)' : 'var(--bg-subtle)',
              padding: '1px 7px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {camps.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('passes')}
          className={`btn btn-sm ${activeView === 'passes' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <QrCode size={16} />
          My Camp Passes
          {activeRegistrations.length > 0 && (
            <span
              style={{
                background: '#dc2626',
                color: '#fff',
                padding: '1px 7px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              {activeRegistrations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('inventory')}
          className={`btn btn-sm ${activeView === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Droplet size={16} />
          Blood Bank Inventory & SOS
        </button>

        <button
          onClick={() => setActiveView('donors')}
          className={`btn btn-sm ${activeView === 'donors' ? 'btn-primary' : 'btn-outline'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HeartHandshake size={16} />
          Volunteer Donors ({filteredDonors.length})
        </button>
      </div>

      {/* Active Blood Requests Broadcast Banner */}
      {bloodRequests.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          {bloodRequests.slice(0, 2).map((req) => (
            <div
              key={req.id}
              style={{
                background: 'var(--crimson-subtle)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                  }}
                >
                  {req.bloodGroup}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#991b1b' }}>
                      URGENT: {req.unitsNeeded} Units {req.bloodGroup} Needed for {req.patientName}
                    </h4>
                    <span className="badge badge-emergency">{req.urgency}</span>
                  </div>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    {req.hospitalName} • Broadcasted {req.createdAt} • {req.donorsResponded} donors responding
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`tel:${req.contactPhone}`}
                  className="btn btn-crimson btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone size={14} />
                  Call Attendant ({req.contactPhone})
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 1: DONATION CAMPS LIST */}
      {activeView === 'camps' && (
        <div>
          {/* Camp Filters & Search Header */}
          <div
            className="card"
            style={{
              padding: '18px 20px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(12,90,71,0.03) 0%, rgba(220,38,38,0.03) 100%)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--primary)" />
                  Upcoming Blood Donation Camps
                </h3>
                <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Register in advance to reserve your preferred donation slot, skip queues, and receive an official digital pass.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    background: 'var(--primary-subtle)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {filteredCamps.length} Camps Found
                </span>
              </div>
            </div>

            {/* Filter Inputs Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Search camp, venue, organizer..."
                  value={campSearch}
                  onChange={(e) => setCampSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13.5px',
                    background: 'var(--bg-surface)',
                  }}
                />
              </div>

              {/* District Filter */}
              <div>
                <select
                  value={campDistrict}
                  onChange={(e) => setCampDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontSize: '13.5px',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <option value="ALL">All Districts & Cities</option>
                  {DISTRICT_OPTIONS.filter((d) => d !== 'ALL').map((dist) => (
                    <option key={dist} value={dist}>
                      {dist} District
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgent Need Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: urgentOnly ? 'var(--crimson-subtle)' : 'var(--bg-surface)',
                  border: urgentOnly ? '1px solid rgba(220, 38, 38, 0.4)' : '1px solid var(--border)',
                }}
              >
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                />
                <span style={{ fontWeight: urgentOnly ? 600 : 400, color: urgentOnly ? '#b91c1c' : 'inherit' }}>
                  🚨 Urgent / Rare Blood Camps Only
                </span>
              </label>
            </div>
          </div>

          {/* Camps Grid */}
          {filteredCamps.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <Calendar size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                No Blood Donation Camps match your filter
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                Try resetting your search filters or organize a new blood donation camp in your locality.
              </p>
              <button
                onClick={() => {
                  setCampSearch('');
                  setCampDistrict('ALL');
                  setUrgentOnly(false);
                }}
                className="btn btn-outline btn-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: '20px',
              }}
            >
              {filteredCamps.map((camp) => {
                const percentFull = Math.min(
                  100,
                  Math.round((camp.registeredDonorsCount / camp.targetUnits) * 100)
                );

                return (
                  <div
                    key={camp.id}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                      padding: '20px',
                      position: 'relative',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      {/* Top Date & Status Bar */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: 'var(--primary)',
                            background: 'var(--primary-subtle)',
                            padding: '4px 10px',
                            borderRadius: '20px',
                          }}
                        >
                          <Calendar size={13} />
                          {camp.date} • {camp.startTime} - {camp.endTime}
                        </span>

                        <span
                          className="badge badge-success"
                          style={{ fontSize: '11px', textTransform: 'uppercase' }}
                        >
                          {camp.status}
                        </span>
                      </div>

                      {/* Camp Title */}
                      <h4
                        style={{
                          fontSize: '17px',
                          fontWeight: 700,
                          margin: '0 0 6px 0',
                          color: 'var(--text-main)',
                          lineHeight: 1.3,
                        }}
                      >
                        {camp.title}
                      </h4>

                      {/* Organizer & Partner */}
                      <div
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--text-muted)',
                          marginBottom: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={13} color="var(--primary)" />
                          <span>
                            <strong>By:</strong> {camp.organizer}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Shield size={13} color="#dc2626" />
                          <span>
                            <strong>Partner:</strong> {camp.hospitalPartner}
                          </span>
                        </div>
                      </div>

                      {/* Venue Address */}
                      <div
                        style={{
                          background: 'var(--bg-subtle)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                          marginBottom: '14px',
                        }}
                      >
                        <MapPin size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <strong style={{ display: 'block', color: 'var(--text-main)' }}>{camp.venue}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>{camp.address}</span>
                        </div>
                      </div>

                      {/* Donor Target Capacity Progress Bar */}
                      <div style={{ marginBottom: '14px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            fontWeight: 600,
                            marginBottom: '5px',
                          }}
                        >
                          <span style={{ color: 'var(--text-muted)' }}>Registered Donors</span>
                          <span style={{ color: 'var(--primary)' }}>
                            {camp.registeredDonorsCount} / {camp.targetUnits} Units ({percentFull}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: '7px',
                            background: 'var(--bg-subtle)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percentFull}%`,
                              height: '100%',
                              background:
                                percentFull > 80
                                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                                  : 'linear-gradient(90deg, #ea580c 0%, #dc2626 100%)',
                              borderRadius: '10px',
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                      </div>

                      {/* Urgent Need Tags */}
                      {camp.urgentBloodGroups && camp.urgentBloodGroups.length > 0 && (
                        <div
                          style={{
                            marginBottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#dc2626' }}>
                            Priority Groups:
                          </span>
                          {camp.urgentBloodGroups.map((grp) => (
                            <span
                              key={grp}
                              style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid rgba(220, 38, 38, 0.3)',
                                padding: '1px 7px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 800,
                              }}
                            >
                              {grp}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Perks / Inclusions */}
                      <div style={{ marginBottom: '16px' }}>
                        <div
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            marginBottom: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}
                        >
                          <Award size={13} color="var(--primary)" /> Donor Benefits & Inclusions:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {camp.perks.slice(0, 3).map((perk, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '11px',
                                background: 'var(--primary-subtle)',
                                color: 'var(--primary-hover)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontWeight: 500,
                              }}
                            >
                              ✓ {perk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <button
                        onClick={() => openCampRegistration(camp)}
                        className="btn btn-primary btn-sm"
                        style={{
                          flex: 2,
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #0c5a47 0%, #10b981 100%)',
                          boxShadow: '0 2px 6px rgba(12, 90, 71, 0.25)',
                        }}
                      >
                        <UserPlus size={15} />
                        Register to Donate
                      </button>

                      <a
                        href={`tel:${camp.contactPhone}`}
                        className="btn btn-outline btn-sm"
                        title={`Call Organizer: ${camp.contactPhone}`}
                        style={{ padding: '8px 10px', textDecoration: 'none' }}
                      >
                        <Phone size={14} color="#dc2626" />
                      </a>

                      <button
                        onClick={() => {
                          const text = `Join the blood donation camp: "${camp.title}" on ${camp.date} at ${camp.venue}, ${camp.district}. Register on Swastya Setu!`;
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(text);
                            alert('Camp details copied to clipboard to share with friends and family!');
                          }
                        }}
                        className="btn btn-outline btn-sm"
                        title="Share Camp Details"
                        style={{ padding: '8px 10px' }}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: MY CAMP PASSES */}
      {activeView === 'passes' && (
        <div>
          <div
            className="card"
            style={{
              padding: '18px 20px',
              marginBottom: '20px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={22} color="var(--primary)" />
                My Blood Donation Camp Passes
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Present this official digital donor pass or quote your Pass ID at the camp reception desk for express entry.
              </p>
            </div>

            <button
              onClick={() => setActiveView('camps')}
              className="btn btn-outline btn-sm"
            >
              <PlusCircle size={15} />
              Register for More Camps
            </button>
          </div>

          {registrations.length === 0 ? (
            <div
              className="card"
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
              }}
            >
              <QrCode size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                No active camp registrations yet
              </h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                You have not registered for any upcoming blood donation camps. Choose a camp and book your slot!
              </p>
              <button onClick={() => setActiveView('camps')} className="btn btn-primary btn-sm">
                Browse Upcoming Donation Camps
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))',
                gap: '16px',
              }}
            >
              {registrations.map((reg) => {
                const isConfirmed = reg.status === 'CONFIRMED';

                return (
                  <div
                    key={reg.id}
                    className="card"
                    style={{
                      border: isConfirmed ? '1.5px solid var(--primary-light)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '18px',
                      background: isConfirmed ? 'var(--bg-surface)' : 'var(--bg-subtle)',
                      opacity: isConfirmed ? 1 : 0.75,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      {/* Header Pass Code */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '10px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            color: 'var(--primary)',
                            background: 'var(--primary-subtle)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {reg.passCode}
                        </span>

                        <span
                          className={`badge ${isConfirmed ? 'badge-success' : 'badge-neutral'}`}
                          style={{ fontSize: '11px' }}
                        >
                          {reg.status}
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 4px 0', fontSize: '15.5px', color: 'var(--text-main)' }}>
                        {reg.campTitle}
                      </h4>

                      <div
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--text-muted)',
                          marginBottom: '8px',
                        }}
                      >
                        📍 {reg.campVenue}
                      </div>

                      {/* Donor Snapshot */}
                      <div
                        style={{
                          background: 'var(--bg-subtle)',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}
                      >
                        <div>
                          <strong>{reg.donorName}</strong> ({reg.donorAge}y, {reg.donorGender})
                          <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                            📞 {reg.donorPhone}
                          </div>
                        </div>

                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            color: '#dc2626',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '15px',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                          }}
                        >
                          {reg.bloodGroup}
                        </div>
                      </div>

                      {/* Reporting Slot */}
                      <div
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--primary)',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Clock size={14} />
                        Slot: {reg.timeSlot} • Date: {reg.campDate}
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        paddingTop: '10px',
                        borderTop: '1px solid var(--border)',
                      }}
                    >
                      <button
                        onClick={() => setActivePassModal(reg)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1.5, justifyContent: 'center' }}
                      >
                        <QrCode size={14} />
                        View / Print Pass
                      </button>

                      {isConfirmed && (
                        <button
                          onClick={() => handleCancelRegistration(reg.id, reg.campId)}
                          className="btn btn-outline btn-sm"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          title="Cancel registration"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: BLOOD BANK INVENTORY & SOS */}
      {activeView === 'inventory' && (
        <div>
          {/* Live Blood Inventory Matrix */}
          <div className="card" style={{ marginBottom: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '17px', margin: 0 }}>Live Blood Inventory (Local Banks Network)</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Real-time aggregate units in verified government & community blood banks
                </p>
              </div>

              {/* Group Filter Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedGroup('ALL')}
                  className={`btn btn-sm ${selectedGroup === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                >
                  All Types
                </button>
                {BLOOD_GROUPS.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedGroup(grp)}
                    className={`btn btn-sm ${selectedGroup === grp ? 'btn-primary' : 'btn-outline'}`}
                    style={{ minWidth: '42px' }}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>

            {/* 8 Blood Groups Inventory Cards */}
            <div className="grid-4" style={{ marginBottom: '20px' }}>
              {BLOOD_GROUPS.map((grp) => {
                const totalUnits = calculateTotalStock(grp);
                const isSelected = selectedGroup === grp;
                const isLow = totalUnits <= 3;

                return (
                  <div
                    key={grp}
                    onClick={() => setSelectedGroup(isSelected ? 'ALL' : grp)}
                    style={{
                      background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-subtle)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#dc2626' }}>{grp}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Compatible Donors</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: isLow ? '#dc2626' : 'var(--text-main)',
                        }}
                      >
                        {totalUnits} Units
                      </div>
                      <span
                        className={`badge ${isLow ? 'badge-emergency' : 'badge-success'}`}
                        style={{ fontSize: '9.5px', padding: '1px 6px' }}
                      >
                        {isLow ? 'Critical Low' : 'In Stock'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Blood Banks List */}
            <h4 style={{ fontSize: '14.5px', marginBottom: '12px', color: 'var(--text-main)' }}>
              Verified Storage Centers in Anand & Vadodara:
            </h4>
            <div className="grid-3">
              {bloodBanks.map((bank) => (
                <div
                  key={bank.id}
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '14px',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span className={`badge ${bank.isGovernment ? 'badge-success' : 'badge-neutral'}`}>
                        {bank.isGovernment ? 'Govt Center' : 'Charitable'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {bank.distanceKm} km
                      </span>
                    </div>
                    <h5 style={{ fontSize: '14.5px', margin: '6px 0 2px 0' }}>{bank.bloodBankName}</h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                      <MapPin size={12} style={{ display: 'inline' }} /> {bank.address}
                    </p>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Updated: {bank.lastUpdated}
                    </div>
                  </div>

                  <a
                    href={`tel:${bank.phone}`}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    <Phone size={14} color="#dc2626" />
                    Call Blood Bank ({bank.phone})
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: VERIFIED VOLUNTEER DONORS DIRECTORY */}
      {activeView === 'donors' && (
        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '17px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartHandshake size={20} color="var(--primary)" />
                Verified Volunteer Donors Near You
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Direct contact available for emergency replacement or direct hospital transfusion
              </p>
            </div>
            <span className="badge badge-success">{filteredDonors.length} Donors Available</span>
          </div>

          <div className="grid-3">
            {filteredDonors.map((don) => (
              <div
                key={don.id}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '17px',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                    }}
                  >
                    {don.bloodGroup}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '14.5px' }}>{don.name}</h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {don.age}y • {don.district} ({don.distanceKm} km)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>
                      Last donated: {don.lastDonated}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${don.phone}`}
                  className="btn btn-outline btn-sm"
                  title="Call Donor"
                  style={{ padding: '8px 10px', textDecoration: 'none' }}
                >
                  <Phone size={15} color="#dc2626" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: REGISTER FOR CAMP MODAL */}
      {selectedCampForReg && (
        <div className="modal-overlay" onClick={() => setSelectedCampForReg(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    letterSpacing: '0.5px',
                  }}
                >
                  Voluntary Blood Donation Drive
                </span>
                <h3 style={{ fontSize: '19px', margin: '3px 0 4px 0', color: 'var(--text-main)' }}>
                  Register for Blood Donation Camp
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  {selectedCampForReg.title} • {selectedCampForReg.venue}
                </p>
              </div>

              <button
                onClick={() => setSelectedCampForReg(null)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Camp Details Badge Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--primary-subtle) 0%, rgba(16,185,129,0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '18px',
                fontSize: '12.5px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <strong>Date:</strong> {selectedCampForReg.date} ({selectedCampForReg.startTime} -{' '}
                {selectedCampForReg.endTime})
              </div>
              <div style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Partner: {selectedCampForReg.hospitalPartner}
              </div>
            </div>

            <form
              onSubmit={handleConfirmCampRegistration}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              {/* Donor Full Name */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Donor Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={campDonorName}
                  onChange={(e) => setCampDonorName(e.target.value)}
                  placeholder="Full name as per Govt Photo ID"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                  }}
                />
              </div>

              {/* Phone & Age */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={campDonorPhone}
                    onChange={(e) => setCampDonorPhone(e.target.value)}
                    placeholder="+91..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Age (18 - 65) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={campDonorAge}
                    onChange={(e) => setCampDonorAge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                    }}
                  />
                </div>
              </div>

              {/* Blood Group & Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Blood Group *
                  </label>
                  <select
                    value={campDonorGroup}
                    onChange={(e) => setCampDonorGroup(e.target.value as BloodGroup)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                      fontWeight: 600,
                    }}
                  >
                    {BLOOD_GROUPS.map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}{' '}
                        {selectedCampForReg.urgentBloodGroups?.includes(grp) ? ' (Urgent Need!)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Gender *
                  </label>
                  <select
                    value={campDonorGender}
                    onChange={(e) => setCampDonorGender(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Select Preferred Reporting Time Slot *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {selectedCampForReg.timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <div
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--primary-hover)' : 'inherit',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Clock size={13} />
                        {slot}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medical Pre-Screening Checklist */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: '8px',
                  padding: '14px',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '8px',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Shield size={16} color="var(--primary)" />
                  Pre-Donation Eligibility Self-Assessment:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreeWeightAge}
                      onChange={(e) => setAgreeWeightAge(e.target.checked)}
                    />
                    <span>I am 18–65 years of age and weigh at least 45 kg.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreeLastDonated}
                      onChange={(e) => setAgreeLastDonated(e.target.checked)}
                    />
                    <span>I have not donated blood in the past 90 days (males) / 120 days (females).</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreeHealthy}
                      onChange={(e) => setAgreeHealthy(e.target.checked)}
                    />
                    <span>I do not have fever, active cough, antibiotic treatment, or major infection.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreeLightMeal}
                      onChange={(e) => setAgreeLightMeal(e.target.checked)}
                    />
                    <span>I commit to eating a light meal and drinking ample water before arriving.</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCampForReg(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    flex: 2,
                    background: 'linear-gradient(135deg, #0c5a47 0%, #10b981 100%)',
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle size={16} />
                  Confirm & Generate Donor Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFICIAL DIGITAL DONOR PASS MODAL */}
      {activePassModal && (
        <div className="modal-overlay" onClick={() => setActivePassModal(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              padding: '0',
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Printable Pass Card */}
            <div
              id="donor-digital-pass"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                padding: '24px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {/* Pass Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '2px dashed var(--border)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <Droplet size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>
                      SWASTYA SETU
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.4px' }}>
                      VOLUNTARY BLOOD TRANSFUSION PASS
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '13px',
                      color: '#dc2626',
                      background: '#fee2e2',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'inline-block',
                    }}
                  >
                    {activePassModal.passCode}
                  </span>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Express Entry QR Pass
                  </div>
                </div>
              </div>

              {/* Donor Profile Block */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Donor Details
                  </span>
                  <h4 style={{ margin: '2px 0', fontSize: '16px', color: 'var(--text-main)' }}>
                    {activePassModal.donorName}
                  </h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {activePassModal.donorAge} Years • {activePassModal.donorGender} • {activePassModal.donorPhone}
                  </div>
                </div>

                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    background: '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    boxShadow: '0 4px 8px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{activePassModal.bloodGroup}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>DONOR</span>
                </div>
              </div>

              {/* Camp Venue & Time Block */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>
                    📅 Date & Reporting Slot
                  </div>
                  <strong style={{ color: 'var(--primary)' }}>{activePassModal.campDate}</strong>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{activePassModal.timeSlot}</div>
                </div>

                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginBottom: '2px' }}>
                    🏢 Camp Venue
                  </div>
                  <strong style={{ color: 'var(--text-main)', display: 'block', textOverflow: 'ellipsis' }}>
                    {activePassModal.campVenue}
                  </strong>
                </div>
              </div>

              {/* QR Code & Verification Watermark */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'linear-gradient(135deg, rgba(12,90,71,0.04) 0%, rgba(220,38,38,0.04) 100%)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  marginBottom: '16px',
                }}
              >
                {/* Simulated QR Code Box */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: '#ffffff',
                    border: '2px solid var(--text-main)',
                    borderRadius: '6px',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={48} color="#0f172a" />
                </div>

                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} color="var(--primary)" />
                    Verified Official Donor Registration
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                    Scan QR code at entry gate reception for instant token validation & health kit collection.
                  </div>
                </div>
              </div>

              {/* Pre-Camp Guidelines */}
              <div
                style={{
                  background: '#fef3c7',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '11.5px',
                  color: '#92400e',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={13} />
                  Important Pre-Donation Instructions:
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', lineHeight: 1.4 }}>
                  <li>Hydrate well (drink 500ml water or fruit juice 30m prior).</li>
                  <li>Do not donate on an empty stomach; have a light meal.</li>
                  <li>Please carry any Govt Photo ID (Aadhaar / Voter ID / DL).</li>
                </ul>
              </div>
            </div>

            {/* Pass Actions Bar */}
            <div
              style={{
                padding: '14px 24px',
                background: 'var(--bg-surface)',
                display: 'flex',
                gap: '10px',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => window.print()}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                Print / Save Pass
              </button>

              <button
                onClick={() => handleCopyPass(activePassModal)}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Share2 size={15} />
                {copiedPass ? 'Pass Copied!' : 'Share Pass'}
              </button>

              <button
                onClick={() => setActivePassModal(null)}
                className="btn btn-outline btn-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ORGANIZE / HOST A CAMP MODAL */}
      {isHostCampOpen && (
        <div className="modal-overlay" onClick={() => setIsHostCampOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', padding: '24px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '19px', margin: '0 0 4px 0', color: 'var(--primary)' }}>
                  Organize & Publish a Blood Donation Camp
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  NGOs, hospitals, colleges, or community clubs can list voluntary blood drives across any locality.
                </p>
              </div>

              <button
                onClick={() => setIsHostCampOpen(false)}
                style={{ color: 'var(--text-muted)', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {hostSuccessMsg ? (
              <div
                style={{
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <CheckCircle size={36} style={{ marginBottom: '8px', display: 'inline-block' }} />
                <div>{hostSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handleHostCampSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Camp Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Ribbon Youth Blood Drive"
                    value={hostTitle}
                    onChange={(e) => setHostTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Organizing Body / NGO *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rotary Club / Youth Trust"
                      value={hostOrganizer}
                      onChange={(e) => setHostOrganizer(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Partner Blood Bank / Hospital *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Civil Hospital Blood Center"
                      value={hostHospital}
                      onChange={(e) => setHostHospital(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Venue Name & Landmark *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Community Town Hall, Station Road"
                      value={hostVenue}
                      onChange={(e) => setHostVenue(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      District / City *
                    </label>
                    <select
                      value={hostDistrict}
                      onChange={(e) => setHostDistrict(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      {DISTRICT_OPTIONS.filter((d) => d !== 'ALL').map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Camp Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={hostDate}
                      onChange={(e) => setHostDate(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Target Units
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={1000}
                      value={hostTarget}
                      onChange={(e) => setHostTarget(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Helpline Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91..."
                      value={hostPhone}
                      onChange={(e) => setHostPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Urgent / Priority Blood Groups Needed
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {BLOOD_GROUPS.map((grp) => {
                      const isChecked = hostUrgentGroups.includes(grp);
                      return (
                        <button
                          key={grp}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setHostUrgentGroups(hostUrgentGroups.filter((g) => g !== grp));
                            } else {
                              setHostUrgentGroups([...hostUrgentGroups, grp]);
                            }
                          }}
                          className={`btn btn-sm ${isChecked ? 'btn-crimson' : 'btn-outline'}`}
                          style={{ minWidth: '44px', padding: '4px 8px' }}
                        >
                          {grp}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsHostCampOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                    <CheckCircle size={16} />
                    Publish Camp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: EMERGENCY SOS BROADCAST MODAL */}
      {isBroadcastModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBroadcastModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3
              style={{
                fontSize: '19px',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}
            >
              <Radio size={22} />
              Emergency SOS Blood Broadcast
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Dispatches an immediate high-priority SMS and alert to all matching registered donors within 15 km.
            </p>

            {broadcastSuccess ? (
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
                <CheckCircle size={26} style={{ marginBottom: '6px', display: 'inline-block' }} />
                <div>{broadcastSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleBroadcastSOS} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastPatient}
                    onChange={(e) => setBroadcastPatient(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Required Blood Group
                    </label>
                    <select
                      value={broadcastGroup}
                      onChange={(e) => setBroadcastGroup(e.target.value as BloodGroup)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      Units Needed
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={10}
                      value={broadcastUnits}
                      onChange={(e) => setBroadcastUnits(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Hospital Name & Room
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastHospital}
                    onChange={(e) => setBroadcastHospital(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Attendant Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastPhone}
                    onChange={(e) => setBroadcastPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-crimson" style={{ flex: 1.5 }}>
                    <Radio size={16} />
                    Dispatch Emergency SOS
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: BECOME VOLUNTEER DONOR MODAL */}
      {isDonorRegisterOpen && (
        <div className="modal-overlay" onClick={() => setIsDonorRegisterOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '19px', marginBottom: '8px' }}>Register as a Voluntary Lifesaver</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Your blood can save a mother during delivery, an accident victim, or a child with thalassemia.
            </p>

            <form onSubmit={handleRegisterVolunteerDonor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Blood Group
                  </label>
                  <select
                    value={regGroup}
                    onChange={(e) => setRegGroup(e.target.value as BloodGroup)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Age (18 - 60)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    value={regAge}
                    onChange={(e) => setRegAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    District / Taluka
                  </label>
                  <input
                    type="text"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsDonorRegisterOpen(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
                  Join Donor Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
