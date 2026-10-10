import React, { Component } from 'react';
import { Container, Card, Button } from 'react-bootstrap';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5 text-center">
          <Card className="p-4 mx-auto app-card" style={{ maxWidth: '500px' }}>
            <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h4 className="fw-bold mb-2">Something went wrong</h4>
            <p className="text-muted small mb-4">
              An unexpected error occurred while rendering this component.
            </p>
            <Button variant="primary" onClick={this.handleReset}>
              <i className="bi bi-arrow-clockwise me-2"></i>Reload Application
            </Button>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
