import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    
    // Check if admin is logged in and has admin role
    if (!adminInfo || !adminInfo.token || adminInfo.role !== 'admin') {
        // Redirect to login page if not authenticated
        return <Navigate to="/admin/login" replace />;
    }
    
    return children;
};

export default AdminRoute;
