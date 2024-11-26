import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminFlights = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [aerolineas, setAerolineas] = useState([]);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [formData, setFormData] = useState({
    idVuelo: '',
    origen: '',
    destino: '',
    fechaDeSalida: '',
    horaDeSalida: '',
    duracion: '',
    capacidad: '',
    aerolineaId: '',
    aeropuertoId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (formData.idVuelo) {
        await axios.put(`http://localhost:8081/api/v1/vuelos/${formData.idVuelo}`, formData, config);
        setSuccess('Flight updated successfully');
        const response = await axios.get('http://localhost:8081/api/v1/vuelos', config);
        setFlights(response.data);
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/vuelos', formData, config);
        setSuccess('Flight created successfully');
        setFlights([...flights, response.data]);
      }
      setFormData({
        idVuelo: '',
        origen: '',
        destino: '',
        fechaDeSalida: '',
        horaDeSalida: '',
        duracion: '',
        capacidad: '',
        aerolineaId: '',
        aeropuertoId: '',
      });
    } catch (error) {
      setError('Error saving flight');
    }
  };

  const handleEdit = (flight) => {
    setFormData({
      idVuelo: flight.idVuelo,
      origen: flight.origen,
      destino: flight.destino,
      fechaDeSalida: flight.fechaDeSalida,
      horaDeSalida: flight.horaDeSalida,
      duracion: flight.duracion,
      capacidad: flight.capacidad,
      aerolineaId: flight.aerolinea?.idAerolinea || '',
      aeropuertoId: flight.aeropuerto?.idAeropuerto || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/vuelos/${id}`, config);
      setFlights(flights.filter((flight) => flight.idVuelo !== id));
      setSuccess('Flight deleted successfully');
    } catch (error) {
      setError('Error deleting flight');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Manage Flights</Card.Title>
          <Button 
                  variant="outline-primary"
                  onClick={() => navigate('/admin')}
                  style={{marginTop: '5px', marginBottom: '10px'}}
                >
                 🔙 Admin Menu
          </Button>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formOrigen" className="mb-3">
            <Form.Label>Origen</Form.Label>
            <Form.Control
              type="text"
              name="origen"
              placeholder="Enter origin"
              value={formData.origen}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDestino" className="mb-3">
            <Form.Label>Destino</Form.Label>
            <Form.Control
              type="text"
              name="destino"
              placeholder="Enter destination"
              value={formData.destino}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFechaDeSalida" className="mb-3">
            <Form.Label>Fecha de Salida</Form.Label>
            <Form.Control
              type="date"
              name="fechaDeSalida"
              value={formData.fechaDeSalida}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formHoraDeSalida" className="mb-3">
            <Form.Label>Hora de Salida</Form.Label>
            <Form.Control
              type="time"
              name="horaDeSalida"
              value={formData.horaDeSalida}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDuracion" className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duracion"
              placeholder="Enter duration"
              value={formData.duracion}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formCapacidad" className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacidad"
              placeholder="Enter capacity"
              value={formData.capacidad}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formAerolinea" className="mb-3">
            <Form.Label>Aerolinea</Form.Label>
            <Form.Control
              as="select"
              name="aerolineaId"
              value={formData.aerolineaId}
              onChange={handleInputChange}
            >
              <option value="">Select Aerolinea</option>
              {aerolineas.map((aerolinea) => (
                <option key={aerolinea.idAerolinea} value={aerolinea.idAerolinea}>
                  {aerolinea.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formAeropuerto" className="mb-3">
            <Form.Label>Aeropuerto</Form.Label>
            <Form.Control
              as="select"
              name="aeropuertoId"
              value={formData.aeropuertoId}
              onChange={handleInputChange}
            >
              <option value="">Select Aeropuerto</option>
              {aeropuertos.map((aeropuerto) => (
                <option key={aeropuerto.idAeropuerto} value={aeropuerto.idAeropuerto}>
                  {aeropuerto.nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            {formData.idVuelo ? 'Update Flight' : 'Create Flight'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setFormData({
            idVuelo: '',
            origen: '',
            destino: '',
            fechaDeSalida: '',
            horaDeSalida: '',
            duracion: '',
            capacidad: '',
            aerolineaId: '',
            aeropuertoId: '',
          })}>
            Clear
          </Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha de Salida</th>
              <th>Hora de Salida</th>
              <th>Duración</th>
              <th>Capacidad</th>
              <th>Aerolinea</th>
              <th>Aeropuerto</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.idVuelo}>
                <td>{flight.idVuelo}</td>
                <td>{flight.origen}</td>
                <td>{flight.destino}</td>
                <td>{flight.fechaDeSalida}</td>
                <td>{flight.horaDeSalida}</td>
                <td>{flight.duracion}</td>
                <td>{flight.capacidad}</td>
                <td>{aerolineas.find(a => a.idAerolinea === flight.aerolineaId)?.nombre || 'N/A'}</td>
                <td>{aeropuertos.find(a => a.idAeropuerto === flight.aeropuertoId)?.nombre || 'N/A'}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(flight)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(flight.idVuelo)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default AdminFlights;