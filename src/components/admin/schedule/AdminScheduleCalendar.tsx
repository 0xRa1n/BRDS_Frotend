import { useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, X, FileText, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SetAppointmentModal } from "@/components/admin/SetAppointmentModal";

interface Props {
  requests: any[];
  isLoading: boolean;
  isFetching: boolean;
  refetch: () => void;
}

export function AdminScheduleCalendar({ requests, isLoading, isFetching, refetch }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [editRequest, setEditRequest] = useState<any>(null);

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Group requests by day
  const requestsByDay: Record<number, any[]> = {};
  requests.forEach(req => {
    if (!req.appointment_date) return;
    const apptDate = new Date(req.appointment_date);
    if (apptDate.getMonth() === month && apptDate.getFullYear() === year) {
      const day = apptDate.getDate();
      if (!requestsByDay[day]) requestsByDay[day] = [];
      requestsByDay[day].push(req);
    }
  });

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h2 className="font-bold text-gray-900 text-lg">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-50 text-gray-600 border-r border-gray-200">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleToday} className="px-4 py-2 hover:bg-gray-50 text-sm font-medium text-gray-700">
              Today
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-50 text-gray-600 border-l border-gray-200">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden h-full">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-white py-3 text-center text-sm font-semibold text-gray-500 border-b border-gray-200">
              {day}
            </div>
          ))}
          {days.map((day, idx) => (
            <div key={idx} className="bg-white min-h-[140px] p-2 flex flex-col gap-1 transition-colors hover:bg-gray-50">
              {day && (
                <>
                  <div className="flex justify-start mb-1">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                      day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() 
                        ? 'bg-emerald-600 text-white shadow-sm' 
                        : 'text-gray-700'
                    }`}>
                      {day}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                    {requestsByDay[day]?.map(req => {
                      const timeStr = new Date(req.appointment_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                      let statusColor = 'bg-gray-100 text-gray-700';
                      if (req.status === 'Confirmed') statusColor = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
                      else if (req.status === 'Pending Reschedule') statusColor = 'bg-amber-100 text-amber-800 border border-amber-200';
                      else if (req.status === 'Missed') statusColor = 'bg-red-100 text-red-800 border border-red-200';
                      else statusColor = 'bg-blue-100 text-blue-800 border border-blue-200';
                      
                      return (
                        <div 
                          key={req.ID} 
                          className={`text-xs px-2 py-1 rounded truncate shadow-sm font-medium cursor-pointer transition-transform hover:scale-[1.02] ${statusColor}`} 
                          title={`${timeStr} ${req.user?.full_name}`}
                          onClick={() => setSelectedRequest(req)}
                        >
                          {timeStr} {req.user?.full_name}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-lg text-gray-900">Appointment Details</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-5">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xl font-bold text-gray-900">{selectedRequest.user?.full_name || 'N/A'}</h4>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedRequest.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    selectedRequest.status === 'Pending Reschedule' ? 'bg-amber-100 text-amber-700' :
                    selectedRequest.status === 'Missed' || selectedRequest.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Reference No: {selectedRequest.reference_number}</p>
              </div>

              <div className="border border-gray-100 rounded-lg p-4 flex flex-col gap-4 bg-gray-50/50">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Document Requested</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.document_type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Appointment Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedRequest.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Appointment Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedRequest.appointment_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-100">
              <Button variant="outline" onClick={() => setSelectedRequest(null)} className="text-gray-600">
                Close
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  setEditRequest(selectedRequest);
                  setSelectedRequest(null);
                }}
              >
                Edit Appointment
              </Button>
            </div>
          </div>
        </div>
      )}

      <SetAppointmentModal 
        isOpen={!!editRequest}
        onClose={() => setEditRequest(null)}
        request={editRequest}
        onSuccess={() => {
          setEditRequest(null);
          refetch();
        }}
      />
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
