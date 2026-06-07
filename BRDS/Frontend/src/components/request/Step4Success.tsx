import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step4Props {
  referenceNumber: string;
  formData: {
    documentType: string;
    fullName: string;
    address: string;
  };
}

export function Step4Success({ referenceNumber, formData }: Step4Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-start text-center animate-in zoom-in-95 duration-500 py-8">
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6">
        <Check className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
      
      <p className="text-gray-600 text-sm mb-8 max-w-[320px] mx-auto leading-relaxed">
        {t('requestReceived')}
      </p>

      <div className="border-2 border-dashed border-primary rounded-xl p-6 mb-8 w-full">
        <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">Reference Number</p>
        <p className="text-3xl font-bold text-primary">{referenceNumber}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full text-left mb-8">
        <h3 className="font-bold text-gray-900 mb-4">Request Summary</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('docTypeStep')}</p>
            <p className="font-medium text-gray-900 capitalize">{formData.documentType.replace(/-/g, " ")}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Pangalan</p>
            <p className="font-medium text-gray-900">{formData.fullName}</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="font-medium text-gray-900">{formData.address}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex-1 h-12 text-base rounded-md border-gray-200 text-gray-700"
        >
          {t('backToDashboard')}
        </Button>
        <Button
          onClick={() => navigate(`/track/${referenceNumber}`)}
          className="flex-1 h-12 text-base rounded-md"
        >
          {t('trackRequest')}
        </Button>
      </div>
    </div>
  );
}
