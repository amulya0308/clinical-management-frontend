import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export const Sidebar = ({ isOpen, onClose }) => {
  const { role, user } = useAuth();

  const getLinks = () => {
    switch (role) {
      case ROLES.ADMIN:
        return [
          { to: '/admin/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
          { to: '/admin/doctors', icon: 'bi-person-badge-fill', label: 'Doctors' },
          { to: '/admin/patients', icon: 'bi-people-fill', label: 'Patients' },
          { to: '/admin/departments', icon: 'bi-building', label: 'Departments' },
          { to: '/admin/appointments', icon: 'bi-calendar-event-fill', label: 'Appointments' },
        ];
      case ROLES.DOCTOR:
        return [
          { to: '/doctor/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
          { to: '/doctor/appointments', icon: 'bi-calendar-check-fill', label: 'My Appointments' },
        ];
      case ROLES.PATIENT:
        return [
          { to: '/patient/dashboard', icon: 'bi-grid-fill', label: 'Dashboard' },
          { to: '/patient/doctors', icon: 'bi-search', label: 'Find Doctors' },
          { to: '/patient/book', icon: 'bi-calendar-plus-fill', label: 'Book Appointment' },
          { to: '/patient/appointments', icon: 'bi-calendar2-range-fill', label: 'My Appointments' },
          { to: '/patient/profile', icon: 'bi-person-circle', label: 'My Profile' },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'show' : ''}`}>
      <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
        <NavLink to="/" className="text-decoration-none d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3"
            style={{ width: '38px', height: '38px' }}
          >
            <i className="bi bi-hospital fs-5"></i>
          </div>
          <div>
            <span className="fw-bold text-dark fs-5 mb-0 d-block lh-1">CarePoint</span>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>Clinical System</small>
          </div>
        </NavLink>
        <button
          className="btn btn-sm btn-light d-lg-none"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      <div className="p-3 flex-grow-1 overflow-auto">
        <div className="text-uppercase text-muted fw-bold mb-2 px-2" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
          Navigation
        </div>
        <nav className="nav flex-column">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${link.icon} fs-5`}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-top bg-light">
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '36px', height: '36px' }}
          >
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden" style={{ minWidth: 0 }}>
            <div className="fw-semibold text-truncate small">{user?.fullName || user?.email}</div>
            <div className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>
              {role}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
