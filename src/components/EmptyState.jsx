import React from 'react';
import { Button } from 'react-bootstrap';

export const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No records found',
  description = 'There are no items to display at this time.',
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3">
      <div
        className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-3"
        style={{ width: '64px', height: '64px', color: '#64748b', fontSize: '2rem' }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h6 className="fw-bold text-dark mb-1">{title}</h6>
      <p className="text-muted small mb-3" style={{ maxWidth: '380px', margin: '0 auto' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
