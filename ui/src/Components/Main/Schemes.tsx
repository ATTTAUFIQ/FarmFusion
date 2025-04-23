import React, { useEffect } from "react";
import api from "../utils/api";

const Schemes: React.FC = () => {
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
 
return (
  <div>
      <div id="schemes">
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
        
        </div>)}
        
      </div>
    </section>
  </div>
  </div>
)
}

export default Schemes;
