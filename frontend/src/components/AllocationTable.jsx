import React, { useState, useEffect } from 'react';
import { getAllAllocations } from '../services/api';

function AllocationTable({ refreshTrigger }) {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    getAllAllocations()
      .then(res => setAllocations(res.data))
      .catch(err => console.error('Error fetching allocations'));
  }, [refreshTrigger]);

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Monthly Allocations Record</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f0f0f0' }}>
            <tr>
              <th>ID</th>
              <th>Card Number</th>
              <th>Type</th>
              <th>Members</th>
              <th>Item</th>
              <th>Qty (KG)</th>
              <th>Period</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allocations.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No allocations found</td></tr>
            ) : (
              allocations.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.cardNumber}</td>
                  <td>{a.cardType}</td>
                  <td>{a.familySize}</td>
                  <td>{a.itemName}</td>
                  <td>{a.allocatedQuantity}</td>
                  <td>{a.allocationMonth}/{a.allocationYear}</td>
                  <td>
                    <span style={{ 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontSize: '11px',
                      backgroundColor: a.status === 'ALLOCATED' ? '#e1f5fe' : '#e8f5e9',
                      color: a.status === 'ALLOCATED' ? '#01579b' : '#2e7d32'
                    }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllocationTable;
