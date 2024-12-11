import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import { Editor } from "@tinymce/tinymce-react";
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
  const [deletedImageId, setDeletedImageId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  ///////////////////////

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
      // alert(response.data.message || "Role updated successfully!");
      Swal.fire({
        title: response.data.message || "Role updated successfully!",
        width: 600,
        padding: "3em",
        color: "#716add",
        timer: 2000, // Thời gian tự động đóng
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      });
      setImageUrls((prevImages) =>
        prevImages.map((image) =>
          image.idImg === imageId ? { ...image, duyet: "DaDuyet" } : image
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role. Please try again.");
    }
  };

  const handleReject = (idImg) => {
    setDeletedImageId(idImg); // Cập nhật ID của ảnh đã xóa
  };
  // useEffect(() => {
  //   const deleteImage = async () => {
  //     console.log(deletedImageId);
  //     try {
  //       // Gọi API xóa Tin Đăng
  //       if (!deletedImageId) return;

  //       const response = await fetch(
  //         `http://localhost:5000/api/v1/delete-tin-dang/${deletedImageId}`,
  //         {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to delete the image");
  //       }
  //       // const result = await response.json();
  //       const contentType = response.headers.get("content-type");
  //       let result;
  //       if (contentType && contentType.includes("application/json")) {
  //         result = await response.json(); // Chỉ gọi .json() nếu nội dung là JSON
  //       } else {
  //         const text = await response.text(); // Nếu không phải JSON, lấy dữ liệu dạng text
  //         result = { message: text }; // Tạo một đối tượng JSON chứa thông báo
  //       }
  //       toast.success("Image deleted successfully!");
  //       console.log(result.message); // Hiển thị thông điệp thành công
  //     } catch (error) {
  //       console.error("Error deleting image:", error);
  //       toast.error("Failed to delete the image.");
  //     } finally {
  //       setDeletedImageId(null);
  //     }
  //   };
  //   deleteImage();
  // }, [deletedImageId]);
  useEffect(() => {
    const deleteImage = async () => {
      if (!deletedImageId) return; // Nếu không có deletedImageId thì dừng ngay
      setLoading(true);
      try {
        // Gọi API xóa Tin Đăng
        const response = await fetch(
          `http://localhost:5000/api/v1/delete-tin-dang/${deletedImageId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete the image");
        }

        // Kiểm tra xem phản hồi có phải JSON không
        const contentType = response.headers.get("content-type");
        let result;
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
        } else {
          const text = await response.text();
          result = { message: text };
        }

        toast.success("Image deleted successfully!");
        window.location.reload();
        console.log(result.message);
        // Hiển thị thông điệp thành công
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete the image.");
      } finally {
        // Chỉ cập nhật lại deletedImageId sau khi xóa xong
        setDeletedImageId(null);
      }
    };

    deleteImage();
  }, [deletedImageId]); // Chạy lại useEffect khi deletedImageId thay đổi

  const handlePageChange = (pageNumber) => {
    // Đảm bảo rằng số trang không vượt quá giới hạn
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(imageUrls.length / imagesPerPage);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (content, editor) => {
    // setContent(e.target.value);
    setContent(content);
  };

  // const handleImageChange = (e) => {
  //   setSelectedImages(e.target.files);
  // };
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Lấy ảnh đầu tiên nếu có
    if (file) {
      setSelectedImages(file);
      setPreview(URL.createObjectURL(file)); // Tạo preview cho ảnh đã chọn
    }
  };

  // Xử lý khi xóa ảnh
  const handleRemoveImage = () => {
    setSelectedImages(null); // Xóa ảnh đã chọn
    setPreview(null); // Xóa preview
    fileInputRef.current.value = "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      Swal.fire({
        title: "Vui lòng điền đầy đủ tiêu đề và nội dung.",
        width: 600,
        padding: "3em",
        color: "#716add",
        timer: 2000,
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      });
      return; // Dừng lại nếu title hoặc content không có
    }

    // Kiểm tra nếu không có hình ảnh được chọn
    if (selectedImages.length === 0) {
      Swal.fire({
        title: "Vui lòng chọn ít nhất một hình ảnh.",
        width: 600,
        padding: "3em",
        color: "#716add",
        timer: 2000,
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      });
      return; // Dừng lại nếu không có hình ảnh
    }
    const formData = new FormData();
    formData.append("titleBlog", title);
    formData.append("contentBlog", content);
    console.log("Selected Images: ", selectedImages);
    // Append selected images
    if (selectedImages) {
      formData.append("images", selectedImages); // append ảnh duy nhất
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
      // alert("Blog post created successfully!");
      Swal.fire({
        title: "Blog post created successfully!",
        width: 600,
        padding: "3em",
        color: "#716add",
        timer: 2000, // Thời gian tự động đóng
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      });
      setTitle("");
      setContent("");
      setSelectedImages([]);
    } catch (error) {
      console.error("Error creating blog post:", error);

      Swal.fire({
        title: "Bạn đã thiếu dữ liệu ở đâu đó hãy kiểm tra nha",
        width: 600,
        padding: "3em",
        color: "#716add",
        timer: 2000, // Thời gian tự động đóng
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      });
      // alert();
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

      // alert("Blog and images deleted successfully");
      Swal.fire({
        title: "Blog and images deleted successfully",
        width: 600,
        padding: "3em",
        color: "#716add",
        // timer: 2000, // Automatic close time
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          left top
          no-repeat
        `,
      }).then(() => {
        // Reload the page after the user clicks 'OK'
        window.location.reload();
      });
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
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
                    src={image.Images_path}
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
                      {loading && deletedImageId === image.idImg ? ( // Hiển thị spinner khi đang xóa
                        <ClipLoader color="#ffffff" size={24} />
                      ) : (
                        "Xóa Ảnh"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || currentImages.length === 0} // Disabled nếu không có sản phẩm hoặc trang đầu
                className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="mx-4 text-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === totalPages || currentImages.length === 0
                } // Disabled nếu không có sản phẩm hoặc trang cuối
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
                <Editor
                  apiKey="hanuvt9goeoa4t35vf4y63bpjjadg7msb59meo5rw1vrnt8x" // Thay bằng API key của bạn
                  value={content}
                  onEditorChange={handleContentChange}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "link",
                      "image",
                      "lists",
                      "charmap",
                      "preview",
                      "anchor",
                      "pagebreak",
                      "searchreplace",
                      "wordcount",
                      "visualblocks",
                      "visualchars",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "emoticons",
                      "help",
                    ],
                    toolbar:
                      "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | link image | print preview media fullscreen | " +
                      "forecolor backcolor emoticons | help",
                    image_advtab: true, // Bật tab chỉnh sửa ảnh nâng cao
                    automatic_uploads: true, // Tự động tải ảnh lên
                    file_picker_types: "image", // Giới hạn chọn file chỉ là hình ảnh
                    file_picker_callback: (callback, value, meta) => {
                      if (meta.filetype === "image") {
                        const input = document.createElement("input");
                        input.setAttribute("type", "file");
                        input.setAttribute("accept", "image/*");

                        input.onchange = function () {
                          const file = this.files[0];
                          const reader = new FileReader();

                          reader.onload = function () {
                            // Chèn ảnh vào trình soạn thảo
                            callback(reader.result, {
                              alt: file.name,
                            });
                          };
                          reader.readAsDataURL(file);
                        };

                        input.click();
                      }
                    },
                  }}
                />
                {/* <textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                /> */}
              </div>
              <div className="w-full max-w-md mx-auto">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Images
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-4 flex flex-col items-center">
                  {preview && (
                    <div className="relative mb-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                      >
                        X
                      </button>
                    </div>
                  )}
                  {!preview && (
                    <p className="text-gray-500 text-sm">No image selected</p>
                  )}
                </div>
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
                    <p
                      className="text-gray-700 text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    ></p>{" "}
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
