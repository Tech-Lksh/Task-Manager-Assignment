import { useState } from "react";
import { User, Mail, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`
      ${collapsed ? 'lg:w-20' : 'lg:w-64'}
      w-64 fixed lg:relative inset-y-0 left-0 
      bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 
      h-screen z-30 transition-all duration-300 ease-in-out
      flex flex-col
    `}>
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-40"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* User Profile Section */}
      <div className={`
        ${collapsed ? 'px-3' : 'px-5'}
        pt-6 pb-4 border-b border-gray-200 dark:border-gray-800
        transition-all duration-300
      `}>
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            {collapsed ? (
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>

          {/* User Info - Hidden when collapsed */}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 dark:text-white truncate">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex items-center">
                <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{user?.email || 'user@example.com'}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Details - Only show when not collapsed */}
      {!collapsed && (
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Empty space for content to fill */}
      <div className="flex-1"></div>

      {/* Logout Button */}
      <div className={`
        ${collapsed ? 'px-3' : 'px-5'}
        py-4 border-t border-gray-200 dark:border-gray-800
        transition-all duration-300
      `}>
        <button
          onClick={onLogout}
          className={`
            w-full flex items-center justify-center space-x-2
            ${collapsed ? 'px-2 py-2' : 'px-4 py-3'}
            bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 
            rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 
            font-medium transition-colors
          `}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapsed Tooltip */}
      {collapsed && (
        <div className="absolute left-full top-6 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none">
          {user?.name || 'User'}
        </div>
      )}
    </div>
  );
}