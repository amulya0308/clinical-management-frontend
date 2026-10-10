import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Button, Form, Badge, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

export const BrowseDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [departmentId, setDepartmentId] = useState('');

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
        size: 9,
        keyword: keyword || undefined,
        departmentId: departmentId ? Number(departmentId) : undefined,
      };
      const res = await doctorService.getDoctors(params);
      setDoctors(res.content || []);
      setTotalPages(res.totalPages || 1);
      setTotalElements(res.totalElements || 0);
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  }, [page, keyword, departmentId]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <div className="fade-in">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Find Specialist Doctors</h4>
        <p className="text-muted small mb-0">Browse through our certified medical practitioners and book consultations</p>
      </div>

      {/* Filter Toolbar */}
      <Card className="app-card border-0 shadow-sm p-4 mb-4">
        <Row className="g-3">
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Search by doctor name or medical specialization..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All Clinical Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </Card>

      {/* Doctor Cards */}
      {loading ? (
        <Loader message="Loading doctor profiles..." size="lg" />
      ) : doctors.length === 0 ? (
        <EmptyState
          icon="bi-person-x"
          title="No doctors found"
          description="Try broadening your search or choosing a different clinical department."
        />
      ) : (
        <>
          <Row className="g-4 mb-4">
            {doctors.map((doc) => (
              <Col md={6} lg={4} key={doc.id}>
                <Card className="app-card border-0 shadow-sm h-100 p-3 app-card-hover">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div
                        className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold fs-4 flex-shrink-0"
                        style={{ width: '56px', height: '56px' }}
                      >
                        {doc.fullName?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-1">{doc.fullName}</h6>
                        <span className="text-primary small fw-semibold d-block">{doc.specialization}</span>
                        <small className="text-muted">{doc.departmentName}</small>
                      </div>
                    </div>

                    <div className="bg-light p-2 rounded-3 mb-3 small d-flex justify-content-between align-items-center">
                      <span className="text-muted">
                        <i className="bi bi-award me-1"></i> {doc.experienceYears} Years Exp.
                      </span>
                      <Badge
                        bg={doc.available ? 'success-subtle' : 'secondary-subtle'}
                        className={doc.available ? 'text-success' : 'text-secondary'}
                      >
                        {doc.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>

                    <div className="mt-auto pt-2">
                      <Button
                        as={Link}
                        to={`/patient/book?doctorId=${doc.id}`}
                        variant="primary"
                        className="w-100"
                        disabled={!doc.available}
                      >
                        <i className="bi bi-calendar-check me-2"></i> Book Appointment
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">
                Showing page {page + 1} of {totalPages} ({totalElements} doctors)
              </span>
              <Pagination className="mb-0 pagination-sm">
                <Pagination.Prev
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseDoctors;
