import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminAirlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [airlineData, setAirlineData] = useState({
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
          headers: { Authorization: Bearer ${token} }
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
    setAirlineData((prevData) => ({
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
      if (airlineData.idAerolinea) {
        await axios.put(http://localhost:8081/api/v1/aerolineas/${airlineData.idAerolinea}, airlineData, config);
        setAirlines(airlines.map((airline) => (airline.idAerolinea === airlineData.idAerolinea ? airlineData : airline)));
        setSuccess('Airline updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/aerolineas', airlineData, config);
        setAirlines([...airlines, response.data]);
        setSuccess('Airline added successfully');
      }
    } catch (error) {
      setError('Error adding/updating airline');
    }
  };

  const handleDelete = async (airlineId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      await axios.delete(http://localhost:8081/api/v1/aerolineas/${airlineId}, config);
      setAirlines(airlines.filter((airline) => airline.idAerolinea !== airlineId));
      setSuccess('Airline deleted successfully');
    } catch (error) {
      setError('Error deleting airline');
    }
  };

  const handleEdit = (airline) => {
    setAirlineData(airline);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Opciones de Aerolíneas</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
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
                  <Button variant="warning" onClick={() => handleEdit(airline)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(airline.idAerolinea)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={airlineData.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formCodigoAerolinea" className="mb-3">
            <Form.Label>Código de Aerolínea</Form.Label>
            <Form.Control
              type="text"
              name="codigoAerolinea"
              placeholder="Ingrese el código de aerolínea"
              value={airlineData.codigoAerolinea}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formPaisDeOrigen" className="mb-3">
            <Form.Label>País de Origen</Form.Label>
            <Form.Control
              type="text"
              name="paisDeOrigen"
              placeholder="Ingrese el país de origen"
              value={airlineData.paisDeOrigen}
              onChange={handleInputChange}
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
      </Card.Body>
    </Card>
  );
};

export default AdminAirlines;