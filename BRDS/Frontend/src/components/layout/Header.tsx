import { useState, useEffect, useRef } from "react";
import { Globe, FileText, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const token = localStorage.getItem("jwt_token");
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      api.user
        .getProfile()
        .then((res) => setProfile(res))
        .catch(() => {
          // Silent catch, let dashboard handle auth errors
        });
    }
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("jwt_token");
    setProfile(null);
    setIsLogoutModalOpen(false);
    navigate("/");
    toast.success("Logged out", { 
      id: "logout-success",
      style: { backgroundColor: "#ecfdf5", color: "#059669", border: "1px solid #10b981" }
    });
  };

  const firstName = profile?.full_name?.split(" ")[0] || "User";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-lg">BarangayConnect</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="relative" ref={langDropdownRef}>
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{t('languageName')}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                <button
                  onClick={() => { setLanguage('en'); setIsLangDropdownOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  English
                </button>
                <button
                  onClick={() => { setLanguage('fil'); setIsLangDropdownOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  Filipino
                </button>
              </div>
            )}
          </div>

          <Link
            to="/track"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {t('trackRequest')}
          </Link>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex rounded-full gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">{t('kumusta')}, {firstName}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex rounded-full"
              asChild
            >
              <Link to="/verify" state={{ next: "/dashboard" }}>
                {t('login')}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to log out?</p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
