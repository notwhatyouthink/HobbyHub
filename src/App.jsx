import { Outlet, Link } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/">
          <h1>🎮 GameHub</h1>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/create" className="nav-btn">Create Post</Link>
        </div>
      </nav>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
