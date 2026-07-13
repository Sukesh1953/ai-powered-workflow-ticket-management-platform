import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-6">
      <div className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full">

        <div className="hidden lg:flex flex-col justify-center bg-blue-700 text-white p-14">
          <h1 className="text-5xl font-bold leading-tight">
            AI Workflow
            <br />
            Automation
          </h1>

          <p className="mt-6 text-lg text-blue-100">
            Automate ticket management with AI-powered summarization,
            categorization and workflow automation.
          </p>

          <div className="mt-12 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              AI Ticket Summarization
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              Workflow Automation
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              Analytics Dashboard
            </div>
          </div>
        </div>

        <div className="p-10 lg:p-16">
          <h2 className="text-4xl font-bold text-slate-800">
            Welcome Back 👋
          </h2>

          <p className="text-slate-500 mt-2">
            Login to continue
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <label className="text-sm text-slate-600">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mt-2 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl py-3 font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-slate-500">
              Don't have an account?

              <Link
                to="/register"
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}