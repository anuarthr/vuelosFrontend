import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminFlights = () => {
  const [flights, setFlights] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: Bearer ${token} }
        };
        const response = await axios.get('http://localhost:8081/api/v1/vuelos', config);
        setFlights(response.data);
      } catch (error) {
        setError('Error fetching flights');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      if (formData.id) {
        await axios.put(http://localhost:8081/api/v1/vuelos/${formData.id}, formData, config);
        setFlights(flights.map((flight) => (flight.id === formData.id ? formData : flight)));
        setSuccess('Flight updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/vuelos', formData, config);
        setFlights([...flights, response.data]);
        setSuccess('Flight added successfully');
      }
    } catch (error) {
      setError('Error adding/updating flight');
    }
  };

  const handleDelete = async (flightId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      await axios.delete(http://localhost:8081/api/v1/vuelos/${flightId}, config);
      setFlights(flights.filter((flight) => flight.id !== flightId));
      setSuccess('Flight deleted successfully');
    } catch (error) {
      setError('Error deleting flight');
    }
  };

  const handleEdit = (flight) => {
    setFormData(flight);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Opciones de Vuelos</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
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
                  <Button variant="warning" onClick={() => handleEdit(flight)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(flight.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form onSubmit={handleSubmit} className="mt-3">
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
      </Card.Body>
    </Card>
  );
};

export default AdminFlights;