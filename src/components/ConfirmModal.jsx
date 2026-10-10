import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="h5 fw-bold">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <p className="text-secondary mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={onHide} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? 'Processing...' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
