import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Modal, Badge } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { departmentService } from '../../services/departmentService';
import FormInput from '../../components/FormInput';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';

export const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm();

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpenAdd = () => {
    resetAdd();
    setShowAddModal(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setValueEdit('name', dept.name);
    setValueEdit('description', dept.description);
    setShowEditModal(true);
  };

  const handleOpenDelete = (dept) => {
    setSelectedDept(dept);
    setShowDeleteModal(true);
  };

  const onAddSubmit = async (data) => {
    setActionLoading(true);
    try {
      await departmentService.create(data);
      toast.success('Department created successfully');
      setShowAddModal(false);
      resetAdd();
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    } finally {
      setActionLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    setActionLoading(true);
    try {
      await departmentService.update(selectedDept.id, data);
      toast.success('Department updated successfully');
      setShowEditModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update department');
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await departmentService.delete(selectedDept.id);
      toast.success('Department deleted successfully');
      setShowDeleteModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete department');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading departments..." size="lg" />;
  }

  return (
    <div className="fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h4 className="fw-bold text-dark mb-1">Departments</h4>
          <p className="text-muted small mb-0">Manage clinic specialties and doctor allocations</p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg me-2"></i> Add Department
        </Button>
      </div>

      <Row className="g-4">
        {departments.map((dept) => (
          <Col md={6} lg={4} key={dept.id}>
            <Card className="app-card border-0 shadow-sm h-100 p-3">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                    style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}
                  >
                    <i className="bi bi-hospital"></i>
                  </div>
                  <Badge bg="light" className="text-secondary border px-2 py-1">
                    <i className="bi bi-person-badge me-1"></i> {dept.doctorCount} Doctors
                  </Badge>
                </div>
                <Card.Title className="fw-bold text-dark mb-2">{dept.name}</Card.Title>
                <Card.Text className="text-muted small flex-grow-1">
                  {dept.description || 'No description provided.'}
                </Card.Text>
                <div className="d-flex gap-2 pt-3 border-top mt-3">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="flex-grow-1"
                    onClick={() => handleOpenEdit(dept)}
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOpenDelete(dept)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Department Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Add Clinical Department</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitAdd(onAddSubmit)}>
          <Modal.Body className="p-4">
            <FormInput
              label="Department Name"
              name="name"
              placeholder="e.g. Neurology"
              register={registerAdd}
              validation={{ required: 'Department name is required' }}
              error={errorsAdd.name}
              required
            />
            <FormInput
              label="Description"
              name="description"
              as="textarea"
              rows={3}
              placeholder="Brief description of the department's specialties..."
              register={registerAdd}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowAddModal(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={actionLoading}>
              {actionLoading ? 'Creating...' : 'Create Department'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Department Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="h5 fw-bold">Edit Department</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEdit(onEditSubmit)}>
          <Modal.Body className="p-4">
            <FormInput
              label="Department Name"
              name="name"
              register={registerEdit}
              validation={{ required: 'Department name is required' }}
              error={errorsEdit.name}
              required
            />
            <FormInput
              label="Description"
              name="description"
              as="textarea"
              rows={3}
              register={registerEdit}
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

      {/* Delete Department Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDept?.name}"? A department cannot be deleted if doctors are assigned to it.`}
        confirmText="Delete Department"
        loading={actionLoading}
      />
    </div>
  );
};

export default DepartmentsManagement;
