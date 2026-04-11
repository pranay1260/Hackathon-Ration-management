import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../services/api';

function UserList() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    getAllUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users'));
  }, []);

  const filteredUsers = roleFilter === 'ALL' 
    ? users 
    : users.filter(u => u.role === roleFilter);

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h5 style={{ margin: 0 }}>Registered Users</h5>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ fontSize: '12px' }}>
          <option value="ALL">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="SHOP_MANAGER">SHOP MANAGER</option>
          <option value="BENEFICIARY">BENEFICIARY</option>
        </select>
      </div>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#eee' }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
