import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Navbar from './Navbar';
import {
    Truck,
    RotateCw,
    ShieldCheck,
    ArrowLeft,
    IndianRupee,
    BadgePercent,
    ShoppingBag,
    Tag,
    Star,
    CreditCard,
    Store,
    ShoppingCart
} from 'lucide-react';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

const ProductDetails: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [cartCount, setCartCount] = useState<number>(0); // Track cart count
    const navigate = useNavigate();



    const goToCart = () => {
        navigate('/addtocart'); // Navigate to the cart page
    };

    const butNowAndGotoCart = (product: any) => {


        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if the product is already in the cart
        const existingProduct = cart.find((item: any) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity if product exists
        } else {
            cart.push({ ...product, quantity: 1 }); // Add new product to cart
        }

        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart count immediately
        updateCartCount(); // Call this function to update the cart count state

        // Show toast notification instead of alert
        toast.success('Product added to cart!', {
            position: "top-right", // Position of the toast
            autoClose: 3000, // Duration the toast will stay on screen (in ms)
            hideProgressBar: false, // Whether to show the progress bar
            closeOnClick: true, // Close on click
            pauseOnHover: true, // Pause on hover
            draggable: true, // Make it draggable
            progress: undefined,
        });
        goToCart();
    }


    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
    };


    const getProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data.data);
        } catch (error) {
            console.error('Failed to fetch product details:', error);
        }
    };

    const addToCart = (product: any) => {
        // Get current cart from localStorage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if the product is already in the cart
        const existingProduct = cart.find((item: any) => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity if product exists
        } else {
            cart.push({ ...product, quantity: 1 }); // Add new product to cart
        }

        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update the cart count immediately
        updateCartCount(); // Call this function to update the cart count state

        // Show toast notification instead of alert
        toast.success('Product added to cart!', {
            position: "top-right", // Position of the toast
            autoClose: 3000, // Duration the toast will stay on screen (in ms)
            hideProgressBar: false, // Whether to show the progress bar
            closeOnClick: true, // Close on click
            pauseOnHover: true, // Pause on hover
            draggable: true, // Make it draggable
            progress: undefined,
        });
    };


    useEffect(() => {
        getProduct();
        updateCartCount(); // Set cart count on component load
    }, [id]);

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl font-medium text-green-700 animate-pulse">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-white text-gray-800 font-[Inter,sans-serif]">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Aesthetic Image Section */}
                <div className="flex flex-col items-center justify-center bg-white p-6 rounded-3xl shadow-md border border-green-200">
                    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-green-100 shadow-lg group">
                        <img
                            src={product.image || '/prod.jpg'}
                            onError={(e: any) => (e.target.src = '/prod.jpg')}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-105 bg-green-50"
                        />
                        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                            Featured
                        </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="w-14 h-14 bg-green-50 rounded-xl shadow border border-green-200 p-1">
                            <img src={product.image || '/prod.jpg'} alt="Thumbnail" className="w-full h-full object-contain rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-semibold text-green-800 mb-2 flex items-center gap-3">
                            {product.name}
                            <div className="relative ml-4">
                                <ShoppingCart className="w-6 h-6 text-green-700 cursor-pointer" onClick={goToCart} />

                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1 py-0.5 -mt-4 -mr-3">
                                        {cartCount}
                                    </span>
                                )}
                            </div> {/* Cart count badge */}
                        </h1>


                        <div className="flex items-center gap-2 text-yellow-500 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-600 ml-2">(4.8 / 5)</span>
                        </div>

                        <div className="flex items-center text-2xl text-green-600 font-semibold mb-4">
                            <IndianRupee className="w-6 h-6 mr-1" />
                            {product.price}
                        </div>

                        <div className="bg-green-100 p-5 rounded-xl border border-green-200 mb-6">
                            <h2 className="text-lg font-medium text-green-700 mb-2 flex items-center gap-2">
                                <BadgePercent className="w-5 h-5 text-green-600" />
                                Product Description
                            </h2>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center gap-2">
                                <Truck className="w-5 h-5 text-green-700" />
                                <span><strong>Delivery:</strong> Free delivery within 3–5 days</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCw className="w-5 h-5 text-green-700" />
                                <span><strong>Return:</strong> 10 days easy return</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-700" />
                                <span><strong>Warranty:</strong> 6-month manufacturer warranty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-green-700" />
                                <span><strong>Payment:</strong> Secure Checkout Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Store className="w-5 h-5 text-green-700" />
                                <span><strong>Sold by:</strong> Akiyaras Official</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <button onClick={() => butNowAndGotoCart(product)} className="bg-green-600 hover:bg-green-700 text-white text-base font-medium px-6 py-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2">
                            <ShoppingBag className="w-5 h-5"
                            />
                            Buy Now
                        </button>

                        <button
                            onClick={() => addToCart(product)} // Add to Cart functionality
                            className="bg-yellow-400 hover:bg-yellow-500 text-white text-base font-medium px-6 py-3 rounded-full shadow-lg transition duration-300 flex items-center justify-center gap-2"
                        >
                            <Tag className="w-5 h-5" />
                            Add to Cart
                        </button>

                        <button
                            onClick={() => window.history.back()}
                            className="bg-white border border-green-600 text-green-700 hover:bg-green-50 text-base px-6 py-3 rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
