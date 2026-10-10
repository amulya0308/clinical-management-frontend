import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/formatters';

export const ViewConsultationModal = ({ show, onHide, consultation }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">
          <i className="bi bi-file-earmark-medical text-primary me-2"></i>
          Clinical Consultation & Prescription
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        {consultation ? (
          <div>
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4 border">
              <div>
                <h6 className="fw-bold mb-1 text-dark">{consultation.doctorName}</h6>
                <span className="text-primary small fw-semibold d-block">
                  {consultation.departmentName} — {consultation.doctorSpecialization}
                </span>
              </div>
              <div className="text-end">
                <span className="small text-muted d-block">Consultation Date</span>
                <strong className="text-dark">{formatDate(consultation.appointmentDate)}</strong>
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-semibold text-secondary small mb-1 text-uppercase letter-spacing-1">
                Clinical Diagnosis
              </label>
              <div className="p-3 bg-white border rounded-3 text-dark fw-medium">
                {consultation.diagnosis}
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-semibold text-secondary small mb-1 text-uppercase letter-spacing-1">
                Rx - Prescription & Dosage
              </label>
              <div
                className="p-3 bg-light border rounded-3 text-dark font-monospace"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {consultation.prescription}
              </div>
            </div>

            {consultation.notes && (
              <div className="mb-2">
                <label className="fw-semibold text-secondary small mb-1 text-uppercase letter-spacing-1">
                  Doctor's Clinical Notes & Follow-up
                </label>
                <div className="p-3 bg-white border rounded-3 text-muted">
                  {consultation.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-muted small text-center mb-0">No consultation records found.</p>
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

export default ViewConsultationModal;
