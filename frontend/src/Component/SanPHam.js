import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
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
import { useSubcategory } from "../Context/CategoryContext";
import { useCart } from "../Context/CartContext";
import { useRecentlyViewed } from "../Context/RecentlyViewedContext";
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
  const { cartData, cartToChange } = useCart();
  const [categories, setCategories] = useState([]);
  // const [selectedBrand, setSelectedBrand] = useState(null);
  const [dataFilter, setDataFilter] = useState([]);
  const { addProductToRecentlyViewed } = useRecentlyViewed();
  // const [selectedValue, setSelectedValue] = useState(0);
  const { selectProduct } = useProductContext();
  const handleOpen1 = (value) => setOpen(open === value ? 0 : value);
  const [filters, setFilters] = useState({
    idCategory: null,
    brandId: null,
    Price: null,
  });
  ////////////////////useContext///////////////////////////
  const { searchData, setSearchData } = useContext(ContextSearch);
  const { currentPage, pageSize, updateTotalItems, updatePageSize, setPage } =
    usePagination();
  const { selectedSubcategory, setSelectedSubcategory } = useSubcategory();
  const [loading, setLoading] = useState(true);
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
    updatePageSize(1); // Set pageSize to 8
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
    // console.log("Updating filter:", filterType, value); // Debugging
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };
  //////////////////////////////////////////

  /////////////////////////////////////////////////
  const priceOptions = [
    { value: 100000, title: "0 - 100.000" },
    { value: 500000, title: "100.000 - 500.000" },
    { value: 2000000, title: "500.000 - 2.000.000" },
    { value: 2000001, title: "Trên 2.000.000" },
  ];
  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  //   setPage(1);
  // };
  // const handleBrandClick = (brand) => {
  //   setSelectedBrand(brand);
  //   // Nếu bạn cần chuyển trang, bạn có thể thêm logic tại đây
  //   setPage(1); // Reset trang khi thay đổi thương hiệu
  // };

  // useEffect(() => {
  //   const fetchSearchData = async () => {
  //     if (searchData) {
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/search?Title=${searchData}`
  //         );
  //         // console.log("Search Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching search data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchSearchData();
  // }, [searchData, currentPage]);
  // useEffect(() => {
  //   const fetchCategoryPriceFilteredData = async () => {
  //     if (filters.categoryId && selectedValue) {
  //       console.log(filters.categoryId && selectedValue);
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/category-price?idCategory=${filters.categoryId}&Price=${selectedValue}`
  //         );
  //         // console.log("Category + Price Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching category-price-filtered data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchCategoryPriceFilteredData();
  // }, [filters.categoryId, selectedValue, currentPage]);
  // useEffect(() => {
  //   const fetchBrandPriceFilteredData = async () => {
  //     if (selectedBrand && selectedValue) {
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/brand-price?idthuonghieu=${selectedBrand}&Price=${selectedValue}`
  //         );
  //         // console.log("Brand + Price Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching brand-price-filtered data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchBrandPriceFilteredData();
  // }, [selectedBrand, selectedValue, currentPage]);
  // useEffect(() => {
  //   const fetchCategoryBrandPriceFilteredData = async () => {
  //     if (filters.categoryId && selectedBrand && selectedValue) {
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/category-brand-price?idCategory=${filters.categoryId}&idthuonghieu=${selectedBrand}&Price=${selectedValue}`
  //         );
  //         // console.log("Category + Brand + Price Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error(
  //           "Error fetching category-brand-price-filtered data:",
  //           error
  //         );
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchCategoryBrandPriceFilteredData();
  // }, [filters.categoryId, selectedBrand, selectedValue, currentPage]);
  // useEffect(() => {
  //   const fetchPriceFilteredData = async () => {
  //     if (selectedValue) {
  //       resetFilterStates("price");
  //       console.log(selectedValue);

  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/price?Price=${selectedValue}`
  //         );
  //         // console.log("Price Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching price-filtered data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchPriceFilteredData();
  // }, [selectedValue, currentPage]);
  // useEffect(() => {
  //   const fetchCategoryFilteredData = async () => {
  //     if (filters.categoryId) {
  //       resetFilterStates("category");
  //       console.log(filters.categoryId);
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/products/${filters.categoryId}`
  //         );
  //         // console.log("Category Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching category-filtered data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchCategoryFilteredData();
  // }, [filters.categoryId, currentPage]);

  // useEffect(() => {
  //   const fetchBrandFilteredData = async () => {
  //     if (selectedBrand) {
  //       resetFilterStates("brand");
  //       console.log(selectedBrand);
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/thuonghieu/${selectedBrand}`
  //         );
  //         // console.log("Brand Filtered Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching brand-filtered data:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchBrandFilteredData();
  // }, [selectedBrand, currentPage]);

  // const resetFilterStates = (type) => {
  //   // Reset tất cả trừ state đang được sử dụng
  //   switch (type) {
  //     case "search":
  //       setSelectedBrand(null);
  //       setSelectedValue(null);
  //       setFilters((prevFilters) => ({ ...prevFilters, categoryId: null }));
  //       break;

  //     case "category":
  //       setSelectedBrand(null);
  //       setSelectedValue(null);
  //       break;

  //     case "brand":
  //       setSelectedValue(null);
  //       setFilters((prevFilters) => ({ ...prevFilters, categoryId: null }));
  //       break;

  //     case "price":
  //       setSelectedBrand(null);
  //       setFilters((prevFilters) => ({ ...prevFilters, categoryId: null }));
  //       break;

  //     case "subcategory":
  //       setSelectedBrand(null);
  //       setSelectedValue(null);
  //       setFilters((prevFilters) => ({ ...prevFilters, categoryId: null }));
  //       break;

  //     default:
  //       setSelectedBrand(null);
  //       setSelectedValue(null);
  //       setFilters((prevFilters) => ({ ...prevFilters, categoryId: null }));
  //       break;
  //   }
  //   setData([]);
  //   updateTotalItems(0);
  //   setError(null);
  // };
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // Reset previous data
        setError(null); // Reset any previous errors

        // Only fetch all products when no search, filters, or subcategory
        if (
          !searchData &&
          !filters.idCategory &&
          !filters.brandId &&
          !filters.Price &&
          !selectedSubcategory
        ) {
          // setLoading(true);
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product`
          );
          // setLoading(false);
          if (response.data && response.data.length > 0) {
            updateTotalItems(response.data.length);
            const currentData = paginateData(response.data, 12, currentPage);
            // console.log("Current Page:", currentPage);
            // console.log("Items Per Page:", 12);
            // console.log(
            //   "Paginated Data for Page 1:",
            //   paginateData(response.data, 12, 1)
            // );
            setData(currentData);
          } else {
            setError("No products found");
            // setData([]);
          }
        }
      } catch (err) {
        // setLoading(false);
        setError("Error fetching products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [filters, currentPage]);
  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     try {
  //       // Create an AbortController to cancel previous requests
  //       const controller = new AbortController();
  //       const signal = controller.signal;

  //       // Set loading to true immediately
  //       setLoading(true);
  //       setError(null);

  //       // Only fetch all products when no search, filters, or subcategory
  //       if (
  //         !searchData &&
  //         !filters.idCategory &&
  //         !filters.brandId &&
  //         !filters.Price &&
  //         !selectedSubcategory
  //       ) {
  //         const response = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product`,
  //           { signal }
  //         );

  //         if (response.data && response.data.length > 0) {
  //           updateTotalItems(response.data.length);
  //           const currentData = paginateData(response.data, 12, currentPage);
  //           setData(currentData);
  //         } else {
  //           setError("No products found");
  //           setData([]);
  //         }
  //       }

  //       // Cleanup function to abort request if component unmounts
  //       return () => controller.abort();
  //     } catch (err) {
  //       // Check if error is due to request cancellation
  //       if (axios.isCancel(err)) {
  //         console.log("Request canceled", err.message);
  //       } else {
  //         setError("Error fetching products");
  //         console.error(err);
  //         setData([]); // Ensure data is reset on error
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAllProducts();
  // }, [filters, currentPage, searchData, selectedSubcategory]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null); // Reset lỗi
        // setData([]); // Reset dữ liệu
        // console.log(selectedSubcategory);
        // console.log(searchData);
        // Nếu có searchData, reset selectedSubcategory và tìm kiếm theo searchData
        if (searchData) {
          setSelectedSubcategory(""); // Reset selectedSubcategory

          // Fetch dữ liệu tìm kiếm
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/product/search?Title=${searchData}`
          );

          if (response.data && response.data.length > 0) {
            updateTotalItems(response.data.length);
            const currentData = paginateData(response.data, 12, currentPage);
            setData(currentData);
          } else {
            setData([]); // Không có sản phẩm
          }
        }
        // Nếu có selectedSubcategory, reset searchData và lọc theo selectedSubcategory
        else if (selectedSubcategory) {
          console.log(selectedSubcategory);
          setSearchData(""); // Reset searchData

          // Fetch dữ liệu danh mục
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/categorySubListName/${selectedSubcategory}`
          );

          if (response.data && response.data.length > 0) {
            updateTotalItems(response.data.length);
            const currentData = paginateData(response.data, 12, currentPage);
            setData(currentData);
          } else {
            setData([]); // Không có sản phẩm
          }
        }
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu.");
        setData([]); // Reset dữ liệu khi có lỗi
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Gọi fetchData khi thay đổi searchData hoặc selectedSubcategory
    fetchData();
  }, [searchData, selectedSubcategory, currentPage]);

  // useEffect(() => {
  //   const fetchSearchData = async () => {
  //     try {
  //       setError(null); // Reset lỗi

  //       // Only proceed if searchData is present
  //       if (searchData) {
  //         const response = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product/search?Title=${searchData}`
  //         );

  //         if (response.data && response.data.length > 0) {
  //           updateTotalItems(response.data.length);
  //           const currentData = paginateData(response.data, 12, currentPage);
  //           setData(currentData);
  //         } else {
  //           setData([]); // Trường hợp không tìm thấy sản phẩm
  //           console.log(data);
  //         }
  //       }
  //     } catch (err) {
  //       setError("Error fetching search results");
  //       setData([]); // Reset dữ liệu khi có lỗi
  //       console.error(err);
  //     }
  //   };

  //   fetchSearchData();
  // }, [searchData, currentPage]);
  /////////////////////////////////////////////
  // useEffect(() => {
  //   const fetchFilteredProducts = async () => {
  //     try {
  //       setError(null); // Reset lỗi
  //       // setLoading(true);
  //       // Chỉ gọi API nếu selectedSubcategory có giá trị hợp lệ
  //       if (selectedSubcategory) {
  //         const response = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/categorySubListName/${selectedSubcategory}`
  //         );
  //         // setLoading(false);
  //         if (response.data && response.data.length > 0) {
  //           updateTotalItems(response.data.length);
  //           const currentData = paginateData(response.data, 12, currentPage);
  //           // console.log("Current Page:", currentPage);
  //           // console.log("Items Per Page:", 12);
  //           // console.log(
  //           //   "Paginated Data for Page 1:",
  //           //   paginateData(response.data, 12, 1)
  //           // );
  //           setData(currentData);
  //         } else {
  //           setData([]);
  //           console.log(data);
  //         }
  //       }
  //     } catch (err) {
  //       setError("Lỗi khi lấy sản phẩm.");
  //       // setLoading(false);
  //       setData([]); // Reset dữ liệu khi có lỗi
  //       console.error(err);
  //     }
  //   };
  //   console.log(selectedSubcategory);
  //   fetchFilteredProducts();
  // }, [selectedSubcategory, currentPage]);
  // useEffect(() => {
  //   const fetchFilteredProducts = async () => {
  //     let canceled = false; // Flag to handle component unmounts
  //     try {
  //       setError(null); // Reset error
  //       setLoading(true);

  //       if (selectedSubcategory) {
  //         const response = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/categorySubListName/${selectedSubcategory}`
  //         );

  //         if (!canceled) {
  //           if (response.data && response.data.length > 0) {
  //             updateTotalItems(response.data.length); // Update total items
  //             const currentData = paginateData(response.data, 12, currentPage);
  //             setData(currentData);
  //           } else {
  //             setData([]); // No data found
  //           }
  //         }
  //       } else {
  //         if (!canceled) {
  //           setData([]); // Reset data if no subcategory is selected
  //         }
  //       }
  //     } catch (err) {
  //       if (!canceled) {
  //         setError("Lỗi khi lấy sản phẩm.");
  //         setData([]); // Reset data in case of an error
  //         console.error(err);
  //       }
  //     } finally {
  //       if (!canceled) {
  //         setLoading(false); // Always stop loading
  //       }
  //     }

  //     return () => {
  //       canceled = true; // Cleanup function
  //     };
  //   };

  //   fetchFilteredProducts();
  // }, [selectedSubcategory, currentPage, updateTotalItems]);

  //////////////////////////////////////

  useEffect(() => {
    const fetchCategoryFilter = async () => {
      try {
        setError(null); // Reset any previous errors

        const params = {};

        if (filters.idCategory) params.idCategory = filters.idCategory;
        if (filters.brandId) params.brandId = filters.brandId;
        if (filters.Price) params.Price = filters.Price;

        if (Object.keys(params).length > 0) {
          // resetAllFilters1();
          const response = await axios.get(
            `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/filters`,
            { params }
          );

          if (response.data && response.data.length > 0) {
            updateTotalItems(response.data.length);
            const currentData = paginateData(response.data, 12, currentPage);
            setData(currentData);
          } else {
            setData([]);
          }
        }
      } catch (err) {
        setData([]); // Reset dữ liệu khi có lỗi
        console.error(err);
      }
    };

    fetchCategoryFilter();
  }, [filters, currentPage]);
  const resetAllFilters = () => {
    setFilters({
      idCategory: null,
      brandId: null,
      Price: null,
    });
    setSelectedSubcategory(null); // Reset selectedSubcategory
    setSearchData(""); // Reset searchData
    setPage(1);
  };
  // const resetAllFilters1 = () => {
  //   // setFilters({
  //   //   idCategory: null,
  //   //   brandId: null,
  //   //   Price: null,
  //   // });
  //   setSelectedSubcategory(null); // Reset selectedSubcategory
  //   setSearchData(""); // Reset searchData
  //   setPage(1);
  // };
  // const resetAllFilters2 = () => {
  //   // setFilters({
  //   //   idCategory: null,
  //   //   brandId: null,
  //   //   Price: null,
  //   // });
  //   // setSelectedSubcategory(null); // Reset selectedSubcategory
  //   setSearchData(""); // Reset searchData
  //   setPage(1);
  // };
  // const resetAllFilters3 = () => {
  //   // setFilters({
  //   //   idCategory: null,
  //   //   brandId: null,
  //   //   Price: null,
  //   // });
  //   // setSelectedSubcategory(null); // Reset selectedSubcategory
  //   setSearchData(""); // Reset searchData
  //   setPage(1);
  // };
  const getCategoryNameById = (id) => {
    const category = categories.find((cat) => cat.id === id);
    return category ? category.TitleCategory : "Chưa chọn";
  };

  const getBrandNameById = (id) => {
    const brand = dataFilter.find((b) => b.id === id);
    return brand ? brand.tenthuonghieu : "Chưa chọn";
  };
  // useEffect(() => {
  //   const fetchSubcategoryFilteredData = async () => {
  //     if (selectedSubcategory) {
  //       console.log(selectedSubcategory);
  //       // Đảm bảo có selectedSubcategory
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/filter/categorySubListName/${selectedSubcategory}` // Sử dụng API mới
  //         );
  //         // console.log("Subcategory Filtered Products:", productsResponse.data); // In ra dữ liệu sản phẩm
  //         updateTotalItems(productsResponse.data.length); // Cập nhật tổng số sản phẩm
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData); // Cập nhật dữ liệu sản phẩm hiển thị
  //       } catch (error) {
  //         console.error("Error fetching subcategory-filtered data:", error); // Xử lý lỗi
  //         setError(error); // Cập nhật trạng thái lỗi
  //       }
  //     }
  //   };

  //   fetchSubcategoryFilteredData();
  // }, [selectedSubcategory, currentPage]);
  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     if (!searchData) {
  //       try {
  //         const productsResponse = await axios.get(
  //           `${process.env.REACT_APP_SERVER_URL}/api/v1/product`
  //         );
  //         // console.log("All Products:", productsResponse.data);
  //         updateTotalItems(productsResponse.data.length);
  //         const currentData = paginateData(
  //           productsResponse.data,
  //           12,
  //           currentPage
  //         );
  //         setData(currentData);
  //       } catch (error) {
  //         console.error("Error fetching all products:", error);
  //         setError(error);
  //       }
  //     }
  //   };

  //   fetchAllProducts();
  // }, [searchData, currentPage]);
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
    if (data && data.length > 0) {
      setImageIndices(data.map(() => 0));
    }
  }, [data]);
  const handleProductClick = (productId) => {
    addProductToRecentlyViewed(productId); // Call the context function to update the recently viewed list
  };
  /////////////////////////////////////////////////
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <body>
        <div className="">
          <img
            className="w-full"
            src={require("../assets/img/sanpham.png")}
          ></img>
        </div>
        <div className="Category pt-4 h-full w-full">
          <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 overflow-auto bg-gray-300 flex-none">
            <div className="mb-2 p-4">
              <Typography variant="h5" color="blue-gray">
                FilTer
              </Typography>
            </div>
            <div className="p-4">
              <button
                onClick={resetAllFilters}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Reset Filter
              </button>
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
                            setPage(1);
                            handleFilterChange("idCategory", category.id);
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
                          // value={selectedBrand}
                          onClick={() => {
                            setPage(1);
                            handleFilterChange("brandId", item.id);
                          }}
                          // onClick={() => handleBrandClick(item.id)}
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
                            onChange={() => {
                              setPage(1);
                              handleFilterChange("Price", option.value);
                            }}
                            checked={filters.Price === option.value}
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
              <div className="filter-info bg-blue-50 rounded-lg p-3 mb-4 shadow-md">
                <div className="flex items-center space-x-4">
                  <h3 className="font-bold text-blue-700">
                    Filters đang chọn:
                  </h3>
                  <ul className="flex space-x-3">
                    {filters.idCategory && (
                      <li className="bg-blue-100 px-2 py-1 rounded-md text-blue-800">
                        {getCategoryNameById(filters.idCategory)}
                      </li>
                    )}
                    {filters.brandId && (
                      <li className="bg-green-100 px-2 py-1 rounded-md text-green-800">
                        {getBrandNameById(filters.brandId)}
                      </li>
                    )}
                    {filters.Price && (
                      <li className="bg-purple-100 px-2 py-1 rounded-md text-purple-800">
                        Giá:{" "}
                        {priceOptions.find(
                          (option) => option.value === filters.Price
                        )?.title || "Chưa chọn"}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kiểm tra dữ liệu trước khi hiển thị */}
                {/* {loading ? (
                  // Loading spinner
                  <div className="col-span-full flex justify-center items-center py-20">
                    <ClipLoader color="#3b82f6" size={50} />
                  </div>
                ) : */}
                {data && data.length > 0 ? (
                  data
                    .filter((item) => item.loaisanpham !== "Sale")
                    .map((item, index) => {
                      const images = item.HinhAnh
                        ? item.HinhAnh.split(",")
                        : [];
                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                        >
                          {/* Hiển thị hình ảnh sản phẩm */}
                          <div className="relative w-full h-64">
                            {/* Kiểm tra nếu có hình ảnh */}
                            {images && images.length > 0 ? (
                              <img
                                src={`${
                                  process.env.REACT_APP_SERVER_URL
                                }/src/uploads/avatarProducts/${
                                  images[imageIndices[index] || 0] // Lấy chỉ số hình ảnh
                                }`}
                                alt={`sanpham-${
                                  (imageIndices[index] || 0) + 1
                                }`} // Alt text cho hình ảnh
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              // Hiển thị khi không có hình ảnh
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <p className="text-gray-500 italic">
                                  Không có hình ảnh
                                </p>
                              </div>
                            )}
                            {/* Nút điều hướng hình ảnh */}
                            {images && images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePrevImage(index, images.length); // Chuyển đến hình trước
                                  }}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-black/70 transition-colors duration-200"
                                >
                                  <span className="text-2xl">&#8249;</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleNextImage(index, images.length); // Chuyển đến hình tiếp theo
                                  }}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-black/70 transition-colors duration-200"
                                >
                                  <span className="text-2xl">&#8250;</span>
                                </button>
                              </>
                            )}
                          </div>

                          {/* Thông tin sản phẩm */}
                          <Link
                            to={{
                              pathname: `/SanPham/${item.id}`,
                            }}
                            className="block flex-grow"
                            onClick={() => handleProductClick(item.id)} // Xử lý khi click vào sản phẩm
                          >
                            <div className="p-4 flex-grow">
                              <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                                {item.Title}
                              </h3>
                              <p className="text-xl font-bold mb-2 text-red-600">
                                {formatCurrency(item.Price)}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                Đã bán:{" "}
                                <span className="font-medium">
                                  {item.daban}
                                </span>
                              </p>
                              {/* Hiển thị đánh giá */}
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
                          {/* <div className="p-4">
                            <button
                              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              onClick={() => cartToChange(item)} // Thêm vào giỏ hàng
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div> */}
                          {/* <div className="p-4">
                            <button
                              className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors duration-300 focus:outline-none focus:ring-2 ${
                                item.sold === 0
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "hover:bg-blue-700 focus:ring-blue-500 focus:ring-opacity-50"
                              }`}
                              onClick={() => {
                                if (item.sold > 0) {
                                  cartToChange(item); // Thêm vào giỏ hàng
                                }
                              }}
                              disabled={item.sold === 0}
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div> */}
                          <button
                            className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full transition-colors duration-300 focus:outline-none focus:ring-2 ${
                              item.sold === 0 ||
                              item.loaisanpham === "Ngưng kinh doanh"
                                ? "bg-gray-400 cursor-not-allowed"
                                : "hover:bg-blue-700 focus:ring-blue-500 focus:ring-opacity-50"
                            }`}
                            onClick={() => {
                              if (
                                item.sold > 0 &&
                                item.loaisanpham !== "Ngưng kinh doanh"
                              ) {
                                cartToChange(item); // Thêm vào giỏ hàng
                              }
                            }}
                            disabled={
                              item.sold === 0 ||
                              item.loaisanpham === "Ngưng kinh doanh"
                            }
                          >
                            {item.loaisanpham === "Ngưng kinh doanh"
                              ? "Ngưng Kinh Doanh"
                              : "Thêm vào giỏ hàng"}
                          </button>
                        </div>
                      );
                    })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 italic text-lg">
                      Sản phẩm này hiện chưa có.
                    </p>
                  </div>
                )}
                {/* {loading ? (
                  // Loading spinner
                  <div className="col-span-full flex justify-center items-center py-20">
                    <ClipLoader color="#3b82f6" size={50} />
                  </div>
                ) : data && data.length > 0 ? (
                  data
                    .filter((item) => item.loaisanpham !== "Sale")
                    .map((item, index) => {
                      const images = item.HinhAnh
                        ? item.HinhAnh.split(",")
                        : [];
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
                                alt={`sanpham-${
                                  (imageIndices[index] || 0) + 1
                                }`}
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
                            to={{
                              pathname: `/SanPham/${item.id}`,
                            }}
                            className="block flex-grow"
                            onClick={() => handleProductClick(item.id)}
                          >
                            <div className="p-4 flex-grow">
                              <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                                {item.Title}
                              </h3>
                              <p className="text-xl font-bold mb-2 text-red-600">
                                {formatCurrency(item.Price)}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                Đã bán:{" "}
                                <span className="font-medium">
                                  {item.daban}
                                </span>
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
                          <div className="p-4">
                            <button
                              className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                              onClick={() => cartToChange(item)}
                            >
                              Thêm vào giỏ hàng
                            </button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500 italic text-lg">
                      Sản phẩm này hiện chưa có.
                    </p>
                  </div>
                )} */}
              </div>

              <Pagination />
            </div>
          </div>
        </div>
        {/* <div className="template p-[50px] ">
          <div className="border-t-4 grid grid-cols-2 gap 4 pt-[15px]">
            <div className="">
              <div className="title-temp">
                <h2>Chất dân dã của ẩm thực miền Tây</h2>
                <div>
                  <p className="text-sm text-justify">
                    Mùa nước nổi nơi đây kéo dài từ cuối tháng 7 đến tháng 11
                    hàng năm, kéo theo những đàn cá rô đồng, cá linh và sự sinh
                    trưởng của bông súng, bông điên điển. Với sản vật tươi ngon
                    sẵn có, người dân châu thổ Mekong sáng tạo nên nhiều món ăn
                    chỉ cần nếm qua hương vị cũng khiến du khách khó quên. Trong
                    đó, lẩu cá linh bông điên điển được dùng kèm các loại rau
                    dân dã, đậm màu, trở thành món ăn đặc sắc nhất miền Tây.
                  </p>
                </div>
              </div>
            </div>
            <div className="">
              <div>
                <img src={require("../assets/img/canhchua.jpg")}></img>
              </div>
            </div>
          </div>
        </div> */}
        <div className="Expert p-[50px]">
          <>
            <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
              <AccordionHeader onClick={() => handleOpen1(1)}>
                Lời khuyên của chuyên gia.
              </AccordionHeader>
              <AccordionBody className="flex flex-col space-y-2">
                <div>Hãy đến và đọc các bài viết của chúng tôi</div>
                <div></div>
              </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
              <AccordionHeader onClick={() => handleOpen1(2)}>
                Du lịch mạo hiểm.
              </AccordionHeader>
              <AccordionBody className="flex flex-col space-y-2">
                <div>Hãy đến và đọc các bài viết của chúng tôi</div>
                <div></div>
              </AccordionBody>
            </Accordion>
          </>
        </div>
        <div className="h-40"></div>
      </body>
    </>
  );
}

export default SanPHam;
