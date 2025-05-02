import React, { useState } from "react";
import { FaSort, FaTrash, FaFilter } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";

const TransactionList = () => {
  const { darkMode } = useTheme();
  const { 
    income, 
    expenses, 
    deleteIncome, 
    deleteExpense,
    filter,
    setFilter
  } = useFinance();
  
  const [activeTab, setActiveTab] = useState("expenses");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const sortTransactions = (transactions) => {
    return [...transactions].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (sortField === "date") {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }
      
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };
  
  const resetFilters = () => {
    setFilter({
      startDate: "",
      endDate: "",
      category: "all"
    });
  };
  
  const activeTransactions = activeTab === "expenses" ? expenses : income;
  const sortedTransactions = sortTransactions(activeTransactions);
  
  const categories = [...new Set(activeTransactions.map(item => item.category))];
  
  return (
    <div className={`p-6 rounded-lg shadow-lg ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transações Recentes</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } flex items-center`}
          >
            <FaFilter className="mr-2" />
            Filtros
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className={`p-4 mb-4 rounded ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <h3 className="font-semibold mb-2">Filtrar Transações</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Data Início</label>
              <input
                type="date"
                name="startDate"
                value={filter.startDate}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                } border`}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Data Fim</label>
              <input
                type="date"
                name="endDate"
                value={filter.endDate}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                } border`}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Categoria</label>
              <select
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className={`w-full p-2 rounded ${
                  darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
                } border`}
              >
                <option value="all">Todas</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={resetFilters}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Limpar Filtros
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "expenses" 
                ? `font-semibold border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`
                : ""
            }`}
            onClick={() => setActiveTab("expenses")}
          >
            Despesas
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "income" 
                ? `font-semibold border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`
                : ""
            }`}
            onClick={() => setActiveTab("income")}
          >
            Receitas
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-left ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th 
                className="p-3 cursor-pointer"
                onClick={() => handleSort(activeTab === "expenses" ? "description" : "source")}
              >
                <div className="flex items-center">
                  {activeTab === "expenses" ? "Descrição" : "Fonte"}
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Valor
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Categoria
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th 
                className="p-3 cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Data
                  <FaSort className="ml-1" />
                </div>
              </th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Nenhuma transação encontrada
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className={`border-b ${
                    darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <td className="p-3">
                    {activeTab === "expenses" ? transaction.description : transaction.source}
                  </td>
                  <td className={`p-3 ${activeTab === "expenses" ? 'text-red-500' : 'text-green-500'}`}>
                    {activeTab === "expenses" ? "- " : "+ "}
                    R$ {transaction.amount.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="p-3">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        if (activeTab === "expenses") {
                          deleteExpense(transaction.id);
                        } else {
                          deleteIncome(transaction.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;