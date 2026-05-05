import { useState } from "react"

interface InputFieldProps {
  label: string
  placeholder?: string
  inputType?: string
  name: string
  value: string | number | undefined
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  isCompulsary: boolean
}

export function InputField({
  label,
  placeholder,
  inputType,
  name,
  value,
  onChange,
  isCompulsary,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  const handleInputType = (inputType: string | undefined) => {
    if (inputType === undefined) {
      return "text"
    }

    if (inputType === "password" && showPassword) {
      return "text"
    }

    return inputType
  }

  return (
    <label className="block text-sm font-medium text-stone-700">
      {label} {isCompulsary ? " *" : ""}
      <div className="relative">
        {name === "notes" ||
        name === "description" ||
        name === "careInstructions" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={4}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        ) : (
          <input
            type={handleInputType(inputType)}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        )}
        {name === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 text-stone-600 hover:text-stone-900"
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        )}
      </div>
    </label>
  )
}
