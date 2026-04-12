import React, { useState } from 'react';
import CreateUser from './CreateUser';
import CreateRationCard from './CreateRationCard';
import CardTable from './CardTable';
import CreateItem from './CreateItem';
import CreateAllocation from './CreateAllocation';
import InventoryTable from './InventoryTable';
import TransactionTable from './TransactionTable';
import UserList from './UserList';
import AllocationTable from './AllocationTable';

function AdminDashboard() {
  const [cardRefresh, setCardRefresh] = useState(0);
  const [userRefresh, setUserRefresh] = useState(0);
  const [allocationRefresh, setAllocationRefresh] = useState(0);

  const triggerCardRefresh = () => {
    setCardRefresh(prev => prev + 1);
  };

  const triggerUserRefresh = () => {
    setUserRefresh(prev => prev + 1);
  };

  const triggerAllocationRefresh = () => {
    setAllocationRefresh(prev => prev + 1);
  };

  return (
    <div className="admin-portal">
      <h2>ADMIN CONTROL CENTER (Master Access)</h2>
      <p style={{ color: '#666' }}>Aligning with Guvi/HCL Section 5.1 - 5.6 Requirements</p>
      
      <div className="dashboard-grid">
        {/* 5.1 User Management */}
        <div className="card-container">
          <h4>5.1 User & Role Management</h4>
          <CreateUser onUserCreated={triggerUserRefresh} />
          <UserList refreshTrigger={userRefresh} /> 
        </div>

        {/* 5.2 Beneficiary & Ration Card Management */}
        <div className="card-container">
          <h4>5.2 Ration Card & Beneficiary</h4>
          <CreateRationCard onCardCreated={triggerCardRefresh} />
        </div>

        {/* 5.3 Ration Item Management */}
        <div className="card-container">
          <h4>5.3 Item & Price Control</h4>
          <CreateItem />
        </div>

        {/* 5.5 Allocation Management */}
        <div className="card-container">
          <h4>5.5 Monthly Allocation (Auto-Calculate)</h4>
          <CreateAllocation onAllocationCreated={triggerAllocationRefresh} />
        </div>

        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <AllocationTable refreshTrigger={allocationRefresh} />
        </div>

        {/* Tables and Reports */}
        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <h4>5.2/5.3 Global Tables (View All)</h4>
          <CardTable refreshTrigger={cardRefresh} />
        </div>

        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <h4>5.4/5.6 Inventory & Transaction Reports</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <InventoryTable />
            <TransactionTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
