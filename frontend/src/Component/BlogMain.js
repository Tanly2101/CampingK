import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const BlogMain = () => {
  const [blogs, setBlogs] = useState([]);
  const [imagesByBlogId, setImagesByBlogId] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/datablogs`
        );
        const { blogs, blogImages } = response.data;
        setBlogs(blogs);

        const imagesByBlogId = blogImages.reduce((acc, image) => {
          if (!acc[image.blog_id]) acc[image.blog_id] = [];
          acc[image.blog_id].push(image.secure_url);
          return acc;
        }, {});
        setImagesByBlogId(imagesByBlogId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Blog List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="border border-gray-300 bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex flex-col items-stretch"
          >
            <Link to={`/blog/${blog.id}`} className="mb-3">
              <h2 className="text-2xl font-semibold text-blue-600 hover:underline truncate text-center">
                {blog.title}
              </h2>
            </Link>
            <div className="flex-grow">
              {imagesByBlogId[blog.id]?.[0] && (
                <img
                  src={imagesByBlogId[blog.id][0]}
                  alt={`Blog ${blog.title}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12"></div> {/* Khoảng cách với footer */}
    </div>
  );
};

export default BlogMain;
