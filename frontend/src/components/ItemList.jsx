import React, { useState, useEffect } from 'react';
import { getAllItems, updateItemPrice } from '../services/api';

function ItemList() {
  const [items, setItems] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const fetchItems = () => {
    getAllItems()
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items'));
  };

  useEffect(() => {
    fetchItems();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
  }, []);

  const handleUpdatePrice = (id) => {
    if (!newPrice || isNaN(newPrice)) {
      alert('Enter a valid price');
      return;
    }
    updateItemPrice(id, parseFloat(newPrice))
      .then(() => {
        alert('Price updated successfully');
        setEditingId(null);
        setNewPrice('');
        fetchItems();
      })
      .catch(err => alert('Failed to update price'));
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9fafb' }}>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Price</th>
              {userRole === 'ADMIN' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.itemName}</td>
                <td>
                  {editingId === item.id ? (
                    <input 
                      type="number" 
                      value={newPrice} 
                      onChange={(e) => setNewPrice(e.target.value)} 
                      style={{ width: '60px' }}
                    />
                  ) : (
                    `₹${item.pricePerUnit} / ${item.unitType}`
                  )}
                </td>
                {userRole === 'ADMIN' && (
                  <td>
                    {editingId === item.id ? (
                      <button onClick={() => handleUpdatePrice(item.id)} style={{ padding: '2px 5px', fontSize: '11px' }}>SAVE</button>
                    ) : (
                      <button onClick={() => { setEditingId(item.id); setNewPrice(item.pricePerUnit); }} style={{ padding: '2px 5px', fontSize: '11px' }}>EDIT PRICE</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemList;
