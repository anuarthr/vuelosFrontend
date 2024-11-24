import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <Row>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Vuelos</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/flights')}>
                Gestionar Vuelos
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Reservas</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/reservations')}>
                Gestionar Reservas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Aerolíneas</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/airlines')}>
                Gestionar Aerolíneas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Clientes</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/clients')}>
                Gestionar Clientes
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Aeropuertos</Card.Title>
              <Button variant="primary" onClick={() => navigate('/admin/airports')}>
                Gestionar Aeropuertos
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;s