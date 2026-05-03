import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/">
          <h1>🎮 GameHub</h1>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          {user ? (
            <>
              <Link to="/create" className="nav-btn">Create Post</Link>
              <span className="user-email">{user.email}</span>
              <button onClick={handleLogout} className="nav-btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">Login</Link>
              <Link to="/signup" className="nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
