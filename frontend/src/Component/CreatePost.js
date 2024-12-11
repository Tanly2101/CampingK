import React, { useState, useEffect } from "react";
// import { Overview, Loading } from ".";
import { ClipLoader } from "react-spinners";
import { FaCamera } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import { useAuth } from "../Context/AuthContext";
import { Input } from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from "axios";
// import { apiUploadImage } from '../../serviecs/post';
const CreatePost = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(false);
  const [preview, setPreview] = useState(null);
  // const [fileState, setFileState] = useState({ images: [] });
  // /////////////////////////////////////////////////////////
  // const handleDeleteImg = (image) => {
  //   const newImages = [...fileState.images];
  //   newImages.splice(image, 1);
  //   setFileState((prevState) => ({
  //     ...prevState,
  //     images: newImages,
  //   }));
  // };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    Images_path: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/images`)
  //     .then((response) => {
  //       const imageUrls = response.data.map((image) => {
  //         const fullImageUrl = `${process.env.REACT_APP_SERVER_URL}/src${image.avatarUrl}`;
  //         console.log(fullImageUrl);
  //         return fullImageUrl;
  //       });
  //       setImages(imageUrls);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching images:", error);
  //     });
  // }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/images`)
      .then((response) => {
        // Xử lý và lưu URL của hình ảnh vào state
        const processedUrls = response.data.map((image) => ({
          ...image,
          imageUrl: `${image.Images_path}`,
        }));
        // console.log("Processed Image URLs:", processedUrls);
        setImages(response.data);
        setImageUrls(processedUrls);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);
  // useEffect(() => {
  //   console.log(images);
  // }, [images]);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  // const handleFileChange = (e) => {
  //   setFormData(e.target.files[0]);
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingImg(true);
      // Bắt đầu loading
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      setTimeout(() => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          Images_path: file,
        }));
        setLoadingImg(false); // Kết thúc loading sau khi xử lý
      }, 1000); // Mô phỏng xử lý tệp (thay 1000 bằng thời gian thực tế nếu cần)
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.Images_path) {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("mydata", formData.Images_path);

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/upload-experience`,
          {
            method: "POST",
            body: dataToSend,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload experience. Please try again.");
        }

        const data = await response.json();
        console.log("Success:", data);

        // Hiển thị thông báo thành công bằng alert
        // alert("Upload thành công!");
        Swal.fire({
          title: "Upload thành công!",
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

        // Reset form data
        setFormData({
          name: "",
          email: "",
          Images_path: null,
        });

        // Đóng modal sau khi submit thành công (giả sử toggleModal được định nghĩa ở nơi khác)
        toggleModal();
      } catch (error) {
        // console.error("Error:", error);
        alert(
          error.message || "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại."
        );
      } finally {
        setLoading(false); // Kết thúc loading
      }
    } else {
      Swal.fire({
        title: "Vui lòng điền đầy đủ thông tin.",
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
      // alert("Vui lòng điền đầy đủ thông tin.");
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };

  // const handleSubmit = () => {
  //   // Handle form submission
  //   console.log("Form submitted");
  // };

  ////////////////////////////////////////////////////
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">#Dừng Lại Và Khám Phá</h1>
        <p className="mb-4">
          Chúng tôi thích nhìn thấy thiết bị của mình ở nơi hoang dã. Chia sẻ
          ảnh của bạn @CampingK để được giới thiệu ở đây.
        </p>
        <div className="flex justify-between mt-4">
          {/* <button className="text-blue-500 hover:underline">
            Khám Phá Thư Viện →
          </button> */}
          <button
            onClick={toggleModal}
            className="text-blue-500 hover:underline"
          >
            Thêm Ảnh Của Bạn Vào →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {imageUrls
            .filter((image) => image.duyet === "DaDuyet")
            .map((image) => (
              <div key={image.idImg} className="bg-gray-200 h-64">
                <img
                  src={image.imageUrl}
                  alt={image.name || `Image ${image.idImg}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add your photo</h2>
              <button
                onClick={toggleModal}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  label="name"
                  onChange={handleInputChange}
                  required
                  className={`mt-1 p-2 border h-[40px] text-[18px] ${
                    !formData.name ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                />
                {!formData.name && (
                  <p className="text-red-500 text-sm mt-1">
                    Thiếu Trường Này Rồi.
                  </p>
                )}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                  required
                  className={`mt-1 p-2 border h-[40px] text-[18px] ${
                    !formData.email ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                />
                {!formData.email && (
                  <p className="text-red-500 text-sm mt-1">
                    Thiếu Trường Này Rồi.
                  </p>
                )}
              </div>
              <div className="mb-4 flex items-center"></div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Photo*
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {loadingImg ? (
                      <div className="flex justify-center items-center">
                        <ClipLoader color="#e882d8" size={35} />
                        <p className="ml-2 text-sm text-gray-500">
                          Đang xử lý...
                        </p>
                      </div>
                    ) : (
                      <>
                        {formData.Images_path ? (
                          <div>
                            <p className="text-sm text-gray-700 mb-2">
                              Tệp đã chọn:
                              {preview && (
                                <img
                                  src={preview}
                                  alt="Preview"
                                  className="h-48 w-full object-cover rounded-md"
                                />
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prevFormData) => ({
                                  ...prevFormData,
                                  Images_path: null,
                                }));
                                setPreview(null);
                              }}
                              className="text-red-500 underline text-sm"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8h12v12h-4v-8h-8v4h-4V8z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <path
                                d="M8 28h12v12H8V28z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <path
                                d="M4 20h4v4H4v-4zm20 0h4v4h-4v-4zm8 8h4v4h-4v-4zM4 36h4v4H4v-4z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="mydata"
                                  type="file"
                                  className="sr-only"
                                  onChange={handleFileChange}
                                  required
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {!formData.Images_path && !loadingImg && (
                  <p className="text-red-500 text-sm mt-1">
                    Thiếu Trường Này Rồi.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={
                  !formData.name || !formData.email || !formData.Images_path
                }
                className={`w-full py-2 px-4 rounded-md transition duration-300 ${
                  formData.name && formData.email && formData.Images_path
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <ClipLoader color="#e882d8" size={35} />
                ) : (
                  "Đăng Ảnh"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
