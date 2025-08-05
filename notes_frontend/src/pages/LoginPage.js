import React, { useState } from 'react';

// PUBLIC_INTERFACE
function LoginPage({ onLogin, errorText, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await onLogin(username, password);
    setSubmitting(false);
  }

  return (
    <section className="auth-container">
      <h1>Sign In</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Username
          <input
            autoFocus
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || submitting || !username || !password}
        >
          {loading || submitting ? 'Signing in...' : 'Sign In'}
        </button>
        {errorText && <div className="error-message">{errorText}</div>}
      </form>
    </section>
  );
}

export default LoginPage;
