import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onSuccess: () => void;
}

export function SetAppointmentModal({ isOpen, onClose, request, onSuccess }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select a date and time.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("admin_token");
      
      // Combine date and time
      const appointmentDate = new Date(`${date}T${time}:00`);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/admin/requests/${request.ID}/appointment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointment_date: appointmentDate.toISOString()
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to set appointment");
      }

      toast.success("Appointment scheduled and SMS sent!");
      onSuccess();
      onClose();
      setDate("");
      setTime("");
    } catch (error: any) {
      toast.error(error.message || "Failed to set appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Set Appointment</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="appointment-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-100">
              <p className="text-sm font-medium text-gray-900">{request.user?.full_name}</p>
              <p className="text-xs text-gray-500">{request.document_type}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} type="button" className="text-gray-600">
            Cancel
          </Button>
          <Button type="submit" form="appointment-form" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
