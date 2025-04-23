import React, { useEffect, useState } from 'react'
import api from '../utils/api';
import { FaRegPlusSquare, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ViewExpertsAdmin:React.FC = () => {
    const [experts,setExperts]=useState([
        {
            _id:'',
            name:'',
            email:''
        }
    ])
    const getExperts = async () => {
        try {
        const res=    await api.get('/users?role=EXPERT')
    setExperts(res.data.data)    
    } catch (error) {
            console.log(error);
            
        }
    }
    useEffect(()=>{
getExperts()
    },[]);
    const deleteExpert = async (id:string) => {
        try {
            await api.delete(`/users/${id}?role=EXPERT`, {
                data: {
                    role: "EXPERT"
                }
            })
            getExperts()
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div>
         <div className="flex justify-end p-5">
        <Link to={'/admin/add-expert'}>
          <FaRegPlusSquare className="h-12 w-12 text-green-500" />
        </Link>
      </div>
        <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
            <table className='w-full table-fixed'>
    <thead>
        <tr className='bg-gray-100'>
            <th className='w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase'>#</th>
            <th className='w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase'>Name</th>
            <th className='w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase'>Email</th>
            <th className='w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase'>Action</th>
        </tr>
    </thead>
    <tbody>
        {experts.map((expert,index)=>{
            return(
                <tr className='bg-white' key={expert._id}>
                    <td className='py-4 px-6 border-b border-gray-200'>{index+1}</td>
                    <td  className='py-4 px-6 border-b border-gray-200'>{expert.name}</td>
                    <td className='py-4 px-6 border-b border-gray-200'>{expert.email}</td>
                    <td className='py-4 px-6 border-b border-gray-200'><button onClick={()=>deleteExpert(expert._id)}><FaTrash className='text-red-500 h-8 w-8' /></button></td>
                       
           
           </tr> )
        })
        }
    </tbody>
            </table>
        </div>
    </div>
  )
}

export default ViewExpertsAdmin