import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import { useAuth } from "../Context/AuthContext";
// import * as actions from "../store/actions/auth";
// import { useDispatch, useSelector } from "react-redux";

import "../Style/login.css";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const dispatch = useDispatch();
  // const { isLoggedIn } = useSelector((state) => state.auth);
  const [invalidFields, setInvalidFileds] = useState([]);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // dispatch(actions.login(formData))

  const handleSubmit = async () => {
    let invalids = validate(formData);
    if (invalids === 0) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/v1/user`,
          formData
        );
        if (response.data) {
          localStorage.setItem("user", JSON.stringify(response.data));

          alert("Bạn đã đăng Nhap thành công");

          window.location.href = "/";
        } else {
          alert("Đăng Nhập không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            alert("Bạn sai mật khẩu hay số điện thoại rồi");
          } else {
            alert("Đã xảy ra lỗi. Vui lòng thử lại.");
          }
        } else {
          console.log(error);
        }
      }
    }
  };
  const validate = (formData) => {
    let invalids = 0;
    let fields = Object.entries(formData);

    setInvalidFileds([]); // Xóa các trường không hợp lệ trước đó

    fields.forEach((item) => {
      if (item[1] === "") {
        setInvalidFileds((prev) => [
          ...prev,
          {
            nameTK: item[0],
            message: "Bạn không được bỏ trống trường này.",
          },
        ]);
        invalids++;
      }
    });

    fields.forEach((item) => {
      switch (item[0]) {
        case "password":
          if (item[1].length < 6) {
            setInvalidFileds((prev) => [
              ...prev,
              {
                nameTK: item[0],
                message: "Mật khẩu bạn nhập không đủ 6 ký tự.",
              },
            ]);
            invalids++;
          }
          break;
        case "phone":
          if (!/^\d{10}$/.test(item[1])) {
            setInvalidFileds((prev) => [
              ...prev,
              {
                nameTK: item[0],
                message:
                  "Số điện thoại bạn nhập phải chỉ là số và phải đủ 10 số.",
              },
            ]);
            invalids++;
          }
          break;
        default:
          break;
      }
    });

    return invalids;
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="w-[425px] flex m-auto">
      <div>
        <img src={require("../assets/img/MiniLogo.png")}></img>
        <div className="flex justify-center">
          Sign in or
          <Link className="text-blue-600/100 ml-1" to="/Registration">
            create an account
          </Link>
        </div>
        <div className="flex gap-4 flex-col mt-6">
          <div>
            <Input
              onFocus={() => setInvalidFileds([])}
              label="Phone"
              type="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            {invalidFields?.some((item) => item.nameTK === "phone") && (
              <small className="text-red-500 block w-full">
                {invalidFields.find((item) => item.nameTK === "phone")?.message}
              </small>
            )}
          </div>
          <div className="flex relative password-toggle">
            <div className="w-full">
              <Input
                onFocus={() => setInvalidFileds([])}
                label="Password"
                type={passwordVisible ? "text" : "password"}
                className="input"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {invalidFields?.some((item) => item.nameTK === "password") && (
                <small className="text-red-500 block w-full">
                  {
                    invalidFields.find((item) => item.nameTK === "password")
                      ?.message
                  }
                </small>
              )}
            </div>
            <div
              className="icon-login flex items-center absolute inset-y-0 right-1"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 eyes-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 eyes-icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
        <div className="py-3">
          <Link className="text-blue-600/100 ">Forgot password?</Link>
        </div>
        <div className="flex justify-center border-2 bg-green-600 rounded-md">
          <button className=" p-[10px] text-white" onClick={handleSubmit}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
