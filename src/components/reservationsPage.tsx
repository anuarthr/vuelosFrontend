import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';

const ReservationsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [flights, setFlights] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    passengers: 1,
    passengerDetails: [] // Inicializar la lista de detalles de pasajeros
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || !user.id) {
      setError('Usuario no autenticado');
      return;
    }

    const fetchFlights = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const flightsResponse = await axios.get('http://localhost:8081/api/v1/vuelos', config);
        setFlights(flightsResponse.data);
        const aerolineasResponse = await axios.get('http://localhost:8081/api/v1/aerolineas', config);
        setAerolineas(aerolineasResponse.data);
        const aeropuertosResponse = await axios.get('http://localhost:8081/api/v1/aeropuertos', config);
        setAeropuertos(aeropuertosResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error al obtener los datos');
      }
    };

    const fetchReservations = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get(`http://localhost:8081/api/v1/reservas/cliente/${user.id}`, config);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Error al obtener las reservas');
      }
    };

    fetchFlights();
    fetchReservations();
  }, [user, token]);

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
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.post('http://localhost:8081/api/v1/reservas', {
        idCliente: user.id,
        fechaDeReserva: formData.date,
        numeroDePasajeros: formData.passengers,
        pasajeros: formData.passengerDetails // Asegurarse de enviar la lista de pasajeros
      }, config);
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
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/reservas/${reservationId}`, config);
      setReservations(reservations.filter((reservation) => reservation.idReserva !== reservationId));
      setSuccess('Reserva cancelada exitosamente');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setError('Error al cancelar la reserva');
    }
  };

  const handleReserveFlight = (flight) => {
    setShowModal(true);
  };

  return (
    <div className="reservas">
      <h2>Vuelos Disponibles</h2>
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
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha de Salida</th>
            <th>Hora de Salida</th>
            <th>Duración</th>
            <th>Capacidad</th>
            <th>Aerolínea</th>
            <th>Aeropuerto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.idVuelo}>
              <td>{flight.origen}</td>
              <td>{flight.destino}</td>
              <td>{flight.fechaDeSalida}</td>
              <td>{flight.horaDeSalida}</td>
              <td>{flight.duracion}</td>
              <td>{flight.capacidad}</td>
              <td>{aerolineas.find(a => a.idAerolinea === flight.aerolineaId)?.nombre || 'N/A'}</td>
              <td>{aeropuertos.find(a => a.idAeropuerto === flight.aeropuertoId)?.nombre || 'N/A'}</td>
              <td>
                <Button variant="primary" onClick={() => handleReserveFlight(flight)}>
                  Reservar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h2>Mis Reservas</h2>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Id Reserva</th>
            <th>Fecha Reserva</th>
            <th>Número de Pasajeros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.idReserva}</td>
              <td>{reservation.fechaDeReserva}</td>
              <td>{reservation.numeroDePasajeros}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteReservation(reservation.idReserva)}>
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
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Fecha de Reserva</Form.Label>
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