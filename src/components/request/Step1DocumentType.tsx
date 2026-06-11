import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Briefcase, Building2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Step1Props {
  onNext: (documentType: string) => void;
  onBack?: () => void;
}

export function Step1DocumentType({ onNext, onBack }: Step1Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const { t } = useLanguage();

  const documentTypes = [
    {
      id: "clearance",
      title: "Barangay Clearance",
      description: t('clearanceDesc'),
      icon: FileText,
    },
    {
      id: "indigency",
      title: "Certificate of Indigency",
      description: t('indigencyDesc'),
      icon: MapPin,
    },
    {
      id: "business",
      title: "Business Permit Endorsement",
      description: t('businessDesc'),
      icon: Briefcase,
    },
    {
      id: "residency",
      title: "Certificate of Residency",
      description: t('residencyDesc'),
      icon: Building2,
    },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('docTypeStep')}</h2>
        <p className="text-gray-600 text-sm">{t('whatDocNeeded')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {documentTypes.map((doc) => {
          const isSelected = selected === doc.id;
          const Icon = doc.icon;
          return (
            <div
              key={doc.id}
              onClick={() => setSelected(doc.id)}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-start gap-4 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{doc.title}</h3>
                <p className="text-xs text-gray-500">{doc.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto pt-4 flex gap-3">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full md:w-auto md:flex-1 h-12 text-base rounded-md border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            {t('goBack')}
          </Button>
        )}
        <Button
          onClick={() => onNext(selected!)}
          disabled={!selected}
          className={`h-12 text-base rounded-md ${onBack ? "w-full md:flex-1" : "w-full"}`}
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
}
