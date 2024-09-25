import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import SanPHam from "./Component/SanPHam";
import Home from "./Component/Home";
import Checkout from "./Component/Checkout";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import { ChiTietSanPham } from "./Component";
// import { ArrowLongDownIcon } from "@heroicons/react/24/outline";
import Registration from "./Component/Registration";
import { path } from "./ultis/constant";
import {
  System,
  CreatePost,
  ManagePost,
  EditAccount,
  EditCart,
} from "./containers/System";
import { adminPages } from "./containers/Admin";
import { AppProvider } from "./Context/ContextSearch";
import { useAuth } from "./Context/AuthContext";
import AdminRoutes from "./ultis/AdminRoutes";
import BlogDetail from "./Component/BlogDetail";

export function App() {
  const location = useLocation();
  const { user } = useAuth();
  console.log(user?.vaitro);
  const shouldHideFooter = () => {
    const noFooterPaths = [
      "/Checkout",
      "/admin",
      path.SYSTEM,
      `/he-thong/sua-thong-tin-ca-nhan`, // Thay thế `path.SYSTEM` nếu cần
      `/he-thong/quan-ly-don-hang`,
      `/login`, // Thay thế `path.SYSTEM` nếu cần
    ];

    // Kiểm tra chính xác đường dẫn hoặc bắt đầu bằng đường dẫn
    return noFooterPaths.some(
      (path) => location.pathname === path || location.pathname.startsWith(path)
    );
  };

  return (
    <>
      <Header />
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/SanPham" element={<SanPHam />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route
            path="/Checkout"
            element={user ? <Checkout /> : <Navigate to="/" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/registration"
            element={!user ? <Registration /> : <Navigate to="/" replace />}
          />
          <Route path="/SanPham/:id" element={<ChiTietSanPham />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Route>
        <Route path={path.SYSTEM} element={<System />}>
          {/* <Route path={path.CREATE_POST} element={<CreatePost />} /> */}
          {/* <Route path={path.MANAGE_POST} element={<ManagePost />} /> */}
          <Route path={path.EDIT_ACCOUNT} element={<EditAccount />} />
          <Route path={path.EDIT_CART} element={<EditCart />} />
        </Route>
      </Routes>
      {!shouldHideFooter() && <Footer />}
    </>
  );
}

export default App;
