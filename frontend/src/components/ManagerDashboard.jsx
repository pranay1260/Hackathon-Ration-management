import React from 'react';
import CreateInventory from './CreateInventory';
import Distribution from './Distribution';
import InventoryTable from './InventoryTable';
import ItemList from './ItemList'; // I'll ensure this exists or use getAllItems

function ManagerDashboard() {
  return (
    <div className="manager-portal">
      <h2>SHOP MANAGER DASHBOARD</h2>
      <p style={{ color: '#666' }}>Managing Section 5.3, 5.4, and 5.5 Operations</p>
      
      <div className="dashboard-grid">
        {/* 5.3 Ration Item View */}
        <div className="card-container">
          <h4>5.3 View Ration Items</h4>
          <ItemList />
        </div>

        {/* 5.4 Inventory Management */}
        <div className="card-container">
          <h4>5.4 Inventory Management (Update Stock)</h4>
          <CreateInventory />
        </div>

        {/* 5.5 Distribution Management */}
        <div className="card-container">
          <h4>5.5 Process Distribution</h4>
          <Distribution />
        </div>

        {/* View Levels */}
        <div className="card-container" style={{ gridColumn: 'span 2' }}>
          <h4>5.4 Current Inventory Levels</h4>
          <InventoryTable />
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
