import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import DataTable from '../../components/DataTable';
import FormInput from '../../components/FormInput';
import ConfirmModal from '../../components/ConfirmModal';

export const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Forms
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 10,
        keyword: search || undefined,
        departmentId: departmentId ? Number(departmentId) : undefined,
      };
      const res = await doctorService.getDoctors(params);
      setDoctors(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  }, [page, search, departmentId]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleOpenAdd = () => {
    resetAdd();
    setShowAddModal(true);
  };

  const handleOpenEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setValueEdit('fullName', doctor.fullName);
    setValueEdit('departmentId', doctor.departmentId);
    setValueEdit('specialization', doctor.specialization);
    setValueEdit('phone', doctor.phone);
    setValueEdit('experienceYears', doctor.experienceYears);
    setValueEdit('available', doctor.available);
    setShowEditModal(true);
  };

  const handleOpenDelete = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDeleteModal(true);
  };

  const onAddSubmit = async (data) => {
    setActionLoading(true);
    try {
      await doctorService.create({
        ...data,
        departmentId: Number(data.departmentId),
        experienceYears: Number(data.experienceYears),
      });
      toast.success('Doctor created successfully with login credentials!');
      setShowAddModal(false);
      resetAdd();
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create doctor');
    } finally {
      setActionLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    setActionLoading(true);
    try {
      await doctorService.update(selectedDoctor.id, {
        ...data,
        departmentId: Number(data.departmentId),
        experienceYears: Number(data.experienceYears),
        available: Boolean(data.available),
      });
      toast.success('Doctor details updated successfully!');
      setShowEditModal(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update doctor');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await doctorService.delete(selectedDoctor.id);
      toast.success('Doctor deleted successfully');
      setShowDeleteModal(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete doctor');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'Doctor Name',
      render: (doc) => (
        <div>
          <div className="fw-semibold text-dark">{doc.fullName}</div>
          <small className="text-muted">{doc.email}</small>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'departmentName',
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
    },
    {
      header: 'Experience',
      render: (doc) => <span>{doc.experienceYears} yrs</span>,
    },
    {
      header: 'Phone',
      accessor: 'phone',
    },
    {
      header: 'Availability',
      render: (doc) => (
        <Badge bg={doc.available ? 'success-subtle' : 'secondary-subtle'} className={doc.available ? 'text-success' : 'text-secondary'}>
          {doc.available ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      render: (doc) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleOpenEdit(doc)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleOpenDelete(doc)}
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
          <h4 className="fw-bold text-dark mb-1">Doctor Management</h4>
          <p className="text-muted small mb-0">Manage doctor profiles, departments, and login accounts</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          <i className="bi bi-person-plus-fill me-2"></i> Add New Doctor
        </Button>
      </div>

      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        {/* Filter Controls */}
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </Col>
          <Col md={6}>
            <Form.Select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <DataTable
          columns={columns}
          data={doctors}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
          emptyTitle="No doctors found"
          emptyDescription="Try adjusting your search filters or add a new doctor profile."
          emptyActionText="Add Doctor"
          onEmptyAction={handleOpenAdd}
        />
      </Card>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Add New Doctor</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitAdd(onAddSubmit)}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <FormInput
                  label="Doctor Full Name"
                  name="fullName"
                  placeholder="e.g. Dr. John Watson"
                  register={registerAdd}
                  validation={{ required: 'Full name is required' }}
                  error={errorsAdd.fullName}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="addDept">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...registerAdd('departmentId', { required: 'Department is required' })}
                    isInvalid={!!errorsAdd.departmentId}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                  {errorsAdd.departmentId && (
                    <Form.Control.Feedback type="invalid">
                      {errorsAdd.departmentId.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <FormInput
                  label="Email (Account Login)"
                  name="email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  register={registerAdd}
                  validation={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  error={errorsAdd.email}
                  required
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="At least 6 characters"
                  register={registerAdd}
                  validation={{
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters' },
                  }}
                  error={errorsAdd.password}
                  required
                />
              </Col>
              <Col md={4}>
                <FormInput
                  label="Specialization"
                  name="specialization"
                  placeholder="e.g. Interventional Cardiologist"
                  register={registerAdd}
                  validation={{ required: 'Specialization is required' }}
                  error={errorsAdd.specialization}
                  required
                />
              </Col>
              <Col md={4}>
                <FormInput
                  label="Experience (Years)"
                  name="experienceYears"
                  type="number"
                  placeholder="e.g. 8"
                  register={registerAdd}
                  validation={{
                    required: 'Experience is required',
                    min: { value: 0, message: 'Cannot be negative' },
                  }}
                  error={errorsAdd.experienceYears}
                  required
                />
              </Col>
              <Col md={4}>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  placeholder="+1-555-0199"
                  register={registerAdd}
                  validation={{ required: 'Phone is required' }}
                  error={errorsAdd.phone}
                  required
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowAddModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Doctor'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Edit Doctor Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit(onEditSubmit)}>
          <Modal.Body className="p-4">
            <Row>
              <Col md={6}>
                <FormInput
                  label="Doctor Full Name"
                  name="fullName"
                  register={registerEdit}
                  validation={{ required: 'Full name is required' }}
                  error={errorsEdit.fullName}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="editDept">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    Department <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    {...registerEdit('departmentId', { required: 'Department is required' })}
                    isInvalid={!!errorsEdit.departmentId}
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <FormInput
                  label="Specialization"
                  name="specialization"
                  register={registerEdit}
                  validation={{ required: 'Specialization is required' }}
                  error={errorsEdit.specialization}
                  required
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="Phone Number"
                  name="phone"
                  register={registerEdit}
                  validation={{ required: 'Phone is required' }}
                  error={errorsEdit.phone}
                  required
                />
              </Col>
              <Col md={6}>
                <FormInput
                  label="Experience (Years)"
                  name="experienceYears"
                  type="number"
                  register={registerEdit}
                  validation={{ required: 'Experience is required' }}
                  error={errorsEdit.experienceYears}
                  required
                />
              </Col>
              <Col md={6} className="d-flex align-items-center mt-3">
                <Form.Check
                  type="switch"
                  id="doctor-available-switch"
                  label="Available for Appointments"
                  {...registerEdit('available')}
                />
              </Col>
            </Row>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Doctor Profile"
        message={`Are you sure you want to delete ${selectedDoctor?.fullName}? Doctors with existing appointments cannot be removed.`}
        confirmText="Delete Doctor"
        loading={actionLoading}
      />
    </div>
  );
};

export default DoctorsManagement;
