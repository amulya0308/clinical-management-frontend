import React from 'react';
import { Spinner } from 'react-bootstrap';

export const Loader = ({ message = 'Loading...', size = 'md' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner
        animation="border"
        variant="primary"
        style={{ width: size === 'lg' ? '3rem' : '2rem', height: size === 'lg' ? '3rem' : '2rem' }}
      />
      {message && <p className="text-muted mt-3 mb-0 small fw-medium">{message}</p>}
    </div>
  );
};

export default Loader;
