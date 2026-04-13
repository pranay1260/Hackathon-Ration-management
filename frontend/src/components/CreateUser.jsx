import React, { useState } from 'react';
import { createUser } from '../services/api';

function CreateUser({ onUserCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BENEFICIARY');
  const [message, setMessage] = useState('');

  const validate = () => {
    // 1. NAME VALIDATION (Letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    if (!nameRegex.test(name)) {
      setMessage('Error: Name must be 3-50 characters and contain ONLY letters.');
      return false;
    }

    // 2. EMAIL VALIDATION (Strict)
    const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email) || email.startsWith('-')) {
      setMessage('Error: Please enter a valid email address. Cannot start with symbols.');
      return false;
    }

    // 3. PHONE VALIDATION
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setMessage('Error: Phone number must be exactly 10 digits.');
      return false;
    }

    // 4. PASSWORD VALIDATION
    if (password.length < 6 || password.includes(' ')) {
      setMessage('Error: Password must be 6+ characters and cannot contain spaces.');
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Using SHOP_MANAGER instead of MANAGER to match backend enum
    const data = { name, email, phoneNumber, role, password };
    
    createUser(data)
      .then(response => {
        setMessage('User Created Successfully!');
        setName('');
        setEmail('');
        setPhoneNumber('');
        setPassword('');
        if (onUserCreated) onUserCreated();
      })
      .catch(error => {
        const errorMsg = error.response?.data?.message || 'Error: Could not create user. Email or Phone might already exist.';
        setMessage(errorMsg);
      });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Register New User (Admin Tool)</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Full Name:</label>
          <input 
            placeholder="e.g. John Doe" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Login Email:</label>
          <input 
            type="email"
            placeholder="user@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number (10 digits):</label>
          <input 
            type="tel"
            placeholder="9876543210" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Initial Password:</label>
          <input 
            type="password"
            placeholder="Min 6 characters" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>User Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="BENEFICIARY">Beneficiary</option>
            <option value="ADMIN">Admin</option>
            <option value="SHOP_MANAGER">Shop Manager</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>SUBMIT REGISTRATION</button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateUser;
