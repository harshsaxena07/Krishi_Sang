import { useUser } from "@clerk/clerk-react";

export default function AdminRoute({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Wait until Clerk loads
  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  // Not logged in
  if (!isSignedIn) {
    return <h1>Please Login First</h1>;
  }

  // Not admin
  if (user?.publicMetadata?.role !== "admin") {
    return <h1>Access Denied</h1>;
  }

  // Admin → allow access
  return children;
}