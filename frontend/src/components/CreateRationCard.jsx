import React, { useState, useEffect } from 'react';
import { createCard, getAllUsers } from '../services/api';

function CreateRationCard({ onCardCreated }) {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('BPL');
  const [familySize, setFamilySize] = useState('1');
  const [status, setStatus] = useState('ACTIVE');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('2030-12-31');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllUsers()
      .then(res => {
        // Only show beneficiaries who don't have cards (ideally), but for now just filter by role
        const beneficiaries = res.data.filter(u => u.role === 'BENEFICIARY');
        setUsers(beneficiaries);
      })
      .catch(err => console.error('Error fetching users'));
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const data = { 
      userId: parseInt(userId), 
      cardNumber, 
      cardType,
      familySize: parseInt(familySize),
      status,
      issueDate,
      expiryDate
    };
    
    createCard(data)
      .then(res => {
        setMessage('Card Created Successfully!');
        // CALLING THE CALLBACK TO REFRESH TABLE
        if (onCardCreated) onCardCreated();
        // Clear inputs
        setUserId('');
        setCardNumber('');
      })
      .catch(err => {
        setMessage('Error creating card. Ensure User ID exists.');
      });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Ration Card Management</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Select Beneficiary:</label>
          <select 
            value={userId} 
            onChange={(e) => setUserId(e.target.value)} 
            required
          >
            <option value="">-- Select Beneficiary --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} (Email: {u.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Card Number:</label>
          <input 
            placeholder="e.g. RAT-12345" 
            value={cardNumber} 
            onChange={(e) => setCardNumber(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Card Type:</label>
          <select value={cardType} onChange={(e) => setCardType(e.target.value)}>
            <option value="BPL">BPL (Below Poverty Line)</option>
            <option value="APL">APL (Above Poverty Line)</option>
            <option value="AY">Antyodaya (AY)</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>CREATE CARD</button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateRationCard;
