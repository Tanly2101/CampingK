import React, { useState, useEffect } from "react";
// import { Overview, Loading } from ".";

import { FaCamera } from "react-icons/fa6";
import { ImBin } from "react-icons/im";
import { useAuth } from "../Context/AuthContext";
import { Input } from "@material-tailwind/react";
import axios from "axios";
// import { apiUploadImage } from '../../serviecs/post';
const CreatePost = () => {
  const { user } = useAuth();
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      Images_path: file,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name && formData.email && formData.Images_path) {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("email", formData.email);
      dataToSend.append("mydata", formData.Images_path);

      try {
        // Send formData to the server using fetch
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

        // Display a success message
        alert("Upload successful!");

        // Reset the form data
        setFormData({
          name: "",
          email: "",
          Images_path: null,
        });

        toggleModal(); // Close modal after successful submission
      } catch (error) {
        console.error("Error:", error);
        alert(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    } else {
      alert("Please fill in all the fields.");
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
        <h1 className="text-3xl font-bold mb-4">#NeverStopExploring</h1>
        <p className="mb-4">
          We love seeing our gear out in the wild. Share your photos
          @thenorthface to be featured here.
        </p>
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
        <div className="flex justify-between mt-4">
          <button className="text-blue-500 hover:underline">
            Explore the Gallery →
          </button>
          <button
            onClick={toggleModal}
            className="text-blue-500 hover:underline"
          >
            Add your photo →
          </button>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                    This field is required.
                  </p>
                )}
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
                    This field is required.
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
                  </div>
                </div>
                {!formData.Images_path && (
                  <p className="text-red-500 text-sm mt-1">
                    A photo is required.
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
                Submit photo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
