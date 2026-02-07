/**
 * Main App component with routing
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { StudyPage } from './pages/StudyPage';
import { AddCardPage } from './pages/AddCardPage';
import { SettingsPage } from './pages/SettingsPage';
import { CardBrowserPage } from './pages/CardBrowserPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="study" element={<StudyPage />} />
              <Route path="add" element={<AddCardPage />} />
              <Route path="browse" element={<CardBrowserPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
