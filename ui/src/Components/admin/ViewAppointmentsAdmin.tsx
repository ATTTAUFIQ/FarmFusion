import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

import { FaRegCopy } from "react-icons/fa6";

const ViewAppointmentsAdmin: React.FC = () => {
  const email = sessionStorage.getItem("email");
  const [status,setStatus]=useState("")
  const [meetLink,setMeetLink]=useState("")
  const [currentUser, setCurrentUser] = useState({
    _id: "",
  });
  const [appointments, setAppointments] = useState([
    {
      _id: "",
      whenDate: "",
      status: "",
    },
  ]);
  const getCurrentUser = async () => {
    try {
      const res = await api.get(`/users?email=${email}&role=EXPERT`);
      console.log(res.data.data);
      setCurrentUser(res.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const getAppointMents = async () => {
    try {
      const res = await api.get(
        `/appointments/all`
      );
      setAppointments(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCurrentUser();
    getAppointMents();
  }, []);
  const updateStatus=async(appointment:any,status:string)=>{
    try {
      const res=await api.put(`/appointments/${appointment._id}`,{status:status,meetLink:meetLink})
      console.log(res.data.data)
      getAppointMents()
    } catch (error) {
      toast.error("Something went wrong")
      console.log(error)
  }
}
const [isCopied, setIsCopied] = useState('');

const copyText = (textToCopy:any, id:string) => {
  //const textToCopy = "https://meet.google.com/abc-defg-hij"; // Text to be copied

  navigator.clipboard.writeText(textToCopy).then(() => {
    setIsCopied(id);

    // Hide the "Copied!" message after 2 seconds
    setTimeout(() => {
      setIsCopied('');
    }, 2000);
  });
};

  return (
    <div>
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              {/* <th className="p-2 text-left text-gray-600 font-bold uppercase">
                #
              </th> */}
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
                Appointment Date
              </th>
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
                Farmer
              </th>
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
               Expert
              </th>
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
                Meet Link
              </th>
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
                Appointment Status
              </th>
              <th className="p-2 text-left text-gray-600 font-bold uppercase">
               Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment: any, ) => (
              <tr key={appointment._id}>
                {/* <td className="p-2 border-b border-gray-200">
                  {index + 1}
                </td> */}
                <td className="p-2 border-b border-gray-200">
                  {appointment.whenDate}
                </td>
               
                <td className="p-2 border-b border-gray-200">
                  {appointment.farmer?.name}
                  <p className="text-gray-500 text-sm">{appointment.farmer?.email}</p>
                </td>
                <td className="p-2 border-b border-gray-200">
                  {appointment.expert?.name}
                  <p className="text-gray-500 text-sm">{appointment.expert?.email}</p>

                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                <p className="text-gray-900">{appointment.meetLink} <FaRegCopy className="text-gray-500 cursor-pointer"  onClick={()=>copyText(appointment.meetLink, appointment._id)}/> </p>  
                {isCopied===appointment._id && (
        <p className="mt-2 text-green-500">Copied to clipboard!</p>
      )}
                </td>
                <td className="p-2 border-b border-gray-200">
                  <span className="bg-green-500 text-white py-1 px-2 rounded-full text-xs">
                    {" "}
                    {appointment.status}
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                 <input type="text" onChange={(e:any)=>setMeetLink(e.target.value)}  name="meetLink" placeholder="paste meet link here" className="rounded-lg w-full border p-2 m-1 border-gray-300" />
                 <select value={status} name="status" onChange={(e:any)=>setStatus(e.target.value)} id="status" className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                   <option value="PENDING">Pending</option>
                   <option value="ACCEPTED">Accepted</option>
                   <option value="REJECTED">Rejected</option>
                 </select>
                 <button onClick={()=>updateStatus(appointment,status)} className="border rounded-lg bg-green-500 text-white py-1 px-2 m-1">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAppointmentsAdmin;
