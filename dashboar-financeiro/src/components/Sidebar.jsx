import React, { useState } from "react";
import { 
  FaHome, FaChartPie, FaExchangeAlt, FaRegCalendarAlt, 
  FaCog, FaAngleDoubleLeft, FaAngleDoubleRight 
} from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = () => {
  const { darkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { icon: <FaHome />, label: "Dashboard", active: true },
    { icon: <FaExchangeAlt />, label: "Transações", active: false },
    { icon: <FaChartPie />, label: "Orçamentos", active: false },
    { icon: <FaRegCalendarAlt />, label: "Planejamento", active: false },
    { icon: <FaCog />, label: "Configurações", active: false },
  ];

   return (
    <aside 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } shadow-lg hidden md:block`}
    >
      <div className="p-4 flex justify-end">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-full cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>
      
      <nav className="mt-8">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <a 
                href="#"
                className={`flex items-center p-4 ${
                  collapsed ? 'justify-center' : 'space-x-3'
                } ${
                  item.active 
                    ? `${darkMode ? 'bg-gray-700' : 'bg-blue-50'} ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                    : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }`}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;