import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
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

  useEffect(() => {
    const storedCartData = JSON.parse(localStorage.getItem("cartData")) || [];
    updateCart(storedCartData);
  }, []);

  const thaydoisoluong = (Cart, change) => {
    const newCartData = localCartData.map((item) =>
      item.id === Cart.id
        ? { ...item, amount: Math.max(1, item.amount + change) }
        : item
    );
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
  };

  return (
    <CartContext.Provider
      value={{
        localCartData,
        cartData,
        tongtien,
        thaydoisoluong,
        handleDeleteClick,
        cartToChange,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
