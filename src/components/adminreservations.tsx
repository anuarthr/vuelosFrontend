import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/authcontext';

const AdminReservations = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState({
    id: '',
    date: '',
    numeroDePasajeros: 1, // Inicializar el número de pasajeros
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:8081/api/v1/reservas', config);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Error al obtener las reservas');
      }
    };

    fetchReservations();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (reservationData.id) {
        // Editar reserva existente
        await axios.put(`http://localhost:8081/api/v1/reservas/${reservationData.id}`, {
          fechaDeReserva: reservationData.date,
          numeroDePasajeros: reservationData.numeroDePasajeros
        }, config);
        setSuccess('Reserva actualizada exitosamente');
      } else {
        // No permitir agregar nuevas reservas
        setError('No se permite agregar nuevas reservas');
        return;
      }
      const response = await axios.get('http://localhost:8081/api/v1/reservas', config);
      setReservations(response.data);
    } catch (error) {
      console.error('Error actualizando la reserva:', error);
      setError('Error al actualizar la reserva');
    }
  };

  const handleEditReservation = (reservation) => {
    setReservationData({
      id: reservation.idReserva,
      date: reservation.fechaDeReserva,
      numeroDePasajeros: reservation.numeroDePasajeros, // Asegurarse de incluir el número de pasajeros
    });
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.delete(`http://localhost:8081/api/v1/reservas/${reservationId}`, config);
      setReservations(reservations.filter((reservation) => reservation.idReserva !== reservationId));
      setSuccess('Reserva eliminada exitosamente');
    } catch (error) {
      console.error('Error eliminando la reserva:', error);
      setError('Error al eliminar la reserva');
    }
  };

  return (
    <div className="admin-reservations">
      <h2>Administrar Reservas</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Id Reserva</th>
            <th>Fecha de Reserva</th>
            <th>Número de Pasajeros</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation.idReserva}>
              <td>{reservation.idReserva}</td>
              <td>{reservation.fechaDeReserva}</td>
              <td>{reservation.numeroDePasajeros}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditReservation(reservation)}>
                  Editar
                </Button>
                <Button variant="danger" className="ms-2" onClick={() => handleDeleteReservation(reservation.idReserva)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Card className="mt-3">
        <Card.Body>
          <Form onSubmit={handleReservationSubmit}>
            <Form.Group controlId="formDate" className="mb-3">
              <Form.Label>Fecha de Reserva</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={reservationData.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassengers" className="mb-3">
              <Form.Label>Número de Pasajeros</Form.Label>
              <Form.Control
                type="number"
                name="numeroDePasajeros"
                value={reservationData.numeroDePasajeros}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {reservationData.id ? 'Actualizar Reserva' : 'Agregar Reserva'}
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => setReservationData({
              id: '',
              date: '',
              numeroDePasajeros: 1, // Restablecer el número de pasajeros
            })}>
              Limpiar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminReservations;