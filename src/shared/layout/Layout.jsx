import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Ruta corregida
import Footer from '../components/Footer'; // Ruta corregida

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;