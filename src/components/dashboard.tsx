import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !user.id) {
      setError('Usuario no autenticado');
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <Container className="mt-5">
      <h2>Panel de Control para Usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Hacer una Reserva</Card.Title>
              <Card.Text>
                Realiza una nueva reserva para tu próximo vuelo.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate('/reservations')}>Reservar</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Comprar Vuelo</Card.Title>
              <Card.Text>
                Compra un vuelo disponible en nuestra plataforma.
              </Card.Text>
              <Button variant="secondary" onClick={() => navigate('/flights')}>Comprar</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Editar Perfil</Card.Title>
              <Card.Text>
                Actualiza la información de tu perfil.
              </Card.Text>
              <Button variant="info" onClick={() => navigate('/profile')}>Editar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;