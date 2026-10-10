import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/FormInput';

export const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        age: parseInt(data.age, 10),
      };
      await authRegister(payload);
      toast.success('Registration successful! Welcome to CarePoint.');
      navigate('/patient/dashboard', { replace: true });
    } catch (err) {
      if (err.response?.data?.fieldErrors) {
        Object.entries(err.response.data.fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: 'server', message: msg });
        });
      }
      const msg = err.response?.data?.message || 'Registration failed. Please check the details and try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center">
      <Card className="app-card border-0 shadow-sm p-4 p-md-5" style={{ maxWidth: '640px', width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 mb-2"
            style={{ width: '48px', height: '48px' }}
          >
            <i className="bi bi-person-plus-fill fs-4"></i>
          </div>
          <h3 className="fw-bold text-dark">Patient Registration</h3>
          <p className="text-muted small">Create an account to book and manage medical appointments</p>
        </div>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {serverError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12}>
              <FormInput
                label="Full Name"
                name="fullName"
                placeholder="e.g. John Doe"
                register={register}
                validation={{
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Minimum 2 characters' },
                }}
                error={errors.fullName}
                required
              />
            </Col>

            <Col md={6}>
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                register={register}
                validation={{
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
                error={errors.email}
                required
              />
            </Col>

            <Col md={6}>
              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                register={register}
                validation={{
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                }}
                error={errors.password}
                required
              />
            </Col>

            <Col md={4}>
              <FormInput
                label="Age"
                name="age"
                type="number"
                placeholder="e.g. 30"
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

            <Col md={4}>
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

            <Col md={4}>
              <FormInput
                label="Phone Number"
                name="phone"
                placeholder="+1 555-0100"
                register={register}
                validation={{ required: 'Phone number is required' }}
                error={errors.phone}
                required
              />
            </Col>

            <Col md={12}>
              <FormInput
                label="Residential Address"
                name="address"
                as="textarea"
                rows={2}
                placeholder="123 Health Ave, City"
                register={register}
                validation={{ required: 'Address is required' }}
                error={errors.address}
                required
              />
            </Col>
          </Row>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 mt-2 mb-3 fw-semibold"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Account...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>

          <div className="text-center small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary text-decoration-none fw-semibold">
              Sign In
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
