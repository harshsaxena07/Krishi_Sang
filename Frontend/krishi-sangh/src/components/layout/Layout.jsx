//Outlet is used to render the current page based on the route.
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}