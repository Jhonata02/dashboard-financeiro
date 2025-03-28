import React, { useState } from "react";
import { FaBell, FaSun, FaMoon, FaDownload, FaCog } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";
import NotificationsPanel from "./NotificationsPanel";

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { notifications, clearNotifications, exportToCSV } = useFinance();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className={`px-6 py-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex justify-between items-center`}>
      <div className="flex items-center">
        <h1 className="text-xl md:text-2xl font-bold"></h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={exportToCSV}
          className="p-2 rounded-full hover:bg-opacity-80 bg-green-600 text-white cursor-pointer"
          title="Exportar Dados"
        >
          <FaDownload />
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-opacity-80 relative cursor-pointer"
            title="Notificações"
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {notifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationsPanel 
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
        
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full cursor-pointer ${darkMode ? 'text-yellow-300' : 'text-gray-600'}`}
          title={darkMode ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        <button
          className="p-2 rounded-full hover:bg-opacity-80"
          title="Configurações"
        >
          <FaCog />
        </button>
      </div>
    </header>
  );
};

export default Header;
