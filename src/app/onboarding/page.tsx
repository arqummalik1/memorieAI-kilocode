'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { StepName } from '@/components/onboarding/StepName';
import { StepTimezone } from '@/components/onboarding/StepTimezone';
import { StepBriefing } from '@/components/onboarding/StepBriefing';
import { StepNotifications } from '@/components/onboarding/StepNotifications';

const steps = ['Name', 'Timezone', 'Briefing', 'Notifications'];

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = async () => {
    await updateProfile({ onboarding_completed: true });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {steps[currentStep]}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {currentStep === 0 && <StepName onNext={handleNext} />}
          {currentStep === 1 && <StepTimezone onNext={handleNext} />}
          {currentStep === 2 && <StepBriefing onNext={handleNext} />}
          {currentStep === 3 && <StepNotifications onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
}
