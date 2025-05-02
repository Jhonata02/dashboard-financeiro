import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const ChartContainer = ({ title, children }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default ChartContainer;