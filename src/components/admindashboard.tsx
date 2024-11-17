import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminDashboard = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    price: '',
    airline: '',
    airport: '',
  });
  const [airlineData, setAirlineData] = useState({
    name: '',
    code: '',
    country: '',
  });
  const [airportData, setAirportData] = useState({
    name: '',
    city: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showFlights, setShowFlights] = useState(false);
  const [showAirlines, setShowAirlines] = useState(false);
  const [showAirports, setShowAirports] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const flightsResponse = await axios.get('http://localhost:8080/api/flights');
        const airlinesResponse = await axios.get('http://localhost:8080/api/airlines');
        const airportsResponse = await axios.get('http://localhost:8080/api/airports');
        setFlights(flightsResponse.data);
        setAirlines(airlinesResponse.data);
        setAirports(airportsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAirlineInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAirlineData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAirportInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setAirportData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFlightSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/api/flights', formData);
      setFlights([...flights, response.data]);
      setSuccess('Vuelo agregado exitosamente');
    } catch (error) {
      console.error('Error adding flight:', error);
      setError('Error al agregar el vuelo');
    }
  };

  const handleAirlineSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/api/airlines', airlineData);
      setAirlines([...airlines, response.data]);
      setSuccess('Aerolínea agregada exitosamente');
    } catch (error) {
      console.error('Error adding airline:', error);
      setError('Error al agregar la aerolínea');
    }
  };

  const handleAirportSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:8080/api/airports', airportData);
      setAirports([...airports, response.data]);
      setSuccess('Aeropuerto agregado exitosamente');
    } catch (error) {
      console.error('Error adding airport:', error);
      setError('Error al agregar el aeropuerto');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Panel de Control para Administradores</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Insertar Vuelo</Card.Title>
              <Form onSubmit={handleFlightSubmit}>
                <Form.Group controlId="formDestination" className="mb-3">
                  <Form.Label>Destino</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    placeholder="Ingrese el destino"
                    value={formData.destination}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDate" className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formPrice" className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Ingrese el precio"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirline" className="mb-3">
                  <Form.Label>Aerolínea</Form.Label>
                  <Form.Control
                    type="text"
                    name="airline"
                    placeholder="Ingrese la aerolínea"
                    value={formData.airline}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirport" className="mb-3">
                  <Form.Label>Aeropuerto</Form.Label>
                  <Form.Control
                    type="text"
                    name="airport"
                    placeholder="Ingrese el aeropuerto"
                    value={formData.airport}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="custom-button">
                  Insertar Vuelo
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Insertar Aerolínea</Card.Title>
              <Form onSubmit={handleAirlineSubmit}>
                <Form.Group controlId="formAirlineName" className="mb-3">
                  <Form.Label>Nombre de la Aerolínea</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Ingrese el nombre de la aerolínea"
                    value={airlineData.name}
                    onChange={handleAirlineInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirlineCode" className="mb-3">
                  <Form.Label>Código de la Aerolínea</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    placeholder="Ingrese el código de la aerolínea"
                    value={airlineData.code}
                    onChange={handleAirlineInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirlineCountry" className="mb-3">
                  <Form.Label>País de Origen</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Ingrese el país de origen"
                    value={airlineData.country}
                    onChange={handleAirlineInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="custom-button">
                  Insertar Aerolínea
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Insertar Aeropuerto</Card.Title>
              <Form onSubmit={handleAirportSubmit}>
                <Form.Group controlId="formAirportName" className="mb-3">
                  <Form.Label>Nombre del Aeropuerto</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Ingrese el nombre del aeropuerto"
                    value={airportData.name}
                    onChange={handleAirportInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirportCity" className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    placeholder="Ingrese la ciudad"
                    value={airportData.city}
                    onChange={handleAirportInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formAirportCountry" className="mb-3">
                  <Form.Label>País</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    placeholder="Ingrese el país"
                    value={airportData.country}
                    onChange={handleAirportInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="custom-button">
                  Insertar Aeropuerto
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button variant="success" className="mt-3 custom-button" onClick={() => setShowFlights(!showFlights)}>
        {showFlights ? 'Ocultar Vuelos' : 'Ver Vuelos'}
      </Button>
      <Button variant="info" className="mt-3 ml-2 custom-button" onClick={() => setShowAirlines(!showAirlines)}>
        {showAirlines ? 'Ocultar Aerolíneas' : 'Ver Aerolíneas'}
      </Button>
      <Button variant="warning" className="mt-3 ml-2 custom-button" onClick={() => setShowAirports(!showAirports)}>
        {showAirports ? 'Ocultar Aeropuertos' : 'Ver Aeropuertos'}
      </Button>

      {showFlights && (
        <>
          <h3 className="mt-4">Vuelos</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Destino</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Aerolínea</th>
                <th>Aeropuerto</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.destination}</td>
                  <td>{flight.date}</td>
                  <td>{flight.price}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.airport}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {showAirlines && (
        <>
          <h3 className="mt-4">Aerolíneas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Código</th>
                <th>País de Origen</th>
              </tr>
            </thead>
            <tbody>
              {airlines.map((airline, index) => (
                <tr key={index}>
                  <td>{airline.name}</td>
                  <td>{airline.code}</td>
                  <td>{airline.country}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

      {showAirports && (
        <>
          <h3 className="mt-4">Aeropuertos</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>País</th>
              </tr>
            </thead>
            <tbody>
              {airports.map((airport, index) => (
                <tr key={index}>
                  <td>{airport.name}</td>
                  <td>{airport.city}</td>
                  <td>{airport.country}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;