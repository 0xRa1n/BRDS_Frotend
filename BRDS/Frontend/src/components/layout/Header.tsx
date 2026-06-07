import { useState, useEffect, useRef } from "react";
import { Globe, FileText, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { api } from "@/lib/api";

export function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      api.user.getProfile()
        .then(res => setProfile(res))
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setProfile(null);
    setIsDropdownOpen(false);
    navigate("/");
  };

  const firstName = profile?.full_name?.split(' ')[0] || "User";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-lg">BarangayConnect</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Globe className="h-4 w-4" />
            <span>Tagalog</span>
          </button>
          
          <Link to="/track" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            I-track ang Request
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
                <span className="text-gray-700">Kumusta, {firstName}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full" asChild>
              <Link to="/verify" state={{ next: '/dashboard' }}>
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
