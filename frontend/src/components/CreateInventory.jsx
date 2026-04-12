import React, { useState, useEffect } from 'react';
import { createInventory, getAllItems, getAllUsers } from '../services/api';

function CreateInventory() {
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

  const submitForm = (e) => {
    e.preventDefault();
    const data = { 
      itemId: parseInt(itemId), 
      managerId: parseInt(managerId), 
      quantityAvailable: parseInt(quantityAvailable), 
      status 
    };
    
    createInventory(data)
      .then(res => {
        setMessage('Inventory Updated Successfully!');
        setItemId('');
        setManagerId('');
        setQuantityAvailable('');
      })
      .catch(err => {
        setMessage('Error updating inventory. Ensure IDs are correct.');
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
