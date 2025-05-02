import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";
import { FaTrash, FaBell } from "react-icons/fa";

const NotificationsPanel = ({ onClose }) => {
  const { darkMode } = useTheme();
  const { notifications, clearNotifications } = useFinance();

  return (
    <div 
      className={`absolute right-0 top-10 w-72 shadow-xl rounded-lg z-50 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
      style={{
        maxWidth: 'calc(100vw - 20px)',
        right: '10px'
      }}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center">
          <FaBell className="mr-2 text-gray-600" /> 
          <h3 className="font-semibold">Notificações</h3>
        </div>
        <button 
          onClick={clearNotifications}
          className="text-red-500 hover:text-red-700"
          title="Limpar todas"
        >
          <FaTrash />
        </button>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Nenhuma notificação
          </div>
        ) : (
          <ul>
            {notifications.map((notification, index) => (
              <li 
                key={index}
                className={`p-3 ml-6 border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-100'
                } hover:bg-opacity-50 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                {notification}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;