import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building2,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Printer,
  XCircle,
  RefreshCw,
  Sparkles,
  Phone,
  ShieldCheck,
  ChevronRight,
  Info,
  Check,
  Flame,
  Activity,
  UserCheck,
  QrCode,
  Sliders,
} from 'lucide-react';
import {
  HospitalAppointment,
  HospitalCrowdLevel,
  HospitalDepartment,
  HospitalDoctor,
  SupportedLanguage,
} from '../types';
import { translations } from '../data/translations';
import {
  MOCK_HOSPITALS,
  MOCK_DEPARTMENTS,
  MOCK_HOSPITAL_DOCTORS,
  getUpcomingBookingDates,
  getAdvanceDays,
} from '../data/appointmentData';
import { storage } from '../utils/storage';
import { soundManager } from '../utils/sound';

interface DoctorAppointmentBookingProps {
  currentLang: SupportedLanguage;
  onNavigateToTelehealth?: () => void;
}

export const DoctorAppointmentBooking: React.FC<DoctorAppointmentBookingProps> = ({
  currentLang,
  onNavigateToTelehealth,
}) => {
  const t = translations[currentLang];

  // Active view: 'book' or 'my-appointments'
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'my-appointments'>('book');

  // Hospital & Crowd Status State
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-1');
  const [crowdLevel, setCrowdLevel] = useState<HospitalCrowdLevel>(() => storage.getHospitalCrowdStatus());

  // Booking Flow Steps: 1: Dept, 2: Doctor, 3: Date & Time, 4: Patient Details, 5: Confirmation
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedDepartment, setSelectedDepartment] = useState<HospitalDepartment | null>(MOCK_DEPARTMENTS[0]);
  const [selectedDoctor, setSelectedDoctor] = useState<HospitalDoctor | null>(MOCK_HOSPITAL_DOCTORS[0]);

  // Date & Slot Selection
  const availableDates = getUpcomingBookingDates();
  // By default, pre-select the 2-day advance date (index 2) to prioritize crowd reduction!
  const [selectedDateStr, setSelectedDateStr] = useState<string>(availableDates[2]?.dateStr || availableDates[0].dateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');

  // Patient details form
  const [patientName, setPatientName] = useState('Rameshwar Sharma');
  const [patientAge, setPatientAge] = useState('64');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('+91 98765 43210');
  const [reasonForVisit, setReasonForVisit] = useState('Routine consultation & prescription refill');

  // Completed booking confirmation pass
  const [confirmedAppointment, setConfirmedAppointment] = useState<HospitalAppointment | null>(null);

  // Appointments in localStorage
  const [appointments, setAppointments] = useState<HospitalAppointment[]>(() => storage.getHospitalAppointments());

  // Rescheduling modal state
  const [reschedulingApt, setReschedulingApt] = useState<HospitalAppointment | null>(null);
  const [newRescheduleDateStr, setNewRescheduleDateStr] = useState<string>('');
  const [newRescheduleTimeSlot, setNewRescheduleTimeSlot] = useState<string>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeHospital = MOCK_HOSPITALS.find((h) => h.id === selectedHospitalId) || MOCK_HOSPITALS[0];

  // Update crowd status in storage when toggled
  const handleSetCrowdLevel = (level: HospitalCrowdLevel) => {
    setCrowdLevel(level);
    storage.saveHospitalCrowdStatus(level);
    soundManager.playTokenBell();
    showToast(`Hospital crowd status updated to ${level === 'HIGH' ? '🔴 High Crowd' : level === 'MODERATE' ? '🟡 Moderate Crowd' : '🟢 Low Crowd'}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Doctors in current department
  const departmentDoctors = MOCK_HOSPITAL_DOCTORS.filter(
    (doc) => !selectedDepartment || doc.departmentId === selectedDepartment.id
  );

  // Check advance days of currently selected date
  const currentAdvanceDays = getAdvanceDays(selectedDateStr);
  const isSelectedDateAdvance = currentAdvanceDays >= 2;
  const isCrowdedSameOrNextDay = crowdLevel === 'HIGH' && currentAdvanceDays < 2;

  // Jump date to 2+ days advance
  const handleJumpToAdvanceDate = () => {
    const advanceDate = availableDates.find((d) => d.advanceDays >= 2);
    if (advanceDate) {
      setSelectedDateStr(advanceDate.dateStr);
      soundManager.playSuccessChime();
      showToast('Switched to Recommended Advance Booking Date (2 Days Ahead)');
    }
  };

  // Finalize booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDepartment) return;

    const advanceDays = getAdvanceDays(selectedDateStr);
    const isPriority = advanceDays >= 2;

    // Queue number assignment (Priority advance bookings receive fast-track low queue numbers)
    const estimatedQueueNumber = isPriority
      ? Math.floor(2 + Math.random() * 5) // Queue #2 to #6 for advance bookings
      : Math.floor(25 + Math.random() * 35); // Queue #25 to #60 for same-day walk-in rush

    const newAppointment: HospitalAppointment = {
      id: `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName,
      patientAge: parseInt(patientAge) || 45,
      patientGender,
      patientPhone,
      hospitalName: activeHospital.name,
      department: selectedDepartment.name,
      departmentId: selectedDepartment.id,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorAvatar: selectedDoctor.avatar,
      doctorRoom: selectedDoctor.roomNumber,
      date: selectedDateStr,
      timeSlot: selectedTimeSlot,
      estimatedQueueNumber,
      isPriorityAdvance: isPriority,
      bookedInAdvanceDays: advanceDays,
      crowdStatusAtBooking: crowdLevel,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString().split('T')[0],
      reasonForVisit,
    };

    const updated = [newAppointment, ...appointments];
    setAppointments(updated);
    storage.saveHospitalAppointments(updated);

    setConfirmedAppointment(newAppointment);
    setBookingStep(5);
    soundManager.playSuccessChime();
  };

  // Cancel an appointment
  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this doctor appointment?')) {
      const updated = appointments.map((apt) =>
        apt.id === id ? { ...apt, status: 'CANCELLED' as const } : apt
      );
      setAppointments(updated);
      storage.saveHospitalAppointments(updated);
      soundManager.playTokenBell();
      showToast('Appointment successfully cancelled.');
    }
  };

  // Open reschedule modal
  const handleOpenReschedule = (apt: HospitalAppointment) => {
    setReschedulingApt(apt);
    const futureDate = availableDates.find((d) => d.advanceDays >= 2)?.dateStr || availableDates[1]?.dateStr;
    setNewRescheduleDateStr(futureDate);
    setNewRescheduleTimeSlot('11:00 AM');
  };

  // Confirm rescheduling
  const handleConfirmReschedule = () => {
    if (!reschedulingApt) return;
    const advanceDays = getAdvanceDays(newRescheduleDateStr);
    const isPriority = advanceDays >= 2;

    const updated = appointments.map((apt) => {
      if (apt.id === reschedulingApt.id) {
        return {
          ...apt,
          date: newRescheduleDateStr,
          timeSlot: newRescheduleTimeSlot,
          status: 'RESCHEDULED' as const,
          bookedInAdvanceDays: advanceDays,
          isPriorityAdvance: isPriority,
          estimatedQueueNumber: isPriority ? Math.floor(3 + Math.random() * 4) : Math.floor(28 + Math.random() * 30),
        };
      }
      return apt;
    });

    setAppointments(updated);
    storage.saveHospitalAppointments(updated);
    setReschedulingApt(null);
    soundManager.playSuccessChime();
    showToast('Appointment rescheduled successfully!');
  };

  // Start new booking
  const handleStartNewBooking = () => {
    setConfirmedAppointment(null);
    setBookingStep(1);
    setActiveSubTab('book');
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
          }}
        >
          <CheckCircle2 size={18} color="#f59e0b" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="section-header" style={{ marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarCheck size={28} color="var(--primary)" />
              {t.tabs.appointments}
            </h2>
            <p style={{ margin: '4px 0 0 0' }}>{t.appointmentsSubtitle}</p>
          </div>

          {/* Sub-view switcher: Book vs My Appointments */}
          <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-subtle)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveSubTab('book')}
              className={`btn btn-sm ${activeSubTab === 'book' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              <Calendar size={15} /> Book Appointment
            </button>
            <button
              onClick={() => setActiveSubTab('my-appointments')}
              className={`btn btn-sm ${activeSubTab === 'my-appointments' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '13px', position: 'relative' }}
            >
              <UserCheck size={15} /> My Appointments
              {appointments.filter((a) => a.status !== 'CANCELLED').length > 0 && (
                <span
                  style={{
                    marginLeft: '6px',
                    background: '#0c5a47',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {appointments.filter((a) => a.status !== 'CANCELLED').length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HOSPITAL CROWD STATUS BANNER & INTERACTIVE DEMO SIMULATOR                */}
      {/* ========================================================================= */}
      <div
        className="card"
        style={{
          background:
            crowdLevel === 'HIGH'
              ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)'
              : crowdLevel === 'MODERATE'
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(2, 132, 199, 0.05) 100%)',
          border: `1.5px solid ${
            crowdLevel === 'HIGH' ? '#dc2626' : crowdLevel === 'MODERATE' ? '#f59e0b' : '#10b981'
          }`,
          padding: '16px 20px',
          marginBottom: '22px',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 'min(100%, 240px)' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background:
                  crowdLevel === 'HIGH' ? '#fee2e2' : crowdLevel === 'MODERATE' ? '#fef3c7' : '#dcfce7',
                color:
                  crowdLevel === 'HIGH' ? '#dc2626' : crowdLevel === 'MODERATE' ? '#d97706' : '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {crowdLevel === 'HIGH' ? <Flame size={24} /> : crowdLevel === 'MODERATE' ? <Activity size={24} /> : <ShieldCheck size={24} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeHospital.name}
                </h4>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background:
                      crowdLevel === 'HIGH' ? '#dc2626' : crowdLevel === 'MODERATE' ? '#d97706' : '#15803d',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }} />
                  {crowdLevel === 'HIGH' ? '🔴 HIGH CROWD (Overcrowded)' : crowdLevel === 'MODERATE' ? '🟡 MODERATE CROWD' : '🟢 LOW CROWD (Normal)'}
                </span>
              </div>

              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                {crowdLevel === 'HIGH' ? (
                  <span style={{ color: '#b91c1c', fontWeight: 600 }}>
                    ⚠️ Severe OPD rush today! Walk-in waiting time is approx. ~90 minutes. <strong>Book at least 2 days in advance</strong> to skip the queue and get a priority consultation pass.
                  </span>
                ) : crowdLevel === 'MODERATE' ? (
                  <span>
                    Current OPD wait time is approx. ~40 minutes. Advance 2-day bookings receive priority queue tokens.
                  </span>
                ) : (
                  <span style={{ color: '#15803d', fontWeight: 600 }}>
                    Smooth OPD flow with walk-in wait times &lt; 15 mins. Regular slots available.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Interactive Crowd Simulator Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-surface)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sliders size={13} /> Demo Crowd Simulator:
            </span>
            <button
              onClick={() => handleSetCrowdLevel('LOW')}
              style={{
                background: crowdLevel === 'LOW' ? '#10b981' : 'var(--bg-subtle)',
                color: crowdLevel === 'LOW' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: crowdLevel === 'LOW' ? 700 : 500,
              }}
            >
              🟢 Low
            </button>
            <button
              onClick={() => handleSetCrowdLevel('MODERATE')}
              style={{
                background: crowdLevel === 'MODERATE' ? '#f59e0b' : 'var(--bg-subtle)',
                color: crowdLevel === 'MODERATE' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: crowdLevel === 'MODERATE' ? 700 : 500,
              }}
            >
              🟡 Moderate
            </button>
            <button
              onClick={() => handleSetCrowdLevel('HIGH')}
              style={{
                background: crowdLevel === 'HIGH' ? '#dc2626' : 'var(--bg-subtle)',
                color: crowdLevel === 'HIGH' ? '#ffffff' : 'var(--text-main)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11.5px',
                cursor: 'pointer',
                fontWeight: crowdLevel === 'HIGH' ? 700 : 500,
              }}
            >
              🔴 High
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW: MY APPOINTMENTS                                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'my-appointments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
              My Scheduled Hospital Appointments
            </h3>
            <button onClick={handleStartNewBooking} className="btn btn-primary btn-sm">
              + Book New Doctor Appointment
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CalendarCheck size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 6px 0' }}>No Appointments Scheduled</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '360px', margin: '0 auto 16px auto' }}>
                Book an advance hospital appointment to avoid crowded OPD waiting rooms and guarantee your priority doctor token.
              </p>
              <button onClick={handleStartNewBooking} className="btn btn-primary">
                Book Doctor Appointment Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {appointments.map((apt) => {
                const advanceDays = getAdvanceDays(apt.date);

                return (
                  <div
                    key={apt.id}
                    className="card"
                    style={{
                      borderLeft: `5px solid ${
                        apt.status === 'CANCELLED'
                          ? '#94a3b8'
                          : apt.isPriorityAdvance
                          ? '#10b981'
                          : '#0284c7'
                      }`,
                      padding: '18px',
                      opacity: apt.status === 'CANCELLED' ? 0.65 : 1,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <img
                          src={apt.doctorAvatar}
                          alt={apt.doctorName}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid var(--border)',
                          }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                              {apt.doctorName}
                            </h4>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background:
                                  apt.status === 'CANCELLED'
                                    ? '#fee2e2'
                                    : apt.status === 'RESCHEDULED'
                                    ? '#fef3c7'
                                    : '#dcfce7',
                                color:
                                  apt.status === 'CANCELLED'
                                    ? '#b91c1c'
                                    : apt.status === 'RESCHEDULED'
                                    ? '#b45309'
                                    : '#15803d',
                              }}
                            >
                              {apt.status}
                            </span>

                            {apt.isPriorityAdvance && apt.status !== 'CANCELLED' && (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: '#e0f2fe',
                                  color: '#0369a1',
                                }}
                              >
                                ⭐ Priority Fast-Track (2+ Days Advance)
                              </span>
                            )}
                          </div>

                          <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
                            {apt.department} • {apt.doctorRoom}
                          </p>
                          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                            {apt.hospitalName}
                          </p>

                          <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12.5px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Calendar size={14} color="var(--primary)" />
                              <strong>Date:</strong> {apt.date}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={14} color="var(--primary)" />
                              <strong>Slot:</strong> {apt.timeSlot}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <User size={14} color="var(--primary)" />
                              <strong>Patient:</strong> {apt.patientName} ({apt.patientAge}y)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Queue Pass Box & Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div
                          style={{
                            background: 'var(--bg-subtle)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            textAlign: 'center',
                            minWidth: '130px',
                          }}
                        >
                          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>
                            ESTIMATED TOKEN
                          </span>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>
                            Queue #{apt.estimatedQueueNumber}
                          </span>
                          <span style={{ fontSize: '10px', color: '#64748b', display: 'block' }}>
                            ID: {apt.id}
                          </span>
                        </div>

                        {apt.status !== 'CANCELLED' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleOpenReschedule(apt)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            >
                              <RefreshCw size={13} /> Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '11.5px', padding: '4px 10px', color: '#dc2626', borderColor: '#fca5a5' }}
                            >
                              <XCircle size={13} /> Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW: BOOK DOCTOR APPOINTMENT WIZARD                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'book' && (
        <div>
          {/* STEP 5: APPOINTMENT CONFIRMATION SLIP */}
          {bookingStep === 5 && confirmedAppointment && (
            <div className="card printable-area" style={{ borderTop: '6px solid #10b981', padding: '28px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 4px 0', color: '#0c5a47' }}>
                  Doctor Appointment Confirmed!
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                  Present this digital token at the hospital OPD counter for priority fast-track entry.
                </p>
              </div>

              {/* Confirmation Pass Box */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '12px',
                  border: '1.5px dashed #cbd5e1',
                  padding: '20px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>APPOINTMENT PASS ID</span>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>
                      {confirmedAppointment.id}
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>ESTIMATED QUEUE TOKEN</span>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#15803d' }}>
                      Queue #{confirmedAppointment.estimatedQueueNumber}
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Patient Name</span>
                    <strong style={{ fontSize: '15px' }}>{confirmedAppointment.patientName}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>
                      Age: {confirmedAppointment.patientAge} • {confirmedAppointment.patientGender} • {confirmedAppointment.patientPhone}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Consulting Doctor</span>
                    <strong style={{ fontSize: '15px' }}>{confirmedAppointment.doctorName}</strong>
                    <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
                      {confirmedAppointment.department} • {confirmedAppointment.doctorRoom}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Appointment Date</span>
                    <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="var(--primary)" /> {confirmedAppointment.date}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Assigned Slot</span>
                    <strong style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="var(--primary)" /> {confirmedAppointment.timeSlot}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Queue Category</span>
                    <strong style={{ fontSize: '13px', color: confirmedAppointment.isPriorityAdvance ? '#15803d' : '#b45309' }}>
                      {confirmedAppointment.isPriorityAdvance ? '⭐ 2+ Days Advance Priority' : 'Regular Walk-in Queue'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => window.print()} className="btn btn-outline">
                  <Printer size={16} /> Print Confirmation Slip
                </button>
                <button onClick={() => setActiveSubTab('my-appointments')} className="btn btn-primary">
                  View in My Appointments ➔
                </button>
                <button onClick={handleStartNewBooking} className="btn btn-outline">
                  Book Another Appointment
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 TO 4: BOOKING WIZARD */}
          {bookingStep < 5 && (
            <div>
              {/* Progress Steps Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', background: 'var(--bg-surface)', padding: '12px 18px', borderRadius: '8px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px' }}>
                {[
                  { step: 1, label: '1. Department' },
                  { step: 2, label: '2. Doctor' },
                  { step: 3, label: '3. Date & Slot' },
                  { step: 4, label: '4. Patient Info' },
                ].map((s) => (
                  <div
                    key={s.step}
                    onClick={() => {
                      if (s.step < bookingStep) setBookingStep(s.step);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: s.step < bookingStep ? 'pointer' : 'default',
                      color: bookingStep === s.step ? 'var(--primary)' : s.step < bookingStep ? '#10b981' : 'var(--text-muted)',
                      fontWeight: bookingStep === s.step ? 800 : 600,
                      fontSize: '13px',
                    }}
                  >
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: bookingStep === s.step ? 'var(--primary)' : s.step < bookingStep ? '#10b981' : 'var(--bg-subtle)',
                        color: bookingStep === s.step || s.step < bookingStep ? '#ffffff' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                      }}
                    >
                      {s.step < bookingStep ? <Check size={12} /> : s.step}
                    </span>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* STEP 1: SELECT DEPARTMENT */}
              {bookingStep === 1 && (
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '6px' }}>
                    Select Clinical Department
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                    Choose the medical department for your in-person OPD consultation.
                  </p>

                  <div className="grid-3" style={{ gap: '14px' }}>
                    {MOCK_DEPARTMENTS.map((dept) => {
                      const isSelected = selectedDepartment?.id === dept.id;

                      return (
                        <div
                          key={dept.id}
                          onClick={() => {
                            setSelectedDepartment(dept);
                            // Auto select first doctor in this dept
                            const doc = MOCK_HOSPITAL_DOCTORS.find((d) => d.departmentId === dept.id) || null;
                            setSelectedDoctor(doc);
                            setBookingStep(2);
                            soundManager.playTokenBell();
                          }}
                          className="card card-interactive"
                          style={{
                            padding: '16px',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--primary-bg)' : 'var(--bg-surface)',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '8px',
                                background: isSelected ? 'var(--primary)' : 'var(--bg-subtle)',
                                color: isSelected ? '#ffffff' : 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Stethoscope size={20} />
                            </div>

                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: dept.crowdLevel === 'HIGH' ? '#fee2e2' : '#dcfce7',
                                color: dept.crowdLevel === 'HIGH' ? '#b91c1c' : '#15803d',
                              }}
                            >
                              {dept.crowdLevel === 'HIGH' ? 'Busy OPD' : 'Moderate'}
                            </span>
                          </div>

                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800 }}>{dept.name}</h4>
                          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {dept.description}
                          </p>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: '8px' }}>
                            <span>📍 {dept.roomFloor}</span>
                            <span>👨‍⚕️ {dept.activeDoctorsCount} Doctors</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT DOCTOR */}
              {bookingStep === 2 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                        Select Doctor in {selectedDepartment?.name}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0 0' }}>
                        Choose a specialist for your consultation.
                      </p>
                    </div>
                    <button onClick={() => setBookingStep(1)} className="btn btn-outline btn-sm">
                      ← Change Department
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {departmentDoctors.map((doc) => {
                      const isSelected = selectedDoctor?.id === doc.id;

                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setBookingStep(3);
                            soundManager.playTokenBell();
                          }}
                          className="card card-interactive"
                          style={{
                            padding: '16px',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                            background: isSelected ? 'var(--primary-bg)' : 'var(--bg-surface)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '14px',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                            <img
                              src={doc.avatar}
                              alt={doc.name}
                              style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--border)',
                              }}
                            />
                            <div>
                              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{doc.name}</h4>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--primary)', fontWeight: 600 }}>
                                {doc.qualification}
                              </p>
                              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                                OPD Room: <strong>{doc.roomNumber}</strong> • Languages: {doc.languages.join(', ')}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, display: 'block' }}>
                                ★ {doc.rating} / 5.0
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {doc.experienceYears} Years Exp
                              </span>
                            </div>

                            <button className="btn btn-primary btn-sm">
                              Select Doctor ➔
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: SELECT DATE & TIME SLOTS (WITH CROWD WARNING & 2+ DAYS PRIORITIZATION) */}
              {bookingStep === 3 && selectedDoctor && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                        Select Date & Available Time Slot
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '2px 0 0 0' }}>
                        Appointments with <strong>{selectedDoctor.name}</strong> ({selectedDoctor.roomNumber})
                      </p>
                    </div>
                    <button onClick={() => setBookingStep(2)} className="btn btn-outline btn-sm">
                      ← Change Doctor
                    </button>
                  </div>

                  {/* ========================================================================= */}
                  {/* OVERCROWDED WARNING BANNER (SHOWN WHEN SAME/NEXT DAY IS SELECTED ON HIGH) */}
                  {/* ========================================================================= */}
                  {isCrowdedSameOrNextDay && (
                    <div
                      style={{
                        background: '#fee2e2',
                        border: '2px solid #ef4444',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        marginBottom: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        animation: 'fadeIn 0.2s ease-out',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 'min(100%, 220px)' }}>
                        <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0 }} />
                        <div>
                          <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#991b1b' }}>
                            Hospital Crowd Warning
                          </h4>
                          <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>
                            “The hospital is currently crowded. To avoid long waiting times, please book your appointment at least 2 days in advance.”
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleJumpToAdvanceDate}
                        className="btn btn-sm"
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Switch to Advance Date (2+ Days Ahead) ➔
                      </button>
                    </div>
                  )}

                  {/* Advance Booking Prioritization Notice */}
                  {isSelectedDateAdvance && (
                    <div
                      style={{
                        background: '#dcfce7',
                        border: '1.5px solid #10b981',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        color: '#065f46',
                      }}
                    >
                      <Sparkles size={18} color="#10b981" />
                      <span>
                        <strong>Great choice!</strong> You selected a date 2+ days in advance. You will receive a <strong>Fast-Track Queue Token</strong> with minimal waiting at the OPD.
                      </span>
                    </div>
                  )}

                  {/* 7-Day Date Selector Strip */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Choose Appointment Date (Prioritizing 2+ Days Advance):
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 95px), 1fr))', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '4px' }}>
                      {availableDates.map((d) => {
                        const isSelected = selectedDateStr === d.dateStr;
                        const isPrioritized = d.advanceDays >= 2;

                        return (
                          <button
                            key={d.dateStr}
                            type="button"
                            onClick={() => {
                              setSelectedDateStr(d.dateStr);
                              soundManager.playTokenBell();
                            }}
                            style={{
                              background: isSelected ? 'var(--primary)' : isPrioritized ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                              color: isSelected ? '#ffffff' : 'var(--text-main)',
                              border: isSelected
                                ? '2px solid var(--primary)'
                                : isPrioritized
                                ? '1.5px solid #10b981'
                                : '1px solid var(--border)',
                              borderRadius: '10px',
                              padding: '12px 8px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {/* Prioritized Badge */}
                            {isPrioritized && (
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '-8px',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  background: isSelected ? '#ffffff' : '#10b981',
                                  color: isSelected ? '#0c5a47' : '#ffffff',
                                  fontSize: '9px',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '10px',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                ★ 2+ Days
                              </span>
                            )}

                            <span style={{ fontSize: '12px', fontWeight: 600, display: 'block' }}>
                              {d.dayName}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: 800, display: 'block', margin: '2px 0' }}>
                              {d.formattedDate}
                            </span>
                            <span style={{ fontSize: '10.5px', color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)', display: 'block' }}>
                              {d.isToday || d.isTomorrow ? 'Crowded Queue' : 'Fast-Track'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots Selection */}
                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      Select Consultation Time Slot:
                    </label>

                    {/* Morning Batch */}
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        🌅 Morning OPD (09:00 AM - 12:00 PM)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
                        {selectedDoctor.morningSlots.map((slot, i) => {
                          const isSelected = selectedTimeSlot === slot;
                          // Make 1 slot simulated as full for realism
                          const isFull = i === 2;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isFull}
                              onClick={() => {
                                setSelectedTimeSlot(slot);
                                soundManager.playTokenBell();
                              }}
                              style={{
                                padding: '10px 8px',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                border: isSelected
                                  ? '2px solid var(--primary)'
                                  : isFull
                                  ? '1px solid #e2e8f0'
                                  : '1px solid var(--border)',
                                background: isSelected
                                  ? 'var(--primary)'
                                  : isFull
                                  ? '#f1f5f9'
                                  : 'var(--bg-surface)',
                                color: isSelected
                                  ? '#ffffff'
                                  : isFull
                                  ? '#94a3b8'
                                  : 'var(--text-main)',
                                cursor: isFull ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                              }}
                            >
                              {slot}
                              {isFull && <span style={{ display: 'block', fontSize: '10px', color: '#dc2626' }}>Full</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Afternoon Batch */}
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        ☀️ Afternoon OPD (02:00 PM - 05:00 PM)
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
                        {selectedDoctor.afternoonSlots.map((slot, i) => {
                          const isSelected = selectedTimeSlot === slot;
                          const isFull = i === 1;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isFull}
                              onClick={() => {
                                setSelectedTimeSlot(slot);
                                soundManager.playTokenBell();
                              }}
                              style={{
                                padding: '10px 8px',
                                borderRadius: '8px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                border: isSelected
                                  ? '2px solid var(--primary)'
                                  : isFull
                                  ? '1px solid #e2e8f0'
                                  : '1px solid var(--border)',
                                background: isSelected
                                  ? 'var(--primary)'
                                  : isFull
                                  ? '#f1f5f9'
                                  : 'var(--bg-surface)',
                                color: isSelected
                                  ? '#ffffff'
                                  : isFull
                                  ? '#94a3b8'
                                  : 'var(--text-main)',
                                cursor: isFull ? 'not-allowed' : 'pointer',
                                textAlign: 'center',
                              }}
                            >
                              {slot}
                              {isFull && <span style={{ display: 'block', fontSize: '10px', color: '#dc2626' }}>Full</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setBookingStep(4)}
                      className="btn btn-primary"
                      style={{ padding: '10px 24px', fontSize: '14.5px' }}
                    >
                      Continue to Patient Details ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PATIENT DETAILS & CONFIRMATION */}
              {bookingStep === 4 && selectedDoctor && (
                <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                      Patient Details & Confirmation
                    </h3>
                    <button onClick={() => setBookingStep(3)} className="btn btn-outline btn-sm">
                      ← Change Slot
                    </button>
                  </div>

                  {/* Summary of Chosen Slot */}
                  <div style={{ background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hospital & Doctor:</span>
                      <strong>{selectedDoctor.name} ({selectedDoctor.roomNumber})</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Date & Slot:</span>
                      <strong>{selectedDateStr} at {selectedTimeSlot}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Queue Advantage:</span>
                      <strong style={{ color: isSelectedDateAdvance ? '#15803d' : '#d97706' }}>
                        {isSelectedDateAdvance ? '⭐ 2+ Days Advance Priority Token' : 'Standard Walk-in Queue'}
                      </strong>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmBooking}>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 2, minWidth: '180px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Patient Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: '90px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Age *
                        </label>
                        <input
                          type="number"
                          required
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: '100px' }}>
                        <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Gender *
                        </label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Mobile Phone Number (for WhatsApp pass & SMS alert) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Reason for Visit / Symptoms
                      </label>
                      <textarea
                        rows={2}
                        value={reasonForVisit}
                        onChange={(e) => setReasonForVisit(e.target.value)}
                        placeholder="e.g. Follow-up for blood pressure, chronic knee pain..."
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--border)', resize: 'vertical' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}
                    >
                      Confirm & Generate Appointment Pass ➔
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULING MODAL                                                        */}
      {/* ========================================================================= */}
      {reschedulingApt && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                Reschedule Appointment
              </h3>
              <button
                onClick={() => setReschedulingApt(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <XCircle size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Rescheduling for <strong>{reschedulingApt.patientName}</strong> with <strong>{reschedulingApt.doctorName}</strong>.
            </p>

            {/* Select new date */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Select New Date (Prioritizing 2+ Days Ahead):
              </label>
              <select
                value={newRescheduleDateStr}
                onChange={(e) => setNewRescheduleDateStr(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
              >
                {availableDates.map((d) => (
                  <option key={d.dateStr} value={d.dateStr}>
                    {d.dayName} ({d.formattedDate}) {d.advanceDays >= 2 ? '⭐ Recommended (Fast-Track)' : '⚠️ Rush Queue'}
                  </option>
                ))}
              </select>
            </div>

            {/* Select new time slot */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Select New Time Slot:
              </label>
              <select
                value={newRescheduleTimeSlot}
                onChange={(e) => setNewRescheduleTimeSlot(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
              >
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setReschedulingApt(null)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleConfirmReschedule} className="btn btn-primary">
                Save & Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
