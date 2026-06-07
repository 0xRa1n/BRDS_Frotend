import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/lib/api";

export function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phone || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/verify");
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0 && isResendDisabled) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown, isResendDisabled]);

  const handleResend = async () => {
    try {
      setIsResendDisabled(true);
      setCountdown(60);
      await api.auth.sendOtp({ phone_number: phoneNumber });
      toast.success("Verification code resent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend code.");
      setIsResendDisabled(false);
      setCountdown(0);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.auth.verifyOtp({ phone_number: phoneNumber, code });
      
      if (res.token) {
        localStorage.setItem("jwt_token", res.token);
      }

      toast.success("Verification successful!");
      navigate('/request');
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-250px)]">
      <div className="bg-[#f9fafb] p-8 md:p-10 rounded-2xl w-full max-w-[480px]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ilagay ang Verification Code
        </h2>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          I-type ang 6-digit code na ipinadala sa iyong numero.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            ))}
          </div>

          <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
            {isLoading ? "Loading..." : "Confirm"}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              disabled={isResendDisabled}
              onClick={handleResend}
              className={`text-sm ${
                isResendDisabled
                  ? "text-primary/70 cursor-not-allowed"
                  : "text-primary font-medium hover:underline"
              }`}
            >
              Hindi natanggap? I-resend {isResendDisabled && `(${formatTime(countdown)})`}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            Ang iyong numero ay gagamitin lamang para sa verification.
          </p>
        </form>
      </div>
    </div>
  );
}
