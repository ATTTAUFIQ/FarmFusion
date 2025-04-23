import { useState } from "react";
import { FaHome, FaBoxOpen, FaNewspaper, FaInfoCircle } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { RiGovernmentFill } from "react-icons/ri";
import { GiFarmer } from "react-icons/gi";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-1 w-full justify-center">
            <ul className="flex space-x-1">
              {[
                { icon: <FaHome />, text: "Home", href: "#" },
                { icon: <FaBoxOpen />, text: "Products", href: "#products" },
                { icon: <FaNewspaper />, text: "News", href: "#news" },
                { icon: <IoMdSunny />, text: "Weather", href: "#weather" },
                { icon: <RiGovernmentFill />, text: "Schemes", href: "#schemes" },
                { icon: <GiFarmer />, text: "Experts", href: "#experts" },
                { icon: <FaInfoCircle />, text: "About", href: "#about" },
              ].map((item, index) => (
                <li key={index} className="px-2 py-1 rounded-md">
                  <a
                    href={item.href}
                    className="flex items-center text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.text}
                  </a>
                </li>
              ))}
              
              {/* Simple Login Link (No role/path logic) */}
              <li className="px-2 py-1 rounded-md">
                <Link
                  to="/login"
                  className="flex items-center text-white hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <FiUser className="mr-2" />
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-700 bg-opacity-95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {[
              { icon: <FaHome />, text: "Home", href: "#" },
              { icon: <FaBoxOpen />, text: "Products", href: "#products" },
              { icon: <FaNewspaper />, text: "News", href: "#news" },
              { icon: <IoMdSunny />, text: "Weather", href: "#weather" },
              { icon: <RiGovernmentFill />, text: "Schemes", href: "#schemes" },
              { icon: <GiFarmer />, text: "Experts", href: "#experts" },
              { icon: <FaInfoCircle />, text: "About", href: "#about" },
              { icon: <FiUser />, text: "Login", href: "/login" }, // Added Login to mobile menu
            ].map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="flex items-center text-white hover:bg-green-600 px-3 py-2 rounded-md text-base font-medium block"
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;