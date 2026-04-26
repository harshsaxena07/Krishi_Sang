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
import Marketplace from "./pages/Marketplace";

import {
  SignedIn,
  SignedOut,
  SignIn
} from "@clerk/clerk-react";

const signInAppearance = {
  variables: {
    colorPrimary: "#1f7a54",
    colorText: "#0f3d2e",
    colorTextSecondary: "#66766d",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#0f3d2e",
    borderRadius: "16px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  elements: {
    card: "login-card",
    headerTitle: "login-title",
    headerSubtitle: "login-subtitle",
    formFieldInput: "login-input",
    formButtonPrimary: "login-button",
    socialButtonsBlockButton: "login-google-button",
    dividerLine: "login-divider-line",
    dividerText: "login-divider-text",
    footerActionLink: "login-link",
  },
};

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <SignedOut>
          <main className="login-container">
            <section className="login-left" aria-label="KrishiSangh introduction">
              <img
                src="images/logo.png"
                alt="KrishiSangh Logo"
                className="login-logo"
              />
              <h1 className="login-brand">KrishiSangh</h1>
              <p className="login-tagline">
                Empowering Farmers with Smart Technology
              </p>
            </section>

            <section className="login-right" aria-label="Sign in">
              <SignIn
                routing="hash"
                appearance={signInAppearance}
              />
            </section>
          </main>
        </SignedOut>

        <SignedIn>
          <Routes>
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
              <Route path="/marketplace" element={<Marketplace />} />
            </Route>

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SignedIn>
      </BrowserRouter>
    </LanguageProvider>
  );
}