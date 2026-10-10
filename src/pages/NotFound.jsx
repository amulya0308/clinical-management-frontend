import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Container className="py-5 text-center d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Card className="app-card border-0 shadow-sm p-5" style={{ maxWidth: '480px' }}>
        <h1 className="display-1 fw-bold text-primary mb-0">404</h1>
        <h4 className="fw-bold text-dark mt-2 mb-3">Page Not Found</h4>
        <p className="text-muted small mb-4">
          The requested clinical resource or page does not exist or may have been moved.
        </p>
        <div>
          <Button as={Link} to="/" variant="primary">
            <i className="bi bi-house-door me-2"></i> Return to Home
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default NotFound;
