import React from 'react';
import Header from './components/header';
import HomePage from './components/home';
import Footer from './components/footer';
import './assets/styles/style.css';

const App = () => {
  return (
    <div id="root">
      <Header />
      <HomePage />
      <Footer />
    </div>
  );
};

export default App;