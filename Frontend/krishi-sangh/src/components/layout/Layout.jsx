// Outlet is used to render the current page based on the active route
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="app-layout">

      {/* Top navigation bar */}
      <Navbar />

      {/* Main content */}
      <main className="app-main">
        {children ? children : <Outlet />}
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}