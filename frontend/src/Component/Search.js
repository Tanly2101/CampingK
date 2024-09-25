import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { ContextSearch } from "../Context/ContextSearch";

const Search = () => {
  const { setSearchData } = useContext(ContextSearch);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchData(search);

    // Nếu đang ở trang chủ, chuyển hướng đến trang sản phẩm

    navigate("/sanpham");
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full relative">
      <input
        type="text"
        placeholder="Tìm Kiếm"
        className="w-full"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <button
        type="submit"
        className="flex items-center p-1 absolute inset-y-0 right-2"
      >
        <i className="">
          <IoMdSearch className="size-6" />
        </i>
      </button>
    </form>
  );
};

export default Search;
