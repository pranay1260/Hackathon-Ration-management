import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/api';

function InventoryTable() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getInventory()
      .then(res => setItems(res.data))
      .catch(err => console.log('Error fetching inventory'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Current Inventory Report</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Stock Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>{item.quantityAvailable}</td>
                <td>{item.unitType}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
