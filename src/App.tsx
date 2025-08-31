import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import JobMatches from './pages/JobMatches';
import HRDashboard from './pages/HRDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
      <Route path="/upload" element={user ? <Layout><UploadResume /></Layout> : <Navigate to="/login" />} />
      <Route path="/matches" element={user ? <Layout><JobMatches /></Layout> : <Navigate to="/login" />} />
      <Route path="/hr-dashboard" element={user?.role === 'hr' ? <Layout><HRDashboard /></Layout> : <Navigate to="/dashboard" />} />
      <Route path="/candidate-dashboard" element={user?.role === 'candidate' ? <Layout><CandidateDashboard /></Layout> : <Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;