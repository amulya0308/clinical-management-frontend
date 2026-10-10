import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { patientService } from '../../services/patientService';
import DataTable from '../../components/DataTable';
import FormInput from '../../components/FormInput';
import ConfirmModal from '../../components/ConfirmModal';

export const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await patientService.getPatients({
        page,
        size: 10,
        keyword: keyword || undefined,
      });
      setPatients(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleOpenEdit = (patient) => {
    setSelectedPatient(patient);
    setValue('fullName', patient.fullName);
    setValue('age', patient.age);
    setValue('gender', patient.gender);
    setValue('phone', patient.phone);
    setValue('address', patient.address);
    setShowEditModal(true);
  };

  const handleOpenDelete = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const onEditSubmit = async (data) => {
    setActionLoading(true);
    try {
      await patientService.updatePatient(selectedPatient.id, {
        ...data,
        age: parseInt(data.age, 10),
      });
      toast.success('Patient details updated successfully');
      setShowEditModal(false);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update patient');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await patientService.deletePatient(selectedPatient.id);
      toast.success('Patient deleted successfully');
      setShowDeleteModal(false);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete patient');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Patient Name',
      render: (p) => (
        <div>
          <div className="fw-semibold text-dark">{p.fullName}</div>
          <small className="text-muted">{p.email}</small>
        </div>
      ),
    },
    {
      header: 'Age / Gender',
      render: (p) => <span>{p.age} yrs / {p.gender}</span>,
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Address',
      accessor: 'address',
    },
    {
      header: 'Actions',
      render: (p) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleOpenEdit(p)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleOpenDelete(p)}
          >
            <i className="bi bi-trash"></i> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Patient Directory</h4>
          <p className="text-muted small mb-0">View registered patients and manage demographic records</p>
        </div>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        <Row className="mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by patient name, email or phone..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
            />
          </Col>
        </Row>

        <DataTable
          columns={columns}
          data={patients}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          emptyTitle="No patients found"
          emptyDescription="No patients match your search criteria."
        />
      </Card>

      {/* Edit Patient Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Edit Patient Details</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onEditSubmit)}>
          <Modal.Body className="p-4">
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
                  label="Age"
                  name="age"
                  type="number"
                  register={register}
                  validation={{ required: 'Age is required' }}
                  error={errors.age}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="patientGender">
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
              label="Phone Number"
              name="phone"
              register={register}
              validation={{ required: 'Phone is required' }}
              error={errors.phone}
              required
            />
            <FormInput
              label="Address"
              name="address"
              as="textarea"
              rows={2}
              register={register}
              validation={{ required: 'Address is required' }}
              error={errors.address}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowEditModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Patient Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Patient Record"
        message={`Are you sure you want to delete patient "${selectedPatient?.fullName}"? Patients with appointment history cannot be deleted.`}
        confirmText="Delete Patient"
        loading={actionLoading}
      />
    </div>
  );
};

export default PatientsManagement;
