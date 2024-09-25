import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogManage = () => {
  const [activeTab, setActiveTab] = useState("reviewImages");
  const [imageUrls, setImageUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(6); // Number of images per page
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [imagesByBlogId, setImagesByBlogId] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/images`)
      .then((response) => {
        const processedUrls = response.data.map((image) => ({
          ...image,
          imageUrl: `${process.env.REACT_APP_SERVER_URL}/src${image.Images_path}`,
        }));
        console.log("Processed Image URLs:", processedUrls);
        setImages(response.data);
        setImageUrls(processedUrls);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

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

  // Pagination logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = imageUrls.slice(indexOfFirstImage, indexOfLastImage);

  const handleApprove = async (imageId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/updateDuyet/${imageId}`
      );
      alert(response.data.message || "Role updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role. Please try again.");
    }
  };

  const handleReject = (imageId) => {
    console.log(`Rejected image with ID: ${imageId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(imageUrls.length / imagesPerPage);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titleBlog", title);
    formData.append("contentBlog", content);

    // Append selected images
    for (let i = 0; i < selectedImages.length; i++) {
      formData.append("images", selectedImages[i]);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Blog post created successfully!");
      setTitle("");
      setContent("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating blog post:", error);
      alert("Error creating blog post. Please try again.");
    }
  };
  const handleDeleteBlog = async (blogId) => {
    try {
      // Call the API to delete the images first
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/blog/${blogId}/images`
      );

      // Call the API to delete the blog after images have been deleted
      await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/blog/${blogId}`
      );

      alert("Blog and images deleted successfully");

      // Update your state here to remove the deleted blog from the UI
      // Example: updateBlogs(blogId) to remove the blog from the list
    } catch (error) {
      console.error("Error deleting blog or images:", error);
      alert("An error occurred while deleting the blog.");
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("reviewImages")}
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "reviewImages"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Review Images
        </button>
        <button
          onClick={() => setActiveTab("createBlog")}
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "createBlog"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          Create Blog Post
        </button>
        <button
          onClick={() => setActiveTab("listBlogs")}
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "listBlogs"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600"
          }`}
        >
          List Blogs
        </button>
      </div>

      <div className="p-6">
        {activeTab === "reviewImages" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Review User Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentImages.map((image) => (
                <div
                  key={image.idImg}
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center"
                >
                  <img
                    src={image.imageUrl}
                    alt="User Image"
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <p className="text-gray-700 mb-2">Image Description</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(image.idImg)}
                      className={`px-4 py-2 rounded-md shadow-md ${
                        image.duyet === "DaDuyet"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      disabled={image.duyet === "DaDuyet"}
                    >
                      {image.duyet === "DaDuyet" ? "Đã Duyệt" : "Chưa Duyệt"}
                    </button>
                    <button
                      onClick={() => handleReject(image.idImg)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                    >
                      Xóa Ảnh
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4 text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeTab === "createBlog" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Create a Blog Post</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  rows="4"
                  value={content}
                  onChange={handleContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Images
                </label>
                <input
                  type="file"
                  id="image"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {activeTab === "listBlogs" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">List of Blogs</h2>
            <ul className="space-y-4">
              {blogs.map((blog) => (
                <li
                  key={blog.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-md flex items-start space-x-4"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{blog.title}</h3>
                    <p className="text-gray-700 text-sm line-clamp-2">
                      {blog.content}
                    </p>{" "}
                    {/* Nội dung hiển thị ngắn */}
                    {imagesByBlogId[blog.id] && (
                      <div className="flex space-x-2">
                        {imagesByBlogId[blog.id].map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Blog Image ${index}`}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManage;
