import React from "react";

// const SelectQuantity = ({ quantity, handleQuantity, handleChangeQuantity }) => {
//   return (
//     <div>
//       <span
//         onClick={() => handleChangeQuantity("minus")}
//         className="p-2 border-r cursor-pointer border-black"
//       >
//         -
//       </span>
//       <input
//         className="py-2  text-center outline-none w-[30px]"
//         type="text"
//         value={quantity}
//         onChange={(e) => handleQuantity(e.target.value)}
//       ></input>
//       <span
//         onClick={() => handleChangeQuantity("plus")}
//         className="p-2 cursor-pointer border-l border-black  "
//       >
//         +
//       </span>
//     </div>
//   );
// };
const SelectQuantity = ({
  quantity,
  handleQuantity,
  handleChangeQuantity,
  maxQuantity,
}) => {
  console.log("data.sold:", maxQuantity);
  const effectiveMax =
    typeof maxQuantity === "number" && !isNaN(maxQuantity)
      ? maxQuantity
      : Infinity;
  const handleInputChange = (e) => {
    let value = Number(e.target.value);

    // Nếu giá trị nhập vào lớn hơn maxQuantity, chỉnh sửa lại
    if (value > effectiveMax) {
      value = effectiveMax;
    }

    // Đảm bảo giá trị không nhỏ hơn 1
    if (value < 1) {
      value = 1;
    }

    // Cập nhật giá trị mới vào state
    handleQuantity(value);
  };
  return (
    <div className="flex items-center">
      <button
        onClick={() => handleChangeQuantity("minus")}
        disabled={quantity === 1}
        className={`px-2 ${
          quantity === 1 ? "cursor-not-allowed text-gray-400" : "text-black"
        }`}
      >
        -
      </button>
      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        className="w-12 text-center border"
        min="1"
        max={effectiveMax}
      />
      <button
        onClick={() => handleChangeQuantity("plus")}
        disabled={quantity >= effectiveMax}
        className={`px-2 ${
          quantity >= effectiveMax
            ? "cursor-not-allowed text-gray-400"
            : "text-black"
        }`}
      >
        +
      </button>
    </div>
  );
};

export default SelectQuantity;
