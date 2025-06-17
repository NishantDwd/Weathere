import Navbar from "./Navbar";
import { useLocation } from "react-router-dom";

export default function Layout({ children, onLogout, user }) {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/reset-password"; 

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!hideNavbar && <Navbar onLogout={onLogout} user={user} />}
      {hideNavbar ? (
        children
      ) : (
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      )}
    </div>
  );
}