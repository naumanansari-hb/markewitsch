import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Compass,
  Ruler,
  ChevronDown,
} from "lucide-react";

interface Step2DirectPlannerProps {
  onBack: () => void;
  onNext: () => void;
  plannerData: any;
  setPlannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const Step2DirectPlanner: React.FC<Step2DirectPlannerProps> = ({
  onBack,
  onNext,
  plannerData,
  setPlannerData,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setPlannerData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Live input values from form
  const loadWeight = parseFloat(plannerData.loadWeight) || 12;
  const distA = Math.max(1, parseFloat(plannerData.distanceA) || 12.0);
  const distB = Math.max(1, parseFloat(plannerData.distanceB) || 8.0);
  const obstacleH = Math.max(0, parseFloat(plannerData.obstacleHeight) || 6.0);
  const liftH = Math.max(1, parseFloat(plannerData.liftingHeight) || 18.0);
  const boomAngle = Math.min(80, Math.max(10, parseFloat(plannerData.boomAngle) || 45));
  const hasObstacle = plannerData.hasObstacle !== false;

  // KPI Calculations
  const workingRadiusVal = (distA + (hasObstacle ? distB : 0)).toFixed(1);
  const angleRad = (boomAngle * Math.PI) / 180;
  const calculatedBoomLength = (
    parseFloat(workingRadiusVal) / Math.cos(angleRad)
  ).toFixed(1);
  const safetyClearance = Math.max(
    0.5,
    (
      distA * Math.tan(angleRad) -
      obstacleH
    ).toFixed(1) as any
  );

  // Slider track red fill percentage
  const sliderPercentage = ((boomAngle - 10) / (80 - 10)) * 100;

  // SVG Geometry Calculation Constants
  const groundY = 400;
  const pivotX = 120;
  const pivotY = 360;

  // Scaling factor: 1 meter = 12 SVG pixels
  const pxPerM = 12;

  // Dynamic pixel offsets based on inputs
  const distAPx = distA * pxPerM;
  const distBPx = (hasObstacle ? distB : 0) * pxPerM;
  const radiusPx = distAPx + distBPx;

  const obsX = pivotX + distAPx;
  const obsW = Math.max(40, Math.min(100, distBPx * 0.7));
  const obsHPx = obstacleH * pxPerM;
  const obsY = groundY - obsHPx;

  const loadX = pivotX + radiusPx;
  const liftHPx = liftH * pxPerM;
  const loadY = Math.max(40, groundY - liftHPx);

  // Boom Tip Position based on Radius and Angle
  const boomTipY = Math.max(30, pivotY - radiusPx * Math.tan(angleRad));
  const boomTipX = loadX;

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Lift details — Direct planner
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your lift parameters directly — see live crane geometry and calculated values update in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
          {/* Load weight */}
          <div
            onMouseEnter={() => setFocusedField("loadWeight")}
            onMouseLeave={() => setFocusedField((f) => (f === "loadWeight" ? null : f))}
            className={`p-2.5 rounded-lg border transition-all ${
              focusedField === "loadWeight"
                ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800">
                Load weight
              </label>
              {focusedField === "loadWeight" && (
                <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                  Highlighted in diagram
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={plannerData.loadWeight || 12}
                onFocus={() => setFocusedField("loadWeight")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("loadWeight", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#C8102E]">
                  <option value="t">t</option>
                  <option value="kg">kg</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Load dimensions (L x W x H) */}
          <div
            onMouseEnter={() => setFocusedField("dimensions")}
            onMouseLeave={() => setFocusedField((f) => (f === "dimensions" ? null : f))}
            className={`p-2.5 rounded-lg border transition-all ${
              focusedField === "dimensions"
                ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800">
                Load dimensions (L x W x H)
              </label>
              {focusedField === "dimensions" && (
                <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                  Highlighted in diagram
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={plannerData.dimL || "3.0"}
                onFocus={() => setFocusedField("dimensions")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("dimL", e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-center font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <span className="text-xs text-gray-900 font-bold">x</span>
              <input
                type="text"
                value={plannerData.dimW || "2.0"}
                onFocus={() => setFocusedField("dimensions")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("dimW", e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-center font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <span className="text-xs text-gray-900 font-bold">x</span>
              <input
                type="text"
                value={plannerData.dimH || "2.0"}
                onFocus={() => setFocusedField("dimensions")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("dimH", e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-center font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                  <option value="m">m</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Obstacle toggle */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Is there an obstacle in the lift path?
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleInputChange("hasObstacle", true)}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                  hasObstacle
                    ? "bg-[#C8102E] text-white border-[#C8102E]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("hasObstacle", false)}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                  !hasObstacle
                    ? "bg-[#C8102E] text-white border-[#C8102E]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Distance A */}
          <div
            onMouseEnter={() => setFocusedField("distanceA")}
            onMouseLeave={() => setFocusedField((f) => (f === "distanceA" ? null : f))}
            className={`p-2.5 rounded-lg border transition-all ${
              focusedField === "distanceA"
                ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800">
                Distance from crane to obstacle (A)
              </label>
              {focusedField === "distanceA" && (
                <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                  Highlighted in diagram
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                value={plannerData.distanceA || 12.0}
                onFocus={() => setFocusedField("distanceA")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("distanceA", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                  <option value="m">m</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Distance B */}
          {hasObstacle && (
            <div
              onMouseEnter={() => setFocusedField("distanceB")}
              onMouseLeave={() => setFocusedField((f) => (f === "distanceB" ? null : f))}
              className={`p-2.5 rounded-lg border transition-all ${
                focusedField === "distanceB"
                  ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-800">
                  Distance from obstacle to destination (B)
                </label>
                {focusedField === "distanceB" && (
                  <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                    Highlighted in diagram
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.5"
                  value={plannerData.distanceB || 8.0}
                  onFocus={() => setFocusedField("distanceB")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleInputChange("distanceB", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
                />
                <div className="relative shrink-0">
                  <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                    <option value="m">m</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Obstacle height */}
          {hasObstacle && (
            <div
              onMouseEnter={() => setFocusedField("obstacleHeight")}
              onMouseLeave={() => setFocusedField((f) => (f === "obstacleHeight" ? null : f))}
              className={`p-2.5 rounded-lg border transition-all ${
                focusedField === "obstacleHeight"
                  ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-gray-800">
                  Obstacle height
                </label>
                {focusedField === "obstacleHeight" && (
                  <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                    Highlighted in diagram
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.5"
                  value={plannerData.obstacleHeight || 6.0}
                  onFocus={() => setFocusedField("obstacleHeight")}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => handleInputChange("obstacleHeight", e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
                />
                <div className="relative shrink-0">
                  <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                    <option value="m">m</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* Lifting height */}
          <div
            onMouseEnter={() => setFocusedField("liftingHeight")}
            onMouseLeave={() => setFocusedField((f) => (f === "liftingHeight" ? null : f))}
            className={`p-2.5 rounded-lg border transition-all ${
              focusedField === "liftingHeight"
                ? "border-[#C8102E] bg-red-50/40 shadow-xs"
                : "border-transparent"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-800">
                Lifting height
              </label>
              {focusedField === "liftingHeight" && (
                <span className="text-[10px] font-bold text-[#C8102E] animate-pulse">
                  Highlighted in diagram
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                value={plannerData.liftingHeight || 18.0}
                onFocus={() => setFocusedField("liftingHeight")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("liftingHeight", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                  <option value="m">m</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Access minimum width */}
          <div
            onMouseEnter={() => setFocusedField("setup")}
            onMouseLeave={() => setFocusedField((f) => (f === "setup" ? null : f))}
          >
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Access minimum width
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                value={plannerData.accessWidth || 5.0}
                onFocus={() => setFocusedField("setup")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("accessWidth", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                  <option value="m">m</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Setup required area */}
          <div
            onMouseEnter={() => setFocusedField("setup")}
            onMouseLeave={() => setFocusedField((f) => (f === "setup" ? null : f))}
          >
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Setup required area (L x W)
            </label>
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={plannerData.setupL || "12.0"}
                onFocus={() => setFocusedField("setup")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("setupL", e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-center font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <span className="text-xs text-gray-900 font-bold">x</span>
              <input
                type="text"
                value={plannerData.setupW || "8.0"}
                onFocus={() => setFocusedField("setup")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("setupW", e.target.value)}
                className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg text-xs text-center font-semibold text-gray-900 focus:outline-none focus:border-[#C8102E]"
              />
              <div className="relative shrink-0">
                <select className="appearance-none pl-2.5 pr-7 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none">
                  <option value="m">m</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grounding / surface condition */}
          <div
            onMouseEnter={() => setFocusedField("ground")}
            onMouseLeave={() => setFocusedField((f) => (f === "ground" ? null : f))}
          >
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Grounding / surface condition
            </label>
            <div className="relative">
              <select
                value={plannerData.groundCondition || "Compacted gravel"}
                onFocus={() => setFocusedField("ground")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("groundCondition", e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 appearance-none focus:outline-none focus:border-[#C8102E]"
              >
                <option value="Compacted gravel">Compacted gravel</option>
                <option value="Concrete / Paved">Concrete / Paved</option>
                <option value="Firm gravel">Firm gravel</option>
                <option value="Soft ground / Mats required">Soft ground / Mats required</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Additional notes (optional)
            </label>
            <textarea
              rows={2}
              value={plannerData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Enter any additional information..."
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C8102E] resize-none"
            />
            <div className="text-right text-[10px] text-gray-400 mt-0.5">
              {(plannerData.notes || "").length} / 500
            </div>
          </div>

          {/* Boom angle adjustment slider */}
          <div
            onMouseEnter={() => setFocusedField("boomAngle")}
            onMouseLeave={() => setFocusedField((f) => (f === "boomAngle" ? null : f))}
            className={`pt-2 border-t border-gray-100 rounded-lg p-2 transition-all ${
              focusedField === "boomAngle" ? "bg-red-50/40 border border-[#C8102E]/60" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-800">
                  Boom angle adjustment
                </span>
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
              </div>
              <div className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-extrabold text-[#C8102E] text-center shadow-2xs">
                {boomAngle}°
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="text-[10px] font-semibold text-gray-400 mr-2">10°</span>
              <input
                type="range"
                min="10"
                max="80"
                value={boomAngle}
                onFocus={() => setFocusedField("boomAngle")}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => handleInputChange("boomAngle", e.target.value)}
                style={{
                  background: `linear-gradient(to right, #C8102E 0%, #C8102E ${sliderPercentage}%, #E5E7EB ${sliderPercentage}%, #E5E7EB 100%)`,
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#C8102E]"
              />
              <span className="text-[10px] font-semibold text-gray-400 ml-2">80°</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive 2D Crane Diagram (Fully Reactive to Left Form Inputs!) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs relative overflow-hidden">
            {/* Zoom Controls (Stacked Buttons in Top Right Corner) */}
            <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.15))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* SVG Diagram Canvas with Live Interactive Dynamic Scaling */}
            <div className="w-full h-[480px] flex items-center justify-center overflow-hidden bg-slate-50/50 rounded-lg p-2">
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300 origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <svg
                  viewBox="0 0 740 500"
                  className="w-full h-full overflow-visible"
                  fill="none"
                >
                  {/* Extended Bedrock Fill below ground so zoom out never shows empty gap */}
                  <rect
                    x="-2000"
                    y={groundY}
                    width="5000"
                    height="600"
                    fill="#F1F5F9"
                  />

                  {/* Extended Ground Level Line across entire horizon */}
                  <line
                    x1="-2000"
                    y1={groundY}
                    x2="3000"
                    y2={groundY}
                    stroke={focusedField === "ground" ? "#C8102E" : "#111827"}
                    strokeWidth={focusedField === "ground" ? "3" : "1.5"}
                    className="transition-colors duration-200"
                  />

                  {/* Extended Ground Diagonal Hatching */}
                  {Array.from({ length: 340 }).map((_, i) => (
                    <line
                      key={i}
                      x1={-1800 + i * 15}
                      y1={groundY}
                      x2={-1810 + i * 15}
                      y2={groundY + 12}
                      stroke={focusedField === "ground" ? "#C8102E" : "#94A3B8"}
                      strokeWidth="1"
                      className="transition-colors duration-200"
                    />
                  ))}

                  {/* Ground Foundation / Setup Area Highlight */}
                  {(focusedField === "setup" || focusedField === "ground") && (
                    <g className="animate-in fade-in duration-200">
                      <rect
                        x="20"
                        y={groundY - 6}
                        width="160"
                        height="12"
                        rx="3"
                        fill="#C8102E"
                        opacity="0.25"
                      />
                      <text
                        x="100"
                        y={groundY + 28}
                        textAnchor="middle"
                        fill="#C8102E"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        Setup area: {plannerData.setupL || "12.0"}m × {plannerData.setupW || "8.0"}m ({plannerData.groundCondition || "Compacted gravel"})
                      </text>
                    </g>
                  )}

                  {/* Crane Vehicle (Stationary Pivot at 120, 360) */}
                  <g
                    id="crane-truck"
                    transform="translate(30, 340)"
                    onMouseEnter={() => setFocusedField("setup")}
                    onMouseLeave={() => setFocusedField((f) => (f === "setup" ? null : f))}
                    className="cursor-pointer"
                  >
                    {/* Outrigger Cylinder Base */}
                    <rect
                      x="110"
                      y="30"
                      width="12"
                      height="30"
                      fill={focusedField === "setup" ? "#FEE2E2" : "#FFFFFF"}
                      stroke={focusedField === "setup" ? "#C8102E" : "#111827"}
                      strokeWidth={focusedField === "setup" ? "2" : "1.5"}
                    />
                    <rect x="105" y="58" width="22" height="4" fill={focusedField === "setup" ? "#C8102E" : "#111827"} />

                    {/* Truck Chassis */}
                    <path
                      d="M 10 32 L 10 18 L 35 18 L 45 32 Z"
                      fill="#FFFFFF"
                      stroke={focusedField === "setup" ? "#C8102E" : "#111827"}
                      strokeWidth={focusedField === "setup" ? "2" : "1.5"}
                    />
                    <rect
                      x="10"
                      y="32"
                      width="115"
                      height="18"
                      fill="#FFFFFF"
                      stroke={focusedField === "setup" ? "#C8102E" : "#111827"}
                      strokeWidth={focusedField === "setup" ? "2" : "1.5"}
                      rx="2"
                    />
                    <path d="M 15 28 L 15 22 L 32 22 L 38 28 Z" fill="#FFFFFF" stroke="#111827" strokeWidth="1.2" />

                    {/* 4 Wheels */}
                    <circle cx="30" cy="50" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                    <circle cx="30" cy="50" r="5" fill="#111827" />

                    <circle cx="52" cy="50" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                    <circle cx="52" cy="50" r="5" fill="#111827" />

                    <circle cx="74" cy="50" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                    <circle cx="74" cy="50" r="5" fill="#111827" />

                    <circle cx="96" cy="50" r="10" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                    <circle cx="96" cy="50" r="5" fill="#111827" />

                    {/* Turntable Base */}
                    <rect x="70" y="24" width="30" height="8" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />
                  </g>

                  {/* Dynamic Interactive Boom, Obstacle, and Load Rigging */}
                  <g>
                    {/* Angle Arc Indicator with Dashed Line */}
                    <g
                      onMouseEnter={() => setFocusedField("boomAngle")}
                      onMouseLeave={() => setFocusedField((f) => (f === "boomAngle" ? null : f))}
                      className="cursor-pointer"
                    >
                      <path
                        d={`M ${pivotX + 80} ${pivotY} A 80 80 0 0 0 ${
                          pivotX + 80 * Math.cos(angleRad)
                        } ${pivotY - 80 * Math.sin(angleRad)}`}
                        fill="none"
                        stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                        strokeWidth={focusedField === "boomAngle" ? "2.5" : "1.2"}
                        strokeDasharray={focusedField === "boomAngle" ? "none" : "4 3"}
                        className="transition-all duration-200"
                      />
                      {focusedField === "boomAngle" && (
                        <circle
                          cx={pivotX + 98 * Math.cos(angleRad / 2)}
                          cy={pivotY - 98 * Math.sin(angleRad / 2)}
                          r="16"
                          fill="#FEE2E2"
                          stroke="#C8102E"
                          strokeWidth="1.5"
                        />
                      )}
                      <text
                        x={pivotX + 98 * Math.cos(angleRad / 2)}
                        y={pivotY - 98 * Math.sin(angleRad / 2) + 4}
                        textAnchor="middle"
                        fill="#C8102E"
                        fontSize={focusedField === "boomAngle" ? "16" : "14"}
                        fontWeight="bold"
                      >
                        {boomAngle}°
                      </text>
                    </g>

                    {/* Hydraulic Ram Cylinder */}
                    <line
                      x1={pivotX + 30}
                      y1={pivotY}
                      x2={pivotX + 60 * Math.cos(angleRad)}
                      y2={pivotY - 60 * Math.sin(angleRad)}
                      stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                      strokeWidth="4"
                    />

                    {/* Dynamic Telescopic Boom Line extending to boomTipX, boomTipY */}
                    <line
                      x1={pivotX}
                      y1={pivotY}
                      x2={boomTipX}
                      y2={boomTipY}
                      stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                      strokeWidth={focusedField === "boomAngle" ? "10" : "8"}
                      strokeLinecap="square"
                      className="transition-all duration-200"
                    />
                    <line
                      x1={pivotX}
                      y1={pivotY}
                      x2={boomTipX}
                      y2={boomTipY}
                      stroke="#FFFFFF"
                      strokeWidth="5"
                      strokeLinecap="square"
                    />
                    
                    {/* Telescopic Collar Sections */}
                    <rect
                      x={pivotX + 120 * Math.cos(angleRad) - 6}
                      y={pivotY - 120 * Math.sin(angleRad) - 6}
                      width="12"
                      height="12"
                      fill="#FFFFFF"
                      stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                      strokeWidth="1.5"
                    />
                    <rect
                      x={pivotX + 240 * Math.cos(angleRad) - 5}
                      y={pivotY - 240 * Math.sin(angleRad) - 5}
                      width="10"
                      height="10"
                      fill="#FFFFFF"
                      stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                      strokeWidth="1.5"
                    />

                    {/* Lattice Boom Tip */}
                    <polygon
                      points={`${boomTipX - 12},${boomTipY + 6} ${boomTipX},${boomTipY} ${boomTipX - 6},${boomTipY - 12}`}
                      fill="#FFFFFF"
                      stroke={focusedField === "boomAngle" ? "#C8102E" : "#111827"}
                      strokeWidth="1.5"
                    />

                    {/* Pulley Sheave */}
                    <circle cx={boomTipX} cy={boomTipY} r="4" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />

                    {/* Vertical Cable dropping dynamically from boom tip to load Y */}
                    <line
                      x1={boomTipX}
                      y1={boomTipY}
                      x2={loadX}
                      y2={loadY}
                      stroke="#111827"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />

                    {/* Hook Block */}
                    <circle cx={loadX} cy={loadY} r="6" fill="#FFFFFF" stroke="#111827" strokeWidth="1.5" />

                    {/* Load Rigging Lines */}
                    <line x1={loadX} y1={loadY + 6} x2={loadX - 30} y2={loadY + 30} stroke="#111827" strokeWidth="1.2" />
                    <line x1={loadX} y1={loadY + 6} x2={loadX + 30} y2={loadY + 30} stroke="#111827" strokeWidth="1.2" />

                    {/* Red Load Box — Highlights without any text cropping */}
                    <g
                      transform={`translate(${loadX - 37}, ${loadY + 30})`}
                      onMouseEnter={() => setFocusedField("loadWeight")}
                      onMouseLeave={() => setFocusedField((f) => (f === "loadWeight" ? null : f))}
                      className="cursor-pointer"
                    >
                      {/* Pulsing highlight aura when active */}
                      {(focusedField === "loadWeight" || focusedField === "dimensions") && (
                        <rect
                          x="-6"
                          y="-6"
                          width="86"
                          height="76"
                          rx="8"
                          fill="#FEE2E2"
                          stroke="#C8102E"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          className="animate-pulse"
                        />
                      )}

                      <rect
                        x="0"
                        y="0"
                        width="74"
                        height="64"
                        rx="4"
                        fill={focusedField === "loadWeight" || focusedField === "dimensions" ? "#FEF2F2" : "#FFFFFF"}
                        stroke="#C8102E"
                        strokeWidth={focusedField === "loadWeight" || focusedField === "dimensions" ? "3" : "2"}
                        className="transition-all duration-200"
                      />
                      <text
                        x="37"
                        y="38"
                        textAnchor="middle"
                        fill="#C8102E"
                        fontSize="16"
                        fontWeight="extrabold"
                      >
                        {loadWeight} t
                      </text>

                      {/* Dimension Badge below Load Box — Full width, never cropped */}
                      {focusedField === "dimensions" && (
                        <g transform="translate(37, 82)">
                          <rect
                            x="-70"
                            y="-11"
                            width="140"
                            height="22"
                            rx="5"
                            fill="#FFFFFF"
                            stroke="#C8102E"
                            strokeWidth="1.5"
                            className="shadow-sm"
                          />
                          <text
                            x="0"
                            y="4"
                            textAnchor="middle"
                            fill="#C8102E"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            {plannerData.dimL || "3.0"}m × {plannerData.dimW || "2.0"}m × {plannerData.dimH || "2.0"}m
                          </text>
                        </g>
                      )}
                    </g>

                    {/* Dynamic Obstacle Box (Hatched Rect matching form input height & distance A) */}
                    {hasObstacle && (
                      <g
                        onMouseEnter={() => setFocusedField("obstacleHeight")}
                        onMouseLeave={() => setFocusedField((f) => (f === "obstacleHeight" ? null : f))}
                        className="cursor-pointer"
                      >
                        <defs>
                          <pattern
                            id="obs-hatch"
                            width="8"
                            height="8"
                            patternTransform="rotate(45 0 0)"
                            patternUnits="userSpaceOnUse"
                          >
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="8"
                              stroke={focusedField === "obstacleHeight" ? "#C8102E" : "#4B5563"}
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>

                        {/* Obstacle highlight halo */}
                        {focusedField === "obstacleHeight" && (
                          <rect
                            x={obsX - 4}
                            y={obsY - 4}
                            width={obsW + 8}
                            height={obsHPx + 8}
                            rx="4"
                            fill="#FEE2E2"
                            opacity="0.5"
                          />
                        )}

                        <rect
                          x={obsX}
                          y={obsY}
                          width={obsW}
                          height={obsHPx}
                          fill="url(#obs-hatch)"
                          stroke={focusedField === "obstacleHeight" ? "#C8102E" : "#111827"}
                          strokeWidth={focusedField === "obstacleHeight" ? "2.5" : "1.5"}
                          className="transition-all duration-200"
                        />

                        {/* Obstacle Height Dimension Arrows & Text */}
                        <line
                          x1={obsX + obsW + 25}
                          y1={groundY}
                          x2={obsX + obsW + 25}
                          y2={obsY}
                          stroke={focusedField === "obstacleHeight" ? "#C8102E" : "#111827"}
                          strokeWidth={focusedField === "obstacleHeight" ? "2" : "1"}
                        />
                        <polyline
                          points={`${obsX + obsW + 22},${groundY - 6} ${obsX + obsW + 25},${groundY} ${obsX + obsW + 28},${groundY - 6}`}
                          fill="none"
                          stroke={focusedField === "obstacleHeight" ? "#C8102E" : "#111827"}
                          strokeWidth={focusedField === "obstacleHeight" ? "2" : "1"}
                        />
                        <polyline
                          points={`${obsX + obsW + 22},${obsY + 6} ${obsX + obsW + 25},${obsY} ${obsX + obsW + 28},${obsY + 6}`}
                          fill="none"
                          stroke={focusedField === "obstacleHeight" ? "#C8102E" : "#111827"}
                          strokeWidth={focusedField === "obstacleHeight" ? "2" : "1"}
                        />

                        {focusedField === "obstacleHeight" ? (
                          <g transform={`translate(${obsX + obsW + 28}, ${obsY + obsHPx / 2 - 11})`}>
                            <rect
                              x="0"
                              y="0"
                              width="60"
                              height="22"
                              rx="4"
                              fill="#FEE2E2"
                              stroke="#C8102E"
                              strokeWidth="1.2"
                            />
                            <text
                              x="30"
                              y="15"
                              textAnchor="middle"
                              fill="#C8102E"
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {obstacleH.toFixed(1)} m
                            </text>
                          </g>
                        ) : (
                          <text
                            x={obsX + obsW + 35}
                            y={obsY + obsHPx / 2 + 4}
                            fill="#111827"
                            fontSize="13"
                            fontWeight="bold"
                          >
                            {obstacleH.toFixed(1)} m
                          </text>
                        )}
                      </g>
                    )}

                    {/* Lifting Height Dimension (Right Side - Dynamic to liftingHeight, nicely padded) */}
                    <g
                      transform="translate(635, 0)"
                      onMouseEnter={() => setFocusedField("liftingHeight")}
                      onMouseLeave={() => setFocusedField((f) => (f === "liftingHeight" ? null : f))}
                      className="cursor-pointer"
                    >
                      <line
                        x1="0"
                        y1={groundY}
                        x2="0"
                        y2={loadY}
                        stroke={focusedField === "liftingHeight" ? "#C8102E" : "#111827"}
                        strokeWidth={focusedField === "liftingHeight" ? "2" : "1"}
                        strokeDasharray={focusedField === "liftingHeight" ? "none" : "3 3"}
                        className="transition-all duration-200"
                      />
                      <polyline
                        points="-3,394 0,400 3,394"
                        fill="none"
                        stroke={focusedField === "liftingHeight" ? "#C8102E" : "#111827"}
                        strokeWidth={focusedField === "liftingHeight" ? "2" : "1"}
                      />
                      <polyline
                        points={`-3,${loadY + 6} 0,${loadY} 3,${loadY + 6}`}
                        fill="none"
                        stroke={focusedField === "liftingHeight" ? "#C8102E" : "#111827"}
                        strokeWidth={focusedField === "liftingHeight" ? "2" : "1"}
                      />

                      {focusedField === "liftingHeight" ? (
                        <g transform={`translate(6, ${(groundY + loadY) / 2 - 11})`}>
                          <rect
                            x="0"
                            y="0"
                            width="64"
                            height="22"
                            rx="4"
                            fill="#FEE2E2"
                            stroke="#C8102E"
                            strokeWidth="1.2"
                          />
                          <text
                            x="32"
                            y="15"
                            textAnchor="middle"
                            fill="#C8102E"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {liftH.toFixed(1)} m
                          </text>
                        </g>
                      ) : (
                        <text
                          x="10"
                          y={(groundY + loadY) / 2 + 4}
                          fill="#111827"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {liftH.toFixed(1)} m
                        </text>
                      )}
                    </g>

                    {/* Bottom Dimensions A & B with dynamic positioning & highlighting */}
                    <g transform="translate(0, 440)">
                      {/* Dimension A */}
                      <g
                        onMouseEnter={() => setFocusedField("distanceA")}
                        onMouseLeave={() => setFocusedField((f) => (f === "distanceA" ? null : f))}
                        className="cursor-pointer"
                      >
                        {focusedField === "distanceA" && (
                          <rect
                            x={pivotX + 15}
                            y="-18"
                            width={Math.max(40, obsX - (pivotX + 15))}
                            height="40"
                            rx="6"
                            fill="#FEE2E2"
                            opacity="0.6"
                          />
                        )}

                        <line
                          x1={pivotX + 20}
                          y1="0"
                          x2={obsX}
                          y2="0"
                          stroke={focusedField === "distanceA" ? "#C8102E" : "#111827"}
                          strokeWidth={focusedField === "distanceA" ? "2" : "1.2"}
                        />
                        <line x1={pivotX + 20} y1="-6" x2={pivotX + 20} y2="6" stroke={focusedField === "distanceA" ? "#C8102E" : "#111827"} strokeWidth="1.2" />
                        <line x1={obsX} y1="-6" x2={obsX} y2="6" stroke={focusedField === "distanceA" ? "#C8102E" : "#111827"} strokeWidth="1.2" />
                        <polyline points={`${pivotX + 26},-3 ${pivotX + 20},0 ${pivotX + 26},3`} fill="none" stroke={focusedField === "distanceA" ? "#C8102E" : "#111827"} />
                        <polyline points={`${obsX - 6},-3 ${obsX},0 ${obsX - 6},3`} fill="none" stroke={focusedField === "distanceA" ? "#C8102E" : "#111827"} />
                        <text
                          x={(pivotX + 20 + obsX) / 2}
                          y="-8"
                          textAnchor="middle"
                          fill={focusedField === "distanceA" ? "#C8102E" : "#111827"}
                          fontSize="12"
                          fontWeight="bold"
                        >
                          A
                        </text>
                        <text
                          x={(pivotX + 20 + obsX) / 2}
                          y="16"
                          textAnchor="middle"
                          fill={focusedField === "distanceA" ? "#C8102E" : "#111827"}
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {distA.toFixed(1)} m
                        </text>
                      </g>

                      {/* Dimension B */}
                      {hasObstacle && (
                        <g
                          onMouseEnter={() => setFocusedField("distanceB")}
                          onMouseLeave={() => setFocusedField((f) => (f === "distanceB" ? null : f))}
                          className="cursor-pointer"
                        >
                          {focusedField === "distanceB" && (
                            <rect
                              x={obsX}
                              y="-18"
                              width={Math.max(40, loadX - obsX)}
                              height="40"
                              rx="6"
                              fill="#FEE2E2"
                              opacity="0.6"
                            />
                          )}

                          <line
                            x1={obsX}
                            y1="0"
                            x2={loadX}
                            y2="0"
                            stroke={focusedField === "distanceB" ? "#C8102E" : "#111827"}
                            strokeWidth={focusedField === "distanceB" ? "2" : "1.2"}
                          />
                          <line x1={obsX} y1="-6" x2={obsX} y2="6" stroke={focusedField === "distanceB" ? "#C8102E" : "#111827"} strokeWidth="1.2" />
                          <line x1={loadX} y1="-6" x2={loadX} y2="6" stroke={focusedField === "distanceB" ? "#C8102E" : "#111827"} strokeWidth="1.2" />
                          <polyline points={`${obsX + 6},-3 ${obsX},0 ${obsX + 6},3`} fill="none" stroke={focusedField === "distanceB" ? "#C8102E" : "#111827"} />
                          <polyline points={`${loadX - 6},-3 ${loadX},0 ${loadX - 6},3`} fill="none" stroke={focusedField === "distanceB" ? "#C8102E" : "#111827"} />
                          <text
                            x={(obsX + loadX) / 2}
                            y="-8"
                            textAnchor="middle"
                            fill={focusedField === "distanceB" ? "#C8102E" : "#111827"}
                            fontSize="12"
                            fontWeight="bold"
                          >
                            B
                          </text>
                          <text
                            x={(obsX + loadX) / 2}
                            y="16"
                            textAnchor="middle"
                            fill={focusedField === "distanceB" ? "#C8102E" : "#111827"}
                            fontSize="13"
                            fontWeight="bold"
                          >
                            {distB.toFixed(1)} m
                          </text>
                        </g>
                      )}
                    </g>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom KPI Metrics Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50/60 rounded-xl border border-red-100 p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 block">Working radius</span>
                <span className="text-base font-extrabold text-gray-900">{workingRadiusVal} m</span>
              </div>
            </div>

            <div className="bg-red-50/60 rounded-xl border border-red-100 p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 block">Boom length</span>
                <span className="text-base font-extrabold text-gray-900">{calculatedBoomLength} m</span>
              </div>
            </div>

            <div className="bg-red-50/60 rounded-xl border border-red-100 p-3.5 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-gray-500 block">Safety clearance</span>
                <span className="text-base font-extrabold text-gray-900">{safetyClearance} m</span>
              </div>
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
          <span>See crane options</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
