import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Schemes from './pages/Schemes';
import Loans from './pages/Loans';
import CropDetection from './pages/CropDetection';
import ToolRental from './pages/ToolRental';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="loans" element={<Loans />} />
          <Route path="crop-detection" element={<CropDetection />} />
          <Route path="tool-rental" element={<ToolRental />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}
