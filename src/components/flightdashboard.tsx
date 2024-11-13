import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const FlightDashboard = () => {
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/flights');
        setFlights(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

  const handleBookFlight = async (flightId) => {
    try {
      const response = await axios.post('http://localhost:8080/api/reservations', {
        userId: user.id,
        flightId,
      });
      console.log('Flight booked:', response.data);
    } catch (error) {
      console.error('Error booking flight:', error);
    }
  };

  return (
    <div className="flight-dashboard">
      <h2>Vuelos Disponibles</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Destino</th>
            <th>Fecha</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index}>
              <td>{flight.destination}</td>
              <td>{flight.date}</td>
              <td>{flight.price}</td>
              <td>
                <Button variant="primary" onClick={() => handleBookFlight(flight.id)}>
                  Reservar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FlightDashboard;