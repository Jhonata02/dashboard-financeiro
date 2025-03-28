import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";

const TransactionForm = () => {
  const { darkMode } = useTheme();
  const { addIncome, addExpense } = useFinance();
  
  const [formData, setFormData] = useState({
    type: "income",
    description: "",
    amount: "",
    category: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.description.trim()) {
      errors.description = "Descrição é obrigatória";
    }
    
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = "Valor deve ser um número positivo";
    }
    
    if (!formData.category.trim()) {
      errors.category = "Categoria é obrigatória";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const transaction = {
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category
    };
    
    if (formData.type === "income") {
      addIncome({ source: transaction.description, ...transaction });
    } else {
      addExpense(transaction);
    }
    
    setFormData({
      type: "income",
      description: "",
      amount: "",
      category: ""
    });
  };
  
  return (
    <div className={`p-6 rounded-lg shadow-lg mb-6 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className="text-xl font-bold mb-4">Adicionar Nova Transação</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Tipo
            </label>
            <select
              name="type"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              value={formData.type}
              onChange={handleChange}
            >
              <option value="income">Receita</option>
              <option value="expense">Despesa</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              {formData.type === "income" ? "Fonte" : "Descrição"}
            </label>
            <input
              type="text"
              name="description"
              placeholder={formData.type === "income" ? "Ex: Salário" : "Ex: Mercado"}
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } ${formErrors.description ? 'border-red-500' : ''}`}
              value={formData.description}
              onChange={handleChange}
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Valor (R$)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Ex: 100.00"
              step="0.01"
              min="0"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } ${formErrors.amount ? 'border-red-500' : ''}`}
              value={formData.amount}
              onChange={handleChange}
            />
            {formErrors.amount && (
              <p className="text-red-500 text-sm mt-1">{formErrors.amount}</p>
            )}
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Categoria
            </label>
            <input
              type="text"
              name="category"
              placeholder="Ex: Alimentação"
              className={`w-full p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              } ${formErrors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={handleChange}
            />
            {formErrors.category && (
              <p className="text-red-500 text-sm mt-1">{formErrors.category}</p>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {formData.type === "income" ? "Adicionar Receita" : "Adicionar Despesa"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;