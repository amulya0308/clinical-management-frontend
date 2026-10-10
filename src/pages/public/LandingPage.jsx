import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to load departments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const getDashboardLink = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="py-5 bg-white border-bottom position-relative overflow-hidden">
        <Container className="py-md-4">
          <Row className="align-items-center g-5">
            <Col lg={7}>
              <Badge bg="primary-subtle" className="text-primary px-3 py-2 mb-3 rounded-pill fw-semibold">
                <i className="bi bi-shield-check me-1"></i> Leading Clinical Care & Management
              </Badge>
              <h1 className="display-4 fw-bold text-dark lh-sm mb-3">
                Compassionate Healthcare, <span className="text-primary">Seamlessly Managed</span>
              </h1>
              <p className="lead text-secondary mb-4">
                CarePoint connects patients with top medical specialists. Schedule consultations,
                track health records, and access prescriptions all in one secure, unified clinical platform.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Button as={Link} to={getDashboardLink()} variant="primary" size="lg" className="px-4 shadow-sm">
                    <i className="bi bi-speedometer2 me-2"></i> Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button as={Link} to="/register" variant="primary" size="lg" className="px-4 shadow-sm">
                      <i className="bi bi-calendar-plus me-2"></i> Book an Appointment
                    </Button>
                    <Button as={Link} to="/login" variant="outline-primary" size="lg" className="px-4">
                      Sign In
                    </Button>
                  </>
                )}
              </div>
              <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top">
                <div>
                  <h4 className="fw-bold text-dark mb-0">15+</h4>
                  <small className="text-muted">Specialists</small>
                </div>
                <div className="border-end h-100" style={{ height: '30px' }}></div>
                <div>
                  <h4 className="fw-bold text-dark mb-0">99.8%</h4>
                  <small className="text-muted">Satisfaction</small>
                </div>
                <div className="border-end h-100" style={{ height: '30px' }}></div>
                <div>
                  <h4 className="fw-bold text-dark mb-0">24/7</h4>
                  <small className="text-muted">Access</small>
                </div>
              </div>
            </Col>
            <Col lg={5}>
              <div className="p-4 bg-light rounded-4 border position-relative">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle bg-primary text-white p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-heart-pulse fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Cardiology & Vitals</h6>
                    <small className="text-muted">Live appointment scheduling</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle bg-success text-white p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-file-earmark-medical fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">E-Consultations</h6>
                    <small className="text-muted">Diagnoses & prescriptions verified</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 p-3 bg-white rounded-3 shadow-sm">
                  <div className="rounded-circle bg-info text-white p-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                    <i className="bi bi-calendar-check fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Zero Overlap Booking</h6>
                    <small className="text-muted">Automated conflict prevention</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Clinical Departments Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h6 className="text-primary text-uppercase fw-bold letter-spacing-1">Our Specialties</h6>
            <h2 className="fw-bold text-dark">Clinical Departments</h2>
            <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Expert medical teams equipped to handle diagnostic, preventative, and specialized treatments.
            </p>
          </div>

          <Row className="g-4">
            {departments.map((dept) => (
              <Col md={6} lg={3} key={dept.id}>
                <Card className="h-100 border-0 shadow-sm app-card-hover p-3 text-center">
                  <Card.Body className="d-flex flex-column align-items-center">
                    <div
                      className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center mb-3"
                      style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}
                    >
                      <i className="bi bi-hospital"></i>
                    </div>
                    <Card.Title className="fw-bold mb-2">{dept.name}</Card.Title>
                    <Card.Text className="text-muted small mb-3 flex-grow-1">
                      {dept.description || 'Specialized clinical care and patient management.'}
                    </Card.Text>
                    <Badge bg="light" className="text-secondary border px-2 py-1">
                      {dept.doctorCount} Doctors
                    </Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Overview */}
      <section className="py-5 bg-white border-top">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="fw-bold text-dark">Why Patients & Doctors Trust CarePoint</h2>
              <p className="text-secondary">Designed from the ground up for modern clinical workflows.</p>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={4}>
              <div className="p-4 rounded-3 h-100 border bg-light text-center">
                <i className="bi bi-clock-history text-primary fs-1 mb-3 d-inline-block"></i>
                <h5 className="fw-bold">Real-time Slot Booking</h5>
                <p className="text-muted small">
                  Prevents double booking instantly with server-side validation and immediate schedule updates.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 rounded-3 h-100 border bg-light text-center">
                <i className="bi bi-journal-check text-success fs-1 mb-3 d-inline-block"></i>
                <h5 className="fw-bold">Digital Prescriptions</h5>
                <p className="text-muted small">
                  Doctors document diagnosis and prescribe medications directly into the patient's record.
                </p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4 rounded-3 h-100 border bg-light text-center">
                <i className="bi bi-shield-lock text-info fs-1 mb-3 d-inline-block"></i>
                <h5 className="fw-bold">Role-Based Access</h5>
                <p className="text-muted small">
                  Strict privacy boundaries ensure patient data is only accessible to authorized clinical personnel.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;
