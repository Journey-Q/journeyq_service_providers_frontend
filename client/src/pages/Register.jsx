"use client"

import { useState } from "react"

// Inline UI Components
const Button = ({
  children,
  className = "",
  variant = "default",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4",
  }

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", type = "text", ...props }) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

const Label = ({ children, htmlFor, className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
}

const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

const Checkbox = ({ checked, onCheckedChange, id, className = "" }) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      className={`h-4 w-4 rounded border border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
    />
  )
}

const Select = ({ children, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")

  const handleSelect = (value) => {
    setSelectedValue(value)
    onValueChange(value)
    setIsOpen(false)
  }

  return <div className="relative">{children({ isOpen, setIsOpen, selectedValue, handleSelect })}</div>
}

const SelectTrigger = ({ children, className = "", isOpen, setIsOpen, selectedValue }) => {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

const SelectValue = ({ placeholder, selectedValue }) => {
  return <span>{selectedValue || placeholder}</span>
}

const SelectContent = ({ children, isOpen }) => {
  if (!isOpen) return null

  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  )
}

const SelectItem = ({ children, value, handleSelect }) => {
  return (
    <div onClick={() => handleSelect(value)} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100">
      {children}
    </div>
  )
}

const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`}>{children}</div>
  )
}

const CardHeader = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}

const CardTitle = ({ children, className = "" }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

const CardDescription = ({ children, className = "" }) => {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
}

const CardContent = ({ children, className = "" }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

const Separator = ({ className = "" }) => {
  return <div className={`shrink-0 bg-gray-200 h-[1px] w-full ${className}`} />
}

const Tooltip = ({ children }) => {
  return <div className="relative inline-block">{children}</div>
}

const TooltipProvider = ({ children }) => {
  return <div>{children}</div>
}

const TooltipTrigger = ({ children }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} className="relative">
      {children}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50">
          Tooltip content
        </div>
      )}
    </div>
  )
}

const TooltipContent = ({ children }) => {
  return <div>{children}</div>
}

// Icons as SVG components
const User = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const Mail = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const Lock = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const Briefcase = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8a2 2 0 012-2V6"
    />
  </svg>
)

const FileText = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const MapPin = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Phone = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

const Eye = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const EyeOff = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
    />
  </svg>
)

const Info = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" />
  </svg>
)

