import { FaFacebook, FaInstagram, FaWhatsapp, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import { IoCall } from 'react-icons/io5';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/logo.png"
            alt="Company Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg bg-white p-2 shadow-md mix-blend-multiply transform hover:scale-105 transition-transform duration-300"
          />
          <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-serif">
            YourBrand
          </h1>
        </div>

        {/* Social Media Icons */}
        <div className="hidden md:flex space-x-3 mb-4 md:mb-0">
          <a href="#" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 text-blue-600 hover:text-blue-800">
            <FaFacebook className="text-2xl" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 text-pink-500 hover:text-pink-700">
            <FaInstagram className="text-2xl" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 text-green-500 hover:text-green-700">
            <FaWhatsapp className="text-2xl" />
          </a>
          <a href="#" className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300 text-blue-400 hover:text-blue-600">
            <FaTwitter className="text-2xl" />
          </a>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
            <HiMail className="text-2xl text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Email Us</p>
              <p className="text-sm font-medium text-gray-700">email@example.com</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
            <IoCall className="text-2xl text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Call Us</p>
              <p className="text-sm font-medium text-gray-700">+1 234 567 890</p>
            </div>
          </div>
          
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
            <FaMapMarkerAlt className="text-2xl text-green-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Visit Us</p>
              <p className="text-sm font-medium text-gray-700">1234 Main St</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Social Icons */}
      <div className="md:hidden flex justify-center space-x-4 py-3 bg-white/50">
        <FaFacebook className="text-xl text-blue-600" />
        <FaInstagram className="text-xl text-pink-500" />
        <FaWhatsapp className="text-xl text-green-500" />
        <FaTwitter className="text-xl text-blue-400" />
      </div>
    </div>
  );
};

export default Header;