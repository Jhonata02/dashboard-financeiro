import React, { useEffect, useState } from 'react';
import { useFinance } from '../contexts/FinanceContext';
const CategoryManager = () => {
    const { removeCategory, getAllCategories } = useFinance();
    const [categories, setCategories] = useState([]);
  
    useEffect(() => {
      setCategories(getAllCategories());
    }, []);
  
    return (
      <div>
        <h2>Gerenciar Categorias</h2>
        {categories.map(category => (
          <div key={category} className="flex items-center justify-between mb-3">
            <span>{category}</span>
            <button 
              onClick={() => removeCategory(category)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  export default CategoryManager;