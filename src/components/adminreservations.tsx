import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState({
    id: '',
    userId: '',
    flightId: '',
    date: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: Bearer ${token} }
        };
        const response = await axios.get('http://localhost:8081/api/v1/reservas', config);
        setReservations(response.data);
      } catch (error) {
        setError('Error fetching reservations');
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      if (reservationData.id) {
        await axios.put(http://localhost:8081/api/v1/reservas/${reservationData.id}, reservationData, config);
        setReservations(reservations.map((reservation) => (reservation.id === reservationData.id ? reservationData : reservation)));
        setSuccess('Reservation updated successfully');
      } else {
        const response = await axios.post('http://localhost:8081/api/v1/reservas', reservationData, config);
        setReservations([...reservations, response.data]);
        setSuccess('Reservation added successfully');
      }
    } catch (error) {
      setError('Error adding/updating reservation');
    }
  };

  const handleDelete = async (reservationId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: Bearer ${token} }
      };
      await axios.delete(http://localhost:8081/api/v1/reservas/${reservationId}, config);
      setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
      setSuccess('Reservation deleted successfully');
    } catch (error) {
      setError('Error deleting reservation');
    }
  };

  const handleEdit = (reservation) => {
    setReservationData(reservation);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Opciones de Reservas</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Vuelo</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.userId}</td>
                <td>{reservation.flightId}</td>
                <td>{reservation.date}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(reservation)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(reservation.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="formUserId" className="mb-3">
            <Form.Label>ID de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="userId"
              placeholder="Ingrese el ID del usuario"
              value={reservationData.userId}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formFlightId" className="mb-3">
            <Form.Label>ID de Vuelo</Form.Label>
            <Form.Control
              type="text"
              name="flightId"
              placeholder="Ingrese el ID del vuelo"
              value={reservationData.flightId}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formDate" className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={reservationData.date}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {reservationData.id ? 'Actualizar Reserva' : 'Agregar Reserva'}
          </Button>
          <Button variant="secondary" className="ms-2" onClick={() => setReservationData({
            id: '',
            userId: '',
            flightId: '',
            date: '',
          })}>
            Limpiar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AdminReservations;