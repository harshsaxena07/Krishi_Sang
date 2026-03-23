// Outlet is used to render the current page based on the active route
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from "./Footer";

export default function Layout() {
  return (
    // Main layout wrapper for entire app
    <div className="app-layout">

      {/* Top navigation bar (visible on all pages) */}
      <Navbar />

      {/* Main content area where routed pages are rendered */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Footer section (visible on all pages) */}
      <Footer />
    </div>
  );
}