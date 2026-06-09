import { useState, useEffect } from "react";
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
  const [status, setStatus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize state when modal opens
  useEffect(() => {
    if (request && isOpen) {
      if (request.appointment_date) {
        const d = new Date(request.appointment_date);
        // Add local timezone offset so we extract the correct local date string
        const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
        setDate(localDate.toISOString().split('T')[0]);
        setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setDate("");
        setTime("");
      }
      setStatus(request.status || "Pending");
      setDocumentType(request.document_type || "Barangay Clearance");
    }
  }, [request, isOpen]);

  if (!isOpen || !request) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      let updated = false;

      const existingDateStr = request.appointment_date ? new Date(request.appointment_date).toISOString().split('T')[0] : "";
      const existingTimeStr = request.appointment_date ? new Date(request.appointment_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : "";

      const dateChanged = date !== existingDateStr || time !== existingTimeStr;
      if (dateChanged && date && time) {
        const appointmentDate = new Date(`${date}T${time}:00`);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests/${request.ID}/appointment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            appointment_date: appointmentDate.toISOString()
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to set appointment");
        }
        updated = true;
      }

      const statusChanged = status !== request.status;
      const documentTypeChanged = documentType !== request.document_type;

      // If we changed date, the backend forces status to "Confirmed". If our local status is not "Confirmed", we must override it.
      if (statusChanged || documentTypeChanged || (dateChanged && status !== "Confirmed")) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}/api/v1/admin/requests/${request.ID}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status, document_type: documentType })
        });
        if (!res.ok) throw new Error("Failed to update status");
        updated = true;
      }

      if (updated) {
        toast.success("Appointment updated successfully");
        onSuccess();
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg w-full max-w-[500px] shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">Edit Appointment</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="appointment-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm text-gray-700">Resident Name</label>
              <input
                type="text"
                value={request.user?.full_name || ""}
                readOnly
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none bg-white text-gray-900 focus:border-gray-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-700">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
                <option value="Certificate of Residency">Certificate of Residency</option>
                <option value="Business Permit Endorsement">Business Permit Endorsement</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm text-gray-700">Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500 bg-white"
                >
                  <option value="" disabled>Select a time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Missed">Missed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
          <Button variant="outline" onClick={onClose} type="button" className="text-gray-600 bg-white shadow-sm border-gray-200">
            Cancel
          </Button>
          <Button type="submit" form="appointment-form" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Appointment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
