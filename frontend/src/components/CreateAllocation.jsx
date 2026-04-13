import React, { useState, useEffect } from 'react';
import { createAllocation, getAllCards, getAllItems } from '../services/api';

function CreateAllocation({ onAllocationCreated }) {
  const [cardId, setCardId] = useState('');
  const [itemId, setItemId] = useState('');
  const [cards, setCards] = useState([]);
  const [items, setItems] = useState([]);
  const [month, setMonth] = useState('4'); // Default April
  const [year, setYear] = useState('2026');
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllCards()
      .then(res => {
        // Filter for ACTIVE cards only as per business rules
        setCards(res.data.filter(c => c.status === 'ACTIVE'));
      })
      .catch(err => console.error('Error fetching cards'));

    getAllItems()
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items'));
  }, []);

  const validate = () => {
    if (!cardId || !itemId) {
      setMessage('Error: Select both a Ration Card and an Item.');
      return false;
    }
    const m = parseInt(month);
    const y = parseInt(year);
    if (isNaN(m) || m < 1 || m > 12) {
      setMessage('Error: Month must be between 1 and 12.');
      return false;
    }
    if (isNaN(y) || y < 2024 || y > 2030) {
      setMessage('Error: Year must be between 2024 and 2030.');
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { 
      cardId: parseInt(cardId), 
      itemId: parseInt(itemId), 
      allocatedQuantity: 0, // Backend auto-calculates this based on Business Rules (APL/BPL/AAY)
      allocationMonth: parseInt(month),
      allocationYear: parseInt(year),
      status
    };
    
    createAllocation(data)
      .then(res => {
        setMessage(`SUCCESS: Allocation Set! Qty: ${res.data.allocatedQuantity} KG`);
        if (onAllocationCreated) onAllocationCreated();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'Error: Process failed. Check stock or duplicates.';
        setMessage(String(errorMsg));
      });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Allocation Management</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Select Ration Card:</label>
          <select 
            value={cardId} 
            onChange={(e) => setCardId(e.target.value)} 
            required
          >
            <option value="">-- Select Active Card --</option>
            {cards.map(c => (
              <option key={c.id} value={c.id}>
                {c.cardNumber} ({c.cardType} - {c.familySize} Members)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Select Item:</label>
          <select 
            value={itemId} 
            onChange={(e) => setItemId(e.target.value)} 
            required
          >
            <option value="">-- Select Item --</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.itemName} (₹{item.pricePerUnit}/unit)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Allocated Quantity:</label>
          <input 
            placeholder="Auto-calculated by system" 
            type="text"
            value="System Managed (Auto)" 
            readOnly
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />
          <small style={{ color: '#0056b3', fontWeight: 'bold' }}>
            Quantity is automatically calculated based on Card Type & Total Family Members
          </small>
        </div>
        <div className="form-group">
          <label>Allocation Month (1-12):</label>
          <input 
            type="number"
            min="1" max="12"
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
          />
          <small style={{ color: '#666' }}>Select which month's ration is being issued (Monthly Rule)</small>
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Set Allocation</button>
      </form>
      {message && <p style={{ color: message.toLowerCase().includes('success') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateAllocation;
