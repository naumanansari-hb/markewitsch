import { useState, useRef, useEffect } from "react";
import {
  Search,
  Globe,
  Bell,
  Grid3x3,
  Sun,
  Moon,
  Monitor,
  Building2,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Check,
  Palette,
  Clock,
  X,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Mail,
  Phone,
  ChevronRight,
  Star,
  Crown,
  Shield,
  Plus,
  CalendarCheck,
  CalendarX,
  ClipboardList,
  UserCheck,
  UserX,
  Timer,
  ClipboardCheck,
  Key,
} from "lucide-react";
import logo from "../../assets/1b7ab447194c5f0fc1b269452281b2173e53bd29.png";
import {
  FormModal,
  FormLabel,
  FormInput,
  FormField,
  FormFooter,
  FormSection,
} from "./hb/common/Form";

interface GlobalHeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isSidebarCollapsed: boolean;
  currentTheme?: string;
  onThemeChange?: (theme: string) => void;
}

export function GlobalHeader({
  isDarkMode,
  onToggleDarkMode,
  isSidebarCollapsed,
  currentTheme = "natural",
  onThemeChange,
}: GlobalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] =
    useState(false);
  const [recentSearches, setRecentSearches] = useState<
    string[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showLanguageDropdown, setShowLanguageDropdown] =
    useState(false);
  const [
    showNotificationsDropdown,
    setShowNotificationsDropdown,
  ] = useState(false);
  const [
    showApplicationsDropdown,
    setShowApplicationsDropdown,
  ] = useState(false);
  const [showUserDropdown, setShowUserDropdown] =
    useState(false);
  const [showThemeDropdown, setShowThemeDropdown] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState("English");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Refs for click outside detection
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const applicationsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  // Mock data
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
  ];

  const themes = [
    {
      id: "natural",
      name: "Natural",
      description: "Clean neutral grays",
    },
    {
      id: "slate",
      name: "Slate",
      description: "Modern blue-gray tones",
    },
    {
      id: "nord",
      name: "Nord",
      description: "Nordic soft palette",
    },
    {
      id: "midnight",
      name: "Midnight",
      description: "Deep blue theme",
    },
    {
      id: "warm",
      name: "Warm",
      description: "Coffee & earth tones",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your annual leave request has been approved",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Attendance Alert",
      message: "Missing clock-out entry for yesterday",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Correction Request",
      message: "Your attendance correction has been processed",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 4,
      title: "Leave Balance Update",
      message: "Your leave balance has been updated",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 5,
      title: "Team Attendance",
      message: "3 team members are on leave today",
      time: "5 hours ago",
      unread: false,
    },
  ];

  const applications = [
    {
      id: 1,
      name: "Attendance",
      icon: "📋",
      description: "Manage attendance records",
      color: "bg-primary-100 dark:bg-primary-950",
    },
    {
      id: 2,
      name: "Projects",
      icon: "📊",
      description: "Track project progress",
      color: "bg-success-100 dark:bg-success-950",
    },
    {
      id: 3,
      name: "HR",
      icon: "👥",
      description: "Human resources",
      color: "bg-warning-100 dark:bg-warning-950",
    },
  ];

  // Mock search data
  const searchData = [
    // Employees
    {
      id: 1,
      title: "Sarah Johnson",
      type: "Employee",
      category: "Employees",
      icon: UserCheck,
      description: "Present Today - Front Desk",
      status: "Present",
    },
    {
      id: 2,
      title: "Michael Chen",
      type: "Employee",
      category: "Employees",
      icon: UserX,
      description: "On Leave - Housekeeping",
      status: "On Leave",
    },
    {
      id: 3,
      title: "Emily Davis",
      type: "Employee",
      category: "Employees",
      icon: UserCheck,
      description: "Present Today - Restaurant",
      status: "Present",
    },

    // Leave Requests
    {
      id: 6,
      title: "Annual Leave - Sarah Johnson",
      type: "Leave Request",
      category: "Leave Requests",
      icon: CalendarCheck,
      description: "Dec 28 - Jan 2 (5 days)",
      status: "Approved",
    },
    {
      id: 7,
      title: "Sick Leave - Michael Chen",
      type: "Leave Request",
      category: "Leave Requests",
      icon: CalendarX,
      description: "Dec 24 (1 day)",
      status: "Pending",
    },

    // Attendance Records
    {
      id: 8,
      title: "Clock-In Record - Sarah Johnson",
      type: "Attendance",
      category: "Attendance",
      icon: Timer,
      description: "Today at 8:00 AM",
      status: "On Time",
    },
    {
      id: 9,
      title: "Missing Clock-Out - Emily Davis",
      type: "Attendance",
      category: "Attendance",
      icon: ClipboardList,
      description: "Yesterday at 5:00 PM",
      status: "Correction Needed",
    },
    {
      id: 10,
      title: "Late Arrival - Michael Chen",
      type: "Attendance",
      category: "Attendance",
      icon: Clock,
      description: "Dec 22 at 9:30 AM",
      status: "Late",
    },
  ];

  const quickAccessModules = [
    {
      id: 1,
      name: "All Employees",
      icon: Users,
      description: "View all employees",
      module: "employees",
    },
    {
      id: 3,
      name: "Leave Requests",
      icon: CalendarCheck,
      description: "View all leave requests",
      module: "leave-requests",
    },
    {
      id: 4,
      name: "Attendance Records",
      icon: ClipboardList,
      description: "View attendance records",
      module: "attendance",
    },
    {
      id: 5,
      name: "Reports",
      icon: FileText,
      description: "View analytics & reports",
      module: "reports",
    },
  ];

  // Filter search results
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query),
    );
  };

  const searchResults = getSearchResults();
  const groupedResults = searchResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchData>,
  );

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts
      .map((part, index) =>
        part.toLowerCase() === query.toLowerCase()
          ? `<mark class="bg-warning-200 dark:bg-warning-900/30 text-neutral-900 dark:text-white px-0.5 rounded">${part}</mark>`
          : part,
      )
      .join("");
  };

  const unreadCount = notifications.filter(
    (n) => n.unread,
  ).length;

  // Keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "k"
      ) {
        event.preventDefault();
        setShowSearchDropdown(true);
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape" && showSearchDropdown) {
        setShowSearchDropdown(false);
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchDropdown]);

  // Handle search input focus
  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      setShowSearchDropdown(true);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      // Add to recent searches
      const newRecent = [
        query,
        ...recentSearches.filter((s) => s !== query),
      ].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(newRecent),
      );
      setShowSearchDropdown(false);
    }
  };

  // Clear recent searches
  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Remove single recent search
  const handleRemoveRecent = (
    searchToRemove: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter(
      (s) => s !== searchToRemove,
    );
    setRecentSearches(newRecent);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(newRecent),
    );
  };

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsDropdown(false);
      }
      if (
        applicationsRef.current &&
        !applicationsRef.current.contains(event.target as Node)
      ) {
        setShowApplicationsDropdown(false);
      }
      if (
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setShowThemeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white dark:bg-neutral-950 transition-all ${isScrolled
        ? "border-b border-neutral-200 dark:border-neutral-800 shadow-sm"
        : ""
        }`}
    >
      <div className="h-12 px-6 flex items-center justify-between gap-4">
        {/* Left Side - Logo (when sidebar collapsed) + Global Search */}
        <div className="flex items-center gap-4 flex-1 max-w-md">
          {/* Logo - Show only when sidebar is collapsed */}
          {isSidebarCollapsed && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <img
                src={logo}
                alt="Admin Panel"
                className="h-8 w-8 object-contain"
              />
            </div>
          )}

          {/* Global Search */}
          <div className="relative flex-1" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-neutral-500 dark:text-neutral-400" />
            <input
              type="text"
              placeholder="Search employees, leave requests, attendance..."
              value={searchQuery}
              onChange={(e) =>
                handleSearchChange(e.target.value)
              }
              onFocus={handleSearchFocus}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleSearchSubmit(searchQuery);
                }
              }}
              className="w-full pl-10 pr-20 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              ref={searchInputRef}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] rounded border border-neutral-300 dark:border-neutral-700">
                ⌘K
              </kbd>
            </div>

            {showSearchDropdown && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
                {/* Search with results */}
                {searchQuery.trim() &&
                  searchResults.length > 0 && (
                    <div className="max-h-[500px] overflow-y-auto">
                      {/* Grouped Results */}
                      {Object.entries(groupedResults).map(
                        ([category, items]) => (
                          <div
                            key={category}
                            className="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                          >
                            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50">
                              <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                                {category}
                              </div>
                            </div>
                            {items.map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => {
                                    handleSearchSubmit(
                                      searchQuery,
                                    );
                                  }}
                                  className="w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-3 group"
                                >
                                  <div className="w-9 h-9 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                                    <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightText(
                                          item.title,
                                          searchQuery,
                                        ),
                                      }}
                                    />
                                    <div
                                      className="text-xs text-neutral-600 dark:text-neutral-400"
                                      dangerouslySetInnerHTML={{
                                        __html: highlightText(
                                          item.description,
                                          searchQuery,
                                        ),
                                      }}
                                    />
                                  </div>
                                  <div
                                    className={`px-2 py-0.5 text-[10px] rounded-full flex-shrink-0 ${item.status ===
                                      "Approved" ||
                                      item.status ===
                                      "Present" ||
                                      item.status ===
                                      "On Time"
                                      ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                                      : item.status ===
                                        "Pending" ||
                                        item.status ===
                                        "Correction Needed"
                                        ? "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400"
                                        : item.status ===
                                          "On Leave" ||
                                          item.status ===
                                          "Late" ||
                                          item.status ===
                                          "Rejected"
                                          ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400"
                                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400"
                                      }`}
                                  >
                                    {item.status}
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                              );
                            })}
                          </div>
                        ),
                      )}
                    </div>
                  )}

                {/* Empty State */}
                {searchQuery.trim() &&
                  searchResults.length === 0 && (
                    <div className="p-8 text-center">
                      <Search className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                      <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                        No results found
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        Try searching with different keywords
                      </div>
                    </div>
                  )}

                {/* Recent Searches & Quick Access (when no query) */}
                {!searchQuery.trim() && (
                  <>
                    {/* Quick Access */}
                    <div className="border-b border-neutral-200 dark:border-neutral-800">
                      <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50">
                        <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                          Quick Access
                        </div>
                      </div>
                      <div className="p-2">
                        {quickAccessModules.map((module) => {
                          const Icon = module.icon;
                          return (
                            <button
                              key={module.id}
                              onClick={() =>
                                setShowSearchDropdown(false)
                              }
                              className="w-full px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-3"
                            >
                              <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                              <div className="flex-1">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {module.name}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                  {module.description}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-between">
                          <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 uppercase tracking-wide">
                            Recent Searches
                          </div>
                          <button
                            onClick={handleClearRecent}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="p-2">
                          {recentSearches.map(
                            (search, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSearchQuery(search);
                                  handleSearchSubmit(search);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors flex items-center gap-3 group"
                              >
                                <Clock className="w-4 h-4 text-neutral-400 dark:text-neutral-600" />
                                <span className="flex-1">
                                  {search}
                                </span>
                                <div
                                  onClick={(e) =>
                                    handleRemoveRecent(
                                      search,
                                      e,
                                    )
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 hover:text-error-500 dark:hover:text-error-400" />
                                </div>
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Empty Recent State */}
                    {recentSearches.length === 0 && (
                      <div className="p-8 text-center border-t border-neutral-200 dark:border-neutral-800">
                        <Clock className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                          No recent searches
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Search Tips Footer */}
                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px]">
                        ↵
                      </kbd>
                      to select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-[10px]">
                        ESC
                      </kbd>
                      to close
                    </span>
                  </div>
                  <span className="text-neutral-500 dark:text-neutral-500">
                    {searchResults.length > 0 &&
                      `${searchResults.length} results`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Icons and Dropdowns */}
        <div className="flex items-center gap-1.5">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() =>
                setShowNotificationsDropdown(
                  !showNotificationsDropdown,
                )
              }
              className="relative w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-error-500 text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotificationsDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer ${notification.unread
                        ? "bg-primary-50/30 dark:bg-primary-950/30"
                        : ""
                        }`}
                    >
                      <div className="flex items-start gap-2">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-1.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                            {notification.title}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-500">
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-neutral-200 dark:border-neutral-800">
                  <button className="w-full py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950 rounded transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() =>
                setShowThemeDropdown(!showThemeDropdown)
              }
              className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
              title="Change theme"
            >
              <Palette className="w-5 h-5" />
            </button>
            {showThemeDropdown && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="text-xs font-medium text-neutral-900 dark:text-white px-2 py-1">
                    Select Theme
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        if (onThemeChange) {
                          onThemeChange(theme.id);
                        }
                        setShowThemeDropdown(false);
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                            {theme.name}
                          </div>
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {theme.description}
                          </div>
                        </div>
                        {currentTheme === theme.id && (
                          <Check className="w-4 h-4 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Day/Night Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-all hover:scale-105 active:scale-95"
            title={
              isDarkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() =>
                setShowUserDropdown(!showUserDropdown)
              }
              className="h-9 px-2 flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <div className="w-7 h-7 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <ChevronDown className="w-3.5 h-3.5 hidden lg:inline" />
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden">
                {/* User Info Section */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      JD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white mb-0.5">
                        John Doe
                      </div>
                      <div className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">
                        john.doe@company.com
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-500">
                        Sales Manager
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded transition-colors flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help & Support</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="p-1 border-t border-neutral-200 dark:border-neutral-800">
                  <button className="w-full px-3 py-2 text-left text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-950 rounded transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <FormModal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
        title="Change Password"
        description="Enter your current password and choose a new one"
        maxWidth="max-w-md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Handle password change logic here
            console.log("Password change submitted:", passwordForm);
            setShowChangePasswordModal(false);
            setPasswordForm({
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }}
        >
          <FormSection>
            <FormField>
              <FormLabel htmlFor="currentPassword" required>
                Current Password
              </FormLabel>
              <FormInput
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </FormField>

            <FormField>
              <FormLabel htmlFor="newPassword" required>
                New Password
              </FormLabel>
              <FormInput
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Must be at least 8 characters long
              </p>
            </FormField>

            <FormField>
              <FormLabel htmlFor="confirmPassword" required>
                Confirm New Password
              </FormLabel>
              <FormInput
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </FormField>
          </FormSection>

          <FormFooter>
            <button
              type="button"
              onClick={() => {
                setShowChangePasswordModal(false);
                setPasswordForm({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
              className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
            >
              Change Password
            </button>
          </FormFooter>
        </form>
      </FormModal>
    </header>
  );
}