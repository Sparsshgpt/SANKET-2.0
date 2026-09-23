import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Brand-New 2026 Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapExplorerPage } from './pages/MapExplorerPage';
import { SimulationPage } from './pages/SimulationPage';
import { BroadcastPage } from './pages/BroadcastPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Public / Landing Showcase Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Operational Command Center Pages (Inside AppLayout) */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />
          <Route
            path="/map"
            element={
              <AppLayout>
                <MapExplorerPage />
              </AppLayout>
            }
          />
          <Route
            path="/analysis"
            element={
              <AppLayout>
                <SimulationPage />
              </AppLayout>
            }
          />
          <Route
            path="/broadcast"
            element={
              <AppLayout>
                <BroadcastPage />
              </AppLayout>
            }
          />
          <Route
            path="/historical"
            element={
              <AppLayout>
                <AnalyticsPage />
              </AppLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <AppLayout>
                <ReportsPage />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            }
          />

          {/* Redirects */}
          <Route path="/alerts" element={<Navigate to="/broadcast" replace />} />
          <Route path="/team" element={<Navigate to="/dashboard" replace />} />
          <Route path="/operations" element={<Navigate to="/dashboard" replace />} />
          <Route path="/overview" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;