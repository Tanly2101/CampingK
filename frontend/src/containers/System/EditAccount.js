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
  const handleToggle = () => {
    setShowPasswordFields(!showPasswordFields);
  };
  // Handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setSuccessMessage(""); // Clear previous success message when a new file is selected
    setErrorMessage(""); // Clear previous error message
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
        const fullAvatarUrl = `${process.env.REACT_APP_SERVER_URL}/src${response.data.avatarUrl}`;
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
      console.log("File uploaded successfully:", response.data);
    } catch (error) {
      // Set error message
      setErrorMessage("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col w-full  items-center">
      <h1 className="font-bold w-full text-start h-[69px] flex-none text-2xl border-b-2 py-4">
        Chỉnh sửa thông tin cá nhân{" "}
      </h1>
      <div className="w-3/5  items-center justify-center flex-auto">
        <div className=" py-6 flex flex-col gap-4 ">
          <InputReadOnly direction={"flex"} label="Mã Thành Viên" />
          <InputReadOnly direction={"flex"} label="Số Điện Thoại" />

          <InputFrom
            setInvalidFields={setInvalidFields}
            invalidFields={invalidFields}
            direction={"flex"}
            label="Tên hiển thị"
            className="w-full"
          />
          <div className="flex w-full">
            <label className="w-48 flex-none" htmlFor="password">
              Mật Khẩu
            </label>
            <div className="flex-auto  text-blue-500 cursor-pointer w-full">
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
                      placeholder="Nhập lại mật khẩu mới"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex mb-6 w-full">
            <label htmlFor="avatar" className="w-48 flex-none">
              {" "}
              Ảnh đại diện
            </label>
            <div className="flex flex-col gap-4">
              <img
                src={`${avatarUrl}` || users}
                alt="avatar"
                className="w-28 h-28 rounded-full object-cover"
              ></img>
              <input
                type="file"
                name="myfile"
                id=""
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          </div>

          <button
            className=" bg-blue-500 text-white p-2 rounded-md"
            onClick={handleSubmit}
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
