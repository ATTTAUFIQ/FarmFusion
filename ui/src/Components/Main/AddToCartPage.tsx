import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash, ShoppingCart, ArrowRightCircle, Plus, Minus, Info } from 'lucide-react'; // Import Lucide icons
import Navbar from './Navbar';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  createdAt: string;
}

const AddToCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Retrieve the cart data from localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      ),
    );
    // Update localStorage whenever the quantity changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const handleRemove = (id: string) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Razorpay Payment Integration
  const handleRazorpayPayment = () => {
    const options: any = {
      key: 'rzp_test_ZglqkhKmjt7KLv', // Replace with your Razorpay key
      amount: totalPrice * 100, // Amount in paise
      currency: 'INR',
      name: 'farmfusion',
      description: 'Proceed to Checkout',
      image: 'https://your_logo_url.png', // Optional logo image
      handler: (response: any) => {
        alert('Payment Successful!');
        console.log(response); // Here you can handle the response (transaction details)
        // Proceed to success page or update order status here
      },
      prefill: {
        name: 'Customer Name', // Prefill customer info
        email: 'customer@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Some address', // Add custom notes for order
      },
      theme: {
        color:  '#28a745', // Custom theme color
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-white text-gray-800 font-[Inter,sans-serif]">
      <Navbar />

      <div className="flex flex-col min-h-screen bg-gray-50 py-8 px-6">
        <h1 className="text-4xl font-semibold text-green-800 mb-8 text-center">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-center text-gray-500">Your cart is empty!</p>
        ) : (
          <div className="flex-grow">
            <ul className="space-y-6">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-lg p-4 transition-all duration-300 hover:scale-105 transform hover:shadow-2xl"
                >
                  <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 transform hover:scale-110"
                    />
                    <div className="mt-4 md:mt-0">
                      <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                      <p className="text-xs text-gray-400">Added on: {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-6 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                        className="w-16 text-center text-sm font-medium border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-500 hover:text-red-700 transition-all duration-300"
                      >
                        <Trash size={22} />
                      </button>
                      <Link
                        to={`/product/${item._id}`}
                        className="text-blue-500 hover:text-blue-700 transition-all duration-300"
                      >
                        <Info size={22} />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center justify-center mt-8 space-y-4 border-t border-gray-300 pt-6">
              <div className="text-2xl font-medium text-gray-800">
                <span className="text-green-700">Total: ₹{totalPrice}</span>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <button
                  onClick={handleRazorpayPayment}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-all duration-300"
                >
                  <ArrowRightCircle size={18} />
                  Proceed to Checkout
                </button>
                <Link
                  to="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCartPage;
