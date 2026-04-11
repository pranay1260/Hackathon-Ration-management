import React, { useState } from 'react';
import { login, createUser } from '../services/api';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BENEFICIARY'); // Still needed for registration
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        // REGISTER: Needs Name, Email, Password, AND Role
        await createUser({ 
          name: username, 
          email: email, 
          password: password, 
          role: role, 
          phoneNumber: '0000000000' 
        });
        alert('Registration Successful! Use your Email to log in.');
        setIsRegister(false);
      } else {
        // LOGIN: Just Email and Password
        const response = await login({ email: email, password: password });
        onLogin(response.data);
        alert('Login Successful!');
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Verification failed. Register first or check credentials.');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 style={{ textAlign: 'center' }}>{isRegister ? 'New Account' : 'Ration Login'}</h2>
        
        {error && (
          <div style={{ color: 'red', marginBottom: '10px', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Full Name:</label>
              <input 
                type="text" 
                placeholder="Name" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Login Email:</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Assign Role:</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">ADMIN</option>
                <option value="SHOP_MANAGER">SHOP MANAGER</option>
                <option value="BENEFICIARY">BENEFICIARY</option>
              </select>
            </div>
          )}

          <button type="submit" className="login-btn">
            {isRegister ? 'REGISTER NOW' : 'SECURE LOGIN'}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)} 
            className="link-btn"
            style={{ color: '#4f46e5', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isRegister ? 'Back to Login' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
