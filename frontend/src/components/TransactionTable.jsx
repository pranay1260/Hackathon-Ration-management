import React, { useState, useEffect } from 'react';
import { getAllDistributions } from '../services/api';

function TransactionTable() {
  const [txns, setTxns] = useState([]);

  useEffect(() => {
    getAllDistributions()
      .then(res => setTxns(res.data))
      .catch(err => console.log('Error fetching transactions'));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h3>Distribution Transaction History</h3>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Allocation ID</th>
            <th>Quantity</th>
            <th>Reference ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {txns.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.allocationId}</td>
              <td>{t.cardNumber} ({t.itemName})</td>
              <td>{t.distributedQuantity}</td>
              <td>{t.referenceId}</td>
              <td>{new Date(t.distributionDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
