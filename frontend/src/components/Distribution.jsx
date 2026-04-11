import React, { useState, useEffect } from 'react';
import { distribute, getAllAllocations } from '../services/api';

function Distribution() {
  const [allocationId, setAllocationId] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [distributedQuantity, setDistributedQuantity] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getAllAllocations()
      .then(res => {
        // Filter for PENDING allocations that still need distribution
        const pending = res.data.filter(a => a.status === 'ALLOCATED' || a.status === 'PENDING');
        setAllocations(pending);
      })
      .catch(err => console.error('Error fetching allocations'));
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    const data = { 
      allocationId: parseInt(allocationId), 
      distributedQuantity: parseFloat(distributedQuantity), 
      referenceId 
    };
    
    distribute(data)
      .then(res => {
        setMessage('SUCCESS: Ration Distributed');
      })
      .catch(err => {
        const errorMsg = err.response?.data?.message || 'FAILED: Check Allocation ID or Stock';
        setMessage(errorMsg);
      });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Process Distribution</h3>
      <form onSubmit={submitForm}>
        <div className="form-group">
          <label>Select Allocation:</label>
          <select 
            value={allocationId} 
            onChange={(e) => setAllocationId(e.target.value)} 
            required
          >
            <option value="">-- Select Pending Allocation --</option>
            {allocations.map(a => (
              <option key={a.id} value={a.id}>
                ID: {a.id} - Card: {a.cardNumber} - Item: {a.itemName} ({a.allocatedQuantity} KG)
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity to Distribute (KGs):</label>
          <input 
            placeholder="e.g. 5.0 (KGs)" 
            type="number"
            step="0.1"
            value={distributedQuantity} 
            onChange={(e) => setDistributedQuantity(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Transaction Reference ID:</label>
          <input 
            placeholder="e.g. TXN-MAY-2026-001" 
            value={referenceId} 
            onChange={(e) => setReferenceId(e.target.value)} 
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', marginTop: '10px' }}>COMPLETE DISTRIBUTION</button>
      </form>
      {message && (
        <p style={{ 
          color: message.includes('SUCCESS') ? 'green' : 'red', 
          fontWeight: 'bold',
          marginTop: '15px',
          textAlign: 'center'
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default Distribution;
