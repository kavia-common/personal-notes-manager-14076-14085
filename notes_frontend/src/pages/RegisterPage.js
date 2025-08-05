import React, { useState } from 'react';

// PUBLIC_INTERFACE
function RegisterPage({ onRegister, errorText, loading }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== repeat) return;
    setSubmitting(true);
    await onRegister(username, password);
    setSubmitting(false);
  }

  return (
    <section className="auth-container">
      <h1>Register</h1>
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
            autoComplete="new-password"
          />
        </label>
        <label>
          Repeat Password
          <input
            type="password"
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={
            loading ||
            submitting ||
            !username ||
            !password ||
            !repeat ||
            password !== repeat
          }
        >
          {loading || submitting ? 'Registering...' : 'Register'}
        </button>
        {password && repeat && password !== repeat && (
          <div className="error-message">Passwords do not match.</div>
        )}
        {errorText && <div className="error-message">{errorText}</div>}
      </form>
    </section>
  );
}

export default RegisterPage;
