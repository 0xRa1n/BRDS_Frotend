import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSuccess: (updatedProfile: any) => void;
}

export function ProfileEditModal({ isOpen, onClose, profile, onSuccess }: ProfileEditModalProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    phoneNumber: profile?.phone_number || "",
    address: profile?.address || "",
    dateOfBirth: profile?.date_of_birth ? profile.date_of_birth.slice(0, 10) : "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.user.updateProfile({
        full_name: formData.fullName,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
      });
      toast.success("Impormasyon updated successfully");
      onSuccess({
        ...profile,
        full_name: formData.fullName,
        address: formData.address,
        date_of_birth: formData.dateOfBirth,
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('editInfo')}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">{t('fullName')}</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
              placeholder="e.g. Juan dela Cruz"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">{t('cellphoneNumber')}</label>
            <input
              type="text"
              readOnly
              value={formData.phoneNumber}
              className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">{t('dateOfBirth')}</label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600">{t('barangayAddress')}</label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 resize-none h-24"
              placeholder="e.g. 143 Mabini St., Brgy. San Isidro"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('saveBtn')}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
