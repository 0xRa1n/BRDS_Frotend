import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomePage } from "@/pages/HomePage";
import { VerifyPage } from "@/pages/VerifyPage";
import { VerifyOtpPage } from "@/pages/VerifyOtpPage";
import { DocumentRequestPage } from "@/pages/DocumentRequestPage";
import { TrackSearchPage } from "@/pages/TrackSearchPage";
import { TrackRequestPage } from "@/pages/TrackRequestPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { AllRequestsPage } from "@/pages/AllRequestsPage";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { AdminGuard } from "@/components/layout/AdminGuard";
import { SuperAdminGuard } from "@/components/layout/SuperAdminGuard";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { AdminSchedulePage } from "@/pages/admin/AdminSchedulePage";
import { AdminRequestDetailsPage } from "@/pages/admin/AdminRequestDetailsPage";
import { LanguageProvider } from "@/contexts/LanguageContext";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminGuard>
                <AdminDashboardPage />
              </AdminGuard>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <SuperAdminGuard>
                <AdminUsersPage />
              </SuperAdminGuard>
            } 
          />
          <Route 
            path="/admin/schedule" 
            element={
              <AdminGuard>
                <AdminSchedulePage />
              </AdminGuard>
            } 
          />
          <Route 
            path="/admin/requests/:id" 
            element={
              <AdminGuard>
                <AdminRequestDetailsPage />
              </AdminGuard>
            } 
          />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/verify-otp" element={<VerifyOtpPage />} />
                <Route path="/track" element={<TrackSearchPage />} />
                <Route path="/track/:id" element={<TrackRequestPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route 
                  path="/dashboard/requests" 
                  element={
                    <AuthGuard>
                      <AllRequestsPage />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/request" 
                  element={
                    <AuthGuard>
                      <DocumentRequestPage />
                    </AuthGuard>
                  } 
                />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
