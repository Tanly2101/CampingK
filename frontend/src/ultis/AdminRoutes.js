import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminPages from "../containers/Admin/adminPages";
import Dashboard from "../containers/Admin/adminDashboar";
import OrderManage from "../containers/Admin/orderManage";
import BlogManage from "../containers/Admin/bolgManage";
import RevenueManage from "../containers/Admin/revenueManage";
import UserManage from "../containers/Admin/userManage";
import ProductsManage from "../containers/Admin/ProductsManage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminPages />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrderManage />} />
        <Route path="blog" element={<BlogManage />} />
        <Route path="revenue" element={<RevenueManage />} />
        <Route path="taikhoan" element={<UserManage />} />
        <Route path="products" element={<ProductsManage />} />
      </Route>
      {/* Các route khác */}
    </Routes>
  );
};

export default AdminRoutes;
