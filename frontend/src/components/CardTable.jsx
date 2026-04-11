import React, { useState, useEffect } from 'react';
import { getAllCards, updateCardStatus } from '../services/api';

function CardTable({ refreshTrigger }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  const fetchCards = () => {
    setLoading(true);
    getAllCards()
      .then(res => {
        setCards(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cards:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCards();
    // Simple check for role from local storage or app state
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserRole(user.role);
    }
  }, [refreshTrigger]);

  const handleStatusChange = (id, newStatus) => {
    updateCardStatus(id, newStatus)
      .then(() => {
        alert(`Status updated to ${newStatus}`);
        fetchCards();
      })
      .catch(err => alert('Failed to update status'));
  };

  if (loading) return <p>Loading card data...</p>;

  return (
    <div style={{ marginTop: '20px' }}>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th>Card ID</th>
            <th>Number</th>
            <th>Type</th>
            <th>Family Size</th>
            <th>Owner ID</th>
            <th>Status</th>
            {userRole === 'ADMIN' && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {cards.map(card => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.cardNumber}</td>
              <td>{card.cardType}</td>
              <td>{card.familySize}</td>
              <td>{card.userId}</td>
              <td>
                <span className={`badge ${card.status === 'ACTIVE' ? 'badge-success' : (card.status === 'SUSPENDED' ? 'badge-danger' : 'badge-warning')}`}>
                  {card.status}
                </span>
              </td>
              {userRole === 'ADMIN' && (
                <td>
                  <select 
                    value={card.status} 
                    onChange={(e) => handleStatusChange(card.id, e.target.value)}
                    style={{ fontSize: '12px', padding: '2px' }}
                  >
                    <option value="ACTIVE">Set ACTIVE</option>
                    <option value="SUSPENDED">Set SUSPENDED</option>
                    <option value="EXPIRED">Set EXPIRED</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
          {cards.length === 0 && (
            <tr><td colSpan={userRole === 'ADMIN' ? 7 : 6} style={{ textAlign: 'center' }}>No cards found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CardTable;
