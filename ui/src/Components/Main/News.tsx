import React, { useEffect, useState } from "react";
import api from "../utils/api"; // Assuming you have an API utility to fetch data

const News: React.FC = () => {
  const [articles, setArticles] = useState([
    {
      title: "",
      description: "",
      url: "",
      urlToImage: "",
    },
  ]);
  const [displayCount, setDisplayCount] = useState(5); // Set initial number of articles to show

  // Fetch articles on component mount
  useEffect(() => {
    api
      .get("/utils/news?topic=farm&sortBy=publishedAt") // Modify to match your API endpoint
      .then((response) => {
        setArticles(response.data.articles); // Assuming the response structure is the same
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  }, []);

  // Function to handle "Show More" button click
  const handleShowMore = () => {
    setDisplayCount((prevCount) => prevCount + 5); // Show 5 more articles
  };

  return (
    <div className="" id="news">
      <h3 className="text-3xl font-bold mb-4 text-center">News Section</h3>
      <div className="grid grid-cols-1 gap-5 justify-center items-center w-full">
        {articles.slice(0, displayCount).map((article, index) => (
          <div
            key={index}
            className="flex p-4 gap-5 border rounded-lg hover:bg-gray-100 transition-colors duration-300 ease-in-out"
          >
            <img
              src={article.urlToImage}
              alt={article.title}
              onError={(e: any) => {
              return  e.target.src = "/globe.jpg";
              }}
              className="h-44 w-44 rounded-lg "
            />
            <div className="news-card-body">
              <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
              <p className="text-wrap truncate">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:underline mt-4"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
        {articles.length > displayCount && (
          <button
            onClick={handleShowMore}
            className="mt-4 p-2 bg-green-300 text-white rounded hover:bg-green-700"
          >
            Show More news &darr;
          </button>
        )}
      </div>
    </div>
  );
};

export default News;
