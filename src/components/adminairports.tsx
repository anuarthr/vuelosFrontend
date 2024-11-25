import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminAirports = () => {
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    idAeropuerto: '',
    nombre: '',
    ciudad: '',
    pais: '',
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
        const response = await axios.get('http://localhost:8081/api/v1/aeropuertos', config);
        setAirports(response.data);
      } catch (error) {
        setError('Error fetching airports');
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
      if (formData.idAeropuerto) {
        await axios.put(`http://localhost:8081/api/v1/aeropuertos/${formData.idAeropuerto}`, formData, config);
        setSuccess('Airport updated successfully');
        const response = await axios.get('http://localhost:8081/api/v1/aeropuertos', config);
        setAirports(response.data);
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/aeropuertos', formData, config);
        setSuccess('Airport created successfully');
        setAirports([...airports, response.data]);
      }
      setFormData({
        idAeropuerto: '',
        nombre: '',
        ciudad: '',
        pais: '',
      });
    } catch (error) {
      setError('Error saving airport');
    }
  };

  const handleEdit = (airport) => {
    setFormData(airport);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/aeropuertos/${id}`, config);
      setAirports(airports.filter((airport) => airport.idAeropuerto !== id));
      setSuccess('Airport deleted successfully');
    } catch (error) {
      setError('Error deleting airport');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Manage Airports</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Enter nombre"
              value={formData.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formCiudad" className="mb-3">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              name="ciudad"
              placeholder="Enter ciudad"
              value={formData.ciudad}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPais" className="mb-3">
            <Form.Label>Pais</Form.Label>
            <Form.Control
              type="text"
              name="pais"
              placeholder="Enter pais"
              value={formData.pais}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {formData.idAeropuerto ? 'Update Airport' : 'Create Airport'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setFormData({
            idAeropuerto: '',
            nombre: '',
            ciudad: '',
            pais: '',
          })}>
            Clear
          </Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Pais</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport) => (
              <tr key={airport.idAeropuerto}>
                <td>{airport.idAeropuerto}</td>
                <td>{airport.nombre}</td>
                <td>{airport.ciudad}</td>
                <td>{airport.pais}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(airport)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(airport.idAeropuerto)}>
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

export default AdminAirports;