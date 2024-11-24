import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });
  const [reservationData, setReservationData] = useState({
    id: '',
    userId: '',
    flightId: '',
    date: '',
  });
  const [airlineData, setAirlineData] = useState({
    idAerolinea: '',
    nombre: '',
    codigoAerolinea: '',
    paisDeOrigen: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFlights, setShowFlights] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [showAirlines, setShowAirlines] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsResponse = await axios.get('http://localhost:8081/api/v1/vuelos');
        const reservationsResponse = await axios.get('http://localhost:8081/api/v1/reservas');
        const airlinesResponse = await axios.get('http://localhost:8081/api/v1/aerolineas');
        setFlights(flightsResponse.data);
        setReservations(reservationsResponse.data);
        setAirlines(airlinesResponse.data);
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

  const handleAirlineInputChange = (e) => {
    const { name, value } = e.target;
    setAirlineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8081/api/v1/vuelos/${formData.id}`, formData);
        setFlights(flights.map((flight) => (flight.id === formData.id ? formData : flight)));
        setSuccess('Flight updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/vuelos', formData);
        setFlights([...flights, response.data]);
        setSuccess('Flight added successfully');
      }
    } catch (error) {
      setError('Error adding/updating flight');
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (reservationData.id) {
        await axios.put(`http://localhost:8081/api/v1/reservas/${reservationData.id}`, reservationData);
        setReservations(reservations.map((reservation) => (reservation.id === reservationData.id ? reservationData : reservation)));
        setSuccess('Reservation updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/reservas', reservationData);
        setReservations([...reservations, response.data]);
        setSuccess('Reservation added successfully');
      }
    } catch (error) {
      setError('Error adding/updating reservation');
    }
  };

  const handleAirlineSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (airlineData.idAerolinea) {
        await axios.put(`http://localhost:8081/api/v1/aerolineas/${airlineData.idAerolinea}`, airlineData);
        setAirlines(airlines.map((airline) => (airline.idAerolinea === airlineData.idAerolinea ? airlineData : airline)));
        setSuccess('Airline updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/aerolineas', airlineData);
        setAirlines([...airlines, response.data]);
        setSuccess('Airline added successfully');
      }
    } catch (error) {
      setError('Error adding/updating airline');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/vuelos/${flightId}`);
      setFlights(flights.filter((flight) => flight.id !== flightId));
      setSuccess('Flight deleted successfully');
    } catch (error) {
      setError('Error deleting flight');
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/reservas/${reservationId}`);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      setSuccess('Reservation deleted successfully');
    } catch (error) {
      setError('Error deleting reservation');
    }
  };

  const handleDeleteAirline = async (airlineId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/aerolineas/${airlineId}`);
      setAirlines(airlines.filter((airline) => airline.idAerolinea !== airlineId));
      setSuccess('Airline deleted successfully');
    } catch (error) {
      setError('Error deleting airline');
    }
  };

  const handleEditFlight = (flight) => {
    setFormData(flight);
    setShowFlights(true);
  };

  const handleEditReservation = (reservation) => {
    setReservationData(reservation);
    setShowReservations(true);
  };

  const handleEditAirline = (airline) => {
    setAirlineData(airline);
    setShowAirlines(true);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={4}>
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
                            <Button variant="warning" onClick={() => handleEditFlight(flight)}>
                              Editar
                            </Button>
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
                      {formData.id ? 'Actualizar Vuelo' : 'Agregar Vuelo'}
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => setFormData({
                      id: '',
                      destination: '',
                      date: '',
                      price: '',
                      airline: '',
                      airport: '',
                    })}>
                      Limpiar
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
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
                            <Button variant="warning" onClick={() => handleEditReservation(reservation)}>
                              Editar
                            </Button>
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
                      {reservationData.id ? 'Actualizar Reserva' : 'Agregar Reserva'}
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => setReservationData({
                      id: '',
                      userId: '',
                      flightId: '',
                      date: '',
                    })}>
                      Limpiar
                    </Button>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Opciones de Aerolíneas</Card.Title>
              <Button variant="primary" onClick={() => setShowAirlines(!showAirlines)}>
                {showAirlines ? 'Ocultar Aerolíneas' : 'Ver Aerolíneas'}
              </Button>
              {showAirlines && (
                <>
                  <Table striped bordered hover className="mt-3">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>País de Origen</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {airlines.map((airline) => (
                        <tr key={airline.idAerolinea}>
                          <td>{airline.nombre}</td>
                          <td>{airline.codigoAerolinea}</td>
                          <td>{airline.paisDeOrigen}</td>
                          <td>
                            <Button variant="warning" onClick={() => handleEditAirline(airline)}>
                              Editar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteAirline(airline.idAerolinea)}>
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Form onSubmit={handleAirlineSubmit} className="mt-3">
                    <Form.Group controlId="formNombre" className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        placeholder="Ingrese el nombre"
                        value={airlineData.nombre}
                        onChange={handleAirlineInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formCodigoAerolinea" className="mb-3">
                      <Form.Label>Código de Aerolínea</Form.Label>
                      <Form.Control
                        type="text"
                        name="codigoAerolinea"
                        placeholder="Ingrese el código de aerolínea"
                        value={airlineData.codigoAerolinea}
                        onChange={handleAirlineInputChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="formPaisDeOrigen" className="mb-3">
                      <Form.Label>País de Origen</Form.Label>
                      <Form.Control
                        type="text"
                        name="paisDeOrigen"
                        placeholder="Ingrese el país de origen"
                        value={airlineData.paisDeOrigen}
                        onChange={handleAirlineInputChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      {airlineData.idAerolinea ? 'Actualizar Aerolínea' : 'Agregar Aerolínea'}
                    </Button>
                    <Button variant="secondary" className="ms-2" onClick={() => setAirlineData({
                      idAerolinea: '',
                      nombre: '',
                      codigoAerolinea: '',
                      paisDeOrigen: '',
                    })}>
                      Limpiar
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