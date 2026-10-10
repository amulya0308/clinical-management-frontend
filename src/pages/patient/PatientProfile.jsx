import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/FormInput';
import Loader from '../../components/Loader';

export const PatientProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await patientService.getCurrentProfile();
        setValue('fullName', data.fullName);
        setValue('age', data.age);
        setValue('gender', data.gender);
        setValue('phone', data.phone);
        setValue('address', data.address);
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const updated = await patientService.updateCurrentProfile({
        ...data,
        age: parseInt(data.age, 10),
      });
      toast.success('Profile updated successfully!');
      if (user) {
        const updatedUser = { ...user, fullName: updated.fullName };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader message="Loading profile information..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">My Medical Profile</h4>
        <p className="text-muted small mb-0">Update your personal demographics and contact details</p>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 p-md-5" style={{ maxWidth: '720px' }}>
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div
            className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-3"
            style={{ width: '64px', height: '64px' }}
          >
            {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'P'}
          </div>
          <div>
            <h5 className="fw-bold mb-0 text-dark">{user?.fullName || 'Patient'}</h5>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Full Name"
            name="fullName"
            register={register}
            validation={{ required: 'Full name is required' }}
            error={errors.fullName}
            required
          />

          <Row>
            <Col md={6}>
              <FormInput
                label="Age (Years)"
                name="age"
                type="number"
                register={register}
                validation={{
                  required: 'Age is required',
                  min: { value: 0, message: 'Invalid age' },
                  max: { value: 130, message: 'Invalid age' },
                }}
                error={errors.age}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="gender">
                <Form.Label className="small fw-semibold text-secondary mb-1">
                  Gender <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select {...register('gender', { required: 'Gender is required' })}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <FormInput
            label="Contact Phone Number"
            name="phone"
            register={register}
            validation={{ required: 'Phone number is required' }}
            error={errors.phone}
            required
          />

          <FormInput
            label="Residential Address"
            name="address"
            as="textarea"
            rows={3}
            register={register}
            validation={{ required: 'Address is required' }}
            error={errors.address}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="px-4 py-2 mt-2 fw-semibold"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Saving Profile...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default PatientProfile;
