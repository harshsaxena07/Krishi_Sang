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
import AddTool from './pages/AddTool';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from "./pages/AdminLayout";
import AdminRoute from './components/admin/AdminRoute';
import ToolApproval from "./components/admin/ToolApproval";
import LoanApproval from "./components/admin/LoanApproval";
import AddScheme from "./components/admin/AddScheme";
import AddLoan from "./components/admin/AddLoan";

// ✅ Clerk imports
import {
  SignedIn,
  SignedOut,
  SignIn
} from "@clerk/clerk-react";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>

        {/* 🔐 NOT LOGGED IN */}
        <SignedOut>
          <div className="auth-page">
            <div className="auth-container">

              <div className="auth-left">
                <img
                  src="images/logo.png"
                  alt="KrishiSangh Logo"
                  className="auth-logo"
                />
                <h1 className="auth-title">KrishiSangh</h1>
                <p className="auth-subtitle">
                  Empowering Farmers with Smart Technology
                </p>
              </div>

              <div className="auth-right">
                <SignIn routing="hash" />
              </div>

            </div>
          </div>
        </SignedOut>

        {/* ✅ LOGGED IN */}
        <SignedIn>
          <Routes>

            {/* 🌐 USER ROUTES (WITH LAYOUT) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="schemes" element={<Schemes />} />
              <Route path="loans" element={<Loans />} />
              <Route path="crop-detection" element={<CropDetection />} />
              <Route path="tool-rental" element={<ToolRental />} />
              <Route path="add-tool" element={<AddTool />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 🔐 ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            {/* 🔐 TOOL APPROVAL PAGE */}
            <Route
              path="/admin/tools"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ToolApproval />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            {/* Loan Approaal page */}
            <Route
              path="/admin/loans"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <LoanApproval />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/schemes"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AddScheme />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            
            {/* 🔐 ADD LOAN */}
              <Route
                path="/admin/add-loan"
                element={
                  <AdminRoute>
                    <AdminLayout>
                      <AddLoan />
                    </AdminLayout>
                  </AdminRoute>
                }
              />

            {/* 🔁 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </SignedIn>

      </BrowserRouter>
    </LanguageProvider>
  );
}