import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentService } from '../../services/appointmentService';
import { consultationService } from '../../services/consultationService';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ConfirmModal from '../../components/ConfirmModal';
import ViewConsultationModal from './ViewConsultationModal';
import { formatDate, formatTime } from '../../utils/formatters';
import { APPOINTMENT_STATUS } from '../../utils/constants';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultation, setConsultation] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        status: statusFilter || undefined,
      };
      const res = await appointmentService.getPatientAppointments(params);
      setAppointments(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load your appointments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    try {
      await appointmentService.cancelPatientAppointment(selectedAppt.id);
      toast.success('Appointment cancelled successfully');
      setShowCancelModal(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenConsultation = async (appt) => {
    try {
      const data = await consultationService.getByAppointmentId(appt.id);
      setConsultation(data);
      setShowConsultModal(true);
    } catch (err) {
      toast.error('No consultation record available for this appointment');
    }
  };

  const columns = [
    {
      header: 'Doctor',
      render: (appt) => (
        <div>
          <div className="fw-semibold text-dark">{appt.doctorName}</div>
          <small className="text-primary">{appt.doctorSpecialization}</small>
          <div className="small text-muted">{appt.departmentName}</div>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (appt) => (
        <div>
          <div className="fw-semibold text-dark">{formatDate(appt.appointmentDate)}</div>
          <small className="text-muted">{formatTime(appt.appointmentTime)}</small>
        </div>
      ),
    },
    {
      header: 'Reason / Concern',
      render: (appt) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '240px' }} title={appt.reason}>
          {appt.reason}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (appt) => <StatusBadge status={appt.status} />,
    },
    {
      header: 'Actions',
      render: (appt) => (
        <div className="d-flex gap-2">
          {(appt.status === APPOINTMENT_STATUS.PENDING || appt.status === APPOINTMENT_STATUS.CONFIRMED) && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleOpenCancel(appt)}
            >
              Cancel
            </Button>
          )}

          {appt.hasConsultation && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleOpenConsultation(appt)}
            >
              <i className="bi bi-file-earmark-medical me-1"></i> View Prescription
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">My Medical Appointments</h4>
          <p className="text-muted small mb-0">View scheduled clinic visits, statuses, and clinical prescriptions</p>
        </div>
        <Button as={Link} to="/patient/book" variant="primary">
          <i className="bi bi-calendar-plus me-2"></i> Book New Appointment
        </Button>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        <Row className="mb-4">
          <Col md={6}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Statuses</option>
              <option value={APPOINTMENT_STATUS.PENDING}>Pending</option>
              <option value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</option>
              <option value={APPOINTMENT_STATUS.COMPLETED}>Completed</option>
              <option value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</option>
            </Form.Select>
          </Col>
        </Row>

        <DataTable
          columns={columns}
          data={appointments}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          emptyTitle="No appointments found"
          emptyDescription="You haven't scheduled any appointments with this filter."
          emptyActionText="Book an Appointment"
          onEmptyAction={() => window.location.href = '/patient/book'}
        />
      </Card>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your appointment with ${selectedAppt?.doctorName} on ${formatDate(selectedAppt?.appointmentDate)}?`}
        confirmText="Yes, Cancel Visit"
        loading={actionLoading}
      />

      {/* View Prescription / Consultation Modal */}
      <ViewConsultationModal
        show={showConsultModal}
        onHide={() => setShowConsultModal(false)}
        consultation={consultation}
      />
    </div>
  );
};

export default MyAppointments;
