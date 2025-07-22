import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { 
  X, 
  User, 
  Brain, 
  Users, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Smartphone, 
  QrCode,
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Star,
  Camera,
  Heart,
  Globe,
  Sparkles,
  Zap,
  Shield,
  Award,
  Mouse
} from "lucide-react";
import img1 from '../assets/images/logo.png'
import trip_post from '../assets/images/trip_post.jpg'
import smartplan from '../assets/images/smartplan.jpg'
import marketplace from '../assets/images/marketplace.jpg'

const Home = () => {
  const navigate = useNavigate(); // Add this hook
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1550679193-d8ec2f2c3a25?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://plus.unsplash.com/premium_photo-1681223447383-402912b83029?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1546209189-247948bf5dfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const appScreenshots = [
    {
      src: smartplan,
      title: "Smart Planner",
      caption: "AI-powered trip planning made simple",
      accent: "from-blue-500 to-purple-600"
    },
    {
      src: trip_post,
      title: "Trip Posts",
      caption: "Share your journey with the community",
      accent: "from-green-500 to-teal-600"
    },
    {
      src: marketplace,
      title: "Marketplace",
      caption: "Book trusted services and accommodations",
      accent: "from-orange-500 to-red-600"
    },
    {
      src: "https://images.unsplash.com/photo-1539650116574-75c0c6d73826?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      title: "Join Trip",
      caption: "Connect and travel with like-minded explorers",
      accent: "from-pink-500 to-rose-600"
    }
  ];
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Trip Planner",
      description: "Get personalized itineraries based on your preferences, budget, and travel style with our advanced AI.",
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: "Join Trips & Travel Together",
      description: "Connect with like-minded travelers and join group adventures around the world safely and easily.",
      color: "from-green-500 to-teal-600",
      bgColor: "bg-green-50"
    },
    {
      icon: BookOpen,
      title: "Share Journals with Budgets & Photos",
      description: "Document your journeys with detailed travel journals, budgets, and stunning photos to inspire others.",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: MapPin,
      title: "Discover Hidden Gems",
      description: "Find secret spots and local favorites recommended by experienced travelers from around the srilanka.",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Shield,
      title: "Safe & Secure Travel",
      description: "Travel with confidence using our verified community and secure booking system with 24/7 support.",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Award,
      title: "Earn Travel Rewards",
      description: "Collect points, badges, and rewards as you explore, share, and help other travelers on their journeys.",
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-yellow-50"
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" }
  ];

  const stats = [
    { number: "2M+", label: "Happy Travelers", icon: Users },
    { number: "150+", label: "Countries", icon: Globe },
    { number: "50K+", label: "Shared Journeys", icon: Camera },
    { number: "4.9★", label: "App Rating", icon: Star }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const scrollToExplore = () => {
    const functionalitiesSection = document.getElementById('functionalities');
    if (functionalitiesSection) {
      functionalitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const nextSlide = () => {
    setCurrentScreenIndex((prev) => (prev + 1) % appScreenshots.length);
  };

  const prevSlide = () => {
    setCurrentScreenIndex((prev) => (prev - 1 + appScreenshots.length) % appScreenshots.length);
  };

  // Updated function to handle service provider button click
  const handleServiceProviderClick = () => {
    navigate('/login'); // This will redirect to the Register page
  };

  return (
    <div className="min-h-screen bg-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 136, 204, 0.3); }
          50% { box-shadow: 0 0 30px rgba(0, 136, 204, 0.6); }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #0088cc, #00b4d8, #0077b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-md">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              {/* Logo placeholder - replace with your actual logo */}
              <img 
                src = {img1}
                alt="JourneyQ Logo" 
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  // Fallback to gradient icon if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-[#0088cc] to-blue-600 rounded-lg items-center justify-center shadow-lg animate-glow hidden">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">JourneyQ</h1>
                <p className="text-xs text-gray-200">Your Travel Companion</p>
              </div>
            </div>

            {/* Updated Service Provider Button */}
            <button
            onClick={handleServiceProviderClick} // Updated onClick handler
            className="bg-[#0088cc] text-white hover:bg-[#0077bb] border border-[#0088cc]/30 shadow-lg rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center"
          >
            <User className="w-4 h-4 mr-2" />
            For Service Providers
          </button>
          </div>
        </div>
      </nav>

      {/* Remove the modal since we're redirecting to Register page */}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
              index === currentImageIndex 
                ? 'opacity-100 scale-110' 
                : 'opacity-0 scale-100'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${image}')`,
              transform: index === currentImageIndex ? 'scale(1.1)' : 'scale(1)',
            }}
          />
        ))}
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0088cc]/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-float delay-500"></div>
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-green-400/20 rounded-full blur-2xl animate-float delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in-up delay-200">
              Discover. Plan.{" "}
              <span className="gradient-text bg-gradient-to-r from-[#0088cc] to-blue-400 bg-clip-text text-transparent animate-pulse">
                Connect.
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-400">
              The ultimate social platform where journeys become stories. Connect with fellow travelers, 
              plan unforgettable adventures with AI assistance, and share your experiences with the Sri Lanka.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 animate-fade-in-up delay-600">
              <button
                onClick={scrollToExplore}
                className="bg-gradient-to-r from-[#0088cc] to-blue-600 hover:from-[#0077bb] hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Explore the App
              </button>
              
              <button className="glass-effect text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
            

            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in-up delay-800">
              <a href="#" className="transition-transform hover:scale-110 duration-300">
                <img 
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                  alt="Download on App Store" 
                  className="h-16 drop-shadow-lg"
                />
              </a>
              <a href="#" className="transition-transform hover:scale-110 duration-300">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-16 drop-shadow-lg"
                />
              </a>
            </div>
          </div>
        </div>
        
        
      </section>

      {/* System Functionalities */}
      <section id="functionalities" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#0088cc]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <div className="inline-block px-6 py-3 bg-[#0088cc]/10 rounded-full text-[#0088cc] font-semibold mb-6">
              ✨ Powerful Features
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              What You Can Do with{" "}
              <span className="gradient-text">JourneyQ</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover powerful features designed to make your travel planning, sharing, and connecting 
              seamless, enjoyable, and unforgettable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${feature.bgColor} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} p-5 mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#0088cc] transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          
        </div>
      </section>

      {/* App Preview Section */}
     <section className="py-24 bg-gradient-to-br from-[#0088cc]/5 to-blue-50 relative overflow-hidden">
  <div className="absolute inset-0">
    <div className="absolute top-20 left-20 w-40 h-40 bg-[#0088cc]/10 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl animate-float delay-1000"></div>
  </div>
  
  <div className="container mx-auto px-6 lg:px-8 relative z-10">
    <div className="text-center mb-20 animate-fade-in-up">
      <div className="inline-block px-6 py-3 bg-[#0088cc]/10 rounded-full text-[#0088cc] font-semibold mb-6">
        📱 App Preview
      </div>
      <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
        Experience <span className="gradient-text">JourneyQ</span> in Action
      </h2>
      <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
        Get a sneak peek of our beautifully designed mobile app that makes travel planning, 
        sharing, and connecting feel effortless and enjoyable.
      </p>
    </div>

    <div className="relative max-w-lg mx-auto">
      <div className="relative">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border border-gray-100"
        >
          <ChevronLeft className="w-6 h-6 text-[#0088cc]" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-white shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border border-gray-100"
        >
          <ChevronRight className="w-6 h-6 text-[#0088cc]" />
        </button>

        {/* Mobile Phone Frame */}
        <div className="relative w-80 h-[640px] mx-auto animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-glow">
            
            {/* Phone Screen */}
            <div className="absolute inset-3 bg-black rounded-[2.5rem] overflow-hidden">
              
              {/* Screen Content - Fullscreen Image */}
              <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                <img
                  src={appScreenshots[currentScreenIndex].src}
                  alt={appScreenshots[currentScreenIndex].title}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <h3 className="text-2xl font-bold mb-2">
                    {appScreenshots[currentScreenIndex].title}
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {appScreenshots[currentScreenIndex].caption}
                  </p>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-white/60 rounded-full z-20"></div>
            </div>

            {/* Phone Highlights */}
            <div className="absolute top-20 left-0 w-1 h-10 bg-gray-600 rounded-r-full"></div>
            <div className="absolute top-40 left-0 w-1 h-16 bg-gray-600 rounded-r-full"></div>
            <div className="absolute top-60 left-0 w-1 h-16 bg-gray-600 rounded-r-full"></div>
            <div className="absolute top-40 right-0 w-1 h-20 bg-gray-600 rounded-l-full"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#0088cc] to-blue-600 rounded-full animate-pulse shadow-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          
          <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-bounce delay-300 shadow-lg"></div>
          
          <div className="absolute top-1/4 -left-8 w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full animate-float delay-500 shadow-lg"></div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Download App Section */}
      <section className="py-24 bg-gradient-to-br from-[#0088cc] to-[#006699] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full blur-2xl animate-bounce delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-white rounded-full blur-2xl animate-float delay-700"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            <div className="flex-1 text-center lg:text-left animate-fade-in-up">
              <div className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold mb-8 border border-white/30">
                🚀 Ready to Start Your Adventure?
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                Start Your Journey with{" "}
                <span className="text-blue-200">JourneyQ</span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
                Download now and join millions of travelers discovering amazing destinations, 
                planning perfect trips, and sharing unforgettable memories with AI-powered assistance.
              </p>
              
              <div className="mb-10">
                <p className="text-2xl font-bold text-white mb-8 flex items-center justify-center lg:justify-start gap-3">
                  <Zap className="w-8 h-8 text-yellow-300" />
                  Download Now and Travel Smarter
                </p>
                
                <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6 mb-10">
                  <a href="#" className="transition-all hover:scale-110 duration-300 drop-shadow-lg">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on App Store" 
                      className="h-16"
                    />
                  </a>
                  <a href="#" className="transition-all hover:scale-110 duration-300 drop-shadow-lg">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                      alt="Get it on Google Play" 
                      className="h-16"
                    />
                  </a>
                </div>
              </div>

              
            </div>

            <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up delay-300">
              <div className="relative">
                <div className="relative w-96 h-[700px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[4rem] p-4 shadow-2xl transform hover:scale-105 transition-transform duration-500 animate-glow">
                  <div className="w-full h-full bg-black rounded-[3.5rem] overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-gray-900 rounded-b-3xl z-10"></div>
                    
                    <div className="w-full h-full bg-gradient-to-br from-[#0088cc] via-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full blur-xl animate-float"></div>
                      </div>
                      
                      <div className="text-center text-white p-10 relative z-10">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30 animate-float">
                          <img src = {img1} />
                        </div>
                        
                        <h3 className="text-4xl font-bold mb-4">JourneyQ</h3>
                        <p className="text-xl text-blue-100 mb-8">Your Ultimate Travel Companion</p>
                        
                        <div className="flex justify-center space-x-6 mb-8">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Brain className="w-6 h-6 text-white" />
                          </div>
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        
                        
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center animate-pulse">
                  <div className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white rounded-full shadow-2xl animate-bounce delay-1000 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                
                <div className="absolute top-1/4 -left-8 w-10 h-10 bg-white rounded-full shadow-xl animate-float delay-500 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#0088cc]" />
                </div>
              </div>
            </div>
          </div>
          
   
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#0088cc] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0088cc] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold gradient-text bg-gradient-to-r from-[#0088cc] to-blue-400 bg-clip-text text-transparent">JourneyQ</h3>
                  <p className="text-sm text-gray-400">Your Travel Companion</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                The ultimate social platform where journeys become stories. Connect with fellow travelers, 
                plan unforgettable adventures with AI assistance, and share your experiences with the world.
              </p>
              
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 bg-gray-800 hover:bg-[#0088cc] rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 border border-gray-700 hover:border-[#0088cc]"
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4">
                {["About Us", "Features", "How It Works", "Pricing", "Blog", "Careers"].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-400 hover:text-[#0088cc] transition-colors duration-300 flex items-center gap-2 group">
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Support</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                  <Mail className="h-5 w-5 text-[#0088cc]" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">support@journeyq.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl border border-gray-700">
                  <Phone className="h-5 w-5 text-[#0088cc]" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 JourneyQ. All rights reserved. Made with ❤️ for travelers worldwide.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#0088cc] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#0088cc] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#0088cc] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;