import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  MapPin,
  AlertTriangle,
  Ruler,
  RotateCcw,
  Plus,
  Minus,
  Crosshair,
  ShieldCheck,
  Edit2,
  Info,
  Move,
} from "lucide-react";
import duisburgMapImg from "../../../assets/duisburg_map.jpg";

interface Step2MapPlannerProps {
  onBack: () => void;
  onNext: () => void;
  plannerData: any;
  setPlannerData: React.Dispatch<React.SetStateAction<any>>;
}

export const Step2MapPlanner: React.FC<Step2MapPlannerProps> = ({
  onBack,
  onNext,
  plannerData,
  setPlannerData,
}) => {
  // Active placement tool
  const [activeTool, setActiveTool] = useState<"crane" | "pick" | "drop" | "obstacle" | "measure">("crane");

  // Map elements interactive coordinates
  const [cranePos, setCranePos] = useState({ x: 180, y: 320 });
  const [pickPos, setPickPos] = useState({ x: 90, y: 220 });
  const [dropPos, setDropPos] = useState({ x: 560, y: 150 });
  const [obstaclePos, setObstaclePos] = useState({ x: 380, y: 210 });
  const [craneAngle, setCraneAngle] = useState(-25);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // 1 pixel on this map ≈ 0.12 meters
  const pxToMeters = (px: number) => Math.round(px * 0.115 * 10) / 10;

  // Calculate live geometric distances from map coordinates
  const distA_px = Math.hypot(obstaclePos.x - cranePos.x, obstaclePos.y - cranePos.y);
  const distB_px = Math.hypot(dropPos.x - obstaclePos.x, dropPos.y - obstaclePos.y);

  const distA_m = pxToMeters(distA_px);
  const distB_m = pxToMeters(distB_px);
  const liftH_m = parseFloat(plannerData.liftingHeight) || 12.0;

  const totalRadius_m = distA_m + distB_m;
  const reqBoomLength_m = Math.round(Math.hypot(totalRadius_m, liftH_m) * 1.12 * 10) / 10;
  const reqBoomAngle_deg = Math.round(Math.atan2(liftH_m, totalRadius_m) * (180 / Math.PI) * 10) / 10;

  // Sync calculated map measurements back into plannerData
  useEffect(() => {
    setPlannerData((prev: any) => ({
      ...prev,
      distanceA: distA_m.toString(),
      distanceB: distB_m.toString(),
      liftingHeight: (prev.liftingHeight || "12.0").toString(),
      boomAngle: reqBoomAngle_deg.toString(),
      hasObstacle: true,
      obstacleHeight: prev.obstacleHeight || "10.0",
    }));
  }, [distA_m, distB_m, reqBoomAngle_deg, setPlannerData]);

  const handleInputChange = (field: string, value: any) => {
    setPlannerData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Handle map click to place active element
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Keep within bounds
    const boundedX = Math.max(30, Math.min(rect.width - 30, x));
    const boundedY = Math.max(30, Math.min(rect.height - 30, y));

    if (activeTool === "crane") {
      setCranePos({ x: boundedX, y: boundedY });
      // Calculate angle towards obstacle or drop
      const angle = Math.atan2(obstaclePos.y - boundedY, obstaclePos.x - boundedX) * (180 / Math.PI);
      setCraneAngle(Math.round(angle));
    } else if (activeTool === "pick") {
      setPickPos({ x: boundedX, y: boundedY });
    } else if (activeTool === "drop") {
      setDropPos({ x: boundedX, y: boundedY });
    } else if (activeTool === "obstacle") {
      setObstaclePos({ x: boundedX, y: boundedY });
    }
  };

  const toolLabels = {
    crane: "Click anywhere on the map to place the Crane",
    pick: "Click anywhere on the map to set the Pick Point",
    drop: "Click anywhere on the map to set the Drop Point",
    obstacle: "Click anywhere on the map to reposition the Obstacle",
    measure: "Interactive map distance measurement active",
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <div className="mb-5">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Map-based lift planner
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Place crane, load points, and obstacles directly on the satellite map to automatically calculate lift geometry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Area: Satellite Map Canvas with Toolbar */}
        <div className="lg:col-span-8 space-y-3">
          {/* Map Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-2xs flex flex-wrap items-center justify-between gap-1 text-xs font-semibold">
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTool("crane")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeTool === "crane"
                    ? "border-[#C8102E] text-[#C8102E] bg-red-50 font-bold shadow-2xs"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Place crane</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("pick")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeTool === "pick"
                    ? "border-emerald-600 text-emerald-700 bg-emerald-50 font-bold shadow-2xs"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pick point</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("drop")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeTool === "drop"
                    ? "border-[#C8102E] text-[#C8102E] bg-red-50 font-bold shadow-2xs"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                <span>Drop point</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("obstacle")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeTool === "obstacle"
                    ? "border-amber-600 text-amber-700 bg-amber-50 font-bold shadow-2xs"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Add obstacle</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool("measure")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                  activeTool === "measure"
                    ? "border-blue-600 text-blue-700 bg-blue-50 font-bold shadow-2xs"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Measure / annotate</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setCranePos({ x: 180, y: 320 });
                setPickPos({ x: 90, y: 220 });
                setDropPos({ x: 560, y: 150 });
                setObstaclePos({ x: 380, y: 210 });
                setCraneAngle(-25);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset plan</span>
            </button>
          </div>

          {/* Interactive Map View Container */}
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            className="relative rounded-xl overflow-hidden border border-gray-300 h-[540px] bg-slate-900 shadow-inner group cursor-crosshair select-none"
          >
            {/* Background Satellite Map Image */}
            <img
              src={duisburgMapImg}
              alt="Satellite map view"
              className="w-full h-full object-cover transition-transform duration-300 pointer-events-none"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Instruction Tooltip Banner */}
            <div className="absolute top-3 left-3 z-30 bg-gray-900/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-md flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
              <span>{toolLabels[activeTool]}</span>
            </div>

            {/* Canvas Overlay Layer for Interactive Paths & Dimensions */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Path from Pick -> Crane */}
              <line
                x1={pickPos.x}
                y1={pickPos.y}
                x2={cranePos.x}
                y2={cranePos.y}
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Path from Crane -> Obstacle */}
              <line
                x1={cranePos.x}
                y1={cranePos.y}
                x2={obstaclePos.x}
                y2={obstaclePos.y}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Path from Obstacle -> Drop */}
              <line
                x1={obstaclePos.x}
                y1={obstaclePos.y}
                x2={dropPos.x}
                y2={dropPos.y}
                stroke="#EF4444"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Live Distance A Badge (Crane to Obstacle) */}
              <g transform={`translate(${(cranePos.x + obstaclePos.x) / 2}, ${(cranePos.y + obstaclePos.y) / 2 - 12})`}>
                <rect x="-34" y="-12" width="68" height="24" rx="6" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" opacity="0.95" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  A: {distA_m} m
                </text>
              </g>

              {/* Live Distance B Badge (Obstacle to Drop) */}
              <g transform={`translate(${(obstaclePos.x + dropPos.x) / 2}, ${(obstaclePos.y + dropPos.y) / 2 - 12})`}>
                <rect x="-34" y="-12" width="68" height="24" rx="6" fill="#0F172A" stroke="#EF4444" strokeWidth="1.5" opacity="0.95" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                  B: {distB_m} m
                </text>
              </g>

              {/* Obstacle Shaded Boundary around Obstacle Position */}
              <g transform={`translate(${obstaclePos.x}, ${obstaclePos.y})`}>
                <polygon
                  points="-45,-25 45,-35 55,25 -40,35"
                  fill="rgba(220, 38, 38, 0.4)"
                  stroke="#EF4444"
                  strokeWidth="2"
                />
                <rect x="-42" y="-14" width="84" height="28" rx="5" fill="#7F1D1D" stroke="#EF4444" strokeWidth="1" opacity="0.95" />
                <text x="0" y="-1" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">
                  ⚠️ Obstacle
                </text>
                <text x="0" y="9" textAnchor="middle" fill="#FECACA" fontSize="8.5" fontWeight="semibold">
                  H: {plannerData.obstacleHeight || "10.0"} m
                </text>
              </g>
            </svg>

            {/* Interactive Elements Overlay */}
            {/* Green Pick Point Marker */}
            <div
              style={{ left: `${pickPos.x}px`, top: `${pickPos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1.5 cursor-pointer z-20 hover:scale-110 transition-transform"
            >
              <div className="bg-emerald-600 text-white p-2 rounded-full shadow-xl border-2 border-white ring-2 ring-emerald-500/50 animate-bounce">
                <MapPin className="w-4 h-4 fill-current" />
              </div>
              <span className="bg-emerald-950/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/60 shadow-md pointer-events-none">
                Pick point
              </span>
            </div>

            {/* Red Drop Point Marker */}
            <div
              style={{ left: `${dropPos.x}px`, top: `${dropPos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center space-x-1.5 cursor-pointer z-20 hover:scale-110 transition-transform"
            >
              <div className="bg-[#C8102E] text-white p-2 rounded-full shadow-xl border-2 border-white ring-2 ring-red-500/50 animate-bounce">
                <MapPin className="w-4 h-4 fill-current" />
              </div>
              <span className="bg-red-950/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-red-500/60 shadow-md pointer-events-none">
                Drop point
              </span>
            </div>

            {/* Crane Truck Unit */}
            <div
              className="absolute z-30 transition-transform duration-200"
              style={{
                left: `${cranePos.x}px`,
                top: `${cranePos.y}px`,
                transform: `translate(-50%, -50%) rotate(${craneAngle}deg)`,
              }}
            >
              <div className="relative p-2.5 border-2 border-white bg-slate-950/80 rounded-lg backdrop-blur-xs shadow-2xl group/crane ring-2 ring-[#C8102E]">
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white rounded-xs shadow-xs" />
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-xs shadow-xs" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white rounded-xs shadow-xs" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-xs shadow-xs" />

                <div className="flex items-center space-x-1.5 text-white">
                  <div className="w-14 h-7 bg-[#C8102E] rounded-sm flex items-center justify-center font-extrabold text-[10px] border border-white tracking-wider">
                    CRANE
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full border border-gray-400" />
                </div>
              </div>
            </div>

            {/* Map Scale Bar */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-3 py-1 rounded-md border border-white/20 flex flex-col items-center z-10">
              <div className="w-16 h-1 border-b-2 border-x-2 border-white mb-0.5" />
              <span>20 m</span>
            </div>

            {/* Zoom & Center Controls */}
            <div className="absolute bottom-4 left-4 flex flex-col space-y-1.5 z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((z) => Math.min(1.8, z + 0.15));
                }}
                className="w-8 h-8 rounded-lg bg-white/95 text-gray-800 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel((z) => Math.max(0.8, z - 0.15));
                }}
                className="w-8 h-8 rounded-lg bg-white/95 text-gray-800 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomLevel(1);
                }}
                className="w-8 h-8 rounded-lg bg-white/95 text-gray-800 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                title="Reset Zoom"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Technical Details & Plan */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Technical details & plan</h2>
          </div>

          {/* Legends (Not checkboxes) explaining that Blue highlighted fields are measured from map */}
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-blue-900 font-bold">
              <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200 shrink-0" />
              <span>Blue highlighted fields: <em>Measured from map</em></span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600 text-[11px] font-medium pl-5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gray-200 border border-gray-300 shrink-0" />
              <span>Standard fields: Manual inputs</span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Load weight */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Load weight</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={plannerData.loadWeight || "12"}
                  onChange={(e) => handleInputChange("loadWeight", e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-gray-900 text-right"
                />
                <span className="text-xs text-gray-500 font-semibold">t</span>
              </div>
            </div>

            {/* Load dimensions */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Load dimensions (L x W x H)</label>
              <div className="flex items-center space-x-1 text-xs">
                <input
                  type="text"
                  value={plannerData.dimL || "4.0"}
                  onChange={(e) => handleInputChange("dimL", e.target.value)}
                  className="w-10 px-1 py-1 bg-gray-50 border border-gray-200 rounded-md text-center font-semibold"
                />
                <span>x</span>
                <input
                  type="text"
                  value={plannerData.dimW || "2.2"}
                  onChange={(e) => handleInputChange("dimW", e.target.value)}
                  className="w-10 px-1 py-1 bg-gray-50 border border-gray-200 rounded-md text-center font-semibold"
                />
                <span>x</span>
                <input
                  type="text"
                  value={plannerData.dimH || "2.5"}
                  onChange={(e) => handleInputChange("dimH", e.target.value)}
                  className="w-10 px-1 py-1 bg-gray-50 border border-gray-200 rounded-md text-center font-semibold"
                />
                <span className="text-gray-500 font-semibold">m</span>
              </div>
            </div>

            {/* Obstacle toggle */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Is there an obstacle in lift path?</label>
              <div className="flex items-center space-x-3 text-xs">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="obs_map"
                    checked={plannerData.hasObstacle !== false}
                    onChange={() => handleInputChange("hasObstacle", true)}
                    className="text-[#C8102E]"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="radio"
                    name="obs_map"
                    checked={plannerData.hasObstacle === false}
                    onChange={() => handleInputChange("hasObstacle", false)}
                    className="text-[#C8102E]"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Distance A (Measured from Map) */}
            <div className="flex items-center justify-between bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
              <div>
                <label className="text-xs font-bold text-blue-950 block">
                  Distance crane to obstacle (A)
                </label>
                <span className="text-[10px] text-blue-700 font-medium">Live from map position</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {distA_m} m
                </span>
              </div>
            </div>

            {/* Distance B (Measured from Map) */}
            <div className="flex items-center justify-between bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
              <div>
                <label className="text-xs font-bold text-blue-950 block">
                  Distance obstacle to load (B)
                </label>
                <span className="text-[10px] text-blue-700 font-medium">Live from map position</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs">
                  {distB_m} m
                </span>
              </div>
            </div>

            {/* Obstacle height */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Obstacle height</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={plannerData.obstacleHeight || "10.0"}
                  onChange={(e) => handleInputChange("obstacleHeight", e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-gray-900 text-right"
                />
                <span className="text-xs text-gray-500 font-semibold">m</span>
              </div>
            </div>

            {/* Lifting height */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Lifting height (ground to hook)</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={plannerData.liftingHeight || "12.0"}
                  onChange={(e) => handleInputChange("liftingHeight", e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-gray-900 text-right"
                />
                <span className="text-xs text-gray-500 font-semibold">m</span>
              </div>
            </div>

            {/* Calculated values highlight (Measured from Map) */}
            <div className="flex items-center justify-between bg-blue-50/90 p-2.5 rounded-lg border border-blue-200">
              <label className="text-xs font-bold text-blue-950">Boom length (min. required)</label>
              <span className="text-xs font-extrabold text-[#C8102E]">{reqBoomLength_m} m</span>
            </div>

            <div className="flex items-center justify-between bg-blue-50/90 p-2.5 rounded-lg border border-blue-200">
              <label className="text-xs font-bold text-blue-950">Boom angle (at min. radius)</label>
              <span className="text-xs font-extrabold text-[#C8102E]">{reqBoomAngle_deg} °</span>
            </div>

            {/* Access minimum width */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Access minimum width</label>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={plannerData.accessWidth || "6.0"}
                  onChange={(e) => handleInputChange("accessWidth", e.target.value)}
                  className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-gray-900 text-right"
                />
                <span className="text-xs text-gray-500 font-semibold">m</span>
              </div>
            </div>

            {/* Setup required area */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-700">Setup required area (L x W)</label>
              <div className="flex items-center space-x-1 text-xs">
                <input
                  type="text"
                  value={plannerData.setupL || "9.5"}
                  onChange={(e) => handleInputChange("setupL", e.target.value)}
                  className="w-10 px-1 py-1 bg-gray-50 border border-gray-200 rounded-md text-center font-semibold"
                />
                <span>x</span>
                <input
                  type="text"
                  value={plannerData.setupW || "8.0"}
                  onChange={(e) => handleInputChange("setupW", e.target.value)}
                  className="w-10 px-1 py-1 bg-gray-50 border border-gray-200 rounded-md text-center font-semibold"
                />
                <span className="text-gray-500 font-semibold">m²</span>
              </div>
            </div>

            {/* Grounding / surface condition */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Grounding / surface condition
              </label>
              <select
                value={plannerData.groundCondition || "Compacted gravel"}
                onChange={(e) => handleInputChange("groundCondition", e.target.value)}
                className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none"
              >
                <option value="Firm gravel">Firm gravel</option>
                <option value="Compacted gravel">Compacted gravel</option>
                <option value="Concrete / Paved">Concrete / Paved</option>
                <option value="Asphalt road">Asphalt road</option>
              </select>
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

        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Map measurements calculated dynamically. Verify on site before final execution.</span>
        </div>

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
