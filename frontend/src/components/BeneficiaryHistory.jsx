import React, { useState, useEffect } from 'react';
import { getDistributionsByCardId, getCardsByUserId } from '../services/api';

function BeneficiaryHistory({ userId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (userId) {
      getCardsByUserId(userId)
        .then(res => {
          if (res.data.length > 0) {
            return getDistributionsByCardId(res.data[0].id);
          }
          return { data: [] };
        })
        .then(res => {
          setHistory(res.data);
        })
        .catch(err => console.log('Error fetching history'));
    }
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h4>My Distribution History</h4>
      <table border="1" cellPadding="8" style={{ width: '100%', textAlign: 'left', backgroundColor: '#fff' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Date</th>
            <th>Item/Allocation ID</th>
            <th>Quantity</th>
            <th>Reference ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? history.map(h => (
            <tr key={h.id}>
              <td>{h.createdAt || 'N/A'}</td>
              <td>{h.allocationId}</td>
              <td>{h.distributedQuantity}</td>
              <td>{h.referenceId}</td>
              <td>
                <b style={{ color: h.transactionStatus === 'SUCCESS' ? 'green' : 'red' }}>
                  {h.transactionStatus}
                </b>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No distribution records found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BeneficiaryHistory;
