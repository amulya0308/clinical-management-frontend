import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminDashboard();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading clinic statistics..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Administrative Dashboard</h4>
          <p className="text-muted small mb-0">Overview of clinical operations, doctors, and patient schedules</p>
        </div>
        <Button variant="outline-primary" size="sm" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
        </Button>
      </div>

      {/* Main Stats Cards */}
      <Row className="g-3 mb-4">
        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Doctors</span>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalDoctors || 0}</h3>
              <small className="text-success"><i className="bi bi-person-badge me-1"></i>Active Medical Staff</small>
            </div>
            <div className="stat-icon bg-primary-subtle text-primary">
              <i className="bi bi-person-badge-fill"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Patients</span>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalPatients || 0}</h3>
              <small className="text-info"><i className="bi bi-people me-1"></i>Registered Profiles</small>
            </div>
            <div className="stat-icon bg-info-subtle text-info">
              <i className="bi bi-people-fill"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Appointments</span>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalAppointments || 0}</h3>
              <small className="text-warning"><i className="bi bi-calendar-event me-1"></i>Total Scheduled</small>
            </div>
            <div className="stat-icon bg-warning-subtle text-warning">
              <i className="bi bi-calendar2-week-fill"></i>
            </div>
          </div>
        </Col>

        <Col sm={6} xl={3}>
          <div className="stat-card">
            <div>
              <span className="text-muted small fw-semibold text-uppercase d-block mb-1">Departments</span>
              <h3 className="fw-bold text-dark mb-0">{stats?.totalDepartments || 0}</h3>
              <small className="text-primary"><i className="bi bi-building me-1"></i>Clinical Specialties</small>
            </div>
            <div className="stat-icon bg-success-subtle text-success">
              <i className="bi bi-hospital-fill"></i>
            </div>
          </div>
        </Col>
      </Row>

      {/* Appointment Status Breakdown */}
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="app-card border-0 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Pending Action</span>
                <h4 className="fw-bold text-warning mb-0">{stats?.pendingAppointments || 0}</h4>
              </div>
              <i className="bi bi-hourglass-split fs-3 text-warning"></i>
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="app-card border-0 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Confirmed</span>
                <h4 className="fw-bold text-primary mb-0">{stats?.confirmedAppointments || 0}</h4>
              </div>
              <i className="bi bi-check-circle-fill fs-3 text-primary"></i>
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="app-card border-0 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Completed</span>
                <h4 className="fw-bold text-success mb-0">{stats?.completedAppointments || 0}</h4>
              </div>
              <i className="bi bi-patch-check-fill fs-3 text-success"></i>
            </div>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="app-card border-0 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted small">Cancelled</span>
                <h4 className="fw-bold text-danger mb-0">{stats?.cancelledAppointments || 0}</h4>
              </div>
              <i className="bi bi-x-circle-fill fs-3 text-danger"></i>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments Table */}
      <Card className="app-card border-0 shadow-sm p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-dark mb-0">Recent Appointments</h5>
          <Button as={Link} to="/admin/appointments" variant="outline-primary" size="sm">
            View All Appointments
          </Button>
        </div>

        {(!stats?.recentAppointments || stats.recentAppointments.length === 0) ? (
          <p className="text-muted small py-3 mb-0">No appointments recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-custom align-middle">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>
                      <div className="fw-semibold">{appt.patientName}</div>
                      <small className="text-muted">{appt.patientPhone}</small>
                    </td>
                    <td>
                      <div className="fw-medium">{appt.doctorName}</div>
                      <small className="text-muted">{appt.doctorSpecialization}</small>
                    </td>
                    <td>{appt.departmentName || '-'}</td>
                    <td>
                      <div>{formatDate(appt.appointmentDate)}</div>
                      <small className="text-muted">{formatTime(appt.appointmentTime)}</small>
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

export default AdminDashboard;
