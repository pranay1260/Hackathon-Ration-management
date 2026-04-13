import React, { useState } from 'react';
import { createItem } from '../services/api';

function CreateItem() {
  const [itemName, setItemName] = useState('');
  const [unitType, setUnitType] = useState('KG');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [message, setMessage] = useState('');

  const validate = () => {
    if (itemName.trim().length < 2) {
      setMessage('Error: Item Name must be at least 2 letters.');
      return false;
    }
    const rate = parseFloat(pricePerUnit);
    if (isNaN(rate) || rate <= 0) {
      setMessage('Error: Price must be a positive number.');
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { itemName, unitType, pricePerUnit: parseFloat(pricePerUnit) };
    
    createItem(data)
      .then(res => {
        setMessage('SUCCESS: Ration Item Added.');
        setItemName('');
        setPricePerUnit('');
      })
      .catch(err => {
        setMessage('Error: Item might already exist or server is down.');
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
