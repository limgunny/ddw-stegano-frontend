import React from 'react'

interface FileInputProps {
  label: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const FileInput: React.FC<FileInputProps> = ({
  label,
  onImageChange,
}) => (
  <div>
    <label
      htmlFor="image-upload"
      className="block mb-2 text-sm font-medium text-gray-900"
    >
      {label}
    </label>
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">클릭하여 업로드</span> 또는 드래그
            앤 드롭
          </p>
          <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={onImageChange}
        />
      </label>
    </div>
  </div>
)

export const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
)

interface AlertProps {
  type: 'success' | 'error'
  title?: string
  message: string
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  className,
}) => {
  const baseClasses = 'p-4 rounded-lg'
  const typeClasses = {
    success: 'bg-green-100 border border-green-400 text-green-800',
    error: 'bg-red-100 border border-red-400 text-red-800',
  }

  const Icon = () => {
    if (type === 'success') {
      return (
        <svg
          className="flex-shrink-0 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
      )
    }
    return (
      <svg
        className="flex-shrink-0 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  }

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]} ${className || ''}`}
      role="alert"
    >
      <div className="flex">
        <Icon />
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? 'mt-2' : ''}`}>{message}</div>
        </div>
      </div>
    </div>
  )
}
