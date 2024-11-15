import React, { useState } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFlightSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/flights', formData);
      setFlights([...flights, response.data]);
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

  const handleAirlineSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/airlines', { name: formData.airline });
      setAirlines([...airlines, response.data]);
    } catch (error) {
      console.error('Error adding airline:', error);
    }
  };

  const handleAirportSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/airports', { name: formData.airport });
      setAirports([...airports, response.data]);
    } catch (error) {
      console.error('Error adding airport:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Dashboard de Administrador</h2>

      <h3>Insertar Vuelo</h3>
      <Form onSubmit={handleFlightSubmit}>
        <Row>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formPrice" className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Ingrese el precio"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
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
          </Col>
          <Col md={6}>
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
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Insertar Vuelo
        </Button>
      </Form>

      <h3>Insertar Aerolínea</h3>
      <Form onSubmit={handleAirlineSubmit}>
        <Form.Group controlId="formAirlineName" className="mb-3">
          <Form.Label>Nombre de la Aerolínea</Form.Label>
          <Form.Control
            type="text"
            name="airline"
            placeholder="Ingrese el nombre de la aerolínea"
            value={formData.airline}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Insertar Aerolínea
        </Button>
      </Form>

      <h3>Insertar Aeropuerto</h3>
      <Form onSubmit={handleAirportSubmit}>
        <Form.Group controlId="formAirportName" className="mb-3">
          <Form.Label>Nombre del Aeropuerto</Form.Label>
          <Form.Control
            type="text"
            name="airport"
            placeholder="Ingrese el nombre del aeropuerto"
            value={formData.airport}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Insertar Aeropuerto
        </Button>
      </Form>

      <h3>Vuelos</h3>
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

      <h3>Aerolíneas</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {airlines.map((airline, index) => (
            <tr key={index}>
              <td>{airline.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h3>Aeropuertos</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          {airports.map((airport, index) => (
            <tr key={index}>
              <td>{airport.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;