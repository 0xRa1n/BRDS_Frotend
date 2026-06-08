import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewRequestModal({ isOpen, onClose, onSuccess }: Props) {
  const [fullName, setFullName] = useState("");
  const [documentType, setDocumentType] = useState("Barangay Clearance");
  const [purpose, setPurpose] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !documentType || !purpose || !contactNumber) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setIsLoading(true);
      await api.admin.createRequest({
        full_name: fullName,
        contact_number: contactNumber,
        document_type: documentType,
        purpose,
      });
      toast.success("Request created successfully!");
      onSuccess();
      onClose();
      // Reset
      setFullName("");
      setDocumentType("Barangay Clearance");
      setPurpose("");
      setContactNumber("");
    } catch (error: any) {
      toast.error(error.message || "Failed to create request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg">New Document Request</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="new-request-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Resident Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Juan Dela Cruz"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Barangay Clearance">Barangay Clearance</option>
                <option value="Certificate of Indigency">Certificate of Indigency</option>
                <option value="Certificate of Residency">Certificate of Residency</option>
                <option value="Business Permit Endorsement">Business Permit Endorsement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Employment, Bank requirement"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 09123456789"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md outline-none focus:border-emerald-500"
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <Button variant="outline" onClick={onClose} type="button" className="text-gray-600">
            Cancel
          </Button>
          <Button type="submit" form="new-request-form" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Request"}
          </Button>
        </div>
      </div>
    </div>
  );
}
