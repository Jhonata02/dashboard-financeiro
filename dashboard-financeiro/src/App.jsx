import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import { FinanceProvider } from "./contexts/FinanceContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <Layout>
          <Dashboard />
          <ToastContainer position="bottom-right" />
        </Layout>
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;