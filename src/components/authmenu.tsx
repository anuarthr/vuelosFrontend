import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authcontext';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AuthMenu = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

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
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:8081/api/v1/auth/login', {
          username: formData.username,
          password: formData.password,
        });
        const userData = response.data;
        login(userData);
        if (userData.roles.includes('ROLE_ADMIN')) {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        setError('Invalid credentials');
      }
    } else {
      try {
        await axios.post('http://localhost:8081/api/v1/auth/signup', formData);
        setIsLogin(true);
      } catch (error) {
        setError('Error registering user');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  return (
    <div className="auth-menu" style={{width: '100%',maxWidth:'600px', margin: 'auto',padding: '15px',border: '1px solid #ddd',borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'}}>
      <h2 style={{ fontWeight: 'bold' }}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Ingrese su nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formApellido" className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Ingrese su apellido"
                value={formData.apellido}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                placeholder="Ingrese su dirección"
                value={formData.direccion}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                placeholder="Ingrese su número"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        )}
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Ingrese su nombre de usuario"
            value={formData.username}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
      </Form>
      <p className="mt-3 text-center">
        {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
        <span
          onClick={toggleAuthMode}
          style={{ color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
        </span>
      </p>
    </div>
  );
};

export default AuthMenu;