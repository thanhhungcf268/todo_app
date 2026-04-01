import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { register } from "../services/authService";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const validateForm = async (value) => {
    const {message, status} = await register({
      email: value.get("email"),
      password: value.get("password"),
    });
    if (status === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };
  return (
    <div className="h-screen bg-gray-900">
      <ToastContainer />
      <div className="flex min-h-full  flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action={validateForm} method="POST" className="space-y-6">
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
                type="sumbit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => {}}
              >
                Register
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            You already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
