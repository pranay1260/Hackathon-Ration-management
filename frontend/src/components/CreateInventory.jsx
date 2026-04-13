import React, { useState, useEffect } from 'react';
import { createInventory, getAllItems, getAllUsers } from '../services/api';

function CreateInventory({ onInventoryUpdated }) {
  const [itemId, setItemId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [items, setItems] = useState([]);
  const [managers, setManagers] = useState([]);
  const [quantityAvailable, setQuantityAvailable] = useState('');
  const [status, setStatus] = useState('AVAILABLE');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllItems()
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items'));

    getAllUsers()
      .then(res => {
        const shopManagers = res.data.filter(u => u.role === 'SHOP_MANAGER');
        setManagers(shopManagers);
      })
      .catch(err => console.error('Error fetching users'));
  }, []);

  const validate = () => {
    if (!itemId) {
      setMessage('Error: Please select an item to update stock.');
      return false;
    }
    if (!managerId) {
      setMessage('Error: Please select a manager.');
      return false;
    }
    const qty = parseInt(quantityAvailable);
    if (isNaN(qty) || qty < 0) {
      setMessage('Error: Stock quantity cannot be negative.');
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { 
      itemId: parseInt(itemId), 
      quantityAvailable: parseInt(quantityAvailable), 
      managerId: parseInt(managerId),
      status: status
    };
    
    createInventory(data)
      .then(res => {
        setMessage('SUCCESS: Stock Catalog Updated.');
        if (onInventoryUpdated) onInventoryUpdated();
      })
      .catch(err => {
        setMessage('Error: Could not update inventory.');
      });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Update Inventory Stock</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Select Ration Item:</label>
          <select 
            value={itemId} 
            onChange={(e) => setItemId(e.target.value)} 
            required
          >
            <option value="">-- Select Item --</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.itemName || item.name} (₹{item.pricePerUnit || item.price || 0}/unit) - {item.unitType || item.unit}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Managed By (Shop Manager):</label>
          <select 
            value={managerId} 
            onChange={(e) => setManagerId(e.target.value)} 
            required
          >
            <option value="">-- Select Manager --</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity Available (in KGs):</label>
          <input 
            placeholder="Weight in KGs (e.g. 500)" 
            type="number"
            value={quantityAvailable} 
            onChange={(e) => setQuantityAvailable(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Stock Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="LOW_STOCK">LOW STOCK</option>
            <option value="OUT_OF_STOCK">OUT OF STOCK</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px', backgroundColor: '#2e7d32' }}>ADD PHYSICAL STOCK (QUANTITY)</button>
      </form>
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <strong>Note:</strong> This form adds actual kgs/litres to the shop's physical inventory.
      </div>
      {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default CreateInventory;
