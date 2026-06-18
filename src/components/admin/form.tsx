import React from 'react'

// 後台表單共用樣式與小元件。

export const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 disabled:bg-gray-50 disabled:text-gray-400'

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-poppins text-2xl font-bold mb-1">{title}</h1>
        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
      {message}
    </p>
  )
}
