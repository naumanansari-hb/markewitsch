import React from "react";
import { X, CheckCircle, FileText, Download, ShieldCheck, Ruler, Truck } from "lucide-react";

interface CraneDetailModalProps {
  crane: any;
  onClose: () => void;
}

export const CraneDetailModal: React.FC<CraneDetailModalProps> = ({
  crane,
  onClose,
}) => {
  if (!crane) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 space-y-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
          <div className="w-16 h-12 bg-red-50 border border-red-100 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={crane.image} alt={crane.name} className="object-contain h-full w-full" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-[#C8102E]">
                {crane.badge}
              </span>
              <span className="text-xs text-gray-500 font-semibold">
                {crane.boomLengthSpec ? `${crane.boomLengthSpec} boom • ${crane.maxCapacity} max • ${crane.maxRadius} radius` : crane.specs}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">{crane.name}</h2>
          </div>
        </div>

        {/* Grid Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
            <span className="text-xs text-gray-500 font-semibold block">Max Capacity</span>
            <span className="text-lg font-bold text-gray-900">{crane.maxCapacity || "40 t"}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
            <span className="text-xs text-gray-500 font-semibold block">Max Telescopic Boom</span>
            <span className="text-lg font-bold text-gray-900">{crane.maxBoom || "40 m"}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/70">
            <span className="text-xs text-gray-500 font-semibold block">Drive / Steering</span>
            <span className="text-lg font-bold text-gray-900">{crane.steering || "8 x 6 x 8"}</span>
          </div>
        </div>

        {/* Technical Highlights */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Key Features & Technical Suitability</h3>
          <ul className="space-y-2">
            {crane.bullets.map((b: string, i: number) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-gray-700">
                <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
            <li className="flex items-start space-x-2 text-xs text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <span>Compact outrigger footprint designed for constrained industrial plants</span>
            </li>
            <li className="flex items-start space-x-2 text-xs text-gray-700">
              <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <span>Certified under Euro 6 emission standards with bio-degradable hydraulic oil</span>
            </li>
          </ul>
        </div>

        {/* Load Radius Schematic */}
        <div className="bg-slate-900 rounded-xl p-4 text-white space-y-2">
          <div className="flex items-center justify-between text-xs border-b border-slate-700 pb-2">
            <span className="font-bold flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-red-400" />
              <span>Load Chart Summary ({crane.name})</span>
            </span>
            <span className="text-slate-400">DIN EN 13000 Standard</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400 text-[10px]">Radius 10m</div>
              <div className="font-bold text-red-400">18.5 t</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400 text-[10px]">Radius 15m</div>
              <div className="font-bold text-red-400">12.0 t</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400 text-[10px]">Radius 20m</div>
              <div className="font-bold text-red-400">8.2 t</div>
            </div>
            <div className="bg-slate-800 p-2 rounded">
              <div className="text-slate-400 text-[10px]">Radius 28m</div>
              <div className="font-bold text-red-400">4.5 t</div>
            </div>
          </div>
        </div>

        {/* PDF Download Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <a
            href="#download"
            onClick={(e) => {
              e.preventDefault();
              alert(`Downloading official technical data sheet for ${crane.name}...`);
            }}
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#C8102E] hover:underline"
          >
            <Download className="w-4 h-4" />
            <span>Download Spec Sheet PDF</span>
          </a>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            Close preview
          </button>
        </div>
      </div>
    </div>
  );
};
