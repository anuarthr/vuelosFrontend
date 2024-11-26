import React, { useEffect, useState } from 'react';
import { Table, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const FlightsPage = () => {
  const { user, token } = useAuth();
  const [flights, setFlights] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Usuario no autenticado');
        return;
      }
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

    fetchData();
  }, [token]);

  const handleBuyFlight = (flight) => {
    setSelectedFlight(flight);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`http://localhost:8081/api/v1/compras`, {
        flightId: selectedFlight.idVuelo,
        userId: user.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      alert('Compra realizada con éxito');
    } catch (error) {
      console.error('Error buying flight:', error);
      setError('Error al realizar la compra');
    }
  };

  return (
    <div>
      <h1>Vuelos Disponibles</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
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
                <Button variant="primary" onClick={() => handleBuyFlight(flight)}>
                  Comprar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formOrigen" className="mb-3">
              <Form.Label>Origen</Form.Label>
              <Form.Control
                type="text"
                name="origen"
                value={selectedFlight?.origen || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formDestination" className="mb-3">
              <Form.Label>Destino</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={selectedFlight?.destino || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Fecha de Salida</Form.Label>
              <Form.Control
                type="text"
                name="date"
                value={selectedFlight?.fechaDeSalida || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formTime" className="mb-3">
              <Form.Label>Hora de Salida</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={selectedFlight?.horaDeSalida || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formDuration" className="mb-3">
              <Form.Label>Duración</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={selectedFlight?.duracion || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formCapacity" className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="text"
                name="capacity"
                value={selectedFlight?.capacidad || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formAirline" className="mb-3">
              <Form.Label>Aerolínea</Form.Label>
              <Form.Control
                type="text"
                name="airline"
                value={aerolineas.find(a => a.idAerolinea === selectedFlight?.aerolineaId)?.nombre || 'N/A'}
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formAirport" className="mb-3">
              <Form.Label>Aeropuerto</Form.Label>
              <Form.Control
                type="text"
                name="airport"
                value={aeropuertos.find(a => a.idAeropuerto === selectedFlight?.aeropuertoId)?.nombre || 'N/A'}
                readOnly
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Confirmar Compra
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlightsPage;