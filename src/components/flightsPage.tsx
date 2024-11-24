import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const FlightsPage = () => {
  const { user, token } = useAuth();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });

  useEffect(() => {
    const fetchFlights = async () => {
      if (!token) {
        setError('Usuario no autenticado');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8081/api/v1/vuelos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError('Error al obtener los vuelos');
      }
    };

    fetchFlights();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8081/api/v1/vuelos', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights([...flights, response.data]);
      setShowModal(false);
    } catch (error) {
      console.error('Error adding flight:', error);
      setError('Error al agregar el vuelo');
    }
  };

  const handleDeleteFlight = async (flightId) => {
    try {
      await axios.delete(`http://localhost:8081/api/v1/vuelos/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(flights.filter((flight) => flight.id !== flightId));
    } catch (error) {
      console.error('Error deleting flight:', error);
      setError('Error al eliminar el vuelo');
    }
  };

  const handleBuyFlight = async (flightId) => {
    try {
      await axios.post(`http://localhost:8081/api/v1/vuelos/${flightId}/comprar`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Vuelo comprado exitosamente');
    } catch (error) {
      console.error('Error buying flight:', error);
      setError('Error al comprar el vuelo');
    }
  };

  return (
    <div className="flights-page">
      <h2>Vuelos Disponibles</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="primary" onClick={() => setShowModal(true)}>Agregar Vuelo</Button>
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
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.destination}</td>
              <td>{flight.date}</td>
              <td>{flight.price}</td>
              <td>{flight.airline}</td>
              <td>{flight.airport}</td>
              <td>
                <Button variant="success" onClick={() => handleBuyFlight(flight.id)}>
                  Comprar
                </Button>
                <Button variant="danger" onClick={() => handleDeleteFlight(flight.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Vuelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFlightSubmit}>
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
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlightsPage;