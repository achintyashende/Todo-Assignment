import React from 'react';
import Dashboard from './components/Dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Singup';
import Login from './components/Login/index';
function App() {

  const user = localStorage.getItem('token');
  return (
    <div className="App">
      <Routes>
        {user && <Route path="/" exact element={<Dashboard />} />}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' exact element={<Navigate replace to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

