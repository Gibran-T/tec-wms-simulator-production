/**
 * Login.tsx — Auth guard redirect component
 * Used by FioriShell when user is not authenticated.
 * Redirects to /login (LocalLogin page with email/password form).
 */
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    // Redirect to the local login page
    window.location.replace("/login");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#0070f2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-400">Redirection vers la connexion...</p>
      </div>
    </div>
  );
}
