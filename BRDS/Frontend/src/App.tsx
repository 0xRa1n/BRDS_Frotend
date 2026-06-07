import { BrowserRouter, Routes, Route } from "react-router";
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
import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans">
        <Header />
        
        <main className="flex-1 flex flex-col">
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
        </main>
        
        <Footer />
      </div>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
