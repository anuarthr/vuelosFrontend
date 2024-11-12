import React from 'react';
import '../assets/styles/style.css';
import logo from '../assets/images/Aero-Magdalena.png';

const Header = () => {
  return (
    <header className="nav-bar">
      <img src={logo} alt="Aero Magdalena" className="logo" />
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="#">Relevante</a>
        <a href="#">Pilotos</a>
        <a href="#">Vuelos</a>
        <a href="#">Sobre Nosotros</a>
      </nav>
      <button className="login-button">Login</button>
    </header>
  );
};

export default Header;