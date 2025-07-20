"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Building,
  FileText,
  ArrowLeft,
  Loader2,
  Facebook,
  Twitter,
  CheckCircle,
  AlertCircle,
  UserPlus,
  LogIn,
} from "lucide-react"
import logo from "../assets/images/logo.png"

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Form states
  const [loginData, setLoginData] = useState({
    emailOrUsername: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    businessName: "", // Changed from username to businessName
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    serviceType: "", // New field for service type
    businessRegNumber: "",
    termsAccepted: false,
    privacyAccepted: false,
  })

  // Validation errors
  const [errors, setErrors] = useState({})

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    color: "#ef4444",
  })

  const backgroundImages = [
    'https://images.unsplash.com/photo-1550679193-d8ec2f2c3a25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://plus.unsplash.com/premium_photo-1681223447383-402912b83029?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1546209189-247948bf5dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [backgroundImages.length])

  // Handle form toggle with animation
  const handleFormToggle = (newIsLogin) => {
    if (newIsLogin !== isLogin) {
      setIsTransitioning(true)
      setTimeout(() => {
        setIsLogin(newIsLogin)
        setErrors({})
        setTimeout(() => {
          setIsTransitioning(false)
        }, 100)
      }, 300)
    }
  }

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0
    let feedback = "Very Weak"
    let color = "#ef4444"

    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    if (score <= 2) {
      feedback = "Weak"
      color = "#ef4444"
    } else if (score <= 4) {
      feedback = "Medium"
      color = "#f59e0b"
    } else if (score <= 5) {
      feedback = "Strong"
      color = "#10b981"
    } else {
      feedback = "Very Strong"
      color = "#059669"
    }

    return { score, feedback, color }
  }

  // Real-time validation
  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "businessName": // Updated from username to businessName
        if (!value) {
          newErrors.businessName = "Business Name is required"
        } else if (value.length < 3 || value.length > 50) {
          newErrors.businessName = "Business Name must be 3-50 characters"
        } else {
          delete newErrors.businessName
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

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (value !== signupData.password) {
          newErrors.confirmPassword = "Passwords do not match"
        } else {
          delete newErrors.confirmPassword
        }
        break

      case "phone":
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/
        if (!value) {
          newErrors.phone = "Phone number is required"
        } else if (!phoneRegex.test(value.replace(/\s/g, ""))) {
          newErrors.phone = "Please enter a valid phone number"
        } else {
          delete newErrors.phone
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

      case "serviceType":
        if (!value) {
          newErrors.serviceType = "Service Type is required"
        } else {
          delete newErrors.serviceType
        }
        break
    }

    setErrors(newErrors)
  }

  // Handle input changes
  const handleLoginChange = (name, value) => {
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupChange = (name, value) => {
    setSignupData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate all fields before submission
    if (!isLogin) {
      validateField("businessName", signupData.businessName)
      validateField("email", signupData.email)
      validateField("password", signupData.password)
      validateField("confirmPassword", signupData.confirmPassword)
      validateField("phone", signupData.phone)
      validateField("businessRegNumber", signupData.businessRegNumber)
      validateField("serviceType", signupData.serviceType)
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      console.log(isLogin ? "Login submitted:" : "Signup submitted:", isLogin ? loginData : signupData)
    }, 2000)
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`)
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      <style jsx>{`
        .page-background {
          position: fixed;
          inset: 0;
          z-index: -10;
          background-size: cover;
          background-position: center;
          filter: blur(10px);
          transform: scale(1.1);
          transition: background-image 1s ease-in-out;
        }

        .page-background-overlay {
          position: fixed;
          inset: 0;
          z-index: -5;
          background: rgba(0, 0, 0, 0.4);
        }

        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInFromBottom {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slideOutLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-50px); }
        }
        
        @keyframes slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(50px); }
        }
        
        @keyframes morphBackground {
          0% { border-radius: 20px; }
          50% { border-radius: 30px; }
          100% { border-radius: 20px; }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 
                       0 0 40px rgba(59, 130, 246, 0.1),
                       inset 0 0 10px rgba(255, 255, 255, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.4), 
                       0 0 60px rgba(59, 130, 246, 0.15),
                       inset 0 0 15px rgba(255, 255, 255, 0.15);
          }
        }
        
        @keyframes backgroundZoomIn {
          0% { transform: scale(1); opacity: 1; }
          85% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1.15); opacity: 0.9; }
        }
        
        @keyframes backgroundFadeIn {
          0% { transform: scale(1.1); opacity: 0; }
          15% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .form-enter {
          animation: ${isLogin ? "slideInFromLeft" : "slideInFromRight"} 0.4s ease-out forwards;
        }
        
        .form-exit {
          animation: ${isLogin ? "slideOutRight" : "slideOutLeft"} 0.2s ease-out forwards;
        }
        
        .field-enter {
          animation: slideInFromBottom 0.3s ease-out forwards;
        }
        
        .scale-enter {
          animation: fadeInScale 0.3s ease-out forwards;
        }
        
        .morph-bg {
          animation: morphBackground 6s ease-in-out infinite;
        }
        
        .glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
        
        .wiggle-error {
          animation: shake 0.3s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          50% { transform: translateX(3px); }
          75% { transform: translateX(-3px); }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 15px 30px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        .glass-input, .glass-select {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(59, 130, 246, 0.2);
          box-shadow: 
            0 4px 15px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease-out;
        }
        
        .glass-input:focus, .glass-select:focus {
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 
            0 6px 20px rgba(59, 130, 246, 0.15),
            0 0 0 2px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transform: translateY(-1px);
        }
        
        .glass-button {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.9), 
            rgba(37, 99, 235, 0.9)
          );
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 10px 20px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .glass-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.25), 
            transparent
          );
          transition: left 0.4s ease;
        }
        
        .glass-button:hover {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 1), 
            rgba(37, 99, 235, 1)
          );
          box-shadow: 
            0 12px 25px rgba(59, 130, 246, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        
        .glass-button:hover::before {
          left: 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6, #60a5fa, #2563eb);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.4) rgba(255, 255, 255, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.5), rgba(37, 99, 235, 0.5));
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(59, 130, 246, 0.7), rgba(37, 99, 235, 0.7));
        }
        
        .toggle-button {
          transition: all 0.3s ease-out;
        }
        
        .toggle-button:hover {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }
        
        .interactive-hover {
          transition: all 0.3s ease-out;
        }
        
        .interactive-hover:hover {
          transform: translateY(-1px);
        }
        
        .card-hover {
          transition: all 0.4s ease-out;
        }
        
        .card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div
        className="page-background"
        style={{ backgroundImage: `url('${backgroundImages[currentImageIndex]}')` }}
      />
      <div className="page-background-overlay" />

      <button
        onClick={handleGoBack}
        className="fixed top-4 left-4 z-50 flex items-center text-white hover:text-blue-200 transition-all duration-300 p-2 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 scale-enter"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="ml-2 text-sm font-medium">Back</span>
      </button>

      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <div className="glass-card rounded-2xl morph-bg glow-pulse card-hover flex flex-col sm:flex-row h-[80vh] max-h-[720px]">
            <div className="hidden sm:flex sm:w-1/2 relative rounded-l-2xl overflow-hidden">
              {backgroundImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex 
                      ? "opacity-100 background-zoom-in" 
                      : index === (currentImageIndex - 1 + backgroundImages.length) % backgroundImages.length
                      ? "opacity-0 background-fade-in"
                      : "opacity-0"
                  }`}
                  style={{ backgroundImage: `url('${image}')` }}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-2xl font-bold gradient-text">JourneyQ</h2>
                <p className="text-sm text-white/80">Explore the World with Ease</p>
              </div>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col p-6 sm:p-8">
              <div className="flex-shrink-0 mb-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">
                    {isLogin ? "Welcome Back" : "Join JourneyQ"}
                  </h2>
                  <p className="text-sm text-white/70 mt-1">
                    {isLogin ? "Sign in to continue your journey" : "Create an account to start exploring"}
                  </p>
                </div>
              </div>

              <div className="flex bg-white/10 rounded-lg p-1 mb-6 scale-enter delay-100">
                <button
                  onClick={() => handleFormToggle(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLogin
                      ? "glass-button text-white shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
                <button
                  onClick={() => handleFormToggle(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    !isLogin
                      ? "glass-button text-white shadow-md"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className={`${isTransitioning ? "form-exit" : "form-enter"}`}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {isLogin ? (
                      <div className="space-y-4">
                        <div className="space-y-1 field-enter delay-100">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <User className="h-4 w-4 mr-2 text-blue-300" />
                            Email or Business Name
                          </label>
                          <input
                            type="text"
                            value={loginData.emailOrUsername}
                            onChange={(e) => handleLoginChange("emailOrUsername", e.target.value)}
                            className="w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover"
                            placeholder="Email or Business Name"
                          />
                        </div>

                        <div className="space-y-1 field-enter delay-200">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Lock className="h-4 w-4 mr-2 text-blue-300" />
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginData.password}
                              onChange={(e) => handleLoginChange("password", e.target.value)}
                              className="w-full px-4 py-2.5 pr-10 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover"
                              placeholder="Password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-all duration-200"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm field-enter delay-300">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                            />
                            <span className="ml-2 text-white/80">Remember me</span>
                          </label>
                          <Link
                            to="/forgot-password"
                            className="text-blue-300 hover:text-blue-200 transition-colors"
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full glass-button text-white font-semibold py-3 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 field-enter delay-400"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            <>
                              <LogIn className="h-4 w-4" />
                              Sign In
                            </>
                          )}
                        </button>

                        <div className="text-center text-sm field-enter delay-500">
                          <p className="text-white/80">
                            Don't have an account?{" "}
                            <button
                              onClick={() => handleFormToggle(false)}
                              className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                            >
                              Sign Up
                            </button>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1 field-enter delay-100">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Building className="h-4 w-4 mr-2 text-blue-300" />
                            Business Name
                          </label>
                          <input
                            type="text"
                            value={signupData.businessName}
                            onChange={(e) => handleSignupChange("businessName", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.businessName ? "border-red-400 wiggle-error" : ""
                            }`}
                            placeholder="Enter your business name"
                          />
                          {errors.businessName && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.businessName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-150">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <User className="h-4 w-4 mr-2 text-blue-300" />
                            Service Type
                          </label>
                          <select
                            value={signupData.serviceType}
                            onChange={(e) => handleSignupChange("serviceType", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-select rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.serviceType ? "border-red-400 wiggle-error" : ""
                            }`}
                          >
                            <option value="" disabled>Select Service Type</option>
                            <option value="HOTEL">Hotel</option>
                            <option value="TOUR_GUIDE">Tour Guide</option>
                            <option value="TRAVEL_AGENT">Travel Agent</option>
                          </select>
                          {errors.serviceType && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.serviceType}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-200">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Mail className="h-4 w-4 mr-2 text-blue-300" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={signupData.email}
                            onChange={(e) => handleSignupChange("email", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.email ? "border-red-400 wiggle-error" : ""
                            }`}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-300">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Lock className="h-4 w-4 mr-2 text-blue-300" />
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={signupData.password}
                              onChange={(e) => handleSignupChange("password", e.target.value)}
                              className={`w-full px-4 py-2.5 pr-10 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                                errors.password ? "border-red-400 wiggle-error" : ""
                              }`}
                              placeholder="Create a password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-all duration-200"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {signupData.password && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-white/80">Password Strength:</span>
                                <span className="flex items-center gap-1" style={{ color: passwordStrength.color }}>
                                  {passwordStrength.score >= 4 && <CheckCircle className="h-3 w-3" />}
                                  {passwordStrength.feedback}
                                </span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-1 mt-1">
                                <div
                                  className="h-1 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(passwordStrength.score / 6) * 100}%`,
                                    backgroundColor: passwordStrength.color,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {errors.password && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-400">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Lock className="h-4 w-4 mr-2 text-blue-300" />
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={signupData.confirmPassword}
                            onChange={(e) => handleSignupChange("confirmPassword", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.confirmPassword ? "border-red-400 wiggle-error" : ""
                            }`}
                            placeholder="Confirm your password"
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-500">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <Phone className="h-4 w-4 mr-2 text-blue-300" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => handleSignupChange("phone", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.phone ? "border-red-400 wiggle-error" : ""
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-600">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <FileText className="h-4 w-4 mr-2 text-blue-300" />
                            Business Registration Number
                          </label>
                          <input
                            type="text"
                            value={signupData.businessRegNumber}
                            onChange={(e) => handleSignupChange("businessRegNumber", e.target.value)}
                            className={`w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 interactive-hover ${
                              errors.businessRegNumber ? "border-red-400 wiggle-error" : ""
                            }`}
                            placeholder="Enter registration number"
                          />
                          {errors.businessRegNumber && (
                            <p className="text-xs text-red-300 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.businessRegNumber}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1 field-enter delay-700">
                          <label className="flex items-center text-sm font-medium text-white/90">
                            <MapPin className="h-4 w-4 mr-2 text-blue-300" />
                            Business Address
                          </label>
                          <textarea
                            value={signupData.address}
                            onChange={(e) => handleSignupChange("address", e.target.value)}
                            className="w-full px-4 py-2.5 glass-input rounded-md text-gray-800 placeholder-gray-400 min-h-[80px] resize-none interactive-hover"
                            placeholder="Enter your business address"
                            maxLength={500}
                          />
                          <p className="text-xs text-white/60 text-right">{signupData.address.length}/500</p>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading || !signupData.termsAccepted || !signupData.privacyAccepted}
                          className="w-full glass-button text-white font-semibold py-3 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 field-enter delay-900"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Create Account
                            </>
                          )}
                        </button>

                        <div className="text-center text-sm field-enter delay-1000">
                          <p className="text-white/80">
                            Already have an account?{" "}
                            <button
                              onClick={() => handleFormToggle(true)}
                              className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                            >
                              Sign In
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login