import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });
  const [reservationData, setReservationData] = useState({
    userId: '',
    flightId: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFlights, setShowFlights] = useState(false);
  const [showReservations, setShowReservations] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsResponse = await axios.get('http://localhost:8081/api/v1/flights');
        const reservationsResponse = await axios.get('http://localhost:8081/api/v1/reservations');
        setFlights(flightsResponse.data);
        setReservations(reservationsResponse.data);
      } catch (error) {
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReservationInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8081/api/v1/flights', formData);
      setFlights([...flights, response.data]);
      setSuccess('Flight added successfully');
    } catch (error) {
      setError('Error adding flight');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8081/api/v1/reservations', reservationData);
      setReservations([...reservations, response.data]);
      setSuccess('Reservation added successfully');
    } catch (error) {
      setError('Error adding reservation');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/flights/${flightId}`);
      setFlights(flights.filter((flight) => flight.id !== flightId));
      setSuccess('Flight deleted successfully');
    } catch (error) {
      setError('Error deleting flight');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/reservations/${reservationId}`);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      setSuccess('Reservation deleted successfully');
    } catch (error) {
      setError('Error deleting reservation');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Vuelos</Card.Title>
              <Button variant="primary" onClick={() => setShowFlights(!showFlights)}>
                {showFlights ? 'Ocultar Vuelos' : 'Ver Vuelos'}
              </Button>
              {showFlights && (
                <>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Destino</th>
                        <th>Fecha</th>
                        <th>Precio</th>
                        <th>Aerolínea</th>
                        <th>Aeropuerto</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flights.map((flight) => (
                        <tr key={flight.id}>
                          <td>{flight.destination}</td>
                          <td>{flight.date}</td>
                          <td>{flight.price}</td>
                          <td>{flight.airline}</td>
                          <td>{flight.airport}</td>
                          <td>
                            <Button variant="danger" onClick={() => handleDeleteFlight(flight.id)}>
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Form onSubmit={handleFlightSubmit} className="mt-3">
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
                    <Form.Group controlId="formPrice" className="mb-3">
                      <Form.Label>Precio</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        placeholder="Ingrese el precio"
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAirline" className="mb-3">
                      <Form.Label>Aerolínea</Form.Label>
                      <Form.Control
                        type="text"
                        name="airline"
                        placeholder="Ingrese la aerolínea"
                        value={formData.airline}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formAirport" className="mb-3">
                      <Form.Label>Aeropuerto</Form.Label>
                      <Form.Control
                        type="text"
                        name="airport"
                        placeholder="Ingrese el aeropuerto"
                        value={formData.airport}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Agregar Vuelo
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Reservas</Card.Title>
              <Button variant="primary" onClick={() => setShowReservations(!showReservations)}>
                {showReservations ? 'Ocultar Reservas' : 'Ver Reservas'}
              </Button>
              {showReservations && (
                <>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Usuario</th>
                        <th>Vuelo</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td>{reservation.userId}</td>
                          <td>{reservation.flightId}</td>
                          <td>{reservation.date}</td>
                          <td>
                            <Button variant="danger" onClick={() => handleDeleteReservation(reservation.id)}>
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Form onSubmit={handleReservationSubmit} className="mt-3">
                    <Form.Group controlId="formUserId" className="mb-3">
                      <Form.Label>ID de Usuario</Form.Label>
                      <Form.Control
                        type="text"
                        name="userId"
                        placeholder="Ingrese el ID del usuario"
                        value={reservationData.userId}
                        onChange={handleReservationInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formFlightId" className="mb-3">
                      <Form.Label>ID de Vuelo</Form.Label>
                      <Form.Control
                        type="text"
                        name="flightId"
                        placeholder="Ingrese el ID del vuelo"
                        value={reservationData.flightId}
                        onChange={handleReservationInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formDate" className="mb-3">
                      <Form.Label>Fecha</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={reservationData.date}
                        onChange={handleReservationInputChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Agregar Reserva
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;