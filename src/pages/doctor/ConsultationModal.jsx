import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { consultationService } from '../../services/consultationService';
import FormInput from '../../components/FormInput';
import { formatDate, formatTime } from '../../utils/formatters';

export const ConsultationModal = ({
  show,
  onHide,
  appointment,
  existingConsultation,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      diagnosis: '',
      prescription: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (existingConsultation) {
      setValue('diagnosis', existingConsultation.diagnosis);
      setValue('prescription', existingConsultation.prescription);
      setValue('notes', existingConsultation.notes || '');
    } else {
      reset();
    }
  }, [existingConsultation, setValue, reset]);

  const onSubmit = async (data) => {
    if (!appointment) return;
    setLoading(true);
    try {
      if (existingConsultation) {
        await consultationService.updateConsultation(existingConsultation.id, data);
        toast.success('Consultation updated successfully');
      } else {
        await consultationService.createConsultation(appointment.id, data);
        toast.success('Consultation recorded! Appointment marked as Completed.');
      }
      onSuccess();
      onHide();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save consultation record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">
          {existingConsultation ? 'Edit Clinical Consultation' : 'Add Clinical Consultation'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="p-4">
          {appointment && (
            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold text-dark">Patient: {appointment.patientName}</span>
                <span className="small text-muted">
                  {formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentTime)}
                </span>
              </div>
              <small className="text-muted d-block">
                <strong>Chief Complaint:</strong> {appointment.reason}
              </small>
            </div>
          )}

          <FormInput
            label="Clinical Diagnosis"
            name="diagnosis"
            as="textarea"
            rows={3}
            placeholder="Enter clinical findings, symptoms assessment and diagnosis..."
            register={register}
            validation={{ required: 'Diagnosis is required' }}
            error={errors.diagnosis}
            required
          />

          <FormInput
            label="Prescription & Dosage"
            name="prescription"
            as="textarea"
            rows={4}
            placeholder="e.g. Paracetamol 500mg (1-0-1) for 5 days after food..."
            register={register}
            validation={{ required: 'Prescription details are required' }}
            error={errors.prescription}
            required
          />

          <FormInput
            label="Additional Notes / Follow-up Advice"
            name="notes"
            as="textarea"
            rows={2}
            placeholder="e.g. Advised blood routine in 2 weeks. Drink plenty of fluids."
            register={register}
            error={errors.notes}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={loading}>
            {loading ? 'Saving...' : existingConsultation ? 'Update Consultation' : 'Save & Complete Appointment'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ConsultationModal;
