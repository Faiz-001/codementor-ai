import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
/* import { ThemeProvider } from '../context/ThemeContext'; */
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyzePage from './pages/AnalyzePage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import SkillsPage from './pages/SkillsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950 text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

const AdminLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-950 text-slate-300">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analyze"
              element={
                <ProtectedLayout>
                  <AnalyzePage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analysis/:id"
              element={
                <ProtectedLayout>
                  <AnalysisResultPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/skills"
              element={
                <ProtectedLayout>
                  <SkillsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedLayout>
                  <AnalyticsPage />
                </ProtectedLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminPage />
                </AdminLayout>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}