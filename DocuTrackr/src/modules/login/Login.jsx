import { useState } from 'react';
import './Login.css';

function Login({ onLoginResult }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault(); // prevent page refresh

    const loginData = { username, password };
    setLoading(true);

    try {
      const response = await fetch('http://193.203.161.251:9090/enwcore/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.status === 400 || response.status === 401) {
        alert(response.message || 'Invalid username or password.');
        if (onLoginResult) onLoginResult(false, null);
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      if (onLoginResult) onLoginResult(true, data);
      
    } catch (error) {
      console.error('Login error:', error.message);
      if (onLoginResult) onLoginResult(false, null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h3 className="text-center mb-4">Login to Your Account</h3>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Logging in...</span>
          </div>
          <p className="mt-2">Logging in...</p>
        </div>
      ) : (
        <form onSubmit={submitLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      )}
    </div>
  );
}

export default Login;
