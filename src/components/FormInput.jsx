import React from 'react';
import { Form } from 'react-bootstrap';

export const FormInput = ({
  label,
  name,
  register,
  validation,
  error,
  type = 'text',
  placeholder,
  as,
  rows,
  children,
  disabled = false,
  className = '',
  required = false,
  helpText,
  ...rest
}) => {
  const registerProps = register && name ? register(name, validation) : {};

  return (
    <Form.Group className={`mb-3 ${className}`} controlId={name}>
      {label && (
        <Form.Label className="small fw-semibold text-secondary mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        as={as}
        rows={rows}
        type={as ? undefined : type}
        placeholder={placeholder}
        disabled={disabled}
        isInvalid={!!error}
        {...registerProps}
        {...rest}
      >
        {children}
      </Form.Control>
      {helpText && !error && (
        <Form.Text className="text-muted small">{helpText}</Form.Text>
      )}
      {error && (
        <Form.Control.Feedback type="invalid" className="d-block small">
          {error.message || error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default FormInput;
