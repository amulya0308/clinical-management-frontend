import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export const BookAppointment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDoctorId = searchParams.get('doctorId') || '';

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      doctorId: initialDoctorId,
      appointmentDate: todayStr,
      appointmentTime: '10:00',
      reason: '',
    },
  });

  const selectedDoctorId = watch('doctorId');
  const selectedTime = watch('appointmentTime');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctorsList();
        setDoctors(data);
        if (initialDoctorId) {
          setValue('doctorId', initialDoctorId);
        }
      } catch (err) {
        toast.error('Failed to load doctors list');
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, [initialDoctorId, setValue]);

  const selectedDoctor = doctors.find((d) => String(d.id) === String(selectedDoctorId));

  const onSubmit = async (data) => {
    setConflictError(null);
    setSubmitting(true);
    try {
      // Ensure time string is HH:mm:ss for backend LocalTime parsing
      let timeFormatted = data.appointmentTime;
      if (timeFormatted.length === 5) {
        timeFormatted += ':00';
      }

      const payload = {
        doctorId: Number(data.doctorId),
        appointmentDate: data.appointmentDate,
        appointmentTime: timeFormatted,
        reason: data.reason.trim(),
      };

      await appointmentService.bookAppointment(payload);
      toast.success('Appointment booked successfully! Status: PENDING confirmation by doctor.');
      navigate('/patient/appointments');
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = err.response.data?.message || 'Doctor already has an active appointment at this date and time.';
        setConflictError(msg);
        toast.error(msg);
      } else {
        const msg = err.response?.data?.message || 'Failed to book appointment. Please check inputs.';
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctors) {
    return <Loader message="Loading available doctors..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Book an Appointment</h4>
        <p className="text-muted small mb-0">Select your preferred medical specialist, date, and convenient consultation slot</p>
      </div>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="app-card border-0 shadow-sm p-4 p-md-5">
            {conflictError && (
              <Alert variant="danger" className="py-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  <div>
                    <strong>Booking Conflict:</strong>
                    <div>{conflictError}</div>
                  </div>
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Doctor Selection */}
              <Form.Group className="mb-4" controlId="selectDoctor">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Select Specialist Doctor <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  {...register('doctorId', { required: 'Please select a doctor' })}
                  isInvalid={!!errors.doctorId}
                >
                  <option value="">-- Choose Doctor --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.fullName} — {doc.departmentName} ({doc.specialization})
                    </option>
                  ))}
                </Form.Select>
                {errors.doctorId && (
                  <Form.Control.Feedback type="invalid">
                    {errors.doctorId.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Row>
                {/* Appointment Date */}
                <Col md={6}>
                  <FormInput
                    label="Appointment Date"
                    name="appointmentDate"
                    type="date"
                    min={todayStr}
                    register={register}
                    validation={{
                      required: 'Date is required',
                      validate: (val) => val >= todayStr || 'Date cannot be in the past',
                    }}
                    error={errors.appointmentDate}
                    required
                  />
                </Col>

                {/* Appointment Time Field */}
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="timeSlot">
                    <Form.Label className="small fw-semibold text-secondary mb-1">
                      Time Slot <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register('appointmentTime', { required: 'Time slot is required' })}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Slot Quick Selector */}
              <div className="mb-4">
                <label className="small fw-semibold text-secondary mb-2 d-block">
                  Available Consultation Slots:
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedTime === slot ? 'primary' : 'outline-secondary'}
                      size="sm"
                      onClick={() => setValue('appointmentTime', slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Reason for Appointment */}
              <FormInput
                label="Reason for Visit / Symptoms"
                name="reason"
                as="textarea"
                rows={3}
                placeholder="Briefly describe your symptoms, concern or consultation goals..."
                register={register}
                validation={{
                  required: 'Reason for visit is required',
                  minLength: { value: 5, message: 'Please provide at least 5 characters' },
                }}
                error={errors.reason}
                required
              />

              <div className="d-flex gap-3 mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="px-4"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Booking Appointment...
                    </>
                  ) : (
                    'Confirm & Book Appointment'
                  )}
                </Button>
                <Button
                  as={Link}
                  to="/patient/appointments"
                  variant="light"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Doctor Summary Sidebar Card */}
        <Col lg={4}>
          <Card className="app-card border-0 shadow-sm p-4">
            <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">Consultation Overview</h6>
            {selectedDoctor ? (
              <div>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-4"
                    style={{ width: '48px', height: '48px' }}
                  >
                    {selectedDoctor.fullName.charAt(0)}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">{selectedDoctor.fullName}</h6>
                    <small className="text-primary fw-medium">{selectedDoctor.specialization}</small>
                  </div>
                </div>

                <div className="small text-muted mb-2">
                  <i className="bi bi-hospital me-2"></i>
                  <strong>Department:</strong> {selectedDoctor.departmentName}
                </div>
                <div className="small text-muted mb-2">
                  <i className="bi bi-award me-2"></i>
                  <strong>Experience:</strong> {selectedDoctor.experienceYears} Years
                </div>
                <div className="small text-muted mb-3">
                  <i className="bi bi-telephone me-2"></i>
                  <strong>Clinic Phone:</strong> {selectedDoctor.phone}
                </div>
                <div className="p-3 bg-light rounded-3 small text-secondary">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Appointments are subject to doctor confirmation. You will receive real-time status updates in your dashboard.
                </div>
              </div>
            ) : (
              <p className="text-muted small mb-0">
                Select a doctor from the form to view specialist credentials and department details.
              </p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BookAppointment;
