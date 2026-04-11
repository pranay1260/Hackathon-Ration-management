import React, { useState, useEffect } from 'react';
import { createAllocation, getAllCards, getAllItems } from '../services/api';

function CreateAllocation() {
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

  const submitForm = (e) => {
    e.preventDefault();
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
        setMessage(`Allocation Successful! Quantity: ${res.data.allocatedQuantity} KG`);
      })
      .catch(err => {
        setMessage('Error creating allocation. Check if Card and Item IDs exist.');
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
                {c.cardNumber} ({c.cardType})
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
                {item.name} (₹{item.price}/unit)
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
          <small style={{ color: '#666' }}>Quantity is based on Card Type & Family Size</small>
        </div>
        <div className="form-group">
          <label>Month (1-12):</label>
          <input 
            type="number"
            min="1" max="12"
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
          />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>Set Allocation</button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateAllocation;
