import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";

const BudgetProgress = () => {
  const { darkMode } = useTheme();
  const { budgets, updateBudgetLimit } = useFinance();
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [newLimit, setNewLimit] = useState("");
  
  const handleEdit = (category, currentLimit) => {
    setEditingCategory(category);
    setNewLimit(currentLimit);
  };
  
  const handleSave = (category) => {
    if (newLimit && !isNaN(newLimit) && Number(newLimit) > 0) {
      updateBudgetLimit(category, Number(newLimit));
      setEditingCategory(null);
    }
  };
  
  const handleCancel = () => {
    setEditingCategory(null);
  };
  
  const getProgressColor = (used, limit) => {
    const percentage = (used / limit) * 100;
    
    if (percentage < 60) return "bg-green-500";
    if (percentage < 85) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className="text-xl font-bold mb-4">Orçamentos</h2>
      
      <div className="space-y-4">
        {Object.entries(budgets).map(([category, { limit, used }]) => (
          <div key={category} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <span className="font-medium">{category}</span>
                {editingCategory === category ? (
                  <div className="ml-2 flex items-center">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      className={`w-24 p-1 text-sm rounded border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300'
                      }`}
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                    />
                    <button
                      onClick={() => handleSave(category)}
                      className="ml-1 p-1 text-green-500 hover:text-green-600"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="ml-1 p-1 text-red-500 hover:text-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(category, limit)}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-600"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              <div className="text-right">
                <div className={`text-sm ${used > limit ? 'text-red-500 font-semibold' : ''}`}>
                  R$ {used.toLocaleString()} / R$ {limit.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round((used / limit) * 100)}% usado
                </div>
              </div>
            </div>
            
            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className={`h-2 rounded-full ${getProgressColor(used, limit)}`}
                style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetProgress;