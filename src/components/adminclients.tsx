import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Importar bcrypt para encriptar la contraseña

const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState({
    idCliente: '',
    nombre: '',
    apellido: '',
    email: '',
    direccion: '',
    telefono: '',
    password: '',
    username: '', // Añadir el campo username
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Añadir este log para verificar el token
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
    console.log('Submitting client data:', clientData);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const hashedPassword = await bcrypt.hash(clientData.password, 10); // Encriptar la contraseña
      if (clientData.idCliente) {
        console.log('Updating client with ID:', clientData.idCliente);
        await axios.put(`http://localhost:8081/api/v1/clientes/${clientData.idCliente}`, {
          ...clientData,
          password: hashedPassword, // Usar la contraseña encriptada
        }, config);
        await axios.put(`http://localhost:8081/api/v1/users/${clientData.idCliente}`, {
          email: clientData.email,
          password: hashedPassword, // Usar la contraseña encriptada
          username: clientData.username, // Añadir el campo username
        }, config);
        setClients(clients.map((client) => (client.idCliente === clientData.idCliente ? { ...clientData, password: hashedPassword } : client)));
        setSuccess('Client updated successfully');
      } else {
        console.log('Client ID is missing');
      }
    } catch (error) {
      console.error('Error updating client:', error);
      setError('Error updating client');
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!clientId) {
      console.error('Client ID is missing');
      setError('Client ID is missing');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      console.log('Deleting client with ID:', clientId);
      await axios.delete(`http://localhost:8081/api/v1/clientes/${clientId}`, config);
      await axios.delete(`http://localhost:8081/api/v1/users/${clientId}`, config);
      setClients(clients.filter((client) => client.idCliente !== clientId));
      setSuccess('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Error deleting client');
    }
  };

  const handleEditClient = async (client) => {
    console.log('Editing client:', client);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const userResponse = await axios.get(`http://localhost:8081/api/v1/users/${client.idCliente}`, config);
      const userData = userResponse.data;
      setClientData({
        idCliente: client.idCliente,
        nombre: client.nombre,
        apellido: client.apellido,
        email: client.email,
        direccion: client.direccion,
        telefono: client.telefono,
        password: client.password,
        username: userData.username, // Obtener el campo username del usuario
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data');
    }
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
              <th>ID</th>
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
              <tr key={client.idCliente || client.email}>
                <td>{client.idCliente}</td>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.email}</td>
                <td>{client.direccion}</td>
                <td>{client.telefono}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditClient(client)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteClient(client.idCliente)}>
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
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Ingrese la contraseña"
              value={clientData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Ingrese el nombre de usuario"
              value={clientData.username}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Modificar Cliente
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setClientData({
            idCliente: '',
            nombre: '',
            apellido: '',
            email: '',
            direccion: '',
            telefono: '',
            password: '',
            username: '', // Añadir el campo username
          })}>
            Limpiar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminClients;