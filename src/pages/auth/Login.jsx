import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/FormInput';
import { ROLES } from '../../utils/constants';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.fullName || user.email}!`);

      // Determine redirect path
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      switch (user.role) {
        case ROLES.ADMIN:
          navigate('/admin/dashboard', { replace: true });
          break;
        case ROLES.DOCTOR:
          navigate('/doctor/dashboard', { replace: true });
          break;
        case ROLES.PATIENT:
          navigate('/patient/dashboard', { replace: true });
          break;
        default:
          navigate('/', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setServerError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    setServerError(null);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center">
      <Card className="app-card border-0 shadow-sm p-4 p-md-5" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3 mb-2"
            style={{ width: '48px', height: '48px' }}
          >
            <i className="bi bi-hospital fs-4"></i>
          </div>
          <h3 className="fw-bold text-dark">Sign In</h3>
          <p className="text-muted small">Access your CarePoint clinical account</p>
        </div>

        {serverError && (
          <Alert variant="danger" className="py-2 small mb-3">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {serverError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="doctor@clinic.com"
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

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            validation={{ required: 'Password is required' }}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 mt-2 mb-3 fw-semibold"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center small text-muted mb-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary text-decoration-none fw-semibold">
              Register as Patient
            </Link>
          </div>

          <div className="border-top pt-3">
            <div className="small fw-semibold text-secondary mb-2 text-center">
              Quick Test Accounts:
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center">
              <Button
                variant="outline-secondary"
                size="sm"
                className="small"
                onClick={() => fillDemoCredentials('admin@clinic.com', 'Admin@123')}
              >
                Admin
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="small"
                onClick={() => fillDemoCredentials('doctor1@clinic.com', 'Doctor@123')}
              >
                Doctor (Sarah)
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="small"
                onClick={() => fillDemoCredentials('patient1@clinic.com', 'Patient@123')}
              >
                Patient (John)
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
