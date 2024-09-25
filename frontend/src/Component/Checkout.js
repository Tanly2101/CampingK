import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Style/CheckOut.css";
import { Input } from "@material-tailwind/react";
// import { Select } from "@material-tailwind/react";
import { useAuth } from "../Context/AuthContext";
import pay2 from "../View/pay2.svg";
import pay1 from "../View/pay1.svg";
import { useCart } from "../Context/CartContext";
import { useLocation } from "../Context/CheckOutContext";
import axios from "axios";
const Checkout = () => {
  const { user } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const { cartData, tongtien, setcartData } = useCart();

  const [formData, setFormData] = useState({
    customer_id: "",
    shipping_address: "",
    payment_method: "cod",
    trangthai: "Đang Xử Lí",
    total_amount: "",
    sanpham: cartData,
  });
  //////////////////////////////////////////////////////

  const {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    showProvinces,
    showDistricts,
    showWards,
    selectedLocation,
    setShowProvinces,
    setShowDistricts,
    setShowWards,
    handleProvinceClick,
    handleDistrictClick,
    handleWardClick,
    handleAddressChange,
    setSelectedLocation,
  } = useLocation();
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
  const tongTienObj = {
    tongTien: tongtien,
    tongTienSauKhiTru: tongtien > 0 ? tongtien + 30000 : 0,
  };
  useEffect(() => {
    if (user) {
      setContactInfo(user.nameTK);
      setPhoneNumber(user.phone);
    }
  }, [user]);
  useEffect(() => {
    if (user && user.id) {
      setFormData((prevData) => ({
        ...prevData,
        customer_id: user.id,
      }));
    }
  }, [user]);
  useEffect(() => {
    console.log("From", formData);
  }, [formData]);
  useEffect(() => {
    console.log("From", cartData);
  }, [cartData]);
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      total_amount: tongTienObj.tongTienSauKhiTru,
    }));
  }, [tongTienObj.tongTienSauKhiTru]);
  useEffect(() => {
    const locationString =
      `${selectedLocation.address},${selectedLocation.ward}, ${selectedLocation.district}, ${selectedLocation.province}`.trim();
    setFormData((prevData) => ({
      ...prevData,
      shipping_address: locationString,
    }));
  }, [selectedLocation]);
  // useEffect(() => {
  //   console.log("pay", selectedPayment);
  // }, [selectedPayment]);
  // useEffect(() => {
  //   console.log("mount", tongTienObj.tongTienSauKhiTru);
  // }, []);
  /////////////////////////////////////////////////////////////////////////
  const validateForm = () => {
    const errors = {};

    // Validate customer_id
    if (!formData.customer_id) {
      errors.customer_id = "User ID is required.";
    }

    // Validate shipping_address
    const locationParts = formData.shipping_address
      .split(",")
      .map((part) => part.trim());
    if (locationParts.length < 4 || locationParts.includes("")) {
      errors.shipping_address =
        "Location must include address, ward, district, and province.";
    }

    // Validate payment_method
    if (!formData.payment_method) {
      errors.payment_method = "Payment method is required.";
    }

    // Validate total_amount
    if (formData.total_amount === "" || formData.total_amount <= 0) {
      errors.total_amount = "Total amount must be greater than 0.";
    }

    // Set form errors and form validity
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
    return Object.keys(errors).length;
  };
  const handleSubmit = async () => {
    // Validate form data trước khi gửi lên server
    const invalids = validateForm();
    console.log(invalids);
    if (invalids === 0) {
      try {
        // Gửi dữ liệu formData lên API createOrder
        const response = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/order/create`,
          formData
        );

        if (response.status === 200) {
          alert("Order created successfully");
          console.log("Order created successfully:", response.data);
          localStorage.removeItem("cartData");
          setcartData([]);
          // Xử lý thêm nếu cần, ví dụ như điều hướng trang
        } else {
          alert("Failed to create order. Please try again.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 400) {
            alert("All fields are required. Please fill in all the fields.");
          } else {
            alert("Error creating order. Please try again.");
          }
        } else {
          console.error("Error:", error);
          alert("Connection error. Please try again later.");
        }
      }
    }
  };

  const handlePaymentChange = (e) => {
    const selectedPaymentMethod = e.target.id;
    setFormData((prevData) => ({
      ...prevData,
      payment_method: selectedPaymentMethod,
    }));
  };
  ////////////////////////////////////////////////////////////////////////
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Set selectedLocation with the updated address
  //   setSelectedLocation((prev) => ({
  //     ...prev,
  //     address: prev.address, // Make sure to update other fields if needed
  //   }));
  // };

  return (
    <>
      <div className="">
        <div className="border-b border-current "></div>
        <div className="grid grid-cols-2">
          <div className="Checkout-box flex flex-wrap ">
            <div className="Checkout-box-infor">
              <div className="section-infor">
                <div className="section-title">Thông tin giao hàng</div>
                <div className="section-content">
                  <div className="section-infor-private">
                    <div>
                      <Input label="Họ Và Tên" value={contactInfo} />
                    </div>
                    <div className="section-infor-input">
                      <Input label="Email" />
                      <Input label="Số Điện Thoại" value={phoneNumber} />
                    </div>
                  </div>
                  <div className="section-infor-Address">
                    <form action="">
                      <div className="mb-[10px]">
                        <form className="flex w-full relative">
                          <Input
                            label="Địa Chỉ"
                            type="text"
                            id="address"
                            name="address"
                            onChange={handleAddressChange}
                            value={selectedLocation.address}
                          />
                        </form>
                      </div>
                      <div className="flex gap-[10px]">
                        <div className="relative">
                          <Input
                            label="Chọn Tỉnh Thành"
                            value={
                              provinces.find(
                                (province) =>
                                  province.Id === parseInt(selectedProvince)
                              )?.Name || "Chọn Tỉnh Thành"
                            }
                            onClick={() => setShowProvinces(!showProvinces)}
                            readOnly
                          />

                          {showProvinces && (
                            <ul className="absolute top-full left-0 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto">
                              {provinces.map((province) => (
                                <li
                                  key={province.Id}
                                  onClick={() =>
                                    handleProvinceClick(
                                      province.Id,
                                      province.Name
                                    )
                                  }
                                  className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${
                                    selectedProvince === province.Id
                                      ? "bg-gray-200 font-bold"
                                      : ""
                                  }`}
                                >
                                  {province.Name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            label="Chọn Quận/Huyện"
                            value={
                              districts.find(
                                (district) =>
                                  district.Id === parseInt(selectedDistrict)
                              )?.Name || "Chọn Quận/Huyện"
                            }
                            onClick={() => setShowDistricts(!showDistricts)}
                            readOnly
                            disabled={!selectedProvince}
                          />

                          {showDistricts && (
                            <ul className="absolute top-full left-0 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto">
                              {districts.map((district) => (
                                <li
                                  key={district.Id}
                                  onClick={() =>
                                    handleDistrictClick(
                                      district.Id,
                                      district.Name
                                    )
                                  }
                                  className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${
                                    selectedDistrict === district.Id
                                      ? "bg-gray-200 font-bold"
                                      : ""
                                  }`}
                                >
                                  {district.Name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            label="Chọn Phường/Xã"
                            value={
                              wards.find(
                                (ward) => ward.Id === parseInt(selectedWard)
                              )?.Name || "Chọn Phường/Xã"
                            }
                            onClick={() => setShowWards(!showWards)}
                            readOnly
                            disabled={!selectedDistrict} // Disable if no district selected
                          />
                          {showWards && (
                            <ul className="absolute top-full left-0 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-y-auto z-10">
                              {wards.map((ward) => (
                                <li
                                  key={ward.Id}
                                  onClick={() =>
                                    handleWardClick(ward.Id, ward.Name)
                                  }
                                  className={`cursor-pointer px-4 py-2 hover:bg-gray-200 ${
                                    selectedWard === ward.Id
                                      ? "bg-gray-200 font-bold"
                                      : ""
                                  }`}
                                >
                                  {ward.Name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      {formErrors.shipping_address && (
                        <small className="text-red-600">
                          {formErrors.shipping_address}
                        </small>
                      )}
                    </form>
                  </div>
                </div>
              </div>
              <div className="section-shipping">
                <div className="section-shipping-rate">
                  <div className="section-shipping-rate-header">
                    <h2>Phương thức vận chuyển</h2>
                  </div>
                  <div className="section-shipping-box">
                    {selectedWard ? (
                      <div className="section-shipping-rate-final">
                        <p>Giá trị ship: 30K</p>
                      </div>
                    ) : (
                      <div className="section-shipping-rate-loading">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="108"
                          height="85"
                          viewBox="0 0 108 85"
                        >
                          <g
                            stroke="#B2B2B2"
                            stroke-width="2"
                            stroke-miterlimit="10"
                            fill="none"
                          >
                            <path d="M1 18h106M11 70.3h26m-26-6h26m-26-6h17" />
                          </g>
                          <path
                            stroke="#B2B2B2"
                            stroke-width="2"
                            stroke-miterlimit="10"
                            d="M1 18l10.7-17h84.7l10.6 17v61.5c0 2.5-2 4.5-4.5 4.5h-97c-2.5 0-4.5-2-4.5-4.5v-61.5zM54 1v16.6"
                            fill="none"
                          />
                        </svg>
                        <p>
                          Vui lòng chọn tỉnh / thành để có danh sách phương thức
                          vận chuyển
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="section-payment">
                  <div className="section-payment-title">
                    Phương thức thanh toán
                  </div>
                  <div className="space-y-4 border-4 rounded-md p-5">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        className="form-radio text-blue-600"
                        checked={formData.payment_method === "cod"}
                        onChange={handlePaymentChange}
                      />
                      <div>
                        <i>
                          <img src={pay1} alt="ảnh" />
                        </i>
                      </div>
                      <label
                        htmlFor="cod"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Thanh toán khi giao hàng (COD)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="bank"
                        name="payment"
                        className="form-radio text-blue-600"
                        checked={formData.payment_method === "bank"}
                        onChange={handlePaymentChange}
                      />
                      <div>
                        <i>
                          <img src={pay2} alt="ảnh" />
                        </i>
                      </div>
                      <label
                        htmlFor="bank"
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Chuyển khoản qua ngân hàng
                      </label>
                    </div>

                    {/* Conditionally render bank account information */}
                    {selectedPayment === "bank" && (
                      <div className="mt-4 p-4 border border-gray-300 rounded-md">
                        <h4 className="text-lg font-semibold">
                          Thông tin tài khoản ngân hàng
                        </h4>
                        <p className="mt-2">Tên ngân hàng: ABC Bank</p>
                        <p>Số tài khoản: 123456789</p>
                        <p>Chủ tài khoản: John Doe</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="successful">
                <div>
                  <Link to="/SanPham">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px"
                      viewBox="0 -960 960 960"
                      width="40px"
                      fill="#5f6368"
                    >
                      <path d="M400-80 0-480l400-400 61 61.67L122.67-480 461-141.67 400-80Z" />
                    </svg>
                  </Link>
                </div>
                <button onClick={handleSubmit}>Hoàn Tất Hóa Đơn</button>
              </div>
            </div>
          </div>
          <div className="Checkout-box-right">
            <div className="Checkout-box-client">
              <div>
                <div></div>
                <div className="Checkout-box-client-field">
                  <div className="field-input">
                    <div className="flex-auto">
                      <Input label="Mã Giảm Giá" />
                    </div>
                    <div className="flex-none">
                      <button>Sử Dụng</button>
                    </div>
                  </div>
                </div>
                <div className="order-payment">
                  <table className="total-line-table">
                    <tbody>
                      <tr>
                        <td>Tạm Tính</td>
                        <td>{formatCurrency(tongtien)}</td>
                      </tr>
                      <tr>
                        <td>Phí Vận Chuyển</td>
                        <td>
                          <p>{formatCurrency(30000)}</p>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Tổng Cộng</td>
                        <td>{formatCurrency(tongTienObj.tongTienSauKhiTru)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Checkout;
