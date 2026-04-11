import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import './App.css';

function App() {
  const [session, setSession] = useState(null); // stores the UserResponseDTO from backend

  const onLogin = (userResponse) => {
    // Storing the full user object (id, name, role, etc)
    setSession(userResponse);
  };

  const logout = () => {
    setSession(null);
  };

  if (!session) {
    return <Login onLogin={onLogin} />;
  }

  return (
    <div className="App-container">
      <header className="main-header">
        <div className="header-content">
          <h1>Ration System</h1>
          <div className="user-info">
            <span>Welcome, <strong>{session.name}</strong> ({session.role})</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {session.role === 'ADMIN' && <AdminDashboard />}
        {session.role === 'SHOP_MANAGER' && <ManagerDashboard />}
        {session.role === 'BENEFICIARY' && <BeneficiaryDashboard userId={session.id} />}
      </main>
      
      <footer className="main-footer">
        <p>© 2026 Ration Distribution System</p>
      </footer>
    </div>
  );
}

export default App;
