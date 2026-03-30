import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error("Missing Clerk Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: "#2e7d32",
          colorText: "#1b5e20",
          colorBackground: "#f1f8f4",
          borderRadius: "10px",
        },

        elements: {
          card: {
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          },

          formButtonPrimary: {
            backgroundColor: "#2e7d32",
          },

          headerTitle: {
            fontSize: "22px",
            fontWeight: "600",
            color: "#1b5e20",
          },

          headerSubtitle: {
            color: "#4caf50",
          },

          socialButtonsBlockButton: {
            border: "1px solid #c8e6c9",
          },
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)