import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert, Card, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [flights, setFlights] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    passengers: 1,
  });
  const [profileData, setProfileData] = useState({
    name: user?.nombre || '',
    apellido: '',
    direccion: '',
    phone: '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch user reservations
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reservations?userId=${user.id}`);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    // Fetch available flights
    const fetchFlights = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/flights');
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchReservations();
    fetchFlights();
  }, [user.id]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReservationSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/api/reservations', {
        userId: user.id,
        ...formData,
      });
      setReservations([...reservations, response.data]);
      setShowModal(false);
      setSuccess('Reserva realizada exitosamente');
    } catch (error) {
      console.error('Error making reservation:', error);
      setError('Error al realizar la reserva');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8080/api/reservations/${reservationId}`);
      setReservations(reservations.filter(reservation => reservation.id !== reservationId));
      setSuccess('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Error al cancelar la reserva');
    }
  };

  const handleProfileSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(`http://localhost:8080/api/users/${user.id}`, profileData);
      login(response.data);
      setShowEditProfileModal(false);
      setSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    }
  };

  return (
    <div className="dashboard">
      <h2>Panel de Control para Usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Hacer una Reserva</Card.Title>
              <Card.Text>
                Realiza una nueva reserva para tu próximo vuelo.
              </Card.Text>
              <Button variant="primary" onClick={() => setShowModal(true)}>Reservar</Button>
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
              <Button variant="info" onClick={() => setShowEditProfileModal(true)}>Editar</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Button variant="success" className="mt-3" onClick={() => setShowReservations(!showReservations)}>
        {showReservations ? 'Ocultar Reservas y Vuelos' : 'Ver Reservas y Vuelos'}
      </Button>

      {showReservations && (
        <>
          <h3 className="mt-4">Mis Reservas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Pasajeros</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={index}>
                  <td>{reservation.destination}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.passengers}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDeleteReservation(reservation.id)}>
                      Cancelar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h3 className="mt-4">Vuelos Disponibles</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Aerolínea</th>
                <th>Aeropuerto</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.destination}</td>
                  <td>{flight.date}</td>
                  <td>{flight.price}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.airport}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hacer una Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReservationSubmit}>
            <Form.Group controlId="formDestination" className="mb-3">
              <Form.Label>Destino</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                placeholder="Ingrese el destino"
                value={formData.destination}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassengers" className="mb-3">
              <Form.Label>Pasajeros</Form.Label>
              <Form.Control
                type="number"
                name="passengers"
                min="1"
                value={formData.passengers}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Reservar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditProfileModal} onHide={() => setShowEditProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ingrese su nombre"
                value={profileData.name}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellido" className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Ingrese su apellido"
                value={profileData.apellido}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                placeholder="Ingrese su dirección"
                value={profileData.direccion}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Ingrese su número"
                value={profileData.phone}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={profileData.email}
                onChange={handleProfileInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Actualizar Perfil
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;