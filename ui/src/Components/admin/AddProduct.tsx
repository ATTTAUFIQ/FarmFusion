import React, { useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: File;
}
export type SetUpdate = (value: any) => void;

const AddProduct: React.FC<{ data: ProductData,setUpdate: SetUpdate }> = ({ data,setUpdate }) => {
  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [price, setPrice] = useState(data?.price);
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const navigateTo=useNavigate()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      name: "",
      description: "",
      price: "",
      image: "",
    };

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!description) {
      newErrors.description = "Description is required";
      valid = false;
    }

    if (!price || isNaN(Number(price))) {
      newErrors.price = "Valid price is required";
      valid = false;
    }

    if (!image) {
      newErrors.image = "Image is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image as File);
    try {
      if (data?.name) {
        await api.put(`/products/${data?._id}`, formData);
        toast.success("Product Updated successfully");
        navigateTo('/admin/products')
        setUpdate(null)
      } else {
         await api.post("/products", formData);
       toast.success("Product added successfully");
       navigateTo('/admin/products')
      }
      
    } catch (error:any) {
      toast.error(error.response.data.msg);
    }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className=" flex justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">{ data?.name ? "Edit Product" : "Add Product"}</h2>

        <div className="grid grid-cols-1  gap-6 ">
          <div>
            <label htmlFor="name" className="block text-green-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Product Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-green-600 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              placeholder="Product Description"
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block text-green-600 mb-2">
              Price
            </label>
            <input
              type="text"
              id="price"
              value={price}
              placeholder="Product Price"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div>
            <label htmlFor="image" className="block text-green-600 mb-2">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              {data?.name ? "Update Product" : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
