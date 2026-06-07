import { Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <FileText className="h-6 w-6" />
          <span className="font-bold text-lg">BarangayConnect</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <Globe className="h-4 w-4" />
            <span>Tagalog</span>
          </button>
          
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            I-track ang Request
          </button>
          
          <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-full">
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
