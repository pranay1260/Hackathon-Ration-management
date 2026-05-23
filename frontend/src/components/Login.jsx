import React, { useState } from 'react';
import { login, createUser } from '../services/api';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('BENEFICIARY'); // Still needed for registration
  const [error, setError] = useState('');

  const validate = () => {
    // 1. EMAIL VALIDATION (Strict: No leading symbols, proper domain)
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email) || email.startsWith('-')) {
      setError('Error: Please enter a valid email (e.g., alex@mail.com). Cannot start with symbols.');
      return false;
    }
    
    if (isRegister) {
      // 2. NAME VALIDATION (Letters and spaces only)
      const nameRegex = /^[a-zA-Z\s]{3,50}$/;
      if (!nameRegex.test(username)) {
        setError('Error: Name must be 3-50 characters and contain ONLY letters.');
        return false;
      }
      // 3. PHONE VALIDATION
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setError('Error: Phone number must be exactly 10 digits.');
        return false;
      }
      // 4. PASSWORD VALIDATION (No spaces, min 6)
      if (password.length < 6 || password.includes(' ')) {
        setError('Error: Password must be 6+ characters and cannot contain spaces.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    
    try {
      if (isRegister) {
        await createUser({ 
          name: username, 
          email: email, 
          password: password, 
          role: role, 
          phoneNumber: phoneNumber 
        });
        alert('Success! Registration complete. You can now Login.');
        setIsRegister(false);
      } else {
        const response = await login({ email: email, password: password });
        onLogin(response.data);
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Action failed. Check credentials or connection.');
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

          {isRegister && (
            <div className="form-group">
              <label>Phone Number:</label>
              <input 
                type="tel" 
                placeholder="10 digit mobile" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required
              />
            </div>
          )}

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
