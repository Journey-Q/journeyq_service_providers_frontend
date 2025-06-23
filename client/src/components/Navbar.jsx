import React from 'react'

const Navbar = () => {
  return (
    <div>
      
    </div>
  )
}

export default Navbar


// import React from "react";
// import logo from "../assets/images/logo.png";
// import { Link } from "react-router-dom";
// import { FiDownload } from "react-icons/fi";

// const Navbar = () => {
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="max-w-[1280px] mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo + Brand Name (Left) */}
//           <Link
//             to="/"
//             className="flex items-center mr-10 no-underline"
//           >
//             <img
//               src={logo}
//               alt="Journeyq Logo"
//               className="w-10 h-10 object-cover rounded-lg"
//             />
//             <span className="ml-3 text-[#1e293b] font-bold text-xl">
//               Journeyq
//             </span>
//           </Link>

//           {/* Center Navigation Links */}
//           <div className="flex flex-1 justify-center gap-8">
//             <Link
//               to="/about"
//               className="text-[#1e293b] font-medium text-sm no-underline py-2 hover:text-blue-600 transition-colors"
//             >
//               About
//             </Link>
//             <Link
//               to="/contact"
//               className="text-[#1e293b] font-medium text-sm no-underline py-2 hover:text-blue-600 transition-colors"
//             >
//               Contact
//             </Link>
//             <button
//               className="flex items-center gap-2 border border-blue-500 text-blue-500 rounded-md px-4 py-2 font-medium text-sm bg-transparent cursor-pointer hover:bg-blue-50 transition-all"
//             >
//               Download the App
//               <FiDownload className="text-base" />
//             </button>
//           </div>

//           {/* Right Navigation Links */}
//           <div className="flex gap-6 ml-10">
//             <Link
//               to="/sign-in"
//               className="text-[#1F74BF] font-medium text-sm no-underline py-2 hover:text-[#1F74BF] transition-colors"
//             >
//               Login
//             </Link>
//             <Link
//               to="/register"
//               className="bg-blue-500 text-white font-medium text-sm rounded-md px-4 py-2 no-underline hover:bg-[#1F74BF] transition-colors"
//             >
//               Register
//             </Link>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;
