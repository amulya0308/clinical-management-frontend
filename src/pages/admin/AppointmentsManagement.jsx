import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { consultationService } from '../../services/consultationService';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import { formatDate, formatTime } from '../../utils/formatters';
import { APPOINTMENT_STATUS } from '../../utils/constants';

export const AppointmentsManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [doctorIdFilter, setDoctorIdFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Status Change Modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Consultation View Modal
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultation, setConsultation] = useState(null);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctorsList();
      setDoctors(data);
    } catch (err) {
      console.error('Failed to load doctors list', err);
    }
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        status: statusFilter || undefined,
        doctorId: doctorIdFilter ? Number(doctorIdFilter) : undefined,
        date: dateFilter || undefined,
      };
      const res = await appointmentService.getAllAppointments(params);
      setAppointments(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, doctorIdFilter, dateFilter]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleOpenStatusModal = (appt) => {
    setSelectedAppt(appt);
    setNewStatus(appt.status);
    setShowStatusModal(true);
  };

  const handleOpenConsultation = async (appt) => {
    try {
      const data = await consultationService.getByAppointmentId(appt.id);
      setConsultation(data);
      setShowConsultModal(true);
    } catch (err) {
      toast.error('Could not fetch consultation record');
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await appointmentService.adminUpdateStatus(selectedAppt.id, newStatus);
      toast.success('Appointment status updated successfully');
      setShowStatusModal(false);
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update appointment status');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      width: '60px',
    },
    {
      header: 'Patient',
      render: (appt) => (
        <div>
          <div className="fw-semibold text-dark">{appt.patientName}</div>
          <small className="text-muted">{appt.patientPhone}</small>
        </div>
      ),
    },
    {
      header: 'Doctor',
      render: (appt) => (
        <div>
          <div className="fw-semibold text-dark">{appt.doctorName}</div>
          <small className="text-muted">{appt.departmentName}</small>
        </div>
      ),
    },
    {
      header: 'Date & Time',
      render: (appt) => (
        <div>
          <div>{formatDate(appt.appointmentDate)}</div>
          <small className="text-muted">{formatTime(appt.appointmentTime)}</small>
        </div>
      ),
    },
    {
      header: 'Reason',
      render: (appt) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={appt.reason}>
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
          {appt.status !== APPOINTMENT_STATUS.COMPLETED && appt.status !== APPOINTMENT_STATUS.CANCELLED && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => handleOpenStatusModal(appt)}
            >
              Update Status
            </Button>
          )}
          {appt.hasConsultation && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => handleOpenConsultation(appt)}
            >
              <i className="bi bi-file-earmark-medical me-1"></i> Consultation
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
          <h4 className="fw-bold text-dark mb-1">Appointment Schedule</h4>
          <p className="text-muted small mb-0">Overview and status tracking of all clinical bookings</p>
        </div>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        {/* Filters */}
        <Row className="g-3 mb-4">
          <Col md={4}>
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
          <Col md={4}>
            <Form.Select
              value={doctorIdFilter}
              onChange={(e) => {
                setDoctorIdFilter(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Doctors</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} ({doc.departmentName})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={4}>
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
          emptyDescription="There are no appointments matching your filters."
        />
      </Card>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Update Appointment Status</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleStatusSubmit}>
          <Modal.Body className="p-4">
            <p className="small text-muted mb-3">
              Patient: <strong>{selectedAppt?.patientName}</strong> | Doctor: <strong>{selectedAppt?.doctorName}</strong>
            </p>
            <Form.Group controlId="selectStatus">
              <Form.Label className="small fw-semibold text-secondary mb-1">Select New Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                required
              >
                {selectedAppt?.status === APPOINTMENT_STATUS.PENDING && (
                  <>
                    <option value={APPOINTMENT_STATUS.CONFIRMED}>Confirm Appointment</option>
                    <option value={APPOINTMENT_STATUS.CANCELLED}>Cancel Appointment</option>
                  </>
                )}
                {selectedAppt?.status === APPOINTMENT_STATUS.CONFIRMED && (
                  <>
                    <option value={APPOINTMENT_STATUS.COMPLETED}>Mark as Completed</option>
                    <option value={APPOINTMENT_STATUS.CANCELLED}>Cancel Appointment</option>
                  </>
                )}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowStatusModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* View Consultation Modal */}
      <Modal show={showConsultModal} onHide={() => setShowConsultModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Consultation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {consultation && (
            <div>
              <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                <div>
                  <h6 className="fw-bold mb-1">{consultation.doctorName}</h6>
                  <small className="text-muted">{consultation.departmentName} - {consultation.doctorSpecialization}</small>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">Appointment Date</small>
                  <strong>{formatDate(consultation.appointmentDate)}</strong>
                </div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-secondary small mb-1">Diagnosis</label>
                <div className="p-3 bg-light rounded-3 text-dark">{consultation.diagnosis}</div>
              </div>

              <div className="mb-3">
                <label className="fw-semibold text-secondary small mb-1">Prescription</label>
                <div className="p-3 bg-light rounded-3 text-dark">{consultation.prescription}</div>
              </div>

              {consultation.notes && (
                <div className="mb-3">
                  <label className="fw-semibold text-secondary small mb-1">Doctor Notes</label>
                  <div className="p-3 bg-light rounded-3 text-muted">{consultation.notes}</div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConsultModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppointmentsManagement;
