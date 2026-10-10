export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    variant: 'warning',
    bg: '#fef3c7',
    color: '#92400e',
    icon: 'bi-hourglass-split',
  },
  CONFIRMED: {
    label: 'Confirmed',
    variant: 'primary',
    bg: '#dbeafe',
    color: '#1e40af',
    icon: 'bi-check-circle-fill',
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'success',
    bg: '#d1fae5',
    color: '#065f46',
    icon: 'bi-patch-check-fill',
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'danger',
    bg: '#fee2e2',
    color: '#991b1b',
    icon: 'bi-x-circle-fill',
  },
};
