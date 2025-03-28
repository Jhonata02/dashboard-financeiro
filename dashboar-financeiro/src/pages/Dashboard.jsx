import React from "react";
import DashboardMetrics from "../components/DashboardMetrics";
import BudgetProgress from "../components/BudgetProgress";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import ChartContainer from "../components/ChartContainer";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";
import { Chart as ChartJS, registerables } from 'chart.js';
import { useMemo } from "react";
import CategoryManager from "../components/CategoryManager";

ChartJS.register(...registerables);

const Dashboard = () => {
  const { darkMode } = useTheme();
  const { expenses, income } = useFinance();
  
  const expensesByCategory = {};
  expenses.forEach(expense => {
    if (expensesByCategory[expense.category]) {
      expensesByCategory[expense.category] += expense.amount;
    } else {
      expensesByCategory[expense.category] = expense.amount;
    }
  });
  
  // Gráfico de Despesas por Categoria
  const expensePieData = useMemo(() => {
    const expensesByCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    return {
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          data: Object.values(expensesByCategory),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#7CFC00'
          ],
          borderWidth: 1
        }
      ]
    };
  }, [expenses]);

  // Gráfico de Receitas vs Despesas
  const incomeVsExpenseData = useMemo(() => {
    // Agrupa receitas e despesas por mês
    const monthlyData = {};
    
    // Processando receitas
    income.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      monthlyData[month] = monthlyData[month] || { income: 0, expenses: 0 };
      monthlyData[month].income += item.amount;
    });
    
    // Processando despesas
    expenses.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      monthlyData[month] = monthlyData[month] || { income: 0, expenses: 0 };
      monthlyData[month].expenses += item.amount;
    });

    // Ordenando meses e preparando dados
    const sortedMonths = Object.keys(monthlyData)
      .sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`))
      .slice(-6); // Últimos 6 meses

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Receitas',
          data: sortedMonths.map(month => monthlyData[month].income),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Despesas',
          data: sortedMonths.map(month => monthlyData[month].expenses),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
  }, [income, expenses]);
  
  // Gráfico de Tendência de Economia - Dinâmico
  const savingsTrendData = useMemo(() => {
    const monthlyData = {};
    
    // Processando receitas e despesas
    income.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + item.amount;
    });
    
    expenses.forEach(item => {
      const month = new Date(item.date).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) - item.amount;
    });

    // Ordenando meses e preparando dados
    const sortedMonths = Object.keys(monthlyData)
      .sort((a, b) => new Date(`01 ${a}`) - new Date(`01 ${b}`))
      .slice(-6); // Últimos 6 meses

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Economia',
          data: sortedMonths.map(month => Math.max(0, monthlyData[month])),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true
        }
      ]
    };
  }, [income, expenses]);
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: darkMode ? '#fff' : '#333'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#fff' : '#333'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: darkMode ? '#fff' : '#333'
        },
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Dashboard Financeiro</h1>
      
      <DashboardMetrics />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Despesas por Categoria">
          <div className="h-64">
            <Pie data={expensePieData} options={{
              ...chartOptions,
              maintainAspectRatio: false
            }} />
          </div>
        </ChartContainer>
        
        <ChartContainer title="Receitas vs Despesas">
          <div className="h-64">
            <Bar data={incomeVsExpenseData} options={{
              ...chartOptions,
              maintainAspectRatio: false
            }} />
          </div>
        </ChartContainer>
      </div>
      
      <ChartContainer title="Tendência de Economia">
        <div className="h-64">
          <Line data={savingsTrendData} options={{
            ...chartOptions,
            maintainAspectRatio: false
          }} />
        </div>
      </ChartContainer>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
        <BudgetProgress />
        <TransactionForm />
       {/* <CategoryManager /> */}
      </div>
      
      <TransactionList />
    </div>
  );
};

export default Dashboard;