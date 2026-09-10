import React from 'react';
import { Bell, CheckCheck, X, Droplet, Pill, Calendar, Heart } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'medicine' | 'blood' | 'telehealth' | 'womens';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'medicine':
        return <Pill size={17} color="#059669" />;
      case 'blood':
        return <Droplet size={17} color="#dc2626" />;
      case 'telehealth':
        return <Calendar size={17} color="#ea580c" />;
      case 'womens':
        return <Heart size={17} color="#ec4899" />;
      default:
        return <Bell size={17} color="#0c5a47" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          color: '#0f172a',
          padding: '24px',
          maxWidth: '500px',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={18} color="#0c5a47" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                System Notifications
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Real-time alerts & prescription updates
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onMarkAllRead}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '11.5px',
                padding: '5px 10px',
                background: '#f8fafc',
                color: '#0c5a47',
                border: '1px solid #cbd5e1',
                fontWeight: 600,
              }}
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
            <button
              onClick={onClose}
              style={{
                color: '#64748b',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f5f9',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '60vh', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b', fontSize: '13.5px' }}>
              No notifications at this time.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  background: n.read ? '#ffffff' : '#f0fdf4',
                  border: n.read ? '1px solid #e2e8f0' : '1px solid #a7f3d0',
                  borderLeft: n.read ? '1px solid #e2e8f0' : '4px solid #10b981',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  gap: '12px',
                  boxShadow: n.read ? 'none' : '0 2px 6px rgba(16, 185, 129, 0.08)',
                }}
              >
                <div
                  style={{
                    marginTop: '2px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: n.read ? '#f1f5f9' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  {getIcon(n.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <h5
                      style={{
                        margin: '0 0 3px 0',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: n.read ? '#1e293b' : '#064e3b',
                      }}
                    >
                      {n.title}
                    </h5>
                    <span
                      style={{
                        fontSize: '10.5px',
                        color: n.read ? '#94a3b8' : '#059669',
                        fontWeight: n.read ? 400 : 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {n.timestamp}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#475569', lineHeight: 1.45 }}>
                    {n.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
