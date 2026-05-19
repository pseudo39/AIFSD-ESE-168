import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">ComplaintAI</Link>
        <div className="flex items-center gap-4">
          <Link to="/complaints" className="text-gray-600 hover:text-blue-600 text-sm">Complaints</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-500">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-lg hover:bg-red-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/signup" className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
