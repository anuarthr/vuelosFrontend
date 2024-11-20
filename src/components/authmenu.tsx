import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

function AuthMenu() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/v1/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
    }
  };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/api/v1/auth/signup', {
        username: formData.username,
        nombre: formData.nombre,
        apellido: formData.apellido,
        direccion: formData.direccion,
        telefono: formData.telefono,
        email: formData.email,
        password: formData.password,
      });
      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      setError('Error al registrar el usuario: ' + error.message);
    }
  };

  return (
    <div className="auth-menu">
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={isLogin ? handleLogin : handleRegister}>
        {isLogin ? (
          <>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Ingrese su nombre de usuario"
                value={formData.username}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        ) : (
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
                placeholder="Ingrese su teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingrese su email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </>
        )}
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
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
}

export default AuthMenu;