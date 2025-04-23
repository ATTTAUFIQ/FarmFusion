import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Experts: React.FC = () => {
  const [experts, setExperts] = useState([
    {
      _id: "",
      name: "",
      email: "",
    },
  ]);
  const getExperts = async () => {
    try {
      const res = await api.get("/users?role=EXPERT");
      setExperts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getExperts();
    getCurrentUser();
  }, []);
  const email = sessionStorage.getItem("email");
  const [currentUser, setCurrentUser] = useState({
    _id: "",
  });
  const [expertId, setExpertId] = useState();
  const [whenDate, setWhenDate] = useState();
  const getCurrentUser = async () => {
    try {
      const res = await api.get(`/users?email=${email}&role=FARMER`);
      console.log(res.data.data);
      setCurrentUser(res.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const navigateTo=useNavigate()
  const bookExpert = async (id: any) => {
    if (!currentUser&&!email) {
      return toast.error("Please Login First");
    }
    try {
      await api.post("/appointments", { expertId: id, farmerId: currentUser?._id, whenDate: whenDate });
    toast.success("Appointment Booked Successfully");

    navigateTo('/farmer/appointments')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <h2 className="text-2xl font-bold text-center mt-10 mb-10">
        Book Your Experts
      </h2>
      <div id="experts" className="flex flex-wrap gap-3 justify-center">
        {experts?.map((items: any) => (
          <div
            key={items._id}
            onClick={() => setExpertId(items._id)}
            className="relative flex  flex-col justify-center overflow-hidden bg-gray-50 "
          >
            <img
              src="/img/beams.jpg"
              alt=""
              className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
              width={1308}
            />
            <div className="group relative cursor-pointer overflow-hidden  px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-lg sm:px-10">
              <span className="absolute top-10 z-0 h-20 w-20 rounded-full bg-green-500 transition-all duration-300 group-hover:scale-[10]" />
              <div className="relative z-10 mx-auto max-w-md">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-green-500 transition-all duration-300 group-hover:bg-green-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-10 w-10 text-white transition-all"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </span>
                <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
                  <h2>{items.name}</h2>
                </div>
                <div className="pt-5 text-base font-semibold leading-7">
                  <p>
                    <a
                      href="#experts"
                      className="text-sky-500 transition-all duration-300 group-hover:text-white"
                    >
                      Book The Expert →
                    </a>
                  </p>
                </div>
                <div className="">
                  {expertId === items._id && (
                    <p className="text-gray-500 text-sm">
                      <input
                        type="date"
                        onChange={(e: any) => setWhenDate(e.target.value)}
                        className="border rounded-lg p-2"
                      />{" "}
                      <button onClick={(e:any)=>{
                        e.stopPropagation()
                        bookExpert(items._id)
                      }} className="border rounded-lg p-2 text-black">Submit</button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experts;
