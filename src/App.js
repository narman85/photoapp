import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudioDetailPage from './pages/StudioDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import StudioFormPage from './pages/StudioFormPage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { Box } from '@mui/material';
import { StudioProvider } from './context/StudioContext';

function App() {
  return (
    <StudioProvider>
      <Router>
        <Box component="main" sx={{ minHeight: '100vh' }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/studio/:id" element={<StudioDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/studio/new" element={
              <ProtectedRoute>
                <StudioFormPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/studio/edit/:id" element={
              <ProtectedRoute>
                <StudioFormPage />
              </ProtectedRoute>
            } />
          </Routes>
        </Box>
      </Router>
    </StudioProvider>
  );
}

export default App;
