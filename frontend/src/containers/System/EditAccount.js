import React, { useState, useRef, useEffect } from "react";
import { InputReadOnly, InputFrom } from "../../Component";
import users from "../../assets/img/user.png";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
const EditAccount = () => {
  const { user } = useAuth();
  const [invalidFields, setInvalidFields] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (user && user.id) {
      setContactInfo({
        nameTK: user.nameTK || "",
        phone: user.phone || "",
      });
    }
  }, [user]);
  const handleToggle = () => {
    setShowPasswordFields(!showPasswordFields);
  };
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
      setSuccessMessage("");
      setErrorMessage("");
    }
  };
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    fileInputRef.current.value = ""; // Clear the file input field
  };
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user || !user.id) {
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/user/avatar/${user.id}`
        );
        const fullAvatarUrl = `${response.data.avatarUrl}`;
        console.log(fullAvatarUrl);
        setAvatarUrl(fullAvatarUrl);
        // setAvatarUrl(response.data.avatarUrl);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [user]);
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !user.id) {
      setErrorMessage("User ID not found. Please log in again.");
      return;
    }

    if (!selectedFile) {
      setErrorMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("myfile", selectedFile);
    formData.append("userId", user.id); // Thêm user.id vào FormData

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/uploadfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Set success message and reset the file input
      setSuccessMessage("File uploaded successfully!");
      setErrorMessage(""); // Clear any error message
      setSelectedFile(null); // Clear the selected file
      fileInputRef.current.value = ""; // Reset the file input field
      window.location.reload();
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      // Set error message
      setErrorMessage("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };
  const handleSubmitPassword = async () => {
    // Kiểm tra xem mật khẩu mới và mật khẩu xác nhận có trùng khớp không
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      // Gửi request API để đổi mật khẩu
      const response = await axios.post(
        "http://localhost:5000/api/v1/change-password",
        {
          userId: user.id, // Thay bằng userId thực tế
          oldPassword,
          newPassword,
        }
      );

      // Nếu đổi mật khẩu thành công
      setSuccess(response.data.message);
      setError("");

      // Xóa token đăng nhập (nếu có) và yêu cầu người dùng đăng nhập lại
      localStorage.removeItem("user"); // Nếu bạn lưu token trong localStorage

      // Chuyển hướng người dùng đến trang đăng nhập
      window.location.href = "/login"; // Đảm bảo trang đăng nhập có sẵn
    } catch (err) {
      setError(err.response?.data?.message || "Đã xảy ra lỗi");
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col w-full  items-center">
      <h1 className="font-bold w-full text-start h-[69px] flex-none text-2xl border-b-2 py-4">
        Chỉnh sửa thông tin cá nhân{" "}
      </h1>
      <div className="w-3/5  items-center justify-center flex-auto">
        <div className=" py-6 flex flex-col gap-4 ">
          <InputReadOnly
            direction={"flex"}
            value={contactInfo.nameTK}
            label="Tên Hiện Thị"
          />
          <InputReadOnly
            direction={"flex"}
            value={contactInfo.phone}
            label="Số Điện Thoại"
          />
          <div className="flex w-full">
            <label className="w-48 flex-none" htmlFor="password">
              Mật Khẩu
            </label>
            <div className="flex-auto text-blue-500 cursor-pointer w-full">
              <small className="h-12" onClick={handleToggle}>
                Đổi Mật Khẩu
              </small>

              {showPasswordFields && (
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Mật Khẩu Cũ
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Nhập mật khẩu cũ"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Mật Khẩu Mới
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nhập mật khẩu mới"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Xác Nhận Mật Khẩu Mới
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <button
                    className="bg-blue-500 text-white p-2 rounded-md"
                    onClick={handleSubmitPassword}
                  >
                    Cập Nhật
                  </button>
                  {error && <div className="text-red-500 mt-2">{error}</div>}
                  {success && (
                    <div className="text-green-500 mt-2">{success}</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex mb-6 w-full">
            <label
              htmlFor="avatar"
              className="w-48 flex-none text-gray-700 font-medium"
            >
              Ảnh đại diện
            </label>
            <div className="flex flex-col gap-4 w-full">
              <div className="border border-gray-300 rounded-lg p-4 flex flex-col items-center">
                <img
                  src={avatarUrl || users}
                  alt="Avatar"
                  className="w-28 h-28 rounded-full object-cover mb-4"
                />
                <input
                  type="file"
                  name="myfile"
                  id="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="text-sm text-gray-600"
                />
              </div>
              <div className="relative border border-gray-300 rounded-lg p-4 bg-gray-100 flex flex-col items-center">
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-28 h-28 rounded-full object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      onClick={handleRemoveFile}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">No image selected</p>
                )}
              </div>
            </div>
          </div>

          <button
            className=" bg-blue-500 text-white p-2 rounded-md"
            onClick={handleSubmit}
            disabled={!selectedFile}
          >
            Cập Nhật
          </button>
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
