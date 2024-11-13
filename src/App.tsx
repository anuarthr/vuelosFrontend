import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import HomePage from './components/home';
import Footer from './components/footer';
import AuthMenu from './components/authmenu';
import Dashboard from './components/dashboard';
import FlightDashboard from './components/flightdashboard';
import './assets/styles/style.css';

const App = () => {
  return (
    <div id="root">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthMenu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<div>Booking Page</div>} />
        <Route path="/flights" element={<FlightDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;