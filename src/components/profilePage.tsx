import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    direccion: user?.direccion || '',
    telefono: user?.telefono || '',
    email: user?.email || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const userResponse = await axios.put(`http://localhost:8081/api/v1/users/${user.id}`, {
        username: user.username,
        email: profileData.email,
        password: user.password,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const clienteResponse = await axios.put(`http://localhost:8081/api/v1/clientes/${user.id}`, {
        nombre: profileData.nombre,
        apellido: profileData.apellido,
        direccion: profileData.direccion,
        telefono: profileData.telefono,
        email: profileData.email,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      login({ ...userResponse.data, ...clienteResponse.data });
      setSuccess('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
    }
  };

  const handleDeleteProfile = async () => {
    setError('');
    setSuccess('');
    try {
      await axios.delete(`http://localhost:8081/api/v1/users/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await axios.delete(`http://localhost:8081/api/v1/clientes/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logout();
      setSuccess('Perfil eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Error al eliminar el perfil');
    }
  };

  return (
    <div className="profile-page" style={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ fontWeight: 'bold' }}>Perfil</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleProfileSubmit}>
        <Form.Group controlId="formNombre" className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            placeholder="Ingrese su nombre"
            value={profileData.nombre}
            onChange={handleProfileInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formApellido" className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            placeholder="Ingrese su apellido"
            value={profileData.apellido}
            onChange={handleProfileInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formDireccion" className="mb-3">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            placeholder="Ingrese su dirección"
            value={profileData.direccion}
            onChange={handleProfileInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formTelefono" className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            placeholder="Ingrese su número"
            value={profileData.telefono}
            onChange={handleProfileInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Ingrese su correo"
            value={profileData.email}
            onChange={handleProfileInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          Actualizar Perfil
        </Button>
        <Button variant="danger" onClick={handleDeleteProfile} className="w-100 mt-3">
          Eliminar Perfil
        </Button>
      </Form>
    </div>
  );
};

export default Profile;