import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  requests: any[];
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
}

export function AdminScheduleList({ requests, isLoading, isFetching, refetch }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter requests for currentDate
  const todaysRequests = requests.filter(req => {
    if (!req.appointment_date) return false;
    const apptDate = new Date(req.appointment_date);
    return apptDate.getDate() === currentDate.getDate() &&
           apptDate.getMonth() === currentDate.getMonth() &&
           apptDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-gray-900 text-lg">
            {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-9 px-3"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
            <button type="button" onClick={handlePrevDay} className="p-2 hover:bg-gray-50 text-gray-600 border-r border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={handleToday} className="px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">
              Today
            </button>
            <button type="button" onClick={handleNextDay} className="p-2 hover:bg-gray-50 text-gray-600 border-l border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50/50 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading schedules...</div>
        ) : todaysRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm">
            No appointments scheduled for this day.
          </div>
        ) : (
          todaysRequests.map(req => {
            const apptDate = new Date(req.appointment_date);
            const monthStr = apptDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = apptDate.getDate().toString().padStart(2, '0');
            const timeStr = apptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={req.ID} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg w-16 h-16 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{monthStr}</span>
                    <span className="text-2xl font-bold text-gray-900 leading-tight">{dayStr}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="font-bold text-gray-900 text-lg">{req.user?.full_name || 'Unknown User'}</h3>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${
                        req.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                        req.status === 'Missed' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {timeStr}
                      </div>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{req.reference_number}</span>
                      <span className="text-gray-300">•</span>
                      <span>{req.document_type ? req.document_type.charAt(0).toUpperCase() + req.document_type.slice(1) : ""}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-9">Edit</Button>
                  <Button variant="outline" className="h-9">Details</Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
