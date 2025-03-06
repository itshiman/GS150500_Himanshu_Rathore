import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import StoresPage from './pages/StoresPage';
import SKUsPage from './pages/SKUsPage';
import PlanningPage from './pages/PlanningPage';
import ChartPage from './pages/ChartPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <HomePage />
          } />
          <Route path="/stores" element={
            <ProtectedRoute>
              <StoresPage />
            </ProtectedRoute>
          } />
          <Route path="/skus" element={
            <ProtectedRoute>
              <SKUsPage />
            </ProtectedRoute>
          } />
          <Route path="/planning" element={
            <ProtectedRoute>
              <PlanningPage />
            </ProtectedRoute>
          } />
          <Route path="/chart" element={
            <ProtectedRoute>
              <ChartPage />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={
          <ProtectedRoute>
            <NotFoundPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
