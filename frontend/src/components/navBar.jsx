import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styles/components.css';

function Navbar() {
  // Using useContext instead of local state for authentication.
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent default <Link> behavior
    await logout();     // Call logout from context
    navigate('/login'); // Redirect user after logout
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {!isLoggedIn ? (
          <>
            <Link to="/quizzes" className="nav-link">Take a Quiz</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/create-study" className="nav-link">Create study</Link>
            <Link to="/results" className="nav-link">Results</Link>
            {/* Allow navigation but also handle logout */}
            <a href="/" className="nav-link" onClick={handleLogout}>Log out</a>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
