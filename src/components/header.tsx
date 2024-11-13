import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/style.css';
import logo from '../assets/images/Aero-Magdalena.png';
import { useAuth } from '../contexts/authcontext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <header className="nav-bar">
      <img src={logo} alt="Aero Magdalena" className="logo" onClick={handleHomeClick} style={{ cursor: 'pointer' }} />
      <nav className="nav-links">
        <a href="#" onClick={handleHomeClick}>Home</a>
        <a href="#">Relevante</a>
        <a href="#">Pilotos</a>
        <a href="#">Vuelos</a>
        <a href="#">Sobre Nosotros</a>
      </nav>
      {user ? (
        <button className="login-button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      ) : (
        <button className="login-button" onClick={handleLoginClick}>
          Iniciar sesión
        </button>
      )}
    </header>
  );
};

export default Header;