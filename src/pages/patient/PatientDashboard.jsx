import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';

export const PatientDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPatientDashboard();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load patient dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader message="Loading health dashboard..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Patient Health Portal</h4>
          <p className="text-muted small mb-0">Track upcoming visits, medical records, and physician consultations</p>
        </div>
        <div className="d-flex gap-2">
          <Button as={Link} to="/patient/doctors" variant="outline-primary" size="sm">
            <i className="bi bi-search me-1"></i> Find Doctors
          </Button>
          <Button as={Link} to="/patient/book" variant="primary" size="sm">
            <i className="bi bi-calendar-plus me-1"></i> Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} md={4}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Active Bookings</span>
              <h3 className="fw-bold text-primary mb-0">{stats?.activeAppointmentsCount || 0}</h3>
              <small className="text-primary"><i className="bi bi-calendar2-check me-1"></i>Pending or Confirmed</small>
            </div>
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-calendar-event"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} md={4}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Past Visits</span>
              <h3 className="fw-bold text-success mb-0">{stats?.pastAppointmentsCount || 0}</h3>
              <small className="text-success"><i className="bi bi-check2-circle me-1"></i>Completed consultations</small>
            </div>
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-file-earmark-medical"></i>
            </div>
          </div>
        </Col>

        <Col sm={12} md={4}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Total History</span>
              <h3 className="fw-bold text-secondary mb-0">{stats?.totalAppointmentsCount || 0}</h3>
              <small className="text-muted"><i className="bi bi-journal-text me-1"></i>Lifetime visits</small>
            </div>
            <div className="stat-icon bg-light text-secondary">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Appointments Card */}
      <Card className="app-card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Recent Appointments</h5>
          <Button as={Link} to="/patient/appointments" variant="outline-primary" size="sm">
            View All My Appointments
          </Button>
        </div>

        {(!stats?.recentAppointments || stats.recentAppointments.length === 0) ? (
          <div className="text-center py-5 text-muted small">
            <i className="bi bi-calendar-x fs-2 text-secondary d-block mb-2"></i>
            You have no appointments yet. Schedule your first consultation today!
            <div className="mt-3">
              <Button as={Link} to="/patient/book" variant="primary" size="sm">
                Book Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="fw-semibold text-dark">{appt.doctorName}</div>
                      <small className="text-muted">{appt.doctorSpecialization}</small>
                    </td>
                    <td>{appt.departmentName || '-'}</td>
                    <td>
                      <div>{formatDate(appt.appointmentDate)}</div>
                      <small className="text-muted">{formatTime(appt.appointmentTime)}</small>
                    </td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
                        {appt.reason}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientDashboard;
