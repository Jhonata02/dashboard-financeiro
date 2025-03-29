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
  const { 
    expenses, 
    income, 
    monthlyHistory, 
    getLastSixMonthsData, 
    resetCurrentMonth,
    chartUpdateTrigger 
  } = useFinance();
  
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

  // Gráfico de Receitas vs Despesas (usando dados dos últimos 6 meses)
  const incomeVsExpenseData = useMemo(() => {
    const sixMonthsData = getLastSixMonthsData();
    
    return {
      labels: sixMonthsData.map(data => data.month),
      datasets: [
        {
          label: 'Receitas',
          data: sixMonthsData.map(data => data.income),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Despesas',
          data: sixMonthsData.map(data => data.expenses),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
        }
      ]
    };
  }, [getLastSixMonthsData, chartUpdateTrigger]); // Adicionado chartUpdateTrigger como dependência
  
  // Gráfico de Tendência de Economia - Dinâmico (usando dados dos últimos 6 meses)
  const savingsTrendData = useMemo(() => {
    const sixMonthsData = getLastSixMonthsData();
    
    return {
      labels: sixMonthsData.map(data => data.month),
      datasets: [
        {
          label: 'Economia',
          data: sixMonthsData.map(data => Math.max(0, data.income - data.expenses)),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true
        }
      ]
    };
  }, [getLastSixMonthsData, chartUpdateTrigger]); // Adicionado chartUpdateTrigger como dependência
  
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
      
      <div className="mb-6 flex justify-between items-center">
        <DashboardMetrics />
        <button 
          onClick={resetCurrentMonth}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
        >
          Resetar Mês Atual
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartContainer title="Despesas por Categoria">
          <div className="h-64">
            <Pie data={expensePieData} options={{
              ...chartOptions,
              maintainAspectRatio: false
            }} />
          </div>
        </ChartContainer>
        
        <ChartContainer title="Receitas vs Despesas (Últimos 6 Meses)">
          <div className="h-64">
            <Bar data={incomeVsExpenseData} options={{
              ...chartOptions,
              maintainAspectRatio: false
            }} />
          </div>
        </ChartContainer>
      </div>
      
      <ChartContainer title="Tendência de Economia (Últimos 6 Meses)">
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
      </div>
      
      <TransactionList />
      
      {/* Componente para exibir o histórico mensal */}
      {monthlyHistory.length > 0 && (
        <ChartContainer title="Histórico Mensal">
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 border dark:border-gray-700">Mês</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Receitas</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Despesas</th>
                  <th className="px-4 py-2 border dark:border-gray-700">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {monthlyHistory.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border dark:border-gray-700">{item.month}</td>
                    <td className="px-4 py-2 border dark:border-gray-700 text-green-600">
                      R$ {item.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2 border dark:border-gray-700 text-red-600">
                      R$ {item.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2 border dark:border-gray-700">
                      <span className={item.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        R$ {item.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>
      )}
    </div>
  );
};

export default Dashboard;