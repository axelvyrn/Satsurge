import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import PlayerDashboard from './pages/PlayerDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import GameEditor from './components/GameEditor';
import Documentation from './pages/Documentation';
import StatusPage from './pages/StatusPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/status" element={<StatusPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/player" 
            element={user?.type === 'player' ? <PlayerDashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/creator" 
            element={user?.type === 'creator' ? <CreatorDashboard /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/editor/:gameId" 
            element={user?.type === 'creator' ? <GameEditor /> : <Navigate to="/auth" />} 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;