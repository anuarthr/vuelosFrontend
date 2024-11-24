import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminAirports = () => {
  const [aeropuertos, setAeropuertos] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
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
          headers: { Authorization: Bearer ${token} }
        };
        const response = await axios.get('http://localhost:8081/api/v1/aeropuertos', config);
        setAeropuertos(response.data);
      } catch (error) {
        setError('Error fetching aeropuertos');
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
        await axios.put(http://localhost:8081/api/v1/aeropuertos/${formData.id}, formData, config);
        setSuccess('Aeropuerto updated successfully');
      } else {
        await axios.post('http://localhost:8081/api/v1/aeropuertos', formData, config);
        setSuccess('Aeropuerto created successfully');
      }
      const response = await axios.get('http://localhost:8081/api/v1/aeropuertos', config);
      setAeropuertos(response.data);
      setFormData({
        id: '',
        nombre: '',
        ciudad: '',
        pais: '',
      });
    } catch (error) {
      setError('Error saving aeropuerto');
    }
  };

  const handleEdit = (aeropuerto) => {
    setFormData(aeropuerto);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      await axios.delete(http://localhost:8081/api/v1/aeropuertos/${id}, config);
      setAeropuertos(aeropuertos.filter((aeropuerto) => aeropuerto.id !== id));
      setSuccess('Aeropuerto deleted successfully');
    } catch (error) {
      setError('Error deleting aeropuerto');
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Manage Aeropuertos</Card.Title>
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
            {formData.id ? 'Update Aeropuerto' : 'Create Aeropuerto'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setFormData({
            id: '',
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
            {aeropuertos.map((aeropuerto) => (
              <tr key={aeropuerto.id}>
                <td>{aeropuerto.id}</td>
                <td>{aeropuerto.nombre}</td>
                <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(aeropuerto)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(aeropuerto.id)}>
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