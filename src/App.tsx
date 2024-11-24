import React, { Profiler } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './components/home';
import Footer from './components/footer';
import AuthMenu from './components/authmenu';
import Dashboard from './components/dashboard';
import AdminDashboard from './components/admindashboard';
import './assets/styles/style.css';
import Profile from './components/profilePage';
import Reservas from './components/reservationsPage';
import FlightsPage from './components/flightsPage';
import AdminFlights from './components/adminflights';
import AdminReservations from './components/adminreservations';
import AdminAirlines from './components/adminairlines';
import AdminClients from './components/adminclients';
import { Navigate } from 'react-router-dom';

const App = () => {

  return (
    <div id="root">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthMenu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path= "/profile" element={<Profile />}/>
        <Route path= "/reservations" element={<Reservas />}/>
        <Route path= "/flights" element={<FlightsPage />}/>
        <Route path="/admin/flights" element={<AdminFlights />}/>
        <Route path="/admin/reservations" element={<AdminReservations />}/>
        <Route path="/admin/airlines" element={<AdminAirlines />}/>
        <Route path="/admin/clients" element={<AdminClients />}/>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;