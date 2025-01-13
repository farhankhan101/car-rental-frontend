import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import RanterDashboard from './pages/RanterDashboard';
import './index.css';
import AuthMiddleware from './middleware/AuthMiddleware';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthMiddleware requiredRole="Lister">
              <Dashboard />
            </AuthMiddleware>
          }
        />
        <Route
          path="/"
          element={
            <AuthMiddleware requiredRole="Renter">
              <RanterDashboard />
            </AuthMiddleware>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
