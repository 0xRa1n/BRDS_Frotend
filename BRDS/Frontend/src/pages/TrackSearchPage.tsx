import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export function TrackSearchPage() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (referenceNumber.trim()) {
      navigate(`/track/${referenceNumber.trim()}`);
    }
  };

  return (
    <div className="flex-1 bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-100 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-gray-200">
            <Search className="w-8 h-8 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          I-track ang iyong Request
        </h1>
        
        <p className="text-sm text-gray-600 mb-8 leading-relaxed px-2">
          I-type ang Reference Number na natanggap mo matapos mag-submit ng request.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            placeholder="E.G. BR-2024-0041"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center placeholder:text-gray-400"
            required
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-base font-medium"
          >
            Hanapin
          </Button>
        </form>

      </div>
    </div>
  );
}
