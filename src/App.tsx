import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicOnlyRoute } from './components/auth/PublicOnlyRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { MemberDirectoryPage } from './pages/public/MemberDirectoryPage';
import { UndanganCatalogPage } from './pages/public/UndanganCatalogPage';
import { WeddingInvitationViewPage } from './pages/public/WeddingInvitationViewPage';
import { TokoPage } from './pages/public/TokoPage';
import { BlogPage } from './pages/public/BlogPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Member Pages (Protected)
import { DashboardPage } from './pages/member/DashboardPage';
import { ProfilePage } from './pages/member/ProfilePage';
import { CvTaarufPage } from './pages/member/CvTaarufPage';
import { TaarufPage } from './pages/member/TaarufPage';
import { BelajarPage } from './pages/member/BelajarPage';
import { PlannerPage } from './pages/member/PlannerPage';
import { SuratCintaPage } from './pages/member/SuratCintaPage';
import { WeddingInvitationBuilderPage } from './pages/member/WeddingInvitationBuilderPage';
import { SettingsPage } from './pages/member/SettingsPage';

// Admin Page
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Standalone Full-Screen Wedding Invitation Route */}
          <Route path="/undangan/:slug" element={<WeddingInvitationViewPage />} />

          <Route element={<AppLayout />}>
            {/* Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/daftar-member" element={<MemberDirectoryPage />} />
            <Route path="/undangan" element={<UndanganCatalogPage />} />
            <Route path="/toko" element={<TokoPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Guest / Public-Only Auth Routes */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/masuk" element={<Navigate to="/login" replace />} />
              <Route path="/daftar" element={<Navigate to="/register" replace />} />
            </Route>

            {/* Authenticated Member Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profil/:id" element={<ProfilePage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/cv-taaruf" element={<CvTaarufPage />} />
              <Route path="/taaruf" element={<TaarufPage />} />
              <Route path="/belajar" element={<BelajarPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/surat-cinta" element={<SuratCintaPage />} />
              <Route path="/undangan-builder" element={<WeddingInvitationBuilderPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/pengaturan" element={<SettingsPage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
