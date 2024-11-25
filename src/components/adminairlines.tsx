import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [formData, setFormData] = useState({
    idAerolinea: '',
    nombre: '',
    codigoAerolinea: '',
    paisDeOrigen: '',
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
        const response = await axios.get('http://localhost:8081/api/v1/aerolineas', config);
        setAirlines(response.data);
      } catch (error) {
        setError('Error fetching airlines');
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
      if (formData.idAerolinea) {
        await axios.put(`http://localhost:8081/api/v1/aerolineas/${formData.idAerolinea}`, formData, config);
        setSuccess('Airline updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/aerolineas', formData, config);
        setSuccess('Airline created successfully');
        setAirlines([...airlines, response.data]);
      }
      setFormData({
        idAerolinea: '',
        nombre: '',
        codigoAerolinea: '',
        paisDeOrigen: '',
      });
    } catch (error) {
      setError('Error saving airline');
    }
  };

  const handleEdit = (airline) => {
    setFormData(airline);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/aerolineas/${id}`, config);
      setAirlines(airlines.filter((airline) => airline.idAerolinea !== id));
      setSuccess('Airline deleted successfully');
    } catch (error) {
      setError('Error deleting airline');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Manage Airlines</Card.Title>
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
          <Form.Group controlId="formCodigoAerolinea" className="mb-3">
            <Form.Label>Codigo Aerolinea</Form.Label>
            <Form.Control
              type="text"
              name="codigoAerolinea"
              placeholder="Enter codigo aerolinea"
              value={formData.codigoAerolinea}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPaisDeOrigen" className="mb-3">
            <Form.Label>Pais de Origen</Form.Label>
            <Form.Control
              type="text"
              name="paisDeOrigen"
              placeholder="Enter pais de origen"
              value={formData.paisDeOrigen}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {formData.idAerolinea ? 'Update Airline' : 'Create Airline'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setFormData({
            idAerolinea: '',
            nombre: '',
            codigoAerolinea: '',
            paisDeOrigen: '',
          })}>
            Clear
          </Button>
        </Form>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Codigo Aerolinea</th>
              <th>Pais de Origen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {airlines.map((airline) => (
              <tr key={airline.idAerolinea}>
                <td>{airline.idAerolinea}</td>
                <td>{airline.nombre}</td>
                <td>{airline.codigoAerolinea}</td>
                <td>{airline.paisDeOrigen}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(airline)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(airline.idAerolinea)}>
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

export default AdminAirlines;