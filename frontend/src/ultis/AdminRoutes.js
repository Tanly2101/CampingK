import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminPages from "../containers/Admin/adminPages";
import Dashboard from "../containers/Admin/adminDashboar";
import OrderManage from "../containers/Admin/orderManage";
import BlogManage from "../containers/Admin/bolgManage";
import RevenueManage from "../containers/Admin/revenueManage";
import UserManage from "../containers/Admin/userManage";
import ProductsManage from "../containers/Admin/ProductsManage";
import { useAuth } from "../Context/AuthContext";
const AdminRoutes = ({ userRole }) => {
  // const { user } = useAuth();

  // Kiểm tra xem user có phải là admin không
  if (userRole === "1") {
    return (
      <Routes>
        <Route path="/" element={<AdminPages />}>
          {/* Admin pages */}
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderManage />} />
          <Route path="blog" element={<BlogManage />} />
          <Route path="revenue" element={<RevenueManage />} />
          <Route path="taikhoan" element={<UserManage />} />
          <Route path="products" element={<ProductsManage />} />
        </Route>
      </Routes>
    );
  } else {
    return <Navigate to="/" replace />;
  }
  //   return (
  //     <Routes>
  //       <Route path="/" element={<AdminPages />}>

  //       </Route>
  //       {/* Các route khác */}
  //     </Routes>
  //   );
  // };
};
export default AdminRoutes;
