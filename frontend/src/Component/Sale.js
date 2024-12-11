import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useCart } from "../Context/CartContext";
const Sale = () => {
  const { cartData, cartToChange } = useCart();
  // const [selectedProducts, setSelectedProducts] = useState([]);
  const [countdown, setCountdown] = useState(0);
  const [products, setProducts] = useState([]);
  const [uniqueSalePeriods, setUniqueSalePeriods] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);

  useEffect(() => {
    formatCountdown();
    fetchNewSaleData();
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/product`)
      .then((response) => {
        // console.log("Dữ liệu sản phẩm:", dataLoai);
        setDataLoai(response.data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/v1/sale/salesrecords`
        );

        const data = response.data;
        // console.log("Dữ liệu sản phẩm:", data);

        const salePeriods = data.reduce((accumulator, current) => {
          const key = `${current.sale_start_time}_${current.sale_end_time}`;
          if (!accumulator[key]) {
            accumulator[key] = {
              sale_start_time: current.sale_start_time,
              sale_end_time: current.sale_end_time,
            };
          }
          return accumulator;
        }, {});

        const newProducts = data.map((item) => ({
          id: item.id,
          SanPham_id: item.SanPham_id,
        }));
        setProducts(newProducts);

        const newUniqueSalePeriods = Object.values(salePeriods);
        setUniqueSalePeriods(newUniqueSalePeriods);

        // Initialize countdown based on the earliest sale end time
        if (newUniqueSalePeriods.length > 0) {
          const now = moment();
          const earliestEndTime = moment.tz(
            newUniqueSalePeriods[0].sale_end_time,
            "Asia/Ho_Chi_Minh"
          );
          const initialCountdown = earliestEndTime.diff(now, "seconds");
          setCountdown(initialCountdown);
        }

        // console.log("Sản phẩm giảm giá:", newProducts);
        // console.log("Thời gian giảm giá duy nhất:", newUniqueSalePeriods);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm giảm giá:", error);
      }
    };

    fetchSaleData();
  }, []);

  useEffect(() => {
    const countdownId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(countdownId);
          fetchNewSaleData(); // Fetch new data after countdown ends
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdownId);
  }, [countdown]);

  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // useEffect(() => {
  //   const countdownId = setInterval(() => {
  //     setCountdown((prevCountdown) => {
  //       if (prevCountdown <= 0) {
  //         clearInterval(countdownId);
  //         fetchNewSaleData(); // Fetch new data after countdown ends
  //         return 0;
  //       }
  //       return prevCountdown - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(countdownId);
  // }, [uniqueSalePeriods]);

  const fetchNewSaleData = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/sale/refreshsaleproducts`
      );
      const newData = response.data;
      const salePeriods = newData.reduce((accumulator, current) => {
        const key = `${current.sale_start_time}_${current.sale_end_time}`;
        if (!accumulator[key]) {
          accumulator[key] = {
            sale_start_time: current.sale_start_time,
            sale_end_time: current.sale_end_time,
          };
        }
        return accumulator;
      }, {});

      const uniquePeriods = Object.values(salePeriods);
      setUniqueSalePeriods(uniquePeriods);

      // Update products and countdown
      const newProducts = newData.map((item) => ({
        id: item.id,
        SanPham_id: item.SanPham_id,
      }));
      setProducts(newProducts);

      // Calculate new countdown based on the earliest sale end time
      if (uniquePeriods.length > 0) {
        const now = moment(); // Current time
        const endTime = moment.tz(
          uniquePeriods[0].sale_end_time,
          "Asia/Ho_Chi_Minh"
        ); // End time in specific timezone
        const newCountdown = endTime.diff(now, "seconds"); // Difference in seconds
        setCountdown(newCountdown);
      }

      console.log("Cập nhật sản phẩm giảm giá mới thành công:", newData);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm giảm giá:", error);
    }
  };
  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  return (
    <div>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Bộ Sưu Tập Giảm Giá
        </h1>
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Thời gian còn lại cho ưu đãi:</p>
          <div className="text-2xl font-bold text-red-600">
            {formatCountdown(countdown)}
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
          <div className="grid grid-cols-2 gap-4 lg:w-1/2">
            {dataLoai
              .filter((itemSanPham) =>
                products.some(
                  (product) => product.SanPham_id === itemSanPham.id
                )
              )
              .map((itemSanPham, index) => (
                <div
                  key={itemSanPham.id || index} // Use id as the key if available
                  className="border border-gray-300 overflow-hidden group flex flex-col"
                >
                  <div className="relative flex-grow aspect-square">
                    <img
                      src={`${
                        process.env.REACT_APP_SERVER_URL
                      }/src/uploads/avatarProducts/${
                        itemSanPham.HinhAnh && itemSanPham.HinhAnh.length > 0
                          ? itemSanPham.HinhAnh.split(",")[0] // Display the first image
                          : "default-image.jpg"
                      }`}
                      alt={itemSanPham.Title || "Sản phẩm"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {itemSanPham.HinhAnh &&
                      itemSanPham.HinhAnh.split(",").length > 1 && (
                        <div className="absolute bottom-0 left-0 bg-black text-white px-2 py-1 text-sm">
                          <span>
                            {itemSanPham.HinhAnh.split(",").length} ảnh
                          </span>
                        </div>
                      )}
                    {itemSanPham.loaisanpham === "Sale" && (
                      <div className="absolute top-0 left-0 bg-red-600 text-white px-2 py-1 text-sm">
                        Sale
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black bg-opacity-50 w-[90%] h-[90%] flex items-center justify-center transition-transform duration-300">
                        {cartData.indexOf(itemSanPham) !== -1 ? (
                          <span className="text-green-600">
                            Sản phẩm đã có trong giỏ
                          </span>
                        ) : (
                          <button
                            className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors"
                            onClick={() => cartToChange(itemSanPham)}
                          >
                            Mua ngay
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-2 bg-white flex-shrink-0">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {itemSanPham.Title || "Sản phẩm mới"}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {itemSanPham.Description || "Mô tả sản phẩm chưa có sẵn."}
                    </p>

                    {/* Display Price */}
                    {itemSanPham.loaisanpham === "Sale" ? (
                      <div>
                        {/* Strikethrough original price */}
                        <p className="mt-2 font-bold text-gray-400 line-through">
                          {itemSanPham.Price
                            ? `${formatCurrency(itemSanPham.Price)} đ`
                            : ""}
                        </p>
                        {/* Sale price */}
                        <p className="mt-1 font-bold text-red-600">
                          {itemSanPham.PriceSale
                            ? `${formatCurrency(itemSanPham.PriceSale)} đ`
                            : "1200 đ"}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 font-bold text-red-600">
                        {itemSanPham.Price
                          ? `${formatCurrency(itemSanPham.Price)} đ`
                          : "1200 đ"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="lg:w-1/2 aspect-square">
            <img
              src={require("../assets/img/rainwear.png")}
              className="w-full h-full object-cover"
              alt="Rainwear Collection"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sale;
