import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;