import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Info,
  ZoomIn,
  ZoomOut,
  Ruler,
  Weight,
  Compass,
} from "lucide-react";
import tk40Img from "../../../assets/tk40_crane.jpg";
import tk60Img from "../../../assets/tk60_crane.jpg";
import mk30Img from "../../../assets/mk30_crane.jpg";
import { CraneDetailModal } from "./CraneDetailModal";

interface Step3Props {
  onBack: () => void;
  onNext: () => void;
  selectedCraneId: string;
  setSelectedCraneId: (id: string) => void;
  boomLength: number;
  setBoomLength: (len: number) => void;
  plannerData?: any;
  setPlannerData?: React.Dispatch<React.SetStateAction<any>>;
}

export const Step3CraneSelection: React.FC<Step3Props> = ({
  onBack,
  onNext,
  selectedCraneId,
  setSelectedCraneId,
  boomLength,
  setBoomLength,
  plannerData = {},
  setPlannerData,
}) => {
  const [modalCrane, setModalCrane] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Exact load chart specs requested by user: Boom length, Max weight, Max outreach radius
  const cranes = [
    {
      id: "tk40",
      name: "Telescopic crane TK 40",
      badge: "Recommended",
      badgeType: "red",
      boomLengthSpec: "40 m",
      maxCapacity: "40 t",
      maxRadius: "36 m",
      image: tk40Img,
      bullets: [
        "Supports 12 t at 15 m radius",
        "Boom range covers required geometry",
        "Suitable for obstacle clearance",
      ],
      priceRange: "€1,200 – €1,500",
      baseRate: 950,
      minBoom: 10,
      maxBoom: 40,
      steering: "8 x 6 x 8",
    },
    {
      id: "tk60",
      name: "Telescopic crane TK 60",
      badge: "Alternative",
      badgeType: "gray",
      boomLengthSpec: "50 m",
      maxCapacity: "60 t",
      maxRadius: "44 m",
      image: tk60Img,
      bullets: [
        "Supports 16 t at 15 m radius",
        "Longer boom for extended reach",
        "Ideal for heavier or further lifts",
      ],
      priceRange: "€1,700 – €2,100",
      baseRate: 1450,
      minBoom: 12,
      maxBoom: 50,
      steering: "10 x 8 x 10",
    },
    {
      id: "mk30",
      name: "City crane MK 30",
      badge: "Alternative",
      badgeType: "gray",
      boomLengthSpec: "30 m",
      maxCapacity: "30 t",
      maxRadius: "26 m",
      image: mk30Img,
      bullets: [
        "Supports 10 t at 13 m radius",
        "Compact setup for constrained sites",
        "Low space requirement",
      ],
      priceRange: "€900 – €1,150",
      baseRate: 750,
      minBoom: 8,
      maxBoom: 30,
      steering: "6 x 6 x 6",
    },
  ];

  const selectedCrane = cranes.find((c) => c.id === selectedCraneId) || cranes[0];

  // Dynamic price calculation without obstacle cost
  const mobilizationCost = 150;
  const boomAdjustmentCost = Math.round((boomLength - 15) * 7.7);
  const otherServicesCost = 100;
  const totalCalculatedPrice =
    selectedCrane.baseRate +
    mobilizationCost +
    boomAdjustmentCost +
    otherServicesCost;

  // Values from Step 2 Direct Planner
  const loadWeight = parseFloat(plannerData.loadWeight) || 12;
  const distA = Math.max(1, parseFloat(plannerData.distanceA) || 12.0);
  const distB = Math.max(1, parseFloat(plannerData.distanceB) || 8.0);
  const obstacleH = Math.max(0, parseFloat(plannerData.obstacleHeight) || 6.0);
  const liftH = Math.max(1, parseFloat(plannerData.liftingHeight) || 18.0);
  const boomAngle = Math.min(80, Math.max(10, parseFloat(plannerData.boomAngle) || 45));
  const hasObstacle = plannerData.hasObstacle !== false;

  // Geometry calculation for diagram
  const groundY = 160;
  const pivotX = 60;
  const pivotY = 145;
  const pxPerM = 7.5;

  const distAPx = distA * pxPerM;
  const distBPx = (hasObstacle ? distB : 0) * pxPerM;
  const radiusPx = distAPx + distBPx;

  const obsX = pivotX + distAPx;
  const obsW = Math.max(24, Math.min(50, distBPx * 0.6));
  const obsHPx = obstacleH * pxPerM;
  const obsY = groundY - obsHPx;

  const loadX = pivotX + radiusPx;
  const liftHPx = liftH * pxPerM;
  const loadY = Math.max(30, groundY - liftHPx);

  const angleRad = (boomAngle * Math.PI) / 180;
  const boomTipX = loadX;
  const boomTipY = Math.max(25, pivotY - radiusPx * Math.tan(angleRad));

  // Boom slider red fill percentage
  const minSliderBoom = selectedCrane.minBoom || 10;
  const maxSliderBoom = selectedCrane.maxBoom || 40;
  const sliderPercentage = Math.min(
    100,
    Math.max(
      0,
      ((boomLength - minSliderBoom) / (maxSliderBoom - minSliderBoom)) * 100
    )
  );

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recommended cranes & indicative price
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Based on your lift requirements, site conditions and obstacle clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Crane List */}
        <div className="lg:col-span-7 space-y-4">
          {cranes.map((crane) => {
            const isSelected = crane.id === selectedCraneId;
            return (
              <div
                key={crane.id}
                onClick={() => setSelectedCraneId(crane.id)}
                className={`bg-white rounded-xl border p-5 transition-all cursor-pointer relative shadow-2xs ${
                  isSelected
                    ? "border-[#C8102E] ring-2 ring-[#C8102E]/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Top Badge & Radio */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      crane.badgeType === "red"
                        ? "bg-[#C8102E] text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {crane.badge}
                  </span>

                  {/* Radio Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#C8102E] bg-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  {/* Crane Image */}
                  <div className="md:col-span-5 h-36 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                    <img
                      src={crane.image}
                      alt={crane.name}
                      className="object-contain h-full w-full max-h-32"
                    />
                  </div>

                  {/* Crane Details */}
                  <div className="md:col-span-7 space-y-2.5">
                    <div>
                      <h3 className="text-base font-extrabold text-gray-900">
                        {crane.name}
                      </h3>

                      {/* 3 Key Load Chart Details: Boom Length, Max Weight, Max Outreach Radius */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200/60 text-gray-700 text-[11px] font-medium">
                          <Ruler className="w-3 h-3 text-gray-500 mr-1 shrink-0" />
                          Boom: <strong className="ml-1 text-gray-900 font-bold">{crane.boomLengthSpec}</strong>
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 border border-red-100 text-[#C8102E] text-[11px] font-medium">
                          <Weight className="w-3 h-3 text-[#C8102E] mr-1 shrink-0" />
                          Max weight: <strong className="ml-1 text-[#C8102E] font-bold">{crane.maxCapacity}</strong>
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200/60 text-gray-700 text-[11px] font-medium">
                          <Compass className="w-3 h-3 text-gray-500 mr-1 shrink-0" />
                          Max radius: <strong className="ml-1 text-gray-900 font-bold">{crane.maxRadius}</strong>
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-1">
                      {crane.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-1.5 text-xs text-gray-700"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-[#C8102E] shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalCrane(crane);
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#C8102E] hover:underline"
                      >
                        <span>View crane page</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <span className="text-[10px] text-gray-400 font-semibold">
                            Indicative price
                          </span>
                          <span
                            title="This is a tentative pricing. Actual price will be given after review."
                            className="cursor-pointer"
                          >
                            <Info className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                          </span>
                        </div>
                        <span className="text-base font-extrabold text-gray-900">
                          {crane.priceRange}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Crane Configurator & Price Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-5">
          {/* Header */}
          <div>
            <span className="text-xs text-gray-400 font-semibold block">
              Selected crane
            </span>
            <h2 className="text-lg font-extrabold text-gray-900">
              {selectedCrane.name}
            </h2>
          </div>

          {/* Boom length adjustment with Red selected highlight track */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">
                Adjust boom length
              </label>
              <select
                value={`${boomLength} m`}
                onChange={(e) => setBoomLength(parseInt(e.target.value))}
                className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-900 focus:outline-none shadow-2xs"
              >
                <option value="15 m">15 m</option>
                <option value="20 m">20 m</option>
                <option value="28 m">28 m</option>
                <option value="35 m">35 m</option>
                <option value="40 m">40 m</option>
              </select>
            </div>

            {/* Red Filled Slider Track */}
            <div className="relative flex items-center">
              <input
                type="range"
                min={minSliderBoom}
                max={maxSliderBoom}
                value={boomLength}
                onChange={(e) => setBoomLength(parseInt(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #C8102E 0%, #C8102E ${sliderPercentage}%, #E5E7EB ${sliderPercentage}%, #E5E7EB 100%)`,
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#C8102E]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
              <span>{minSliderBoom} m</span>
              <span className="text-[#C8102E] font-extrabold">
                Current: {boomLength} m
              </span>
              <span>{maxSliderBoom} m</span>
            </div>
          </div>

          {/* Interactive Geometry Preview with Zoom controls and live exact Step 2 values */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 block">
                Geometry preview (interactive)
              </span>

              {/* Mini Zoom Controls */}
              <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-white rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SVG Schematic with Infinite Ground & Clean Non-Breaking Boom Length Badge */}
            <div className="w-full h-52 bg-slate-50/50 rounded-lg flex items-center justify-center p-2 relative overflow-hidden border border-gray-100">
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <svg viewBox="0 0 420 200" className="w-full h-full overflow-visible">
                  {/* Extended Bedrock Fill */}
                  <rect x="-1000" y={groundY} width="2500" height="300" fill="#F1F5F9" />

                  {/* Extended Ground Line across full horizon */}
                  <line x1="-1000" y1={groundY} x2="2500" y2={groundY} stroke="#374151" strokeWidth="1.5" />

                  {/* Extended Ground Hatching */}
                  {Array.from({ length: 160 }).map((_, i) => (
                    <line
                      key={i}
                      x1={-800 + i * 12}
                      y1={groundY}
                      x2={-808 + i * 12}
                      y2={groundY + 8}
                      stroke="#94A3B8"
                      strokeWidth="0.8"
                    />
                  ))}

                  {/* Crane Truck Chassis */}
                  <g transform={`translate(${pivotX - 35}, ${groundY - 20})`}>
                    <rect x="0" y="4" width="45" height="14" fill="#374151" rx="2" />
                    <circle cx="10" cy="18" r="3.5" fill="#111827" />
                    <circle cx="22" cy="18" r="3.5" fill="#111827" />
                    <circle cx="35" cy="18" r="3.5" fill="#111827" />
                    <rect x="35" y="6" width="6" height="14" fill="#111827" />
                  </g>

                  {/* Boom line extending to boomTipX, boomTipY */}
                  <line
                    x1={pivotX}
                    y1={pivotY}
                    x2={boomTipX}
                    y2={boomTipY}
                    stroke="#C8102E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Non-Breaking, Sized Boom Length Badge centered neatly along boom */}
                  <g transform={`translate(${(pivotX + boomTipX) / 2}, ${(pivotY + boomTipY) / 2 - 12})`}>
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="20"
                      rx="5"
                      fill="#FFFFFF"
                      stroke="#C8102E"
                      strokeWidth="1.5"
                      className="shadow-xs"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#C8102E"
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      Boom length {boomLength} m
                    </text>
                  </g>

                  {/* Obstacle box matching exact Step 2 values */}
                  {hasObstacle && (
                    <g>
                      <rect
                        x={obsX}
                        y={obsY}
                        width={obsW}
                        height={obsHPx}
                        fill="#D1D5DB"
                        stroke="#4B5563"
                        strokeWidth="1"
                      />
                      <text x={obsX + obsW / 2} y={obsY + obsHPx / 2 - 2} textAnchor="middle" fill="#374151" fontSize="7" fontWeight="bold">
                        Obstacle
                      </text>
                      <text x={obsX + obsW / 2} y={obsY + obsHPx / 2 + 8} textAnchor="middle" fill="#C8102E" fontSize="8" fontWeight="bold">
                        {obstacleH.toFixed(1)} m
                      </text>
                    </g>
                  )}

                  {/* Hanging Load Box matching exact Step 2 load weight */}
                  <line
                    x1={boomTipX}
                    y1={boomTipY}
                    x2={loadX}
                    y2={loadY}
                    stroke="#1F2937"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  <g transform={`translate(${loadX - 14}, ${loadY})`}>
                    <rect
                      x="0"
                      y="0"
                      width="28"
                      height="24"
                      rx="2"
                      fill="#FFFFFF"
                      stroke="#C8102E"
                      strokeWidth="1.5"
                    />
                    <text
                      x="14"
                      y="15"
                      textAnchor="middle"
                      fill="#C8102E"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {loadWeight} t
                    </text>
                  </g>

                  {/* Lifting Height Label on Right matching exact Step 2 lifting height */}
                  <line
                    x1={loadX + 30}
                    y1={groundY}
                    x2={loadX + 30}
                    y2={loadY}
                    stroke="#374151"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <polyline points={`${loadX + 28},${groundY - 4} ${loadX + 30},${groundY} ${loadX + 32},${groundY - 4}`} fill="none" stroke="#374151" />
                  <polyline points={`${loadX + 28},${loadY + 4} ${loadX + 30},${loadY} ${loadX + 32},${loadY + 4}`} fill="none" stroke="#374151" />
                  <text x={loadX + 36} y={(groundY + loadY) / 2 - 2} fill="#374151" fontSize="7" fontWeight="bold">
                    Lifting height
                  </text>
                  <text x={loadX + 36} y={(groundY + loadY) / 2 + 8} fill="#C8102E" fontSize="8.5" fontWeight="bold">
                    {liftH.toFixed(1)} m
                  </text>

                  {/* Dimensions A & B matching exact Step 2 values */}
                  <g transform="translate(0, 178)">
                    <text x={(pivotX + obsX) / 2} y="0" textAnchor="middle" fill="#111827" fontSize="7.5" fontWeight="bold">
                      A (Crane to obstacle)
                    </text>
                    <text x={(pivotX + obsX) / 2} y="9" textAnchor="middle" fill="#C8102E" fontSize="8.5" fontWeight="bold">
                      {distA.toFixed(1)} m
                    </text>

                    {hasObstacle && (
                      <>
                        <text x={(obsX + loadX) / 2} y="0" textAnchor="middle" fill="#111827" fontSize="7.5" fontWeight="bold">
                          B (Obstacle to load)
                        </text>
                        <text x={(obsX + loadX) / 2} y="9" textAnchor="middle" fill="#C8102E" fontSize="8.5" fontWeight="bold">
                          {distB.toFixed(1)} m
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Indicative price breakdown */}
          <div className="space-y-2.5 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-800">
                Indicative price breakdown
              </h3>
              <div
                title="This is a tentative pricing. Actual price will be given after review."
                className="inline-flex items-center space-x-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded cursor-pointer"
              >
                <Info className="w-3 h-3 text-amber-600" />
                <span>Tentative pricing</span>
              </div>
            </div>

            {/* Price Bifurcation: Removed Obstacle line, renamed Other services */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Base rate ({selectedCrane.name.split(" ")[2]} {selectedCrane.name.split(" ")[3]})</span>
                <span className="font-semibold text-gray-900">€{selectedCrane.baseRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Mobilization & demobilization</span>
                <span className="font-semibold text-gray-900">€{mobilizationCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Boom length adjustment ({boomLength} m)</span>
                <span className="font-semibold text-gray-900">€{boomAdjustmentCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Other services</span>
                <span className="font-semibold text-gray-900">€{otherServicesCost}</span>
              </div>
            </div>

            {/* Total (without excl. VAT) */}
            <div className="border-t border-gray-200 pt-3 mt-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-900 block">
                  Total personalized indicative price
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-[#C8102E]">
                  €{totalCalculatedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Tentative Pricing Notice Banner */}
            <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] font-medium leading-relaxed">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                This is tentative pricing. Actual price will be given after review by our engineering team.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-md hover:shadow-lg active:scale-98"
        >
          <span>Continue to review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modal */}
      {modalCrane && (
        <CraneDetailModal
          crane={modalCrane}
          onClose={() => setModalCrane(null)}
        />
      )}
    </div>
  );
};
