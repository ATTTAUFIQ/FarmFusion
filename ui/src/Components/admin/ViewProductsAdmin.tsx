import React, { useEffect } from "react";
import api from "../utils/api";
import { FaRegEdit, FaRegPlusSquare } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AddProduct from "./AddProduct";

const ViewProductsAdmin: React.FC = () => {
  const [products, setProducts] = React.useState([
    {
      _id: "",
      name: "",
      price: "",
      description: "",
      image: "",
    },
  ]);
  const getProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getProducts();
  }, []);
  const deleteProduct = async (id: string) => {
    try {
       await api.delete(`/products/${id}`);
       getProducts();
    } catch (error) {
      
    }
  }
  const [update, setUpdate] = React.useState<any>()
  const updateProduct = async (items:Object) => {
    setUpdate(items)
  }
  return (
    <div className="">

   {update?.name?<AddProduct data={update} setUpdate={setUpdate}/>: <div className="bg-gray-100">
      <h2 className="text-3xl font-bold text-center p-4">All Products</h2>
      <div className="flex justify-end p-5">
        <Link to={'/admin/add-product'}>
          <FaRegPlusSquare className="h-12 w-12 text-green-500" />
        </Link>
      </div>{" "}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
        id="products"
      >
        {products?.map((items) => (
          <div
            key={items._id}
            className="max-w-md mx-auto rounded-md overflow-hidden shadow-md hover:shadow-lg"
          >
            <div className="relative">
              <img
                className="w-full h-36"
                src={`${items.image}`}
                //   src="https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                onError={(e: any) => {
                  e.target.src = "/prod.jpg";
                }}
                alt="Product Image"
              />
              {/* <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
      SALE
    </div> */}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium mb-2">{items.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{items.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">₹{items.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => updateProduct(items)}>
                  <FaRegEdit className="text-green-600 hover:text-green-300 h-8 w-8" />
                </button>
                <button onClick={() => deleteProduct(items._id)}>
                  <FaTrash className="text-red-600 hover:text-red-300 h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    </div>
  );
};

export default ViewProductsAdmin;
