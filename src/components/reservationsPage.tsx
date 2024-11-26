import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const ReservationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    passengers: 1,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || !user.id) {
      setError('Usuario no autenticado');
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/v1/reservas?userId=${user.id}`);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Error al obtener las reservas');
      }
    };

    fetchReservations();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8081/api/v1/reservas', {
        userId: user.id,
        ...formData,
      });
      setReservations([...reservations, response.data]);
      setShowModal(false);
      setSuccess('Reserva realizada exitosamente');
    } catch (error) {
      console.error('Error haciendo la reservación:', error);
      setError('Error al realizar la reserva');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/reservas/${reservationId}`);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      setSuccess('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Error al cancelar la reserva');
    }
  };

  return (
    <div className="reservas">
      <h2>Mis Reservas</h2>
        <Button 
                variant="outline-secondary" 
                className="me-2"
                onClick={() => navigate('/dashboard')}
                style={{marginTop: '5px', marginBottom: '10px'}}
              >
                🔙 User Menu
          </Button>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" onClick={() => setShowModal(true)}>Hacer una Reserva</Button>
      <Table striped bordered hover className="mt-3">
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
    </div>
  );
};

export default ReservationsPage;