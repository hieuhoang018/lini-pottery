import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { register } from "../api/authApi"

export function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  })

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await register(form)
      toast.success("Account created. Please login.")
      navigate("/login")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Register failed")
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200"
      >
        <h1 className="text-3xl font-bold text-stone-900">Register</h1>

        <label className="mt-6 block text-sm font-medium text-stone-700">
          Name
          <input
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          Email
          <input
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          Phone
          <input
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-stone-700">
          Password
          <input
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            type="password"
          />
        </label>

        <button className="mt-6 w-full rounded-full bg-amber-800 px-6 py-3 font-semibold text-white">
          Register
        </button>

        <p className="mt-4 text-sm text-stone-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-amber-800">
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}
