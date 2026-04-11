import React, { useState } from 'react';
import { createUser } from '../services/api';

function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('BENEFICIARY');
  const [message, setMessage] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    // FIX: Using SHOP_MANAGER instead of MANAGER to match backend enum
    const data = { name, email, role, password };
    
    createUser(data)
      .then(response => {
        setMessage('User Created Successfully!');
        setName('');
        setEmail('');
      })
      .catch(error => {
        setMessage('Error creating user. Maybe email already exists?');
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
