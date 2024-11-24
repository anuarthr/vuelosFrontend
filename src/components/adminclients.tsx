import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: '',
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
        const clientsResponse = await axios.get('http://localhost:8081/api/v1/clientes', config);
        setClients(clientsResponse.data);
      } catch (error) {
        setError('Error fetching clients');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (clientData.id) {
        await axios.put(`http://localhost:8081/api/v1/clientes/${clientData.id}`, clientData, config);
        setClients(clients.map((client) => (client.id === clientData.id ? clientData : client)));
        setSuccess('Client updated successfully');
      }
    } catch (error) {
      setError('Error updating client');
    }
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/clientes/${clientId}`, config);
      setClients(clients.filter((client) => client.id !== clientId));
      setSuccess('Client deleted successfully');
    } catch (error) {
      setError('Error deleting client');
    }
  };

  const handleEditClient = (client) => {
    setClientData(client);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Opciones de Clientes</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.email}</td>
                <td>{client.direccion}</td>
                <td>{client.telefono}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClient(client)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClient(client.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form onSubmit={handleClientSubmit} className="mt-3">
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese el nombre"
              value={clientData.nombre}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formApellido" className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              placeholder="Ingrese el apellido"
              value={clientData.apellido}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Ingrese el email"
              value={clientData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDireccion" className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              placeholder="Ingrese la dirección"
              value={clientData.direccion}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTelefono" className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              placeholder="Ingrese el teléfono"
              value={clientData.telefono}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {clientData.id ? 'Actualizar Cliente' : 'Agregar Cliente'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setClientData({
            id: '',
            nombre: '',
            apellido: '',
            email: '',
            direccion: '',
            telefono: '',
          })}>
            Limpiar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminClients;