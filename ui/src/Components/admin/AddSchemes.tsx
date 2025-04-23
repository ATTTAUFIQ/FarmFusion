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

const AddSchemes: React.FC = () => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [link, setLink] = useState();
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    link: "",
   
  });
  const navigateTo=useNavigate()

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      name: "",
      description: "",
     
      link: "",
    };

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!description) {
      newErrors.description = "Description is required";
      valid = false;
    }


    if (!link) {
      newErrors.link = "Link is required";
      valid = false;
    }

    
   

    setErrors(newErrors);

    if (valid) {
    
    try {
   
         await api.post("/govt-schemes", {
          name,
          description,
          link,
         });
       toast.success("Scheme added successfully");
       navigateTo('/admin/schemes')
     
    } catch (error:any) {
      toast.error(error.response.data.msg);
      toast.error('Failed to add scheme');

    }
    }
  };

 

  return (
    <div className=" flex justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4">Add Government Schemes</h2>

        <div className="grid grid-cols-1  gap-6 ">
          <div>
            <label htmlFor="name" className="block text-green-600 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Scheme Name"
              onChange={(e:any) => setName(e.target.value)}
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
              placeholder="Scheme Description"
              onChange={(e:any) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block text-green-600 mb-2">
              Link
            </label>
            <input
              type="text"
              id="price"
              value={link}
              placeholder="e.g https://www.mh-gov.in"
              onChange={(e:any) => setLink(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {errors.link && (
              <p className="text-red-500 text-sm mt-1">{errors.link}</p>
            )}
          </div>
         
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
             Add Scheme
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddSchemes;
