import React, { useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ViewProducts: React.FC = () => {
  const [products, setProducts] = React.useState([
    {
      _id: '',
      name: '',
      price: '',
      description: '',
      image: '',
    },
  ]);
  const navigate = useNavigate();
  const getProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-10">
      <h2 className="text-4xl font-bold text-green-700 text-center mb-12 tracking-tight">Discover Our Collection</h2>

      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto">
        {products.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-green-100 transform hover:-translate-y-1"
          >
            {/* Image section */}
            {/* Image section */}
            <div className="w-full aspect-[4/3] overflow-hidden relative rounded-t-3xl">
              <img
                src={item.image}
                onError={(e: any) => (e.target.src = '/prod.jpg')}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <span className="absolute top-3 left-3 bg-green-500 text-white text-[12px] px-3 py-1 rounded-full shadow-sm tracking-wide">
                New
              </span>
            </div>


            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-green-900">{item.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-3">{item.description}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xl font-bold text-green-600">₹{item.price}</span>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => navigate(`/product/${item._id}`)}  // This is now the correct path
                  className="w-full bg-green-600 text-white py-2 rounded-full font-medium shadow-md hover:bg-green-700 hover:shadow-lg transition"
                >
                  More Details
                </button>


                <button   onClick={() => navigate(`/product/${item._id}`)} className="w-full bg-white border border-green-500 text-green-600 py-2 rounded-full font-medium shadow-sm hover:bg-green-50 transition">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
