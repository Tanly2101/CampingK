import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import SanPHam from "./Component/SanPHam";
import Home from "./Component/Home";
import Checkout from "./Component/Checkout";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import Login from "./Component/Login";
import LoadingSpinner from "./Component/LoadingSpinner";
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
import BlogMain from "./Component/BlogMain";

export function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Thêm isLoading từ hook useAuth nếu có
  const [userRole, setUserRole] = useState(1); // Khởi tạo state cho vai trò của user

  useEffect(() => {
    if (user === undefined) {
      setLoading(true);
    } else {
      // Lấy dữ liệu từ LocalStorage
      const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
      if (userDataFromLocalStorage) {
        setUserRole(userDataFromLocalStorage.vaitro);
      }
      setLoading(false);
    }
  }, [user]);
  if (loading) {
    return <div>{loading && <LoadingSpinner />}</div>; // Có thể thay bằng spinner hoặc thông báo chờ
  }

  const shouldHideFooter = () => {
    const noFooterPaths = [
      "/Checkout",
      "/admin",
      path.SYSTEM,
      `/he-thong/sua-thong-tin-ca-nhan`, // Thay thế `path.SYSTEM` nếu cần
      `/he-thong/quan-ly-don-hang`,
      `/login`,
      "/Registration", // Thay thế `path.SYSTEM` nếu cần
    ];

    // Kiểm tra chính xác đường dẫn hoặc bắt đầu bằng đường dẫn
    return noFooterPaths.some(
      (path) => location.pathname === path || location.pathname.startsWith(path)
    );
  };
  const shouldHideHeader = () => {
    const noHeaderPaths = ["/login", "/admin", "/Registration"];

    // Kiểm tra chính xác đường dẫn hoặc bắt đầu bằng đường dẫn
    return noHeaderPaths.some(
      (path) => location.pathname === path || location.pathname.startsWith(path)
    );
  };
  return (
    <>
      {!shouldHideHeader() && <Header />}
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/SanPham" element={<SanPHam />} />
          <Route path="/blog" element={<BlogMain />} />
          <Route
            path="/admin/*"
            element={<AdminRoutes userRole={userRole} />}
          />
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
