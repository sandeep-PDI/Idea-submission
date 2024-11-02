import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import IdeaSubmission from './pages/IdeaSubmission';
import IdeaDetails from './pages/IdeaDetails';
import ReviewDashboard from './pages/ReviewDashboard';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

const oktaAuth = new OktaAuth({
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  redirectUri: window.location.origin + '/login/callback'
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Security oktaAuth={oktaAuth}>
          <Routes>
            <Route path="/login/callback" element={<LoginCallback />} />
            <Route path="/" element={<Layout />}>
              <Route index element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="submit" element={
                <ProtectedRoute>
                  <IdeaSubmission />
                </ProtectedRoute>
              } />
              <Route path="ideas/:id" element={
                <ProtectedRoute>
                  <IdeaDetails />
                </ProtectedRoute>
              } />
              <Route path="review" element={
                <ProtectedRoute allowedRoles={['REVIEWER', 'ADMIN']}>
                  <ReviewDashboard />
                </ProtectedRoute>
              } />
              <Route path="admin" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </Security>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;