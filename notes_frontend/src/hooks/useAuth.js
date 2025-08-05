import { useState, useEffect } from 'react';
import { login, register, logout, fetchUser } from '../api';

// PUBLIC_INTERFACE
/**
 * React hook for authentication: user state, actions, and loading/error status.
 */
function useAuth() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle'|'loading'|'error'
  const [error, setError] = useState('');

  // Check signed-in user on mount
  useEffect(() => {
    async function checkUser() {
      setStatus('loading');
      try {
        const u = await fetchUser();
        setUser(u);
        setStatus('idle');
      } catch (err) {
        setUser(null);
        setStatus('idle');
      }
    }
    checkUser();
  }, []);

  // PUBLIC_INTERFACE
  async function handleLogin(username, password) {
    setError('');
    setStatus('loading');
    try {
      const data = await login(username, password);
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        const currentUser = await fetchUser();
        setUser(currentUser);
        setStatus('idle');
        return true;
      } else {
        setStatus('error');
        setError('Invalid login');
        return false;
      }
    } catch (err) {
      setStatus('error');
      setError(String(err.message));
      return false;
    }
  }

  // PUBLIC_INTERFACE
  async function handleRegister(username, password) {
    setError('');
    setStatus('loading');
    try {
      const data = await register(username, password);
      if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        const currentUser = await fetchUser();
        setUser(currentUser);
        setStatus('idle');
        return true;
      } else {
        setStatus('error');
        setError('Registration failed');
        return false;
      }
    } catch (err) {
      setStatus('error');
      setError(String(err.message));
      return false;
    }
  }

  // PUBLIC_INTERFACE
  async function handleLogout() {
    setError('');
    setStatus('loading');
    try {
      await logout();
      localStorage.removeItem('authToken');
    } catch (e) {
      // ignore
    }
    setUser(null);
    setStatus('idle');
  }

  return {
    user,
    status,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };
}

export default useAuth;
