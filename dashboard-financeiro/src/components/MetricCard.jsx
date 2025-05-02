import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const MetricCard = ({ title, value, icon, color, bgColor, darkBgColor }) => {
  const { darkMode } = useTheme();
  
  return (
    <div 
      className={`p-6 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {title}
          </h2>
          <p className={`text-2xl font-bold ${color}`}>
            {value}
          </p>
        </div>
        <div 
          className={`p-3 rounded-full ${
            darkMode ? darkBgColor : bgColor
          } ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;