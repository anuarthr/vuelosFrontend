import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/style.css';
import planeImage from '../assets/images/plane-image.png';
import { useAuth } from '../contexts/authcontext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBookingClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/booking');
    }
  };

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
        <button className="booking-button" onClick={handleBookingClick}>
          Booking Now
        </button>
      </div>
      <div className="image-container">
        <img src={planeImage} alt="Helicopter" className="plane-image" />
      </div>
    </div>
  );
};

export default HomePage;