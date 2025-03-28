import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(
    JSON.parse(localStorage.getItem("balance")) || 25000
  );
  
  const [income, setIncome] = useState(
    JSON.parse(localStorage.getItem("income")) || [
      { id: 1, source: "Salário", amount: 5000, category: "Regular", date: "2025-03-01" },
      { id: 2, source: "Freelance", amount: 2000, category: "Variável", date: "2025-03-05" },
      { id: 3, source: "Investimentos", amount: 1000, category: "Passivo", date: "2025-03-10" }
    ]
  );
  
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || [
      { id: 1, description: "Aluguel", amount: 1500, category: "Moradia", date: "2025-03-02" },
      { id: 2, description: "Mercado", amount: 400, category: "Alimentação", date: "2025-03-08" },
      { id: 3, description: "Transporte", amount: 200, category: "Transporte", date: "2025-03-12" }
    ]
  );
  
  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || {
      Moradia: { limit: 2000, used: 1500 },
      Alimentação: { limit: 600, used: 400 },
      Transporte: { limit: 300, used: 200 }
    }
  );
  
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) || []
  );
  
  const [alertThreshold, setAlertThreshold] = useState(
    JSON.parse(localStorage.getItem("alertThreshold")) || 0.8
  );

  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    category: "all"
  });

  // Salva no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem("balance", JSON.stringify(balance));
    localStorage.setItem("income", JSON.stringify(income));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budgets", JSON.stringify(budgets));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("alertThreshold", JSON.stringify(alertThreshold));
  }, [balance, income, expenses, budgets, notifications, alertThreshold]);

  // Calcula o total de entradas
  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Calcula o total de despesas
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Atualiza o saldo sempre que as entradas ou despesas mudarem
  useEffect(() => {
    setBalance(totalIncome - totalExpenses);
  }, [income, expenses]);

  // Adiciona uma nova entrada
  const addIncome = (newIncome) => {
    const incomeWithId = {
      ...newIncome,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setIncome([...income, incomeWithId]);
    toast.success("Receita adicionada com sucesso!");
  };

  // Adiciona uma nova despesa
  const addExpense = (newExpense) => {
    const expenseWithId = {
      ...newExpense,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, expenseWithId]);
    
    // Atualiza o limite de orçamento
    if (budgets[newExpense.category]) {
      setBudgets({
        ...budgets,
        [newExpense.category]: {
          ...budgets[newExpense.category],
          used: budgets[newExpense.category].used + newExpense.amount
        }
      });
    } else {
      // Adiciona uma nova categoria de orçamento
      setBudgets({
        ...budgets,
        [newExpense.category]: {
          limit: newExpense.amount * 1.5,
          used: newExpense.amount
        }
      });
    }
    
    toast.success("Despesa adicionada com sucesso!");
  };

  // Remove uma entrada
  const deleteIncome = (id) => {
    setIncome(income.filter(item => item.id !== id));
    toast.info("Receita removida com sucesso!");
  };

  // Remove uma despesa
  const deleteExpense = (id) => {
    const expenseToDelete = expenses.find(item => item.id === id);
    
    if (expenseToDelete) {
      // Atualiza o limite de orçamento
      if (budgets[expenseToDelete.category]) {
        setBudgets({
          ...budgets,
          [expenseToDelete.category]: {
            ...budgets[expenseToDelete.category],
            used: budgets[expenseToDelete.category].used - expenseToDelete.amount
          }
        });
      }
      
      setExpenses(expenses.filter(item => item.id !== id));
      toast.info("Despesa removida com sucesso!");
    }
  };

  // Atualiza o limite de orçamento
  const updateBudgetLimit = (category, newLimit) => {
    setBudgets({
      ...budgets,
      [category]: {
        ...budgets[category],
        limit: newLimit
      }
    });
    toast.success(`Limite de orçamento para ${category} atualizado!`);
  };

  // Verifica se os orçamentos estão acima do limite e exibe um alerta
  const checkBudgetAlerts = () => {
    const newNotifications = [];
    
    Object.entries(budgets).forEach(([category, { limit, used }]) => {
      if ((used/limit) > alertThreshold) {
        const notification = `Alerta: Orçamento de ${category} está em ${Math.round((used/limit) * 100)}% do limite!`;
        if (!notifications.includes(notification)) {
          newNotifications.push(notification);
          toast.warning(notification);
        }
      }
    });
    
    if (newNotifications.length > 0) {
      setNotifications([...notifications, ...newNotifications]);
    }
  };

  // Filtra as entradas e despesas por data e categoria
  const filteredIncome = income.filter(item => {
    const dateMatch = filter.startDate && filter.endDate
      ? new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate)
      : true;
    
    const categoryMatch = filter.category !== 'all'
      ? item.category === filter.category
      : true;
    
    return dateMatch && categoryMatch;
  });

  const filteredExpenses = expenses.filter(item => {
    const dateMatch = filter.startDate && filter.endDate
      ? new Date(item.date) >= new Date(filter.startDate) && new Date(item.date) <= new Date(filter.endDate)
      : true;
    
    const categoryMatch = filter.category !== 'all'
      ? item.category === filter.category
      : true;
    
    return dateMatch && categoryMatch;
  });

  // Exporta os dados de entradas e despesas para um arquivo CSV
  const exportToCSV = () => {
    // Dados de entrada
    let incomeCSV = 'ID,Fonte,Valor,Categoria,Data\n';
    income.forEach(item => {
      incomeCSV += `${item.id},"${item.source}",${item.amount},"${item.category}","${item.date}"\n`;
    });

    // Dados de saida
    let expensesCSV = 'ID,Descrição,Valor,Categoria,Data\n';
    expenses.forEach(item => {
      expensesCSV += `${item.id},"${item.description}",${item.amount},"${item.category}","${item.date}"\n`;
    });

    // Cria links para o download dos dados CSV
    const incomeBlob = new Blob([incomeCSV], { type: 'text/csv' });
    const expensesBlob = new Blob([expensesCSV], { type: 'text/csv' });
    
    const incomeURL = URL.createObjectURL(incomeBlob);
    const expensesURL = URL.createObjectURL(expensesBlob);
    
    const incomeDL = document.createElement('a');
    incomeDL.href = incomeURL;
    incomeDL.download = 'receitas.csv';
    incomeDL.click();
    
    const expensesDL = document.createElement('a');
    expensesDL.href = expensesURL;
    expensesDL.download = 'despesas.csv';
    expensesDL.click();
    
    toast.success("Dados exportados com sucesso!");
  };

  // Limpa as notificações
  const clearNotifications = () => {
    setNotifications([]);
    toast.info("Notificações limpas!");
  };

  // função para remover categoria
  const removeCategory = (categoryName) => {
    // Verificar se a categoria existe em despesas ou receitas
    const usedInExpenses = expenses.some(expense => expense.category === categoryName);
    const usedInIncome = income.some(income => income.category === categoryName);

    // Verificar se a categoria existe no orçamento
    const categoryInBudgets = budgets[categoryName];

    // Se a categoria estiver em uso, não permitir remoção
    if (usedInExpenses || usedInIncome || categoryInBudgets) {
      toast.error(`Não é possível remover a categoria ${categoryName}. Ela ainda contém transações ou está no orçamento.`);
      return;
    }

    // Remover categoria dos orçamentos
    const updatedBudgets = { ...budgets };
    delete updatedBudgets[categoryName];
    setBudgets(updatedBudgets);

    toast.success(`Categoria ${categoryName} removida com sucesso!`);
  };

  // função para listar todas as categorias únicas
  const getAllCategories = () => {
    const expenseCategories = [...new Set(expenses.map(expense => expense.category))];
    const incomeCategories = [...new Set(income.map(income => income.category))];
    const budgetCategories = Object.keys(budgets);

    // Combinar e remover duplicatas
    return [...new Set([...expenseCategories, ...incomeCategories, ...budgetCategories])];
  };


  // Verifica os alertas de orçamentos sempre que as despesas mudarem
  useEffect(() => {
    checkBudgetAlerts();
  }, [expenses, budgets]);

  return (
    <FinanceContext.Provider
      value={{
        balance,
        income,
        expenses,
        budgets,
        notifications,
        alertThreshold,
        totalIncome,
        totalExpenses,
        filter,
        filteredIncome,
        filteredExpenses,
        setFilter,
        addIncome,
        addExpense,
        deleteIncome,
        deleteExpense,
        updateBudgetLimit,
        setAlertThreshold,
        clearNotifications,
        exportToCSV,
        removeCategory,
        getAllCategories
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};