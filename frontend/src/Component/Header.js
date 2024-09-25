import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Link, Navigate } from "react-router-dom";
import "../App.css";
import menuManage from "../ultis/menuManage";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions";
import Search from "./Search";
import { AppProvider, ContextSearch } from "../Context/ContextSearch";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";
export default function Header() {
  const { user } = useAuth();
  // const dispatch = useDispatch();
  // // const [filteredData, setFilteredData] = useState(data);
  // const { isLoggedIn } = useSelector((state) => state.auth);
  let [IsShowMenu, setIsShowMenu] = useState(false);
  let [isActive, setActive] = useState(false);
  const { search, setSearch } = useContext(ContextSearch);
  const { cartData, thaydoisoluong, tongtien, handleDeleteClick } = useCart();
  const storedUser = localStorage.getItem("user");
  const idKhachHang = storedUser ? JSON.parse(storedUser) : null;

  // const userId = idKhachHang.id;
  // console.log(userId);
  // useEffect(() => {

  //   // console.log("User:", user);

  // }, [user]); // Chạy khi giá trị của user thay đổi

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };

  const toggleSidebar = () => {
    setSearch(search);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  let handleopenShopping = () => {
    setActive(true);
  };
  let handlecloseShopping = () => {
    setActive(false);
  };
  function ShowsideBar() {
    let sideBar = document.querySelector(".sideBar");
    sideBar.style.display = "flex";
  }

  function HidesideBar() {
    let sideBar = document.querySelector(".sideBar");
    sideBar.style.display = "none";
  }
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-[1001] ${
          isActive ? "flex justify-end" : "hidden"
        }`}
      >
        <div className="w-full max-w-md bg-white h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Giỏ Hàng Của Bạn</h3>
              <button
                onClick={handlecloseShopping}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#BB271A"
                >
                  {" "}
                  <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" />{" "}
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Miễn Phí Ship Nếu Đơn Của Bạn Trên 100,000 VnĐ
            </p>

            {cartData.length > 0 ? (
              <ul className="space-y-4">
                {cartData.map((Cart) => (
                  <li
                    key={Cart.id}
                    className="flex items-center space-x-4 border-b pb-4"
                  >
                    <img
                      src={`/img/${Cart.Images}`}
                      alt={Cart.Title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h2 className="font-semibold">{Cart.Title}</h2>
                      <p className="text-sm text-gray-600">
                        Giá: {formatCurrency(Cart.Price)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => thaydoisoluong(Cart, -1)}
                          className="px-2 py-1 bg-gray-200 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={Cart.amount}
                          readOnly
                          className="w-12 text-center border-t border-b"
                        />
                        <button
                          onClick={() => thaydoisoluong(Cart, 1)}
                          className="px-2 py-1 bg-gray-200 rounded-r"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(Cart)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                Không có sản phẩm nào trong giỏ hàng.
              </p>
            )}

            <div className="mt-6 flex justify-between items-center font-semibold">
              <span>Tổng Thu</span>
              <span>{formatCurrency(tongtien)}</span>
            </div>

            <Link to="/Checkout" className="block mt-6">
              <button
                className={`w-full text-white py-2 px-4 rounded transition duration-300 ${
                  user
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-600 cursor-not-allowed"
                }`}
                disabled={!user}
              >
                Thanh Toán
              </button>
            </Link>
          </div>
        </div>
      </div>
      <header>
        <nav className="sideBar">
          <Link to="/">
            <span>
              <svg
                onClick={HidesideBar}
                xmlns="http://www.w3.org/2000/svg"
                height="40px"
                viewBox="0 -960 960 960"
                width="40px"
                fill="#5f6368"
              >
                <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z" />
              </svg>
            </span>
          </Link>
          <Link to="/thongtin">
            <span>Infor</span>
          </Link>
          <Link to="/chiase">
            <span>Bolg</span>
          </Link>
        </nav>
        <div className="logo flex flex-none items-center w-1/3 sm:w-full">
          <Link to="/" className="flex items-center ">
            <img
              src={require("../assets/img/Logo.png")}
              className="w-56 h-28"
              alt="logo"
            ></img>
            <span className="text-[24px] font-semibold text-orange-700">
              Shop
            </span>
          </Link>
        </div>
        <div className="Box-search flex-auto sm:w-full w-2/3">
          <Search onClick={toggleSidebar} />
        </div>

        <nav className="sideBarB flex-auto w-1/3">
          <div className="flex items-center w-full justify-end">
            <div className="shopping" onClick={handleopenShopping}>
              <Link>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  viewBox="0 -960 960 960"
                  width="40px"
                  fill="#5f6368"
                >
                  <path d="M284.53-80.67q-30.86 0-52.7-21.97Q210-124.62 210-155.47q0-30.86 21.98-52.7Q253.95-230 284.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83Zm400 0q-30.86 0-52.7-21.97Q610-124.62 610-155.47q0-30.86 21.98-52.7Q653.95-230 684.81-230t52.69 21.98q21.83 21.97 21.83 52.83t-21.97 52.69q-21.98 21.83-52.83 21.83ZM238.67-734 344-515.33h285.33l120-218.67H238.67ZM206-800.67h589.38q22.98 0 34.97 20.84 11.98 20.83.32 41.83L693.33-490.67q-11 19.34-28.87 30.67-17.87 11.33-39.13 11.33H324l-52 96h487.33V-286H278q-43 0-63-31.83-20-31.84-.33-68.17l60.66-111.33-149.33-316H47.33V-880h121.34L206-800.67Zm138 285.34h285.33H344Z" />
                </svg>
              </Link>
              <span className="quantily w-5">{cartData.length}</span>
            </div>
            {user && (
              <div className="relative" ref={menuRef}>
                <Button
                  variant="outlined"
                  onClick={() => setIsShowMenu((prev) => !prev)}
                >
                  Quản lý Tài khoản
                </Button>
                {IsShowMenu && (
                  <div className="absolute min-w-200 top-full bg-white shadow-md rounded-md p-4 right-0 flex flex-col z-[1000] text-xs ">
                    {menuManage.map((item) => (
                      <Link
                        className="hover:text-orange-500 border-b border-gray-300 flex gap-1 items-center px-[15px] py-[8px] "
                        key={item.id}
                        to={item?.path}
                      >
                        {item?.icon}
                        {item.text}
                      </Link>
                    ))}
                    <span
                      onClick={handleLogout}
                      className="cursor-pointer text-black px-[19px] py-[8px] hover:text-orange-500 flex gap-1 items-center"
                    >
                      <CiLogout />
                      Đăng Xuất
                    </span>
                  </div>
                )}
              </div>
            )}

            <Link to="/chiase" className="hideOnMobile">
              <span>Bolg</span>
            </Link>
            <span className="hideOnMobile">
              {!user && (
                <div>
                  <Menu>
                    <MenuHandler>
                      <Button
                        style={{
                          borderRadius: "0px",
                          backgroundColor: "white",
                          boxShadow: "none",
                          color: "black",
                          fontSize: "16px",
                          fontWeight: "700",
                          textTransform: "none",
                        }}
                      >
                        Tài Khoản
                      </Button>
                    </MenuHandler>
                    <MenuList className="z-[1000]">
                      <MenuItem>
                        <Link to="/Registration">Tạo Tài Khoản</Link>
                      </MenuItem>
                      <MenuItem className="cursor-pointer">
                        <Link to="/login">Đăng Nhập</Link>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              )}
            </span>
            <Link to="/">
              <span>
                <svg
                  className="menuButton"
                  onClick={ShowsideBar}
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#5f6368"
                >
                  <path d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
                </svg>
              </span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
