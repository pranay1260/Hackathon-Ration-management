import React, { useState, useEffect } from 'react';
import { getAllocationsByCardId, getCardsByUserId } from '../services/api';

function BeneficiaryAllocations({ userId }) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      // First find the card, then get allocations
      getCardsByUserId(userId)
        .then(res => {
          if (res.data.length > 0) {
            return getAllocationsByCardId(res.data[0].id);
          }
          return { data: [] };
        })
        .then(res => {
          setAllocations(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.log('Error fetching allocations');
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) return <p>Loading allocations...</p>;
  if (allocations.length === 0) return <p>No allocations found for this month.</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#eef2f3', borderRadius: '8px', marginTop: '10px' }}>
      <h4>My Monthly Allocations</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {allocations.map(a => (
          <div key={a.id} style={{ 
            padding: '15px', 
            backgroundColor: 'white', 
            borderLeft: '5px solid #007bff',
            borderRadius: '4px',
            minWidth: '200px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>{a.allocationMonth} {a.allocationYear}</p>
            <h5 style={{ margin: '5px 0' }}>Item ID: {a.itemId}</h5>
            <p style={{ margin: '0' }}><strong>Qty:</strong> {a.allocatedQuantity}</p>
            <div style={{ 
              marginTop: '10px',
              fontSize: '12px',
              padding: '2px 5px',
              backgroundColor: '#fff3cd',
              color: '#856404',
              display: 'inline-block',
              borderRadius: '3px'
            }}>
              {a.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BeneficiaryAllocations;
