import React from 'react';
import { STATUS_CONFIG } from '../utils/constants';

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#f1f5f9',
    color: '#475569',
    icon: 'bi-info-circle',
  };

  return (
    <span
      className="badge-status d-inline-flex align-items-center gap-1"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.color}30`,
      }}
    >
      <i className={`bi ${config.icon}`}></i>
      {config.label}
    </span>
  );
};

export default StatusBadge;
