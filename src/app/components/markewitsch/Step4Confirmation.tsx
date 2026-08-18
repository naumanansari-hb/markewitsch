import React from "react";
import {
  Check,
  Calendar,
  Truck,
  Tag,
  Users,
  FileText,
  Mail,
  ArrowLeft,
  Layers,
} from "lucide-react";

interface Step4Props {
  onRestart: () => void;
  formData: any;
  selectedCraneId: string;
}

export const Step4Confirmation: React.FC<Step4Props> = ({
  onRestart,
  formData,
  selectedCraneId,
}) => {
  const craneNames: Record<string, string> = {
    tk40: "Telescopic crane TK 40",
    tk60: "Telescopic crane TK 60",
    mk30: "City crane MK 30",
  };

  const cranePrices: Record<string, string> = {
    tk40: "€1,200 – €1,500",
    tk60: "€1,700 – €2,100",
    mk30: "€900 – €1,150",
  };

  const selectedCraneName = craneNames[selectedCraneId] || "Telescopic crane TK 40";
  const selectedCranePrice = cranePrices[selectedCraneId] || "€1,200 – €1,500";
  const userEmail = formData.email || "d.schmidt@siemens-energy.com";
  const liftingObject = formData.liftDescription || "Industrial Gas Turbine Compressor Block";

  return (
    <div className="max-w-[850px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center text-center">
      {/* Decorative Green Checkmark with Confetti Sparkles */}
      <div className="relative mb-6">
        {/* Background Confetti Sparkles Dots */}
        <div className="absolute -inset-8 flex items-center justify-center pointer-events-none">
          <span className="absolute top-0 left-4 w-2 h-2 rounded-full bg-pink-300 animate-ping opacity-75" />
          <span className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-[#C8102E]/40" />
          <span className="absolute top-3 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="absolute bottom-0 left-2 w-1.5 h-1.5 rounded-full bg-amber-300" />
        </div>

        {/* Outer Pulsing Ring */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-in zoom-in-75 duration-300">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
        </div>
      </div>

      {/* Main Titles */}
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
        Your inquiry has been submitted
      </h1>
      <p className="text-sm text-gray-500 max-w-lg mb-8 leading-relaxed">
        Thank you. Your request has been received and is now queued for immediate technical review by our team.
      </p>

      <div className="w-full space-y-6 text-left">
        {/* Summary Card 1 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-500 block">Inquiry reference</span>
              <div className="text-xl font-extrabold text-gray-900 mt-0.5">
                ANQ-2026-9042-X
              </div>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-gray-400 block text-right">Status</span>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Under review</span>
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 block">Submitted date</span>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                <Calendar className="w-4 h-4 text-[#C8102E]" />
                <span>17 August 2026</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 block">Lifting object</span>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                <Layers className="w-4 h-4 text-[#C8102E]" />
                <span className="truncate">{liftingObject}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 block">Recommended crane</span>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                <Truck className="w-4 h-4 text-[#C8102E]" />
                <span>{selectedCraneName}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 block">Indicative price</span>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-900">
                <Tag className="w-4 h-4 text-[#C8102E]" />
                <span className="text-[#C8102E] font-extrabold">{selectedCranePrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card 2: What happens next? */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900">What happens next?</h2>

          <div className="space-y-4 text-xs text-gray-700">
            {/* Step 1 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <p className="pt-1 leading-relaxed">
                <strong className="text-gray-900 font-semibold">Markewitsch reviews the technical requirements and availability</strong>{" "}
                to ensure the safest and most efficient solution.
              </p>
            </div>

            <div className="border-t border-gray-100" />

            {/* Step 2 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <p className="pt-1 leading-relaxed">
                <strong className="text-gray-900 font-semibold">We then prepare your final quotation and share it with you</strong>{" "}
                promptly for your evaluation.
              </p>
            </div>

            <div className="border-t border-gray-100" />

            {/* Step 3 */}
            <div className="flex items-start space-x-3.5">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <p className="pt-1 leading-relaxed">
                <strong className="text-gray-900 font-semibold">Confirmation email sent:</strong> A confirmation and summary of your inquiry have been sent to{" "}
                <strong className="text-gray-900 font-bold">{userEmail}</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Return to Start Page Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-md hover:shadow-lg active:scale-98"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to start page</span>
        </button>
      </div>
    </div>
  );
};
