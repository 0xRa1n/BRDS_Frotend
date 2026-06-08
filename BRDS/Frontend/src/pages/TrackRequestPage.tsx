import { useState } from 'react';
import { Check, Clock, AlertCircle, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';

type RequestStatus = 'submitted' | 'review' | 'approved' | 'released';

export function TrackRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Using a state variable to hold the document status for display purposes.
  // This would eventually be populated by an API call using the tracking ID.
  const [status] = useState<RequestStatus>('submitted');

  const request = {
    id: id || '#BR-2024-0041',
    type: 'Barangay Clearance',
    submittedAt: 'June 7, 2026',
    appointmentDate: null, // e.g., 'June 10, 2026 at 09:00 AM'
  };

  const steps = [
    { id: 'submitted', title: t('statusReceived'), subtitle: 'Submitted', side: 'right' as const },
    { id: 'review', title: t('statusUnderReview'), subtitle: 'Under Review', side: 'left' as const },
    { id: 'approved', title: t('statusApproved'), subtitle: 'Approved', side: 'right' as const },
    { id: 'released', title: t('statusReadyForPickup'), subtitle: 'Ready for Pickup', side: 'left' as const },
  ];

  // Determine which steps are active based on the current status
  const getStepStatus = (stepId: string) => {
    const statusOrder = ['submitted', 'review', 'approved', 'released'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);
    
    return stepIndex <= currentIndex;
  };

  return (
    <div className="flex-1 bg-white py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-gray-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          
          <div className="absolute top-6 left-6 z-20">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('goBack')}
            </button>
          </div>

          <div className="text-center mb-8 relative z-10 mt-4 sm:mt-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('requestStatusTitle')}</h1>
            
            <div className="inline-block border border-emerald-500 text-emerald-600 rounded-full px-4 py-1 font-semibold mb-6 bg-white">
              {request.id}
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-1">{request.type}</h2>
            <p className="text-sm text-gray-500">Submitted: {request.submittedAt}</p>
          </div>

          {/* Appointment Notice */}
          <div className="mb-6 relative z-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Appointment Schedule</h3>
            {request.appointmentDate ? (
              <p className="text-blue-600">Your appointment is scheduled for <span className="font-bold">{request.appointmentDate}</span>.</p>
            ) : (
              <p className="text-blue-600">Your request will be scheduled on a specific date once reviewed by the admin or staff. You will receive an SMS notification.</p>
            )}
          </div>

          {/* Status Alerts */}
          <div className="mb-10 relative z-10">
            {status === 'review' && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-orange-700 mb-2">{t('needsInfoTitle')}</h3>
                <p className="text-orange-600 mb-6">{t('needsInfoDesc')}</p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
                  {t('updateInfoBtn')}
                </Button>
              </div>
            )}

            {status === 'approved' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-emerald-700 mb-2">{t('approvedTitle')}</h3>
                <p className="text-emerald-600 mb-6">{t('approvedDesc')}</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 flex items-center gap-2 mx-auto">
                  <Calendar className="w-4 h-4" />
                  {t('schedulePickupBtn')}
                </Button>
              </div>
            )}

            {status === 'released' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-emerald-700 mb-2">{t('releasedTitle')}</h3>
                <p className="text-emerald-600">{t('releasedDesc')}</p>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-3xl p-8 relative z-10 shadow-sm border border-gray-100">
            <div className="relative py-4">
              {/* Vertical Line */}
              <div className="absolute left-1/2 top-8 bottom-8 w-px bg-gray-200 -translate-x-1/2"></div>
              
              <div className="space-y-6">
                {steps.map((step) => {
                  const isActive = getStepStatus(step.id);
                  return (
                    <div key={step.id} className="relative flex justify-between items-center w-full">
                      {step.side === 'left' ? (
                        <>
                          {/* Left Card */}
                          <div className="w-[45%] flex justify-end pr-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 w-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-[200px] text-left">
                              <h4 className="font-bold text-gray-900">{step.title}</h4>
                              <p className="text-sm text-gray-500">{step.subtitle}</p>
                            </div>
                          </div>
                          
                          {/* Center Icon */}
                          <div className="w-[10%] flex justify-center z-10">
                            {isActive ? (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 ring-4 ring-white">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 ring-4 ring-white border border-gray-100">
                                <Clock className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Right Empty */}
                          <div className="w-[45%]"></div>
                        </>
                      ) : (
                        <>
                          {/* Left Empty */}
                          <div className="w-[45%]"></div>
                          
                          {/* Center Icon */}
                          <div className="w-[10%] flex justify-center z-10">
                            {isActive ? (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 ring-4 ring-white">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 ring-4 ring-white border border-gray-100">
                                <Clock className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Right Card */}
                          <div className="w-[45%] flex justify-start pl-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 w-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] max-w-[200px] text-left">
                              <h4 className="font-bold text-gray-900">{step.title}</h4>
                              <p className="text-sm text-gray-500">{step.subtitle}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
