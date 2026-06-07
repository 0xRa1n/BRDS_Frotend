import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step2Props {
  onNext: (data: any) => void;
  onBack: () => void;
}

export function Step2PersonalInfo({ onNext, onBack }: Step2Props) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    dateOfBirth: "",
    purpose: "",
  });
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.user.getProfile();
        let formattedDate = "";
        if (res.date_of_birth && res.date_of_birth !== "0001-01-01T00:00:00Z") {
          formattedDate = new Date(res.date_of_birth).toISOString().split("T")[0];
        }

        setFormData((prev) => ({
          ...prev,
          fullName: res.full_name || "",
          address: res.address || "",
          dateOfBirth: formattedDate,
        }));
      } catch (error) {
        console.error("Failed to load existing profile", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (!formData.fullName || !formData.address || !formData.dateOfBirth || !formData.purpose) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onNext(formData);
  };

  if (isFetching) {
    return <div className="py-20 text-center text-gray-500">Loading your profile...</div>;
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">{t('personalInfoStep')}</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Juan dela Cruz"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="143 Mabini St., Brgy. San Isidro, Quezon City"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Purpose of Request</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-600 bg-white"
          >
            <option value="" disabled>
              {t('selectReason')}
            </option>
            <option value="employment">Employment / Trabaho</option>
            <option value="financial">Financial Assistance</option>
            <option value="medical">Medical Assistance</option>
            <option value="business">Business Requirement</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-medium text-gray-700">Upload Valid ID</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50/50">
            <p className="text-sm text-gray-500 mb-3">{t('uploadIdDesc')}</p>
            <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-colors">
              Choose File / Camera
              <input type="file" className="hidden" accept="image/*" capture="environment" />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <Button
          onClick={handleNext}
          className="w-full h-12 text-base rounded-md"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
