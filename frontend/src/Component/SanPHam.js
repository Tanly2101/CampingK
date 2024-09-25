import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../Style/SanPham.css";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ContextSearch } from "../Context/ContextSearch";
import { usePagination } from "../Context/PaginationContext";
import { useProductContext } from "../Context/ProductContext";

import Pagination from "./Pagination";
function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}
export function SanPHam() {
  const [open, setOpen] = React.useState(0);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const { selectProduct } = useProductContext();
  const handleOpen1 = (value) => setOpen(open === value ? 0 : value);
  const [filters, setFilters] = useState({
    categoryId: null,
    // Thêm các bộ lọc khác ở đây, ví dụ:
    // price: null,
    // brand: null,
    // color: null,
  });
  ////////////////////useContext///////////////////////////
  const { searchData } = useContext(ContextSearch);
  const { currentPage, pageSize, updateTotalItems, updatePageSize, setPage } =
    usePagination();
  /////////////////////////////////////////////////////////
  const [openAccordions, setOpenAccordions] = useState({});
  const [error, setError] = useState(null);
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
  /////////////////////////////
  useEffect(() => {
    updatePageSize(10); // Set pageSize to 8
  }, []);
  ////////////////////////////
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/category`)
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        setData(error);
      });
  }, []);
  ////////////////////////////
  // hiển thị thuwong hieu
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/filter/`)
      .then((response) => {
        console.log(response.data);
        setData(response.data);

        // Biến đổi dữ liệu nếu cần
        const dataFilter = response.data.map((item) => ({
          ...item,
        }));

        setDataFilter(dataFilter);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);
  /////////////////////////////////////
  /////////////////////////////////////////

  const handleFilterChange = (filterType, value) => {
    console.log("Updating filter:", filterType, value); // Debugging
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };
  //////////////////////////////////////////

  /////////////////////////////////////////////////
  const priceOptions = [
    { value: 0, title: "All" },
    { value: 100000, title: "$0 - 100000" },
    { value: 500000, title: "$100001 - $500000" },
    { value: 2000000, title: "$500001 - $2000000" },
    { value: 2000001, title: "Over $2000000" },
  ];
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    setPage(1);
  };
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    // Nếu bạn cần chuyển trang, bạn có thể thêm logic tại đây
    setPage(1); // Reset trang khi thay đổi thương hiệu
  };
  /////////////////////////////////////////////////
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch categories
  //       // Fetch products based on priority
  //       let productsResponse;

  //       if (searchData) {
  //         // Priority 1: Search data
  //         productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/search?Title=${searchData}`
  //         );
  //       } else if (selectedValue) {
  //         productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/price?Price=${selectedValue}`
  //         );
  //       } else if (filters.categoryId) {
  //         // Priority 2: Category filter
  //         productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/products/${filters.categoryId}`
  //         );
  //       } else {
  //         // Priority 3: All products
  //         productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product`
  //         );
  //       }

  //       console.log("Products:", productsResponse.data);
  //       updateTotalItems(productsResponse.data.length);
  //       const currentData = paginateData(
  //         productsResponse.data,
  //         10,
  //         currentPage
  //       );
  //       setData(currentData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setError(error);
  //     }
  //   };

  //   fetchData();
  // }, [selectedValue, filters.categoryId, searchData, currentPage]);
  useEffect(() => {
    const fetchSearchData = async () => {
      if (searchData) {
        try {
          const productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product/search?Title=${searchData}`
          );
          console.log("Search Products:", productsResponse.data);
          updateTotalItems(productsResponse.data.length);
          const currentData = paginateData(
            productsResponse.data,
            10,
            currentPage
          );
          setData(currentData);
        } catch (error) {
          console.error("Error fetching search data:", error);
          setError(error);
        }
      }
    };

    fetchSearchData();
  }, [searchData, currentPage]);
  useEffect(() => {
    const fetchPriceFilteredData = async () => {
      if (selectedValue) {
        try {
          const productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product/price?Price=${selectedValue}`
          );
          console.log("Price Filtered Products:", productsResponse.data);
          updateTotalItems(productsResponse.data.length);
          const currentData = paginateData(
            productsResponse.data,
            10,
            currentPage
          );
          setData(currentData);
        } catch (error) {
          console.error("Error fetching price-filtered data:", error);
          setError(error);
        }
      }
    };

    fetchPriceFilteredData();
  }, [selectedValue, currentPage]);
  useEffect(() => {
    const fetchCategoryFilteredData = async () => {
      if (filters.categoryId) {
        try {
          const productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product/products/${filters.categoryId}`
          );
          console.log("Category Filtered Products:", productsResponse.data);
          updateTotalItems(productsResponse.data.length);
          const currentData = paginateData(
            productsResponse.data,
            10,
            currentPage
          );
          setData(currentData);
        } catch (error) {
          console.error("Error fetching category-filtered data:", error);
          setError(error);
        }
      }
    };

    fetchCategoryFilteredData();
  }, [filters.categoryId, currentPage]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!searchData && !selectedValue && !filters.categoryId) {
        try {
          const productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product`
          );
          console.log("All Products:", productsResponse.data);
          updateTotalItems(productsResponse.data.length);
          const currentData = paginateData(
            productsResponse.data,
            10,
            currentPage
          );
          setData(currentData);
        } catch (error) {
          console.error("Error fetching all products:", error);
          setError(error);
        }
      }
    };

    fetchAllProducts();
  }, [searchData, selectedValue, filters.categoryId, currentPage]);
  useEffect(() => {
    const fetchBrandFilteredData = async () => {
      if (selectedBrand) {
        try {
          const productsResponse = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/thuonghieu/${selectedBrand}`
          );
          console.log("Brand Filtered Products:", productsResponse.data);
          updateTotalItems(productsResponse.data.length);
          const currentData = paginateData(
            productsResponse.data,
            10,
            currentPage
          );
          setData(currentData);
        } catch (error) {
          console.error("Error fetching brand-filtered data:", error);
          setError(error);
        }
      }
    };

    fetchBrandFilteredData();
  }, [selectedBrand, currentPage]);
  ///////////////////////////////////////////////////////

  const paginateData = (data, itemsPerPage, currentPage) => {
    // Tính chỉ số bắt đầu và kết thúc của dữ liệu hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Trả về một phần của mảng dữ liệu
    return data.slice(startIndex, endIndex);
  };

  const handleOpen = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  ////////////////////////////////////////////
  const [imageIndices, setImageIndices] = useState(
    data.map(() => 0) // Khởi tạo tất cả chỉ số hình ảnh ban đầu là 0
  );

  const handleNextImage = (index, imagesLength) => {
    setImageIndices((prevIndices) =>
      prevIndices.map((currentIndex, idx) =>
        idx === index
          ? currentIndex === imagesLength - 1
            ? 0
            : currentIndex + 1
          : currentIndex
      )
    );
  };

  const handlePrevImage = (index, imagesLength) => {
    setImageIndices((prevIndices) =>
      prevIndices.map((currentIndex, idx) =>
        idx === index
          ? currentIndex === 0
            ? imagesLength - 1
            : currentIndex - 1
          : currentIndex
      )
    );
  };
  useEffect(() => {
    if (data) {
      setImageIndices(data.map(() => 0));
    }
  }, [data]);
  /////////////////////////////////////////////////
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <body>
        <div className="Category pt-4 h-full w-full">
          <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-auto bg-gray-300 flex-none">
            <div className="mb-2 p-4">
              <Typography variant="h5" color="blue-gray">
                FilTer
              </Typography>
            </div>
            <List>
              <Accordion
                open={openAccordions[1]}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      openAccordions[1] ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={openAccordions[1]}>
                  <AccordionHeader
                    onClick={() => handleOpen(1)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Thể Loại
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {categories.map((category) => (
                      <ListItem key={category.id} className="p-0">
                        <Link
                          onClick={() => {
                            console.log("Link clicked:", category.id); // Debugging
                            handleFilterChange(
                              "categoryId",
                              String(category.id)
                            );
                          }}
                          className="flex items-center w-full py-2 px-3 rounded-lg text-sm text-blue-gray-700 hover:bg-blue-gray-50 focus:bg-blue-gray-50"
                        >
                          <ListItemPrefix>
                            <ChevronRightIcon className="h-3 w-3" />
                          </ListItemPrefix>
                          {category.TitleCategory}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={openAccordions[3]}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      openAccordions[3] ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={openAccordions[3]}>
                  <AccordionHeader
                    onClick={() => handleOpen(3)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      <ShoppingBagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Thương Hiệu
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {dataFilter.map((item, index) => (
                      <ListItem key={index}>
                        <Link
                          // to={`/products?filter=${item.id}`}
                          className="w-full block py-2 px-4 hover:bg-gray-100 transition-colors text-gray-700 text-sm"
                          value={selectedBrand}
                          onClick={() => handleBrandClick(item.id)}
                        >
                          {item.tenthuonghieu}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
              <Accordion
                open={openAccordions[5]}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      openAccordions[5] ? "rotate-180" : ""
                    }`}
                  />
                }
              >
                <ListItem className="p-0" selected={openAccordions[5]}>
                  <AccordionHeader
                    onClick={() => handleOpen(5)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      <ShoppingBagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal"
                    >
                      Giá
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0">
                    {priceOptions.map((option, index) => (
                      <ListItem key={index}>
                        <label className="sidebar-label-container flex items-center space-x-2">
                          <input
                            className="form-radio h-4 w-4 rounded-none border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            type="radio"
                            value={option.value}
                            // checked={selectedValue === option.value}
                            onChange={handleChange}
                            name="priceOption"
                          />
                          <span className="ml-2 text-gray-700">
                            {option.title}
                          </span>
                        </label>
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            </List>
          </Card>
          <div className="flex-auto w-full h-full bg-gray-100 p-4">
            <div className="List w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data &&
                  data.map((item, index) => {
                    // Kiểm tra nếu `HinhAnh` không rỗng, tách chuỗi thành mảng
                    const images = item.HinhAnh ? item.HinhAnh.split(",") : [];

                    return (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                      >
                        <div className="relative w-full h-64">
                          {images.length > 0 ? (
                            <img
                              src={`${
                                process.env.REACT_APP_SERVER_URL
                              }/src/uploads/avatarProducts/${
                                images[imageIndices[index] || 0]
                              }`}
                              alt={`sanpham-${(imageIndices[index] || 0) + 1}`}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <p className="text-gray-500 italic">
                                Không có hình ảnh
                              </p>
                            </div>
                          )}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePrevImage(index, images.length);
                                }}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-black/70 transition-colors duration-200"
                              >
                                <span className="text-2xl">&#8249;</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNextImage(index, images.length);
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-black/70 transition-colors duration-200"
                              >
                                <span className="text-2xl">&#8250;</span>
                              </button>
                            </>
                          )}
                        </div>
                        <Link
                          to={`/SanPham/${item.id}`}
                          onClick={() => {
                            selectProduct(item);
                            window.location.href = `/SanPham/${item.id}`;
                          }}
                          className="block flex-grow"
                        >
                          {/* Image Carousel */}

                          {/* Thông tin sản phẩm */}
                          <div className="p-4 flex-grow">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                              {item.Title}
                            </h3>
                            <p className="text-xl font-bold mb-2 text-red-600">
                              {formatCurrency(item.Price)}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Đã bán:{" "}
                              <span className="font-medium">{item.daban}</span>
                            </p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400">
                                  {i < Math.floor(item.DiemDanhGiaTrungBinh)
                                    ? "★"
                                    : "☆"}
                                </span>
                              ))}
                              <span className="text-sm text-gray-600 ml-2">
                                ({item.SoLuongDanhGia})
                              </span>
                            </div>
                          </div>
                        </Link>

                        {/* Nút thêm vào giỏ hàng */}
                        <div className="p-4">
                          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <Pagination />
            </div>
          </div>
        </div>
        <div className="template p-[50px] ">
          <div className="border-t-4 grid grid-cols-2 gap 4 pt-[15px]">
            <div className="">
              <div className="title-temp">
                <h2>Title</h2>
                <div>
                  <p>NỘi Dung</p>
                </div>
              </div>
            </div>
            <div className="">
              <div>
                <img src={require("../assets/img/img1.jpg")}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="Expert p-[50px]">
          <>
            <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
              <AccordionHeader onClick={() => handleOpen1(1)}>
                What is Material Tailwind?
              </AccordionHeader>
              <AccordionBody>
                We&aposre not always in the position that we want to be at.
                We&apos;re constantly growing. We&apos;re constantly making
                mistakes. We&apos;re constantly trying to express ourselves and
                actualize our dreams.
              </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
              <AccordionHeader onClick={() => handleOpen1(2)}>
                How to use Material Tailwind?
              </AccordionHeader>
              <AccordionBody>
                We&apos;re not always in the position that we want to be at.
                We&apos;re constantly growing. We&apos;re constantly making
                mistakes. We&apos;re constantly trying to express ourselves and
                actualize our dreams.
              </AccordionBody>
            </Accordion>
            <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
              <AccordionHeader onClick={() => handleOpen1(3)}>
                What can I do with Material Tailwind?
              </AccordionHeader>
              <AccordionBody>
                We&apos;re not always in the position that we want to be at.
                We&apos;re constantly growing. We&apos;re constantly making
                mistakes. We&apos;re constantly trying to express ourselves and
                actualize our dreams.
              </AccordionBody>
            </Accordion>
          </>
        </div>
      </body>
    </>
  );
}

export default SanPHam;
