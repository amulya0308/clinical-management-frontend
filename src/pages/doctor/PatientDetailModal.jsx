import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { patientService } from '../../services/patientService';
import Loader from '../../components/Loader';

export const PatientDetailModal = ({ show, onHide, patientId }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patientId && show) {
      const fetchPatient = async () => {
        setLoading(true);
        try {
          const data = await patientService.getPatientForDoctor(patientId);
          setPatient(data);
        } catch (err) {
          toast.error('Failed to load patient records');
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [patientId, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">Patient Medical Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {loading ? (
          <Loader message="Loading patient details..." />
        ) : patient ? (
          <div>
            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
              <div
                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-4"
                style={{ width: '56px', height: '56px' }}
              >
                {patient.fullName?.charAt(0) || 'P'}
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">{patient.fullName}</h5>
                <small className="text-muted">{patient.email}</small>
              </div>
            </div>

            <Row className="g-3">
              <Col xs={6}>
                <span className="text-muted small d-block">Age / Gender</span>
                <span className="fw-semibold text-dark">{patient.age} years / {patient.gender}</span>
              </Col>
              <Col xs={6}>
                <span className="text-muted small d-block">Contact Phone</span>
                <span className="fw-semibold text-dark">{patient.phone}</span>
              </Col>
              <Col xs={12}>
                <span className="text-muted small d-block">Residential Address</span>
                <span className="text-dark">{patient.address}</span>
              </Col>
            </Row>
          </div>
        ) : (
          <p className="text-muted small text-center mb-0">No patient details found.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PatientDetailModal;
