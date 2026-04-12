import React, { useState } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import BeneficiaryDashboard from './components/BeneficiaryDashboard';
import './App.css';

function App() {
  const [session, setSession] = useState(() => {
    // Restore session from localStorage on refresh
    const saved = localStorage.getItem('ration_session');
    return saved ? JSON.parse(saved) : null;
  });

  const onLogin = (userResponse) => {
    // Storing the full user object (id, name, role, etc)
    setSession(userResponse);
    localStorage.setItem('ration_session', JSON.stringify(userResponse));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('ration_session');
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
        {session.role === 'BENEFICIARY' && <BeneficiaryDashboard user={session} />}
      </main>
      
      <footer className="main-footer">
        <p>© 2026 Ration Distribution System</p>
      </footer>
    </div>
  );
}

export default App;
