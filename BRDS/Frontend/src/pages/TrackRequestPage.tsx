import { useState } from 'react';
import { Check, Clock, AlertCircle, Calendar, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type RequestStatus = 'submitted' | 'review' | 'approved' | 'released';

export function TrackRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { data: res, isLoading } = useQuery({
    queryKey: ["trackRequest", id],
    queryFn: () => api.public.trackRequest(id!),
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return <div className="flex-1 bg-white py-12 flex justify-center items-center text-gray-500">Loading request details...</div>;
  }

  const request = res?.data;

  if (!request) {
    return <div className="flex-1 bg-white py-12 flex justify-center items-center text-gray-500">Request not found. Please check your tracking number.</div>;
  }

  const status = request.status;
  const submittedAt = new Date(request.CreatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const appointmentDate = request.appointment_date ? new Date(request.appointment_date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;

  const steps = [
    { 
      id: 'submitted', 
      title: t('statusReceived'), 
      subtitle: 'Submitted', 
      side: 'right' as const,
      status: 'completed'
    },
    { 
      id: 'review', 
      title: ['Flagged', 'Rejected'].includes(status) ? (status === 'Flagged' ? 'Needs Information' : 'Rejected') : t('statusUnderReview'), 
      subtitle: ['Flagged', 'Rejected'].includes(status) ? (request.remarks || '') : (status === 'Pending' ? 'Waiting for review' : 'Under Review'), 
      side: 'left' as const,
      status: status === 'Flagged' ? 'flagged' : status === 'Rejected' ? 'rejected' : status === 'Pending' ? 'pending' : 'completed'
    },
    { 
      id: 'approved', 
      title: t('statusConfirmed'), 
      subtitle: 'Confirmed', 
      side: 'right' as const,
      status: ['Confirmed', 'Released'].includes(status) ? 'completed' : 'pending'
    },
    {
      id: 'scheduled',
      title: 'Scheduled',
      subtitle: appointmentDate ? `Set for ${appointmentDate}` : 'Waiting for schedule',
      side: 'left' as const,
      status: ['Confirmed', 'Released'].includes(status) ? 'completed' : 'pending'
    },
    { 
      id: 'released', 
      title: t('statusReadyForPickup'), 
      subtitle: 'Ready for Pickup', 
      side: 'right' as const,
      status: status === 'Released' ? 'completed' : 'pending'
    },
  ];

  const renderIcon = (stepStatus: string) => {
    if (stepStatus === 'completed') {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 ring-4 ring-white">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (stepStatus === 'flagged') {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 ring-4 ring-white">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c26500] text-white">
            <AlertCircle className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      );
    }
    if (stepStatus === 'rejected') {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 ring-4 ring-white">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white">
            <X className="w-3 h-3 stroke-[3]" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 ring-4 ring-white border border-gray-100">
        <Clock className="w-4 h-4 text-gray-400" />
      </div>
    );
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
            
            <div className="inline-block border border-emerald-500 text-emerald-600 rounded-full px-4 py-1 font-semibold mb-6 bg-white uppercase">
              {request.reference_number}
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-1 capitalize">{request.document_type}</h2>
            <p className="text-sm text-gray-500">Submitted: {submittedAt}</p>
          </div>

          {/* Appointment Notice */}
          <div className="mb-6 relative z-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-3">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-blue-700 mb-2">Appointment Schedule</h3>
            {appointmentDate ? (
              <p className="text-blue-600">Your appointment is scheduled for <span className="font-bold">{appointmentDate}</span>.</p>
            ) : (
              <p className="text-blue-600">Your request will be scheduled on a specific date once reviewed by the admin or staff. You will receive an SMS notification.</p>
            )}
          </div>

          {/* Status Alerts */}
          <div className="mb-10 relative z-10">
            {status === 'Flagged' && (
              <div className="bg-orange-50 border border-[#c26500] rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-[#c26500]" />
                </div>
                <h3 className="text-lg font-bold text-[#c26500] mb-2">{t('needsInfoTitle')}</h3>
                <p className="text-[#c26500] mb-6">{request.remarks || t('needsInfoDesc')}</p>
                <Button 
                  className="bg-[#c26500] hover:bg-orange-600 text-white rounded-full px-8"
                  onClick={() => navigate('/request?step=2')}
                >
                  {t('updateInfoBtn')}
                </Button>
              </div>
            )}

            {status === 'Rejected' && (
              <div className="bg-red-50 border border-red-300 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-red-700 mb-2">Request Rejected</h3>
                <p className="text-red-600">{request.remarks || "Your request has been denied."}</p>
              </div>
            )}

            {status === 'Confirmed' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="flex justify-center mb-3">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{t('confirmedTitle')}</h3>
                <p className="text-emerald-600 mb-6">{t('approvedDesc')}</p>
              </div>
            )}

            {status === 'Released' && (
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
                            {renderIcon(step.status)}
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
                            {renderIcon(step.status)}
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
