import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'DOCTOR': return 'primary';
      case 'PATIENT': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <header className="dashboard-header">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary btn-sm d-lg-none"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list fs-5"></i>
        </button>
        <span className="fw-semibold text-dark d-none d-sm-inline">
          Clinical Portal
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <Badge bg={getRoleBadgeVariant()} className="text-uppercase px-2 py-1">
          {role}
        </Badge>
        <span className="text-secondary small fw-medium d-none d-md-inline">
          {user?.fullName || user?.email}
        </span>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleLogout}
          className="d-flex align-items-center gap-1"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="d-none d-sm-inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
