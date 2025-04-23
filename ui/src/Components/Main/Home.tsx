import React, { useEffect } from "react";
import ViewProducts from "./ViewProducts";
import News from "./News";
import Weather from "./Weather";
import Experts from "./Experts";
import Schemes from "./Schemes";
import Navbar from "./Navbar";
import Header from "./Header";


const Home: React.FC = () => {
  // const images = [
  //   '/img.png',
  //   '/img1.png',
  //   '/img.png'
  // ]

const role= sessionStorage.getItem("role");
// const [currentRole,setCurrentRole]=React.useState(role);
const [path,setPath]=React.useState("");
useEffect(() =>{
  // setCurrentRole(role);
  if(role==="ADMIN"){
    setPath("/admin")
  }else if(role==="FARMER"){
    setPath("/farmer")
  }else if(role==="EXPERT"){
    setPath("/expert")
  }
},[])
  return (
    <div className=" ">
      {/* Header */}
<Header></Header>

     <Navbar></Navbar>

      {/* images */}
      <div className="">
        <div className="bg-[url('/im1.png')]  h-[600px] p-2 bg-no-repeat bg-cover relative">
          <h4 className=" absolute right-44 top-44 text-4xl text-white font-mono font-bold">
            FarmFusion
          </h4>
          <h4 className=" absolute right-20 top-52 text-xl text-yellow-400 font-mono font-bold">
            Seamless Integration of Agriculture & Technology
          </h4>
          <div className="flex absolute space-x-12 top-[500px] left-1/2 transform -translate-x-1/2">
            <div className="w-44 h-44 rounded-lg bg-white shadow-md items-center justify-center">
              <h6 className="ml-12">Feature</h6>
              <img
                src="https://lnctu.ac.in/wp-content/uploads/2021/05/agriculture-student.jpg"
                alt=""
                className="w-24 h-20 rounded-lg justify-center items-center ml-10 mt-4"
              />
            </div>
            <div className="w-44 h-44 rounded-lg bg-white shadow-md">
              <h6 className="ml-12">Feature</h6>

              <img
                src="https://www.osgu.ac.in/wp-content/uploads/2020/09/MG_6390.jpeg"
                alt=""
                className="w-24 h-20 rounded-lg justify-center items-center ml-10 mt-4"
              />
            </div>
            <div className="w-44 h-44 rounded-lg bg-white shadow-md">
              <h6 className="ml-12">Feature</h6>

              <img
                src="https://www.shutterstock.com/image-photo/young-indian-farmer-sign-on-260nw-1878533734.jpg"
                alt=""
                className="w-24 h-20 rounded-lg justify-center items-center ml-10 mt-4"
              />
            </div>
            <div className="w-44 h-44 rounded-lg bg-white shadow-md">
              <h6 className="ml-12">Feature</h6>

              <img
                src="https://www.shutterstock.com/image-photo/two-indian-farmers-spend-their-260nw-2370391985.jpg"
                alt=""
                className="w-24 h-20 rounded-lg justify-center items-center ml-10 mt-4"
              />
            </div>
          </div>
        </div>
        {/* <img src="/im1.png" alt="" className='w-screen h-[600px] p-2' /> */}

        <div className="mt-36 flex  " id="about">
          <div className=" relative ml-28">
            <img
              src="https://www.deere.com/assets/images/common/industries/agriculture/agriculture-carousel-6m-r4x002531-1366x768.jpg"
              alt=""
              className="w-[1900px] h-[500px] p-2 rounded-full"
            />
            <img
              src="https://lnctu.ac.in/wp-content/uploads/2021/05/agriculture-student.jpg"
              alt=""
              className="w-[300px] h-[300px] p-3 bg-white rounded-full absolute right-56 top-56 "
            />
          </div>
          <div className="mt-16 ml-6">
            <h3 className=" text-6xl font-serif">
              Agriculture & Organic Product Farm
            </h3>
            <p className="text-wrap">
              Farming is the practice of cultivating soil, growing crops, and
              raising animals for food, fiber, and other products. It is
              essential for providing the global population with sustenance and
              raw materials. Modern farming combines traditional methods with
              advanced technology, such as irrigation, machinery, and crop
              management techniques. Sustainable farming practices focus on
              preserving soil health, conserving water, and reducing
              environmental impact, ensuring long-term food security and
              ecosystem health.
            </p>
            <button className=" w-44 h-20 bg-green-600 rounded-2xl text-xl text-white font-serif mt-1">
              Discover More
            </button>
          </div>
        </div>
      </div>

      <ViewProducts />
    <Experts/>
    <Schemes/>
      <News/>
      <Weather/>
      <Footer/>
    </div>
  );
};

export default Home;
  const Footer = () => (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-7 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base leading-6 text-gray-400">
              &copy; 2024  All rights reserved @ Farma-Fusion.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );