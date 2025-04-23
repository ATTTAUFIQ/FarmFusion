import React, { useEffect } from 'react'
import api from '../utils/api';
import { FaPlusSquare, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ViewShemesAdmin = () => {
    const [schemes, setSchemes] = React.useState<any>([
        {
            _id:"", 
            name:"",
            description:"",
            link:""
        }
    ]);
    const getSchemes = async () => {
        try {
            await api.get("/govt-schemes").then((res) => {
                console.log(res.data);
            setSchemes(res.data.data);
            })
        } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(() =>{getSchemes()},[]);
    const deleteScheme = async (id:any) => {
        try {
            await api.delete(`/govt-schemes/${id}`).then((res) => {
                console.log(res.data);
                getSchemes();
            })
        } catch (error) {
            console.log(error);

        }
    }
  return (
    <div>
        <div id="schemes">
            <div className="flex justify-end">
                <Link to='/admin/add-scheme'><FaPlusSquare className='h-8 w-8 text-purple-500 '/></Link>
            </div>
      <section
        id="projects"
        className="mb-20 animate-fade-in-up"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-3xl font-bold mb-8 text-primary-light dark:text-primary-dark">
          Government Schemes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schemes?.map((items:any)=><div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg  duration-300 transform hover:scale-105 transition-transform">
            <h3 className="text-xl font-semibold mb-2">
              {items.name}
            </h3>
            <p className="mb-4">
              {items.description}
            </p>
            <a
              href={items.link}
              target='_blank'
              rel="noopener noreferrer"
              className="text-primary-light dark:text-primary-dark hover:underline transition-colors duration-300"
            >
              Visit Website →
            </a>
            <div className='flex justify-end'>
            <button onClick={()=>deleteScheme(items._id)}><FaTrash className='h-6 w-6 text-red-500'/></button></div>
          </div>)}
          
        </div>
      </section>
    </div>
    </div>
  )
}

export default ViewShemesAdmin