import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  User,
  MapPin,
  Search,
  X,
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Plus,
  ArrowRight,
  ArrowLeft,
  Layers,
  ChevronDown,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import duisburgMapImg from "../../../assets/duisburg_map.jpg";

interface Step1Props {
  onNext: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

// Helper: parse "HH:MM" to total minutes
const timeToMinutes = (t: string): number => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

// Helper: minutes → "X hrs" or "Xh Ym"
const minutesToLabel = (mins: number): string => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hrs`;
};

// Helper: format ISO date to "Mon, 24 Aug 2026"
const formatFullDate = (iso: string): string => {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

export const Step1TellUsAboutJob: React.FC<Step1Props> = ({
  onNext,
  formData,
  setFormData,
}) => {
  const [hoursMode, setHoursMode] = useState<"same" | "differ">("same");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const addressSuggestions = [
    "Am Industriehafen 12, 47119 Duisburg, Germany",
    "Donaustraße 20, 90451 Nürnberg, Germany",
    "Carl-Zeiss-Straße 4, 97424 Schweinfurt, Germany",
    "Rheinstraße 15, 96052 Bamberg, Germany",
    "Hafenstraße 88, 40221 Düsseldorf, Germany",
    "Industriestraße 45, 60314 Frankfurt am Main, Germany",
    "Berliner Allee 102, 30175 Hannover, Germany",
  ];

  const filteredAddresses = addressSuggestions.filter((addr) =>
    addr.toLowerCase().includes((formData.addressSearch || "").toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSelectAddress = (address: string) => {
    handleInputChange("selectedAddress", address);
    handleInputChange("addressSearch", address);
    setIsDropdownOpen(false);
  };

  // Start Date change handler
  const handleStartDateChange = (newStartISO: string) => {
    handleInputChange("startDateISO", newStartISO);
    const d = new Date(newStartISO + "T00:00:00");
    handleInputChange(
      "startDate",
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );

    // If start date is after current end date, push end date forward
    const currentEnd = formData.endDateISO || "2026-08-29";
    if (newStartISO > currentEnd) {
      handleInputChange("endDateISO", newStartISO);
      handleInputChange("endDate", d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }));
    }
  };

  // End Date change handler
  const handleEndDateChange = (newEndISO: string) => {
    handleInputChange("endDateISO", newEndISO);
    const d = new Date(newEndISO + "T00:00:00");
    handleInputChange(
      "endDate",
      d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  };

  // Calculate list of all days in date range between startDateISO and endDateISO
  const daysInRange = useMemo(() => {
    const startStr = formData.startDateISO || "2026-08-24";
    const endStr = formData.endDateISO || "2026-08-29";
    const start = new Date(startStr + "T00:00:00");
    const end = new Date(endStr + "T00:00:00");

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return [];
    }

    // Map of any existing custom overrides by date
    const customMap = new Map<string, { startTime: string; endTime: string }>();
    (formData.customDays || []).forEach((cd: any) => {
      if (cd.date) customMap.set(cd.date, { startTime: cd.startTime, endTime: cd.endTime });
    });

    const result: Array<{
      dateISO: string;
      displayDate: string;
      startTime: string;
      endTime: string;
      isCustom: boolean;
      isSunday: boolean;
    }> = [];

    const cur = new Date(start);
    while (cur <= end) {
      const iso = cur.toISOString().split("T")[0];
      const isSunday = cur.getDay() === 0;
      const customEntry = customMap.get(iso);

      result.push({
        dateISO: iso,
        displayDate: formatFullDate(iso),
        startTime: customEntry?.startTime || formData.dailyStartTime || "07:00",
        endTime: customEntry?.endTime || formData.dailyEndTime || "17:00",
        isCustom: !!customEntry,
        isSunday,
      });

      cur.setDate(cur.getDate() + 1);
    }

    return result;
  }, [
    formData.startDateISO,
    formData.endDateISO,
    formData.customDays,
    formData.dailyStartTime,
    formData.dailyEndTime,
  ]);

  // Update a single day's hours in customDays
  const handleUpdateDayHours = (dateISO: string, startTime: string, endTime: string) => {
    const existing: any[] = [...(formData.customDays || [])];
    const idx = existing.findIndex((cd) => cd.date === dateISO);
    if (idx >= 0) {
      existing[idx] = { ...existing[idx], startTime, endTime };
    } else {
      existing.push({
        id: Date.now(),
        date: dateISO,
        displayDate: formatFullDate(dateISO),
        startTime,
        endTime,
      });
    }
    handleInputChange("customDays", existing);
  };

  // Add another day button: adds next consecutive day and extends endDateISO
  const handleAddAnotherDay = () => {
    const currentEnd = formData.endDateISO || "2026-08-29";
    const nextDate = new Date(currentEnd + "T00:00:00");
    nextDate.setDate(nextDate.getDate() + 1);
    const nextISO = nextDate.toISOString().split("T")[0];

    handleEndDateChange(nextISO);

    // Also add to customDays
    const existing: any[] = [...(formData.customDays || [])];
    existing.push({
      id: Date.now(),
      date: nextISO,
      displayDate: formatFullDate(nextISO),
      startTime: formData.dailyStartTime || "07:00",
      endTime: formData.dailyEndTime || "17:00",
    });
    handleInputChange("customDays", existing);
  };

  // Remove a day: if it is the last day, shrink the end date; otherwise reset custom hours
  const handleRemoveDay = (dateISO: string) => {
    const currentEnd = formData.endDateISO || "2026-08-29";
    if (dateISO === currentEnd && daysInRange.length > 1) {
      // Shrink end date by 1 day
      const prevDate = new Date(currentEnd + "T00:00:00");
      prevDate.setDate(prevDate.getDate() - 1);
      const prevISO = prevDate.toISOString().split("T")[0];
      handleEndDateChange(prevISO);
    }
    const updated = (formData.customDays || []).filter((cd: any) => cd.date !== dateISO);
    handleInputChange("customDays", updated);
  };

  // Total planned hours calculation
  const calcTotalHours = (): string => {
    if (daysInRange.length === 0) return "0 hrs";

    let totalMins = 0;
    daysInRange.forEach((day) => {
      // If same mode, ignore Sundays unless specified
      if (hoursMode === "same") {
        if (!day.isSunday) {
          const dailyMins = Math.max(
            0,
            timeToMinutes(formData.dailyEndTime || "17:00") -
              timeToMinutes(formData.dailyStartTime || "07:00")
          );
          totalMins += dailyMins;
        }
      } else {
        // Differ mode: sum exact hours for all scheduled days
        const dayMins = Math.max(
          0,
          timeToMinutes(day.endTime) - timeToMinutes(day.startTime)
        );
        totalMins += dayMins;
      }
    });

    return minutesToLabel(totalMins);
  };

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Tell us about the job
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Provide a few details about your project and site so we can recommend the right crane.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        className="space-y-6"
      >
        {/* Row 1: Customer Details & Lift Overview in balanced grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Card 1: Customer details */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Customer details</h2>
                <p className="text-xs text-gray-500">Your direct contact details for project coordination</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Contact name
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.contactName || ""}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    placeholder="e.g. D. Schmidt"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Company name
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.companyName || ""}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="e.g. Siemens Energy"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone number (optional)
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+49 171 ..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Lift overview */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Lift overview</h2>
                <p className="text-xs text-gray-500">Brief summary of the object or cargo to be lifted</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                What needs to be lifted?
              </label>
              <textarea
                rows={3}
                value={formData.liftDescription || ""}
                onChange={(e) => handleInputChange("liftDescription", e.target.value)}
                placeholder="e.g. Industrial Gas Turbine Compressor Block, HVAC Unit on roof, Steel structure..."
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Job site */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs transition-all hover:border-gray-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Job site location</h2>
              <p className="text-xs text-gray-500">Address where the crane will be deployed and rigged</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-3">
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Search job site address
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.addressSearch || ""}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      handleInputChange("addressSearch", e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Start typing an address or postal code..."
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20 focus:border-[#C8102E] transition-colors"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {filteredAddresses.length > 0 ? (
                      filteredAddresses.map((addr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAddress(addr)}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-gray-800 hover:bg-red-50 hover:text-[#C8102E] transition-colors flex items-center space-x-2"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                          <span className="truncate">{addr}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-xs text-gray-400">
                        Custom address: {formData.addressSearch}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {formData.selectedAddress && (
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-md bg-red-50 text-[#C8102E] text-xs font-semibold border border-red-100">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{formData.selectedAddress}</span>
                  <button
                    type="button"
                    onClick={() => {
                      handleInputChange("selectedAddress", "");
                      handleInputChange("addressSearch", "");
                    }}
                    className="hover:text-red-800 transition-colors ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="md:col-span-5 relative rounded-lg overflow-hidden border border-gray-200 h-36 bg-gray-100 group">
              <img
                src={duisburgMapImg}
                alt="Job site map location"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="bg-[#C8102E] text-white p-2 rounded-full shadow-lg">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div className="bg-white/90 backdrop-blur-xs text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs text-gray-800 mt-1">
                    Duisburg-Hafen
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs space-y-6">
          {/* Header with Green Total Planned Hrs tag in corner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Schedule & Working Hours</h2>
                <p className="text-xs text-gray-500">Define lift duration and operating hours per day</p>
              </div>
            </div>

            {/* Total Planned Hours Tag in Green */}
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full px-4 py-1.5 shadow-2xs">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-extrabold tracking-tight">
                Total planned: {calcTotalHours()}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {/* Row 1: Requested dates (1 calendar icon ahead of start date and 1 ahead of end date) + Flexible Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              {/* Requested dates: 1 calendar icon for start date, 1 for end date */}
              <div className="md:col-span-8">
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Requested dates
                </label>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  {/* Start Date Box */}
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#C8102E] focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-colors shadow-2xs">
                    <CalendarIcon className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <input
                      type="date"
                      value={formData.startDateISO || "2026-08-24"}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-28 sm:w-32 bg-transparent border-none p-0 focus:outline-none text-xs text-gray-900 font-bold cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>

                  <span className="text-gray-400 font-bold text-sm">→</span>

                  {/* End Date Box */}
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#C8102E] focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-colors shadow-2xs">
                    <CalendarIcon className="w-4 h-4 text-[#C8102E] shrink-0" />
                    <input
                      type="date"
                      value={formData.endDateISO || "2026-08-29"}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-28 sm:w-32 bg-transparent border-none p-0 focus:outline-none text-xs text-gray-900 font-bold cursor-pointer [&::-webkit-calendar-picker-indicator]:hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Is the date flexible? */}
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Dates flexible?
                </label>
                <div className="flex items-center space-x-2 h-[38px]">
                  <button
                    type="button"
                    onClick={() => handleInputChange("isFlexible", true)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      formData.isFlexible
                        ? "border-[#C8102E] text-[#C8102E] bg-red-50/40 shadow-2xs"
                        : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange("isFlexible", false)}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      !formData.isFlexible
                        ? "border-[#C8102E] text-[#C8102E] bg-red-50/40 shadow-2xs"
                        : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Working hours mode question */}
            <div className="pt-2 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-800 mb-2">
                Will working hours (e.g. 07:00 – 17:00) be the same for all days?
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setHoursMode("same")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all shadow-2xs ${
                    hoursMode === "same"
                      ? "bg-[#C8102E] text-white border-[#C8102E]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Yes, same every day
                </button>
                <button
                  type="button"
                  onClick={() => setHoursMode("differ")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all shadow-2xs ${
                    hoursMode === "differ"
                      ? "bg-[#C8102E] text-white border-[#C8102E]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  No, some days differ
                </button>
              </div>
            </div>

            {/* If Same: Show only Daily Working Hours */}
            {hoursMode === "same" && (
              <div className="animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Daily working hours
                </label>
                <div className="inline-flex items-center space-x-3">
                  {/* Start Time Box */}
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#C8102E] focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-colors shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                    <span className="text-[11px] text-gray-500 font-medium">Start</span>
                    <input
                      type="time"
                      value={formData.dailyStartTime || "07:00"}
                      onChange={(e) => handleInputChange("dailyStartTime", e.target.value)}
                      className="w-16 bg-transparent text-xs font-bold text-gray-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                    />
                  </div>

                  <span className="text-gray-400 font-bold">→</span>

                  {/* End Time Box */}
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#C8102E] focus-within:ring-2 focus-within:ring-[#C8102E]/20 transition-colors shadow-2xs">
                    <Clock className="w-3.5 h-3.5 text-[#C8102E] shrink-0" />
                    <span className="text-[11px] text-gray-500 font-medium">End</span>
                    <input
                      type="time"
                      value={formData.dailyEndTime || "17:00"}
                      onChange={(e) => handleInputChange("dailyEndTime", e.target.value)}
                      className="w-16 bg-transparent text-xs font-bold text-gray-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* If Differ: Show every day row between start & end date + Add Day button */}
            {hoursMode === "differ" && (
              <div className="border-t border-gray-100 pt-4 space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">
                      Daily Schedule Breakdown ({daysInRange.length} days in requested period)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Adjust working hours for any individual day. Adding a day extends your finishing date.
                    </p>
                  </div>
                </div>

                {/* Day Rows List */}
                <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50/50">
                  {daysInRange.map((day) => {
                    const dayMins = Math.max(
                      0,
                      timeToMinutes(day.endTime) - timeToMinutes(day.startTime)
                    );
                    return (
                      <div
                        key={day.dateISO}
                        className="flex flex-wrap items-center justify-between bg-white border border-gray-200/90 rounded-lg px-4 py-2.5 text-xs gap-3 shadow-2xs hover:border-gray-300 transition-colors"
                      >
                        {/* Date Label */}
                        <div className="flex items-center space-x-2.5 min-w-[180px]">
                          <div className="w-6 h-6 rounded-md bg-red-50 text-[#C8102E] flex items-center justify-center shrink-0">
                            <CalendarIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block text-xs">
                              {day.displayDate}
                            </span>
                            {day.isSunday && (
                              <span className="text-[10px] text-amber-600 font-semibold">Sunday</span>
                            )}
                          </div>
                        </div>

                        {/* Start and End Times */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          {/* Start Time */}
                          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1">
                            <Clock className="w-3 h-3 text-[#C8102E] shrink-0" />
                            <span className="text-[10px] text-gray-400 font-medium">Start</span>
                            <input
                              type="time"
                              value={day.startTime}
                              onChange={(e) =>
                                handleUpdateDayHours(day.dateISO, e.target.value, day.endTime)
                              }
                              className="w-14 bg-transparent text-xs font-bold text-gray-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                            />
                          </div>

                          <span className="text-gray-400 font-bold text-xs">→</span>

                          {/* End Time */}
                          <div className="flex items-center space-x-1.5 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1">
                            <Clock className="w-3 h-3 text-[#C8102E] shrink-0" />
                            <span className="text-[10px] text-gray-400 font-medium">End</span>
                            <input
                              type="time"
                              value={day.endTime}
                              onChange={(e) =>
                                handleUpdateDayHours(day.dateISO, day.startTime, e.target.value)
                              }
                              className="w-14 bg-transparent text-xs font-bold text-gray-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                            />
                          </div>

                          {/* Day Duration Badge */}
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded min-w-[54px] text-center">
                            {minutesToLabel(dayMins)}
                          </span>

                          {/* Remove button if not first day */}
                          {daysInRange.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDay(day.dateISO)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Remove this day from schedule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Another Day button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleAddAnotherDay}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-dashed border-[#C8102E] text-xs font-bold text-[#C8102E] hover:bg-red-50 transition-colors shadow-2xs active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add another day (extends end date)</span>
                  </button>

                  <span className="text-xs text-gray-500">
                    Schedule span: <strong className="text-gray-900">{formData.startDate}</strong> – <strong className="text-gray-900">{formData.endDate}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            disabled
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg border border-gray-200 text-gray-400 text-xs font-bold cursor-not-allowed bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-3 rounded-lg bg-[#C8102E] text-white text-xs font-bold hover:bg-[#a60d25] transition-all shadow-md hover:shadow-lg active:scale-98"
          >
            <span>Continue to lift details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
