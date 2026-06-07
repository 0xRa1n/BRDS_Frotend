import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const COUNTRY_CODES = [
  { code: "+93", country: "Afghanistan" },
  { code: "+61", country: "Australia" },
  { code: "+55", country: "Brazil" },
  { code: "+1", country: "Canada" },
  { code: "+86", country: "China" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+91", country: "India" },
  { code: "+62", country: "Indonesia" },
  { code: "+39", country: "Italy" },
  { code: "+81", country: "Japan" },
  { code: "+60", country: "Malaysia" },
  { code: "+52", country: "Mexico" },
  { code: "+63", country: "Philippines" },
  { code: "+65", country: "Singapore" },
  { code: "+82", country: "South Korea" },
  { code: "+34", country: "Spain" },
  { code: "+44", country: "United Kingdom" },
  { code: "+1", country: "United States" },
  { code: "+84", country: "Vietnam" },
];

export function VerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Philippines");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 5) {
      toast.error("Please enter a valid cellphone number.");
      return;
    }

    try {
      setIsLoading(true);
      const countryObj = COUNTRY_CODES.find(c => c.country === selectedCountry);
      const code = countryObj ? countryObj.code : "+63";
      const fullPhoneNumber = `${code}${phone.replace(/\D/g, '')}`;
      
      await api.auth.sendOtp({ phone_number: fullPhoneNumber });
      
      toast.success("Verification code sent successfully!");
      navigate('/verify-otp', { state: { phone: fullPhoneNumber, next: location.state?.next } });
    } catch (error: any) {
      toast.error(error.message || "Failed to send code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-250px)]">
      <div className="bg-[#f9fafb] p-8 md:p-10 rounded-2xl w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          I-verify ang iyong numero
        </h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Ilagay ang iyong cellphone number para makatanggap ng verification code.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Cellphone Number
            </label>
            <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <div className="relative flex items-center justify-center w-24 border-r border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                <span className="text-gray-600 text-base font-medium">
                  {COUNTRY_CODES.find(c => c.country === selectedCountry)?.code}
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                  title="Select Country Code"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.country} value={item.country}>
                      {item.code} ({item.country})
                    </option>
                  ))}
                </select>
              </div>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="917 123 4567"
                disabled={isLoading}
                className="flex-1 px-4 py-3 outline-none w-full disabled:opacity-50 text-base"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
            {isLoading ? "Nagpapadala..." : "Magpadala ng code"}
          </Button>

          <p className="text-center text-xs text-gray-500 pt-2">
            Ang iyong numero ay gagamitin lamang para sa verification.
          </p>
        </form>
      </div>
    </div>
  );
}