const Loader2 = ({ className = "" }) => (
  <svg className={`animate-spin ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const Shield = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
)

const XCircle = ({ className = "" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9l-6 6m0-6l6 6" />
  </svg>
)

const serviceTypes = [
  "Plumber",
  "Electrician",
  "Carpenter",
  "Cleaner",
  "Gardener",
  "Painter",
  "HVAC Technician",
  "Handyman",
  "Locksmith",
  "Pest Control",
  "Appliance Repair",
  "Roofing Contractor",
]

export default function Register() {
  const [isLogin, setIsLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Signup form state
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    serviceType: "",
    businessRegNumber: "",
    address: "",
    contactNumber: "",
    termsAccepted: false,
    privacyAccepted: false,
  })

  // Login form state
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  })

  // Validation errors
  const [errors, setErrors] = useState({})

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "bg-gray-200",
  })

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0
    let feedback = "Very Weak"
    let color = "bg-red-500"

    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) {
      feedback = "Weak"
      color = "bg-red-500"
    } else if (score <= 4) {
      feedback = "Medium"
      color = "bg-yellow-500"
    } else if (score <= 5) {
      feedback = "Strong"
      color = "bg-green-500"
    } else {
      feedback = "Very Strong"
      color = "bg-green-600"
    }

    return { score, feedback, color }
  }

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "username":
        if (!value) {
          newErrors.username = "Username is required"
        } else if (value.length < 3 || value.length > 50) {
          newErrors.username = "Username must be 3-50 characters"
        } else {
          delete newErrors.username
        }
        break

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          newErrors.email = "Email is required"
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break

      case "password":
        if (!value) {
          newErrors.password = "Password is required"
        } else if (value.length < 6) {
          newErrors.password = "Password must be at least 6 characters"
        } else {
          delete newErrors.password
        }
        break

      case "businessRegNumber":
        if (!value) {
          newErrors.businessRegNumber = "Business registration number is required"
        } else if (value.length < 5 || value.length > 20) {
          newErrors.businessRegNumber = "Must be 5-20 characters"
        } else {
          delete newErrors.businessRegNumber
        }
        break

      case "contactNumber":
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/
        if (!value) {
          newErrors.contactNumber = "Contact number is required"
        } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          newErrors.contactNumber = "Please enter a valid phone number (10-15 digits)"
        } else {
          delete newErrors.contactNumber
        }
        break

      case "address":
        if (!value) {
          newErrors.address = "Address is required"
        } else if (value.length > 500) {
          newErrors.address = "Address must not exceed 500 characters"
        } else {
          delete newErrors.address
        }
        break

      case "serviceType":
        if (!value) {
          newErrors.serviceType = "Service type is required"
        } else {
          delete newErrors.serviceType
        }
        break
    }

    setErrors(newErrors)
  }

  // Handle signup input changes
  const handleSignupChange = (name, value) => {
    setSignupData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  // Handle login input changes
  const handleLoginChange = (name, value) => {
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log(isLogin ? "Login submitted:" : "Signup submitted:", isLogin ? loginData : signupData)
    }, 2000)
  }

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`)
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">ServicePro</h1>
            </div>
            <p className="text-gray-600">Professional Service Provider Platform</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-semibold text-center">
                {isLogin ? "Welcome Back" : "Join ServicePro"}
              </CardTitle>
              <CardDescription className="text-center">
                {isLogin
                  ? "Sign in to your service provider account"
                  : "Create your professional service provider account"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin ? (
                  // Signup Form
                  <>
                    {/* Username */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="username">Username</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose a unique username (3-50 characters)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="username"
                        value={signupData.username}
                        onChange={(e) => handleSignupChange("username", e.target.value)}
                        placeholder="Enter your username"
                        className={errors.username ? "border-red-500" : ""}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="email">Email Address</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter a valid email address for account verification</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => handleSignupChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="password">Password</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Minimum 6 characters. Include uppercase, lowercase, numbers, and symbols for better
                              security
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => handleSignupChange("password", e.target.value)}
                          placeholder="Create a strong password"
                          className={errors.password ? "border-red-500" : ""}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      {signupData.password && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Password Strength:</span>
                            <span className={`font-medium ${passwordStrength.color.replace("bg-", "text-")}`}>
                              {passwordStrength.feedback}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {errors.password && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Service Type */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="serviceType">Service Type</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select your primary service specialization</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select onValueChange={(value) => handleSignupChange("serviceType", value)}>
                        {({ isOpen, setIsOpen, selectedValue, handleSelect }) => (
                          <>
                            <SelectTrigger
                              className={errors.serviceType ? "border-red-500" : ""}
                              isOpen={isOpen}
                              setIsOpen={setIsOpen}
                              selectedValue={selectedValue}
                            >
                              <SelectValue placeholder="Select your service type" selectedValue={selectedValue} />
                            </SelectTrigger>
                            <SelectContent isOpen={isOpen}>
                              {serviceTypes.map((service) => (
                                <SelectItem key={service} value={service} handleSelect={handleSelect}>
                                  {service}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </>
                        )}
                      </Select>
                      {errors.serviceType && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.serviceType}
                        </p>
                      )}
                    </div>

                    {/* Business Registration Number */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="businessRegNumber">Business Registration Number</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter your official business registration number (5-20 characters)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="businessRegNumber"
                        value={signupData.businessRegNumber}
                        onChange={(e) => handleSignupChange("businessRegNumber", e.target.value)}
                        placeholder="Enter business registration number"
                        className={errors.businessRegNumber ? "border-red-500" : ""}
                      />
                      {errors.businessRegNumber && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.businessRegNumber}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="address">Business Address</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter your complete business address (max 500 characters)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea
                        id="address"
                        value={signupData.address}
                        onChange={(e) => handleSignupChange("address", e.target.value)}
                        placeholder="Enter your complete business address"
                        className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
                        maxLength={500}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          {errors.address && (
                            <span className="text-red-500 flex items-center">
                              <XCircle className="h-3 w-3 mr-1" />
                              {errors.address}
                            </span>
                          )}
                        </span>
                        <span>{signupData.address.length}/500</span>
                      </div>
                    </div>

                    {/* Contact Number */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter your business contact number (10-15 digits)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="contactNumber"
                        value={signupData.contactNumber}
                        onChange={(e) => handleSignupChange("contactNumber", e.target.value)}
                        placeholder="Enter your contact number"
                        className={errors.contactNumber ? "border-red-500" : ""}
                      />
                      {errors.contactNumber && (
                        <p className="text-sm text-red-500 flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          {errors.contactNumber}
                        </p>
                      )}
                    </div>

                    {/* Terms and Privacy */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={signupData.termsAccepted}
                          onCheckedChange={(checked) => handleSignupChange("termsAccepted", checked)}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                          </a>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="privacy"
                          checked={signupData.privacyAccepted}
                          onCheckedChange={(checked) => handleSignupChange("privacyAccepted", checked)}
                        />
                        <Label htmlFor="privacy" className="text-sm">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>
                  </>
                ) : (
                  // Login Form
                  <>
                    {/* Email or Username */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="emailOrUsername">Email or Username</Label>
                      </div>
                      <Input
                        id="emailOrUsername"
                        value={loginData.emailOrUsername}
                        onChange={(e) => handleLoginChange("emailOrUsername", e.target.value)}
                        placeholder="Enter your email or username"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-gray-500" />
                        <Label htmlFor="loginPassword">Password</Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="loginPassword"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => handleLoginChange("password", e.target.value)}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                        <Label htmlFor="remember" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || (!isLogin && (!signupData.termsAccepted || !signupData.privacyAccepted))}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : isLogin ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="space-y-4">
                <Separator />
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleSocialLogin("Google")}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleSocialLogin("Facebook")}
                  >
                    <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Continue with Facebook
                  </Button>
                </div>
              </div>

              {/* Toggle Form */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? "Need an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
