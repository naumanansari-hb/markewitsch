import React, { useState } from "react";
import { Header } from "./Header";
import { LandingPage } from "./LandingPage";
import { Step1TellUsAboutJob } from "./Step1TellUsAboutJob";
import { Step2DirectPlanner } from "./Step2DirectPlanner";
import { Step2MapPlanner } from "./Step2MapPlanner";
import { Step3CraneSelection } from "./Step3CraneSelection";
import { Step4Confirmation } from "./Step4Confirmation";

export const CraneInquiryPrototype: React.FC = () => {
  const [viewMode, setViewMode] = useState<"landing" | "inquiry">("landing");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [plannerMode, setPlannerMode] = useState<"direct" | "map">("direct");

  // Form State
  const [formData, setFormData] = useState({
    contactName: "D. Schmidt",
    companyName: "Siemens Energy",
    email: "d.schmidt@siemens-energy.com",
    phone: "+49 171 9876543",
    addressSearch: "Am Industriehafen 12, 47119 Duisburg",
    selectedAddress: "Am Industriehafen 12, 47119 Duisburg, Germany",
    liftDescription: "Industrial Gas Turbine Compressor Block",
    startDate: "24 Aug 2026",
    endDate: "29 Aug 2026",
    isFlexible: true,
    dailyStartTime: "07:00",
    dailyEndTime: "17:00",
    customDays: [
      {
        id: 1,
        date: "Mon, 25 Aug 2026",
        startTime: "06:00",
        endTime: "15:00",
      },
      {
        id: 2,
        date: "Fri, 29 Aug 2026",
        startTime: "08:00",
        endTime: "16:00",
      },
    ],
  });

  // Planner State
  const [plannerData, setPlannerData] = useState({
    loadWeight: "12",
    dimL: "3.0",
    dimW: "2.0",
    dimH: "2.0",
    hasObstacle: true,
    distanceA: "12.0",
    distanceB: "8.0",
    obstacleHeight: "6.0",
    liftingHeight: "18.0",
    accessWidth: "5.0",
    setupL: "12.0",
    setupW: "8.0",
    groundCondition: "Compacted gravel",
    notes: "",
    boomAngle: "45",
  });

  // Crane Selection State
  const [selectedCraneId, setSelectedCraneId] = useState<string>("tk40");
  const [boomLength, setBoomLength] = useState<number>(28);

  const handleStartInquiry = (initialCraneId?: string, initialPlannerMode?: "direct" | "map") => {
    if (initialCraneId) {
      setSelectedCraneId(initialCraneId);
    }
    setPlannerMode(initialPlannerMode || "direct");
    setCurrentStep(1);
    setViewMode("inquiry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReturnToHome = () => {
    setViewMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setViewMode("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic header contacts matching exact reference screens
  const getHeaderPhone = () => {
    if (currentStep === 1) return "+49 123 456789";
    if (currentStep === 2 && plannerMode === "map") return "+49 162 4542436";
    return "+49 2324 9876-0";
  };

  if (viewMode === "landing") {
    return <LandingPage onStartInquiry={handleStartInquiry} />;
  }

  return (
    <div className="min-h-screen bg-gray-50/70 text-gray-900 font-sans flex flex-col">
      {/* Header (clicking logo redirects to landing page) */}
      <Header
        currentStep={currentStep}
        onStepClick={handleStepClick}
        onHomeClick={handleReturnToHome}
        phone={getHeaderPhone()}
        email="info@markewitsch.de"
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentStep === 1 && (
          <Step1TellUsAboutJob
            onNext={handleNextStep}
            formData={formData}
            setFormData={setFormData}
          />
        )}

        {currentStep === 2 && (
          <>
            {plannerMode === "direct" ? (
              <Step2DirectPlanner
                onBack={handlePrevStep}
                onNext={handleNextStep}
                plannerData={plannerData}
                setPlannerData={setPlannerData}
              />
            ) : (
              <Step2MapPlanner
                onBack={handlePrevStep}
                onNext={handleNextStep}
                plannerData={plannerData}
                setPlannerData={setPlannerData}
              />
            )}
          </>
        )}

        {currentStep === 3 && (
          <Step3CraneSelection
            onBack={handlePrevStep}
            onNext={handleNextStep}
            selectedCraneId={selectedCraneId}
            setSelectedCraneId={setSelectedCraneId}
            boomLength={boomLength}
            setBoomLength={setBoomLength}
            plannerData={plannerData}
            setPlannerData={setPlannerData}
          />
        )}

        {currentStep === 4 && (
          <Step4Confirmation
            onRestart={handleRestart}
            formData={formData}
            selectedCraneId={selectedCraneId}
          />
        )}
      </main>
    </div>
  );
};
