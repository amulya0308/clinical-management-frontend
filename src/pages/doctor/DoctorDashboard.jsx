import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminService } from '../../services/adminService';
import { appointmentService } from '../../services/appointmentService';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import { APPOINTMENT_STATUS } from '../../utils/constants';

export const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDoctorDashboard();
      setStats(data);
    } catch (err) {
      toast.error('Failed to load doctor dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleConfirmAppointment = async (id) => {
    try {
      await appointmentService.updateDoctorAppointmentStatus(id, APPOINTMENT_STATUS.CONFIRMED);
      toast.success('Appointment confirmed!');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <Loader message="Loading doctor dashboard..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Doctor Portal</h4>
          <p className="text-muted small mb-0">Today's schedule, consultations, and assigned patient appointments</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchDashboard}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Today's Visits</span>
              <h3 className="fw-bold text-primary mb-0">{stats?.todayAppointmentsCount || 0}</h3>
              <small className="text-primary"><i className="bi bi-calendar-event me-1"></i>Scheduled for today</small>
            </div>
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-calendar2-day-fill"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Pending Approval</span>
              <h3 className="fw-bold text-warning mb-0">{stats?.pendingAppointmentsCount || 0}</h3>
              <small className="text-warning"><i className="bi bi-hourglass-split me-1"></i>Needs confirmation</small>
            </div>
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-clock-history"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Confirmed</span>
              <h3 className="fw-bold text-info mb-0">{stats?.confirmedAppointmentsCount || 0}</h3>
              <small className="text-info"><i className="bi bi-check-circle me-1"></i>Ready for consultation</small>
            </div>
            <div className="stat-icon bg-info-subtle text-info">
              <i className="bi bi-check2-all"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Completed</span>
              <h3 className="fw-bold text-success mb-0">{stats?.completedAppointmentsCount || 0}</h3>
              <small className="text-success"><i className="bi bi-patch-check me-1"></i>Consulted & prescribed</small>
            </div>
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-check-circle-fill"></i>
            </div>
          </div>
        </Col>
      </Row>

      {/* Today's Schedule Card */}
      <Card className="app-card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0">Today's Appointments</h5>
            <small className="text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</small>
          </div>
          <Button as={Link} to="/doctor/appointments" variant="outline-primary" size="sm">
            View All My Appointments
          </Button>
        </div>

        {(!stats?.todayAppointments || stats.todayAppointments.length === 0) ? (
          <div className="text-center py-4 text-muted small">
            <i className="bi bi-calendar-check fs-2 text-secondary d-block mb-2"></i>
            No appointments scheduled for today. Check upcoming appointments in the directory.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.todayAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td className="fw-semibold text-primary">{formatTime(appt.appointmentTime)}</td>
                    <td>
                      <div className="fw-semibold">{appt.patientName}</div>
                      <small className="text-muted">{appt.patientPhone}</small>
                    </td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
                        {appt.reason}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={appt.status} />
                    </td>
                    <td>
                      {appt.status === APPOINTMENT_STATUS.PENDING ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleConfirmAppointment(appt.id)}
                        >
                          Confirm
                        </Button>
                      ) : (
                        <Button
                          as={Link}
                          to="/doctor/appointments"
                          variant="outline-primary"
                          size="sm"
                        >
                          Manage
                        </Button>
                      )}
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

export default DoctorDashboard;
