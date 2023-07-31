// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './components/Authpage.jsx';
import MainApp from './MainApp';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);

  const handleAuth = (user) => {
    setUser(user);
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage onLogin={handleAuth} onSignup={handleAuth} />} />
        <Route path="/" element={user ? <MainApp /> : <Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
