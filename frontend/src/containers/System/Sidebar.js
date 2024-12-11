import React, { useEffect, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import userAvatar1 from "../../assets/img/user.png"; // Đổi tên biến để tránh conflict
import menusideBar from "../../ultis/menuSidebar";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const ActiveStyle =
  "hover:bg-gray-200 rounded-md flex items-center gap-2 font-bold bg-gray-200 p-2";
const NotActiveStyle =
  "hover:bg-gray-200 rounded-md flex items-center gap-2 p-2";

const Sidebar = () => {
  // Đổi tên component thành viết hoa
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  // useEffect(() => {
  //   if (user) {
  //     setContactInfo(user.nameTK);
  //     // setUserAvatar(user.anhdaidien);
  //   }
  // }, [user]);
  useEffect(() => {
    // Cập nhật contactInfo khi user thay đổi
    if (user && user.id) {
      setContactInfo({
        nameTK: user.nameTK || "", // Gán tên người dùng
        phone: user.phone || "", // Gán số điện thoại
      });
    }
  }, [user]);
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user || !user.id) {
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/user/avatar/${user.id}`
        );
        // console.log("API Response:", response.data);
        const fullAvatarUrl = `${response.data.avatarUrl}`;
        // console.log(fullAvatarUrl);
        setAvatarUrl(fullAvatarUrl);
        console.log("User Avatar Set:", fullAvatarUrl);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar();
  }, [user]);
  const handleLogout = () => {
    // Thêm logic đăng xuất (nếu có)
    // console.log("Đã đăng xuất!");

    // Điều hướng về trang chủ
    navigate("/");
  };

  return (
    <div className="w-64 flex-none p-4 flex flex-col gap-6">
      {/* User Info Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={`${avatarUrl}` || userAvatar1}
            alt="avatar"
            className="w-12 h-12 object-cover rounded-full border-2 border-white"
          />
          <div className="flex flex-col justify-center">
            <span className="font-semibold">{contactInfo.nameTK || "Tan"}</span>
            <small>Số điện thoại: {contactInfo.phone || "0"}</small>
          </div>
        </div>
        <span>
          Mã Thành Viên:{" "}
          <small className="font-medium">{user?.id || "Chưa có ID"}</small>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-4">
        {menusideBar.map((item) => (
          <NavLink
            className={({ isActive }) =>
              isActive ? ActiveStyle : NotActiveStyle
            }
            key={item.id}
            to={item.path}
          >
            {item.icon}
            <span>{item.text}</span>
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="hover:bg-gray-200 rounded-md flex items-center gap-2 p-2 cursor-pointer"
        >
          <CiLogout />
          <span>Thoát</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
