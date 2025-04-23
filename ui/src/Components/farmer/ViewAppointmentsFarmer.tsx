import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { FaRegCopy } from "react-icons/fa";

const ViewAppointmentsFarmer: React.FC = () => {
  const email = sessionStorage.getItem("email");
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
      const res = await api.get(`/users?email=${email}&role=FARMER`);
      console.log(res.data.data);
      setCurrentUser(res.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const getAppointMents = async () => {
    try {
      const res = await api.get(
        `/appointments?role=FARMER&farmerId=${currentUser._id}`
      );
      setAppointments(res.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCurrentUser();
  
  }, []);
  useEffect(() => {
    getAppointMents();
  },[currentUser])
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
              <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">
                #
              </th>
              <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Appointment Date
              </th>
              <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Google Meet Link
              </th>
              <th className=" py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Appointment Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {appointments.map((appointment: any, index: number) => (
              <tr key={appointment._id}>
                <td className="py-4 px-6 border-b border-gray-200">
                  {index + 1}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {appointment.whenDate}
                </td>{" "}
                <td className="py-4 px-6 border-b border-gray-200">
                <p className="text-gray-900">{appointment.meetLink} <FaRegCopy className="text-gray-500 cursor-pointer"  onClick={()=>copyText(appointment.meetLink, appointment._id)}/> </p>  
                {isCopied===appointment._id && (
        <p className="mt-2 text-green-500">Copied to clipboard!</p>
      )}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="bg-green-500 text-white py-1 px-2 rounded-full text-xs">
                    {" "}
                    {appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAppointmentsFarmer;
