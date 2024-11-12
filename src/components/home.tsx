import React from 'react';
import '../assets/styles/style.css';
import planeImage from '../assets/images/plane-image.png';

const HomePage = () => {
  return (
    <div className="content">
      <div className="text-content">
        <h2 className="title">
          <span className="highlight">
            <span className="aero">Aero</span> <span className="magdalena">Magdalena</span>
          </span> vuelos para todo tipo de personas
        </h2>
        <p className="description">
          Nuestro objetivo es que tengas una experiencia única en tu vuelo, por eso te ofrecemos un servicio de calidad y seguridad.
        </p>
        <button className="booking-button">Booking</button>
      </div>
      <div className="image-container">
        <img src={planeImage} alt="Helicopter" className="plane-image" />
      </div>
    </div>
  );
};

export default HomePage;