import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import { login } from "../services/authService";
import useStoreAuth from "../zustand_store/storeAuth";
import { handleAPI } from "../utils";

export default function LogIn() {
  const navigate = useNavigate();
  const setPermissions = useStoreAuth((state) => state.setPermissions);
  const [isVisible, setIsVisible] = useState(false);

  const loginSubmit = async (value) => {
    const [res, err] = await handleAPI(
      login({ email: value.get("email"), password: value.get("password") }),
    );
    if (err) {
      const msg = err?.response?.data?.message || "Đăng nhập thất bại";
      return toast.error(msg);
    }

    const data = res.data;
    localStorage.setItem("token", data.token);
    setPermissions(data.encryptPermission);
    navigate("/");
  };

  useEffect(() => {
    localStorage.clear();
  });
  return (
    <div className="h-screen bg-gray-900">
      <ToastContainer />
      <div className="flex min-h-full  flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={loginSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-100"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isVisible ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute cursor-pointer inset-y-0 right-0 flex items-center pe-3 text-slate-400"
                  >
                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="botton"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            Not a member?{" "}
            <NavLink
              to="/register"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Register
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
