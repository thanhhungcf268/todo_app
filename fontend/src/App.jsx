import { Routes, Route } from "react-router-dom";

import { Navigate } from "react-router-dom";

import "./App.css";
import LogIn from "./views/LogIn";
import Register from "./views/Register";
import Dashboard from "./views/Dashboard";
import Product from "./components/ProductComponent";
import Debt from "./components/DebtComponent";
import DashboardComponent from "./components/DashboardComponent";
// const Register = React.lazy(() => import('./views/Register'))

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
        <Route path="" element={<Dashboard />}>
          <Route index element={<DashboardComponent />} />
          <Route path="product" element={<Product />} />
          <Route path="debt" element={<Debt />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
