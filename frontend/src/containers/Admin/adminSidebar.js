import React from "react";
import { Link } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { NavLink } from "react-router-dom";
const adminSidebar = () => {
  return (
    <>
      <div className="w-[256px] flex-none p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col text-center font-semibold text-[34px]">
            Dashboard
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/admin/orders"
              className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px]"
            >
              Quản lý Đơn Hàng
            </NavLink>
            <NavLink
              to="/admin/taikhoan"
              className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px]"
            >
              Quản lý Người dùng
            </NavLink>
            <NavLink
              to="/admin/blog"
              className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px]"
            >
              Quản lý Blog
            </NavLink>
            <NavLink
              to="/admin/revenue"
              className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px]"
            >
              Quản lý doanh thu
            </NavLink>
            <NavLink
              to="/admin/products"
              className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px]"
            >
              Quản lý Sản phẩm
            </NavLink>
          </div>
          <span className="hover:bg-gray-200 rounded-md flex items-center gap-2 ml-[5px] cursor-pointercd">
            <CiLogout />
            Thoát
          </span>
        </div>
      </div>
    </>
  );
};

export default adminSidebar;
