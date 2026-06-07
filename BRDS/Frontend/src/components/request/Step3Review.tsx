import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step3Props {
  formData: {
    documentType: string;
    fullName: string;
    address: string;
    purpose: string;
  };
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function Step3Review({ formData, onNext, onBack, isSubmitting }: Step3Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Review at Submit</h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Uri ng Dokumento</p>
          <p className="font-medium text-gray-900 capitalize">{formData.documentType.replace(/-/g, " ")}</p>
        </div>
        
        <div className="h-px bg-gray-100 w-full" />
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Full Name</p>
          <p className="font-medium text-gray-900">{formData.fullName}</p>
        </div>
        
        <div className="h-px bg-gray-100 w-full" />
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Address</p>
          <p className="font-medium text-gray-900">{formData.address}</p>
        </div>

        <div className="h-px bg-gray-100 w-full" />
        
        <div>
          <p className="text-xs text-gray-500 mb-1">Purpose</p>
          <p className="font-medium text-gray-900 capitalize">{formData.purpose}</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3 mb-8">
        <div className="pt-0.5">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-gray-700"
          />
        </div>
        <label htmlFor="agree" className="text-sm text-gray-600 cursor-pointer leading-tight">
          Pinatutunayan ko na tama ang lahat ng impormasyon na aking inilagay.
        </label>
      </div>

      <div className="mt-auto pt-4">
        <Button
          onClick={onNext}
          disabled={!agreed || isSubmitting}
          className="w-full h-12 text-base rounded-md text-white bg-[#cbd5e1] hover:bg-gray-400 data-[active=true]:bg-primary"
          style={{ backgroundColor: agreed ? '#10b981' : '#cbd5e1' }}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </div>
    </div>
  );
}
