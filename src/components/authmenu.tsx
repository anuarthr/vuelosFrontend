import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

function AuthMenu() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    apellido: '',
    direccion: '',
    phone: '',
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

    const genericEmail = 'user';
    const genericPassword = '123';

    if (formData.email === genericEmail && formData.password === genericPassword) {
      const userData = {
        id: 1,
        nombre: 'Usuario Genérico',
        email: genericEmail,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      login(userData);
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas o usuario no encontrado.');
    }
  };

  const handleRegister = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.apellido || !formData.direccion || !formData.phone || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const newUser = {
      nombre: formData.name,
      apellido: formData.apellido,
      direccion: formData.direccion,
      telefono: formData.phone,
      correoElectronico: formData.email,
      password: formData.password,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/users', newUser);
      console.log('Usuario registrado:', response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setError('Error al registrar el usuario.');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#b0c4de', color: '#fff', borderRadius: '8px' }}>
      {error && <Alert variant="danger">{error}</Alert>}

      {isLogin ? (
        <>
          <h5 className="mb-4">Iniciar sesión</h5>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingrese su correo"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Iniciar sesión
            </Button>
          </Form>
          <p className="mt-3 text-center">
            ¿No tienes una cuenta?{' '}
            <span
              onClick={toggleAuthMode}
              style={{ color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Regístrate aquí
            </span>
          </p>
        </>
      ) : (
        <>
          <h5 className="mb-4">Registro</h5>
          <Form onSubmit={handleRegister}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formBasicName" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Ingrese su nombre"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicApellido" className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    placeholder="Ingrese su apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicDireccion" className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    placeholder="Ingrese su dirección"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicPhone" className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    placeholder="Ingrese su número"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicEmail" className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Ingrese su correo"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Ingrese contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Registrarse
            </Button>
          </Form>
          <p className="mt-3 text-center">
            ¿Ya tienes una cuenta?{' '}
            <span
              onClick={toggleAuthMode}
              style={{ color: '#000', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Inicia sesión aquí
            </span>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthMenu;