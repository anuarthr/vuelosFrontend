import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../assets/images/Aero-Magdalena.png';
import { useAuth } from '../contexts/authcontext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [contenido, setContenido] = useState(<></>);

  const handleLoginClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setContenido(
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setContenido(<></>);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="nav-bar">
      <img src={logo} alt="Aero Magdalena" className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/relevante">Relevante</Link>
        <Link to="/pilotos">Pilotos</Link>
        <Link to="/vuelos">Vuelos</Link>
        <Link to="/sobre-nosotros">Sobre Nosotros</Link>
      </nav>
      <Dropdown align="end">
        <Dropdown.Toggle
          variant="primary"
          id="authDropdown"
          className="ms-3 fs-5 px-4 py-2 no-caret"
          style={{
            backgroundColor: "#b0c4de",
            color: "#fff",
            minWidth: "180px",
            border: "none",
          }}
        >
          <span onClick={handleLoginClick}>
            {user ? "Cerrar sesión" : "Iniciar sesión"}
          </span>
        </Dropdown.Toggle>
        <div id="CloseSession">{contenido}</div>
      </Dropdown>
    </header>
  );
};

export default Header;