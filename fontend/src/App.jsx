import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./views/layout/MainLayout";

const LogIn = lazy(() => import("./features/auth/LogIn"));
const Register = lazy(() => import("./features/auth/Register"));
// Chỉ lazy load các page nội dung
const DashboardHome = lazy(() => import("./features/dashboard/Dashboard"));
const Product = lazy(() => import("./features/product/Product"));
const Debt = lazy(() => import("./features/debt/Debt"));
const Duolingo = lazy(() => import("./features/learning/Duolingo"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#131f24] text-white min-h-screen flex items-center justify-center">Loading...</div>
      }
    >
      <Routes>
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />

        <Route path="/" element={<MainLayout />}>
          {/* Index và các path con sẽ được render vào Outlet bên trong Suspense */}
          <Route index element={<DashboardHome />} />
          <Route path="product" element={<Product />} />
          <Route path="debt" element={<Debt />} />
          <Route path="duolingo" element={<Duolingo />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
