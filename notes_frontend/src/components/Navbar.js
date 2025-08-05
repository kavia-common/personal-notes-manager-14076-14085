import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Navbar (top header) for navigation and user session info.
 * PUBLIC_INTERFACE
 */
function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📝 Notes Manager</Link>
      </div>
      <ul className="navbar-links">
        {!user ? (
          <>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/notes">My Notes</Link>
            </li>
            <li>
              <button className="btn btn-logout" onClick={onLogout}>
                Logout
              </button>
            </li>
            <li>
              <span className="user-info">
                👤 {user.username}
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
