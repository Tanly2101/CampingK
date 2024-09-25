import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState({});
  const navigate = useNavigate(); // Khởi tạo useNavigate

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
        setImages(imagesByBlogId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const featuredBlog = blogs[0];
  const sideBlogs = blogs.slice(1, 4);

  const handleBlogClick = (id) => {
    // Điều hướng tới trang chi tiết blog khi người dùng click vào blog
    navigate(`/blog/${id}`);
  };

  return (
    <div className="p-4 bg-blue-900">
      <h1 className="text-2xl font-bold text-white mb-4">Blog List</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {featuredBlog && (
          <div
            className="lg:col-span-2 relative cursor-pointer"
            onClick={() => handleBlogClick(featuredBlog.id)} // Điều hướng khi click vào blog chính
          >
            {images[featuredBlog.id] && images[featuredBlog.id][0] && (
              <img
                src={images[featuredBlog.id][0]}
                alt={featuredBlog.title}
                className="w-full h-96 object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
              <h2 className="text-white text-xl font-semibold">
                {featuredBlog.title}
              </h2>
              <p className="text-white text-sm">Read more</p>
            </div>
          </div>
        )}
        <div className="lg:col-span-1">
          <div className="grid grid-cols-1 gap-4">
            {sideBlogs.map((blog) => (
              <div
                key={blog.id}
                className="relative cursor-pointer"
                onClick={() => handleBlogClick(blog.id)} // Điều hướng khi click vào blog phụ
              >
                {images[blog.id] && images[blog.id][0] && (
                  <img
                    src={images[blog.id][0]}
                    alt={blog.title}
                    className="w-full h-28 object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                  <h2 className="text-white text-sm font-semibold">
                    {blog.title}
                  </h2>
                  <p className="text-white text-xs">Read more</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
