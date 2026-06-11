import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Step1DocumentType } from "@/components/request/Step1DocumentType";
import { Step2PersonalInfo } from "@/components/request/Step2PersonalInfo";
import { Step3Review } from "@/components/request/Step3Review";
import { Step4Success } from "@/components/request/Step4Success";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export function DocumentRequestPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialStep = searchParams.get("step") ? parseInt(searchParams.get("step") as string) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  
  const steps = [
    { id: 1, title: t('docTypeStep') },
    { id: 2, title: t('personalInfoStep') },
    { id: 3, title: t('reviewSubmitStep') },
  ];
  
  // Idempotency key generated once per mount of this component
  const idempotencyKey = useRef(crypto.randomUUID());

  const [formData, setFormData] = useState({
    documentType: "",
    fullName: "",
    address: "",
    dateOfBirth: "",
    purpose: "",
  });

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.request.submit(
        {
          full_name: formData.fullName,
          address: formData.address,
          date_of_birth: formData.dateOfBirth,
          document_type: formData.documentType,
          purpose: formData.purpose,
        },
        idempotencyKey.current
      );
      
      setReferenceNumber(res.reference_number);
      toast.success("Request submitted successfully!");
      handleNext(); // Move to Step 4
    } catch (error: any) {
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="flex-1 flex flex-col items-center p-4 py-12 min-h-[calc(100vh-250px)]">
      <div className="bg-[#f9fafb] p-8 md:p-10 rounded-2xl w-full max-w-[800px] overflow-hidden">
        
        {/* Progress Tracker - hide on success page (Step 4) */}
        {currentStep < 4 && (
          <div className="flex justify-center mb-12">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                        isActive || isPast
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden md:block transition-colors duration-300 ${
                        isActive || isPast ? "text-primary" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-24 h-1 mx-2 rounded transition-colors duration-300 ${
                        isPast ? "bg-primary" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="relative" style={{ minHeight: currentStep === 2 ? "750px" : currentStep === 3 ? "600px" : currentStep === 4 ? "750px" : "500px" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute w-full h-full"
            >
              {currentStep === 1 && (
                <Step1DocumentType 
                  onNext={(type) => {
                    setFormData(prev => ({ ...prev, documentType: type }));
                    handleNext();
                  }} 
                  onBack={() => navigate('/dashboard')}
                />
              )}
              {currentStep === 2 && (
                <Step2PersonalInfo 
                  onNext={(data) => {
                    setFormData(prev => ({ ...prev, ...data }));
                    handleNext();
                  }} 
                  onBack={handleBack} 
                />
              )}
              {currentStep === 3 && (
                <Step3Review 
                  formData={formData}
                  onNext={handleSubmit}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === 4 && (
                <Step4Success 
                  referenceNumber={referenceNumber}
                  formData={formData}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
