import React, { useState, useEffect } from 'react';
import { getCardsByUserId, getAllocationsByCardId } from '../services/api';

function BeneficiaryDashboard({ user }) {
  const [card, setCard] = useState(null);
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      // 5.2 View ration card details
      getCardsByUserId(user.id)
        .then(res => {
          if (res.data.length > 0) {
            setCard(res.data[0]);
            // 5.5 View allocation history
            return getAllocationsByCardId(res.data[0].id);
          }
        })
        .then(res => {
          if (res) setAllocations(res.data);
        })
        .catch(err => console.error('Error fetching beneficiary data'));
    }
  }, [user]);

  return (
    <div className="beneficiary-portal">
      <h2>MY RATION PORTAL</h2>
      <p style={{ color: '#666' }}>Authorized View for Section 5.2 & 5.5 Requirements</p>

      <div className="dashboard-grid">
        {/* 5.2 Ration Card Detail Card */}
        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <h4>5.2 My Ration Card Information</h4>
          {card ? (
            <div className="info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '10px' }}>
              <div><strong>Card Number:</strong> {card.cardNumber}</div>
              <div><strong>Category:</strong> {card.cardType}</div>
              <div><strong>Family Size:</strong> {card.familySize} Members</div>
              <div><strong>Status:</strong> 
                <span className={`badge ${card.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: '10px' }}>
                  {card.status}
                </span>
              </div>
              <div style={{ gridColumn: 'span 2', color: '#666', fontSize: '12px' }}>
                Issued: {card.issueDate} | Expiry: {card.expiryDate}
              </div>
            </div>
          ) : (
            <p>No active ration card linked to this account.</p>
          )}
        </div>

        {/* 5.5 Allocation History */}
        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <h4>5.5 My Allocation History</h4>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th>Allocation ID</th>
                <th>Item ID</th>
                <th>Quantity (KG)</th>
                <th>Month</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.itemId}</td>
                  <td>{a.allocatedQuantity} KG</td>
                  <td>{a.allocationMonth}/{a.allocationYear}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
              {allocations.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center' }}>No allocation records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryDashboard;
