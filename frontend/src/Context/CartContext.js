import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const Swal = require("sweetalert2");
  const [localCartData, setLocalCartData] = useState([]);
  const [cartData, setcartData] = useState([]);
  const [tongtien, setTongtien] = useState(0);

  const updateCart = (newCartData) => {
    setLocalCartData(newCartData);
    setcartData(newCartData);
    localStorage.setItem("cartData", JSON.stringify(newCartData));

    const tt = newCartData.reduce((total, sp) => {
      const price = sp.loaisanpham === "Sale" ? sp.PriceSale : sp.Price;
      return total + price * sp.amount;
    }, 0);
    setTongtien(tt);
  };
  const clearCart = () => {
    localStorage.removeItem("cartData");
    updateCart([]);
  };

  useEffect(() => {
    const storedCartData = JSON.parse(localStorage.getItem("cartData")) || [];
    updateCart(storedCartData);
  }, []);

  const thaydoisoluong = (Cart, change) => {
    const newCartData = localCartData.map((item) => {
      if (item.id === Cart.id) {
        const newAmount = item.amount + change;

        // Kiểm tra nếu số lượng mới vượt quá số lượng tồn kho (sold)
        if (newAmount > item.sold) {
          Swal.fire({
            icon: "warning",
            title: "Số lượng vượt quá tồn kho!",
            text: `Chỉ còn ${item.sold} sản phẩm trong kho.`,
            toast: true,
            position: "top-end",
            timer: 2000,
            showConfirmButton: false,
          });
          return item; // Giữ nguyên số lượng cũ nếu vượt quá tồn kho
        }

        return { ...item, amount: Math.max(1, newAmount) };
      }
      return item;
    });
    updateCart(newCartData);
  };

  const handleDeleteClick = (Cart) => {
    const newCartData = localCartData.filter((item) => item.id !== Cart.id);
    updateCart(newCartData);
  };

  const cartToChange = (itemSanPham, quantity = 1) => {
    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    if (localCartData.some((item) => item.id === itemSanPham.id)) return;

    // Thêm sản phẩm mới với số lượng ban đầu là 1
    const newItem = {
      ...itemSanPham,
      amount: quantity,
      // Sử dụng PriceSale nếu có, ngược lại dùng Price
      Price:
        itemSanPham.loaisanpham === "Sale"
          ? itemSanPham.PriceSale
          : itemSanPham.Price,
    };

    // Tạo mảng mới với sản phẩm mới được thêm vào
    const newCartData = [...localCartData, newItem];

    // Sử dụng hàm updateCart để cập nhật giỏ hàng
    updateCart(newCartData);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Sản phẩm đã được thêm vào giỏ hàng thành công!",
      showConfirmButton: false,
      timer: 2000,
      toast: true, // Dạng toast để hiển thị thông báo nhỏ gọn hơn
      backdrop: false,
      customClass: {
        popup: "swal-custom-popup",
      },
      // Thêm style trực tiếp để tuỳ chỉnh popup
      width: "22em", // Độ rộng của thông báo
      padding: "10px", // Giảm khoảng cách padding
      iconColor: "#48BB78", // Màu sắc của icon (success)
      showClass: {
        popup: "swal2-show",
      },
      hideClass: {
        popup: "swal2-hide",
      },
      // Tùy chỉnh tiêu đề để trông nhỏ gọn hơn
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.fontSize = "14px"; // Giảm kích thước font
          popup.style.borderRadius = "8px"; // Bo góc popup
          popup.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)"; // Tạo đổ bóng nhẹ
        }
        const title = Swal.getTitle();
        if (title) {
          title.style.fontSize = "16px"; // Font size của tiêu đề
          title.style.textAlign = "left"; // Căn trái tiêu đề
          title.style.margin = "0px"; // Giảm khoảng cách tiêu đề
        }
        const icon = Swal.getIcon();
        if (icon) {
          icon.style.width = "24px"; // Giảm kích thước icon
          icon.style.height = "24px";
        }
      },
    });
  };

  return (
    <CartContext.Provider
      value={{
        localCartData,
        cartData,
        tongtien,
        setcartData,
        thaydoisoluong,
        clearCart,
        handleDeleteClick,
        cartToChange,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
