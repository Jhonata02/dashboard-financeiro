import React from "react";
import { FaWallet, FaMoneyBillWave, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";
import { useFinance } from "../contexts/FinanceContext";
import MetricCard from "./MetricCard";

const DashboardMetrics = () => {
  const { darkMode } = useTheme();
  const { balance, totalIncome, totalExpenses } = useFinance();
  
  // Calculate savings rate
  const savingsRate = totalIncome > 0 
    ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) 
    : 0;

  const metrics = [
    {
      title: "Saldo Total",
      value: `R$ ${balance.toLocaleString()}`,
      icon: <FaWallet />,
      color: balance >= 0 ? "text-green-500" : "text-red-500",
      bgColor: balance >= 0 ? "bg-green-100" : "bg-red-100",
      darkBgColor: balance >= 0 ? "bg-green-900 bg-opacity-20" : "bg-red-900 bg-opacity-20"
    },
    {
      title: "Receita Mensal",
      value: `R$ ${totalIncome.toLocaleString()}`,
      icon: <FaMoneyBillWave />,
      color: "text-green-500",
      bgColor: "bg-green-100",
      darkBgColor: "bg-green-900 bg-opacity-20"
    },
    {
      title: "Despesas Mensais",
      value: `R$ ${totalExpenses.toLocaleString()}`,
      icon: <FaShoppingCart />,
      color: "text-red-500",
      bgColor: "bg-red-100",
      darkBgColor: "bg-red-900 bg-opacity-20"
    },
    {
      title: "Taxa de Poupança",
      value: `${savingsRate}%`,
      icon: <FaChartLine />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      darkBgColor: "bg-blue-900 bg-opacity-20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default DashboardMetrics;