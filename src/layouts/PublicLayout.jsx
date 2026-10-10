import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

export const PublicLayout = () => {
  const { isAuthenticated, role } = useAuth();

  const getDashboardPath = () => {
    switch (role) {
      case ROLES.ADMIN: return '/admin/dashboard';
      case ROLES.DOCTOR: return '/doctor/dashboard';
      case ROLES.PATIENT: return '/patient/dashboard';
      default: return '/login';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar bg="white" expand="lg" className="border-bottom py-3 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary fs-4">
            <div
              className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3"
              style={{ width: '38px', height: '38px' }}
            >
              <i className="bi bi-hospital fs-5"></i>
            </div>
            CarePoint
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="public-nav" />
          <Navbar.Collapse id="public-nav">
            <Nav className="ms-auto align-items-lg-center gap-2">
              <Nav.Link as={NavLink} to="/" end className="fw-medium">
                Home
              </Nav.Link>
              {isAuthenticated ? (
                <Button as={Link} to={getDashboardPath()} variant="primary" size="sm" className="px-3">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Button>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login" className="fw-medium">
                    Sign In
                  </Nav.Link>
                  <Button as={Link} to="/register" variant="primary" size="sm" className="px-3">
                    Register as Patient
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-white border-top py-4 text-center text-muted small mt-auto">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <div>
              &copy; {new Date().getFullYear()} CarePoint Clinical Management System. All rights reserved.
            </div>
            <div className="d-flex gap-3">
              <span className="text-secondary"><i className="bi bi-shield-check text-success me-1"></i>HIPAA Compliant</span>
              <span className="text-secondary"><i className="bi bi-lock text-primary me-1"></i>256-bit Encryption</span>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
