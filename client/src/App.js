import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';

// Components
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Star animation for the background
  const numberOfStars = 200;
  const stars = [...Array(numberOfStars)].map((_, i) => {
    const x = Math.random() * 100 + 'vw';
    const y = Math.random() * 100 + 'vh';
    const size = Math.random() * 6 + 'px';
    const animationDelay = Math.random() * 2 + 's';

    return (
      <div
        key={i}
        className="star"
        style={{
          top: y,
          left: x,
          width: size,
          height: size,
          animationDelay: animationDelay,
        }}
      ></div>
    );
  });

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    
    setIsAuthenticated(!!token);
    setIsAdmin(!!(adminInfo && adminInfo.token));
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
  };

  // Handle admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem('adminInfo');
    setIsAdmin(false);
  };

  // Handle successful authentication
  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  // Handle successful admin login
  const handleAdminAuth = () => {
    setIsAdmin(true);
  };

  return (
    <Router>
      <div className="App">
        {stars}
        <nav className="main-nav">
          <Link to="/">Products</Link> |{' '}
          <Link to="/cart">Cart</Link> |{' '}
          {isAuthenticated ? (
            <>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#39ff14', 
                  cursor: 'pointer',
                  padding: 0,
                  margin: '0 10px',
                  fontSize: '1rem'
                }}
              >
                Logout
              </button>
              {isAdmin && (
                <Link to="/admin/dashboard" style={{ marginLeft: '10px' }}>
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login">Login / Register</Link>
              <Link to="/admin/login" style={{ marginLeft: '10px' }}>
                Admin Login
              </Link>
            </>
          )}
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleAuth} />
                )
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/login" 
              element={
                isAdmin ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <AdminLogin onLogin={handleAdminAuth} />
                )
              } 
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            {/* Redirect any unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
