import React from "react";
import { Phone, Mail } from "lucide-react";
import logoImg from "../../../assets/markewitsch_logo.png";

interface HeaderProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onHomeClick?: () => void;
  phone?: string;
  email?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onStepClick,
  onHomeClick,
  phone = "+49 123 456789",
  email = "info@markewitsch.de",
}) => {
  const steps = [
    { id: 1, label: "Tell us about the job" },
    { id: 2, label: "Lift planner" },
    { id: 3, label: "Crane options" },
    { id: 4, label: "Confirmation" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Logo (larger size, clicking returns to landing page) */}
          <div
            className="cursor-pointer group flex items-center py-1"
            onClick={onHomeClick || (() => onStepClick(1))}
            title="Return to start page"
          >
            <img
              src={logoImg}
              alt="Gebr Markewitsch Kran · Transport · Montage · Industrieservice"
              className="h-14 sm:h-16 md:h-18 w-auto object-contain transition-transform group-hover:scale-102"
            />
          </div>

          {/* Contact Details */}
          <div className="flex items-center space-x-6 text-xs text-gray-700 font-medium">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center space-x-1.5 hover:text-[#C8102E] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center space-x-1.5 hover:text-[#C8102E] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              <span>{email}</span>
            </a>
          </div>
        </div>

        {/* Step Progress Bar (Equal Bar Lengths) */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-center space-x-3">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => onStepClick(step.id)}
                  className="flex flex-col items-center group focus:outline-none"
                  title={step.label}
                >
                  <div
                    className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[#C8102E]"
                        : isCompleted
                        ? "bg-gray-500"
                        : "bg-gray-200"
                    }`}
                  />
                </button>
                {idx < steps.length - 1 && (
                  <div className="w-2" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};
