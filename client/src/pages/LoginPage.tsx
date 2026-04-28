import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { login } from "../api/authApi"

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const result = await login({ email, password })

      localStorage.setItem("token", result.token)
      toast.success("Logged in successfully")
      navigate("/")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
      >
        <h1 className="text-3xl font-bold text-stone-900">Login</h1>

        <label className="mt-6 block text-sm font-medium text-stone-700">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          Password
          <div className="relative">
            <input
              className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 text-stone-600 hover:text-stone-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        <button className="mt-6 w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white">
          Login
        </button>

        <p className="mt-4 text-sm text-stone-600">
          No account?{" "}
          <Link to="/register" className="font-semibold text-amber-800">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}
