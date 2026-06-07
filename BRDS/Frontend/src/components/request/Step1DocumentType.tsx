import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Briefcase, Building2 } from "lucide-react";

interface Step1Props {
  onNext: (documentType: string) => void;
}

const documentTypes = [
  {
    id: "clearance",
    title: "Barangay Clearance",
    description: "Para sa trabaho, bangko, o ID",
    icon: FileText,
  },
  {
    id: "indigency",
    title: "Certificate of Indigency",
    description: "Para sa financial o medical assistance",
    icon: MapPin,
  },
  {
    id: "business",
    title: "Business Permit Endorsement",
    description: "Para sa pagbukas ng negosyo",
    icon: Briefcase,
  },
  {
    id: "residency",
    title: "Certificate of Residency",
    description: "Patunay ng tirahan sa barangay",
    icon: Building2,
  },
];

export function Step1DocumentType({ onNext }: Step1Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Uri ng Dokumento</h2>
        <p className="text-gray-600 text-sm">Anong dokumento ang kailangan mo?</p>
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

      <div className="mt-auto pt-4">
        <Button
          onClick={() => onNext(selected!)}
          disabled={!selected}
          className="w-full h-12 text-base rounded-md"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
