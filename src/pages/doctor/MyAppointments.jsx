import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { appointmentService } from '../../services/appointmentService';
import { consultationService } from '../../services/consultationService';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import ConsultationModal from './ConsultationModal';
import PatientDetailModal from './PatientDetailModal';
import ConfirmModal from '../../components/ConfirmModal';
import { formatDate, formatTime } from '../../utils/formatters';
import { APPOINTMENT_STATUS } from '../../utils/constants';

export const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultationData, setConsultationData] = useState(null);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
      };
      const res = await appointmentService.getDoctorAppointments(params);
      setAppointments(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dateFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleConfirm = async (id) => {
    try {
      await appointmentService.updateDoctorAppointmentStatus(id, APPOINTMENT_STATUS.CONFIRMED);
      toast.success('Appointment confirmed!');
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm appointment');
    }
  };

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    setActionLoading(true);
    try {
      await appointmentService.updateDoctorAppointmentStatus(selectedAppt.id, APPOINTMENT_STATUS.CANCELLED);
      toast.success('Appointment marked as cancelled');
      setShowCancelModal(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenConsultation = async (appt) => {
    setSelectedAppt(appt);
    if (appt.hasConsultation) {
      try {
        const data = await consultationService.getByAppointmentId(appt.id);
        setConsultationData(data);
      } catch (err) {
        setConsultationData(null);
      }
    } else {
      setConsultationData(null);
    }
    setShowConsultModal(true);
  };

  const handleOpenPatientDetail = (patientId) => {
    setSelectedPatientId(patientId);
    setShowPatientModal(true);
  };

  const columns = [
    {
      header: 'Date & Time',
      render: (appt) => (
        <div>
          <div className="fw-semibold text-dark">{formatDate(appt.appointmentDate)}</div>
          <small className="text-primary fw-medium">{formatTime(appt.appointmentTime)}</small>
        </div>
      ),
    },
    {
      header: 'Patient Details',
      render: (appt) => (
        <div>
          <button
            className="btn btn-link p-0 fw-semibold text-decoration-none text-dark d-block text-start"
            onClick={() => handleOpenPatientDetail(appt.patientId)}
          >
            {appt.patientName} <i className="bi bi-info-circle text-primary small"></i>
          </button>
          <small className="text-muted">{appt.patientPhone}</small>
        </div>
      ),
    },
    {
      header: 'Reason / Complaint',
      render: (appt) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '220px' }} title={appt.reason}>
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
        <div className="d-flex flex-wrap gap-2">
          {appt.status === APPOINTMENT_STATUS.PENDING && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => handleConfirm(appt.id)}
              >
                <i className="bi bi-check-lg me-1"></i> Confirm
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleOpenCancel(appt)}
              >
                Cancel
              </Button>
            </>
          )}

          {appt.status === APPOINTMENT_STATUS.CONFIRMED && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenConsultation(appt)}
              >
                <i className="bi bi-journal-plus me-1"></i> Add Consultation
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleOpenCancel(appt)}
              >
                Cancel
              </Button>
            </>
          )}

          {appt.status === APPOINTMENT_STATUS.COMPLETED && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleOpenConsultation(appt)}
            >
              <i className="bi bi-file-earmark-medical me-1"></i> View Record
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
          <h4 className="fw-bold text-dark mb-1">My Patient Appointments</h4>
          <p className="text-muted small mb-0">Manage clinical appointments, review patient records, and submit diagnoses</p>
        </div>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        {/* Filters */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Appointment Statuses</option>
              <option value={APPOINTMENT_STATUS.PENDING}>Pending</option>
              <option value={APPOINTMENT_STATUS.CONFIRMED}>Confirmed</option>
              <option value={APPOINTMENT_STATUS.COMPLETED}>Completed</option>
              <option value={APPOINTMENT_STATUS.CANCELLED}>Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setPage(0);
              }}
            />
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
          emptyDescription="You have no patient appointments matching the current filter."
        />
      </Card>

      {/* Consultation Modal */}
      <ConsultationModal
        show={showConsultModal}
        onHide={() => setShowConsultModal(false)}
        appointment={selectedAppt}
        existingConsultation={consultationData}
        onSuccess={fetchAppointments}
      />

      {/* Patient Detail Modal */}
      <PatientDetailModal
        show={showPatientModal}
        onHide={() => setShowPatientModal(false)}
        patientId={selectedPatientId}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Patient Appointment"
        message={`Are you sure you want to cancel the appointment for ${selectedAppt?.patientName}?`}
        confirmText="Confirm Cancellation"
        loading={actionLoading}
      />
    </div>
  );
};

export default MyAppointments;
