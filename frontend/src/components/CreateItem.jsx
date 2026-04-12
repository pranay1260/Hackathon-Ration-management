import React, { useState } from 'react';
import { createItem } from '../services/api';

function CreateItem() {
  const [itemName, setItemName] = useState('');
  const [unitType, setUnitType] = useState('KG');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [message, setMessage] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    const data = { 
      itemName, 
      unitType, 
      pricePerUnit: parseFloat(pricePerUnit) || 0 
    };
    
    createItem(data)
      .then(res => {
        setMessage('Item Created Successfully!');
        setItemName('');
        setPricePerUnit('');
      })
      .catch(err => {
        setMessage('Error creating item. Ensure all fields are filled.');
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Create New Item Record (Master List)</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Item Name:</label>
          <input 
            placeholder="e.g. Rice, Oil" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Unit Type:</label>
          <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
            <option value="KG">Kilograms (KG)</option>
            <option value="LITRE">Litres (L)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price per Unit (₹):</label>
          <input 
            type="number"
            placeholder="e.g. 45.0" 
            value={pricePerUnit} 
            onChange={(e) => setPricePerUnit(e.target.value)} 
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>CREATE ITEM (FOR MASTER LIST)</button>
      </form>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateItem;
