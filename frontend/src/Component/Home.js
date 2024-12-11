import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Glider from "glider-js";
import { Blog } from "../Component";
import { CreatePost, Sale, Brand, BaoHanh, GioiThieu } from "../Component";
import "../App.css";
import { useCart } from "../Context/CartContext";
import { useSubcategory } from "../Context/CategoryContext";
import axios from "axios";
import { Tooltip } from "@material-tailwind/react";
import { useRecentlyViewed } from "../Context/RecentlyViewedContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "../Context/PaginationContext";
import { ContextSearch } from "../Context/ContextSearch";
export function Home() {
  const [data, setData] = useState([]);
  const [datacate, setDatacate] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  const { recentlyViewed, addProductToRecentlyViewed } = useRecentlyViewed();
  // const { cartData, cartToChange } = useContext(CartContext);
  const { setPage } = usePagination();
  const { setSearchData } = useContext(ContextSearch);
  const { setSelectedSubcategory } = useSubcategory();
  const { cartData, cartToChange } = useCart();
  // const { cartData, cartToChange } = useCart();
  // useEffect(() => {
  //   console.log(setDataLoai(data));
  // }, [data]);

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
  useEffect(() => {
    //step 1: get DOM
    let nextDom = document.getElementById("next");
    let prevDom = document.getElementById("prev");

    let carouselDom = document.querySelector(".carousel");
    let SliderDom = carouselDom.querySelector(".carousel .list");
    let thumbnailBorderDom = document.querySelector(".carousel .thumbnail");
    let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll(".item");
    let timeDom = document.querySelector(".carousel .time");

    // thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
    let timeRunning = 3000;
    // let timeAutoNext = 7000;

    nextDom.onclick = function () {
      showSlider("next");
    };

    prevDom.onclick = function () {
      showSlider("prev");
    };
    let runTimeOut;
    // let runNextAuto = setTimeout(() => {
    //     nextDom.click();
    // }, timeAutoNext)
    function showSlider(type) {
      let SliderItemsDom = SliderDom.querySelectorAll(".carousel .list .item");
      let thumbnailItemsDom = document.querySelectorAll(
        ".carousel .thumbnail .item"
      );

      if (type === "next") {
        if (SliderItemsDom.length > 0) {
          SliderDom.appendChild(SliderItemsDom[0]);
        } else {
          console.error("Không tìm thấy SliderItemsDom");
        }

        if (thumbnailItemsDom.length > 0) {
          thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        } else {
          console.error("Không tìm thấy thumbnailItemsDom");
        }

        carouselDom.classList.add("next");
      } else {
        if (SliderItemsDom.length > 0) {
          SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        } else {
          console.error("Không tìm thấy SliderItemsDom");
        }

        if (thumbnailItemsDom.length > 0) {
          thumbnailBorderDom.prepend(
            thumbnailItemsDom[thumbnailItemsDom.length - 1]
          );
        } else {
          console.error("Không tìm thấy thumbnailItemsDom");
        }

        carouselDom.classList.add("prev");
      }

      clearTimeout(runTimeOut);
      runTimeOut = setTimeout(() => {
        carouselDom.classList.remove("next");
        carouselDom.classList.remove("prev");
      }, timeRunning);

      // clearTimeout(runNextAuto);
      // runNextAuto = setTimeout(() => {
      //     nextDom.click();
      // }, timeAutoNext)
    }
  }, []);
  useEffect(() => {
    console.log(cartData);
  });
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/category`)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        setData(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/categorySubList`)
      .then((response) => {
        // console.log(response.data);
        setDatacate(response.data);
      })
      .catch((error) => {
        setDatacate(error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/product`)
      .then((response) => {
        // console.log(dataLoai);
        setDataLoai(response.data);
      })
      .catch((error) => {});
  }, []);
  const getSubcategoriesForCategory = (id) => {
    return datacate.filter((subcategory) => subcategory.idloaisanpham === id);
  };
  useEffect(() => {
    if (dataLoai && dataLoai.length > 0) {
      // Đợi một chút để đảm bảo DOM đã render xong
      const timer = setTimeout(() => {
        new Glider(document.querySelector(".glider"), {
          slidesToShow: 3,
          dots: "#dots",
          arrows: {
            prev: ".glider-prev",
            next: ".glider-next",
          },
          responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 2,
              },
            },
            {
              breakpoint: 740,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 400,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 300,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        });
      }, 100); // Đợi 100ms

      return () => clearTimeout(timer); // Xóa timer khi component unmount
    }
  }, [dataLoai]); // Khởi động lại effect khi `dataLoai` thay đổi
  ////////////////////////////////////////////////////////////////////

  const [imageIndices, setImageIndices] = useState(
    recentlyViewed.map(() => 0) // Start with the first image (index 0) for each product
  );

  // Handle next image
  const handleNextImage = (productIndex, imagesLength) => {
    setImageIndices((prevIndices) =>
      prevIndices.map((currentIndex, idx) =>
        idx === productIndex
          ? currentIndex === imagesLength - 1
            ? 0 // Loop back to first image if on last one
            : currentIndex + 1 // Move to next image
          : currentIndex
      )
    );
  };

  // Handle previous image
  const handlePrevImage = (productIndex, imagesLength) => {
    setImageIndices((prevIndices) =>
      prevIndices.map((currentIndex, idx) =>
        idx === productIndex
          ? currentIndex === 0
            ? imagesLength - 1 // Loop back to last image if on first one
            : currentIndex - 1 // Move to previous image
          : currentIndex
      )
    );
  };
  useEffect(() => {
    if (recentlyViewed) {
      setImageIndices(recentlyViewed.map(() => 0));
    }
  }, [recentlyViewed]);
  const handleProductClick = (productId) => {
    addProductToRecentlyViewed(productId); // Call the context function to update the recently viewed list
  };
  return (
    <>
      <nav className="bg-black">
        <div className="max-w-7xl flex items-center mx-auto relative">
          <ul className="flex font-semibold">
            <li className="group">
              <a className="menu-item group-hover:border-white" href="/SanPham">
                Shop All
              </a>
              <div
                className="grid grid-cols-7 w-full p-5 absolute top-full left-0 bg-white text-white mt-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-10 group-hover:mt-0 
                transition-all duration-500 "
              >
                {data &&
                  data.map((items) => (
                    <ul className="p-2 " key={items.id}>
                      <li className=" border-blue-gray-900 border-b-2">
                        <Link to="" className="mega-sub-item-title">
                          {items.TitleCategory}
                        </Link>
                      </li>
                      {getSubcategoriesForCategory(items.id).map((item) => (
                        <div className="">
                          <li className="flex justify-between" key={item.id}>
                            <Link
                              to="/SanPham"
                              className="mega-sub-item"
                              onClick={() => {
                                setPage(1);
                                setSearchData("");
                                setSelectedSubcategory(item.title);
                              }}
                            >
                              {item.title}
                            </Link>
                          </li>
                        </div>
                      ))}
                    </ul>
                  ))}
                <ul></ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div class="carousel">
        <div class="list">
          <div class="item">
            <img src={require("../assets/img/RungNgapManCaMau.jpg")} />
            <div class="SupContent">
              <div class="author">CampingK</div>
              <div class="titleau">DU LỊCH</div>
              <div class="topic">CẢNH QUANG</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/RungTramTraSu.jpg")} />
            <div class="SupContent">
              <div class="author">CampingK</div>
              <div class="titleau">DU LỊCH</div>
              <div class="topic">CẢNH QUANG</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/Tramchim.jpg")} />
            <div class="SupContent">
              <div class="author">CampingK</div>
              <div class="titleau">DU LỊCH</div>
              <div class="topic">CẢNH QUANG</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/dulich.jpg")} />
            <div class="SupContent">
              <div class="author">CampingK</div>
              <div class="titleau">DU LỊCH</div>
              <div class="topic">CẢNH QUANG</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
              </div>
            </div>
          </div>
        </div>

        <div class="thumbnail">
          <div class="item">
            <img src={require("../assets/img/RungNgapManCaMau.jpg")} />
            <div class="SupContent">
              <div class="titleau">Rừng Ngập Mặn Cà Mau</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/RungTramTraSu.jpg")} />
            <div class="SupContent">
              <div class="titleau">Rừng Tràm Trà Sư</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/Tramchim.jpg")} />
            <div class="SupContent">
              <div class="titleau">Tràm Chim</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/dulich.jpg")} />
            <div class="SupContent">
              <div class="titleau">Địa Điểm Du Lịch</div>
            </div>
          </div>
        </div>
        <div class="arrows">
          <button id="prev">{"<"}</button>
          <button id="next">{">"}</button>
        </div>
      </div>

      <div className="content">
        <body>
          <div className="PageWith">
            <div className="text-[43px]">Sản phẩm bạn xem gần đây</div>

            <ul className="flex space-x-4 overflow-x-auto pb-4 px-4">
              {recentlyViewed.slice(0, 5).map((product, productIndex) => {
                // Get the image URLs from the product data
                const images = product.image_urls || ["default-image.jpg"];
                const currentImageIndex = imageIndices[productIndex]; // Get the current image index

                return (
                  <li
                    key={product.id}
                    className="w-64 flex-shrink-0 bg-white shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`${process.env.REACT_APP_SERVER_URL}/src/uploads/avatarProducts/${images[currentImageIndex]}`}
                        alt={`Product ${product.id} Image ${
                          currentImageIndex + 1
                        }`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/path/to/default-image.jpg"; // Default image fallback
                          e.target.className =
                            "w-full h-full object-cover opacity-50";
                        }}
                      />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              handlePrevImage(productIndex, images.length)
                            }
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75 transition"
                          >
                            <ChevronLeft className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            onClick={() =>
                              handleNextImage(productIndex, images.length)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 rounded-full p-1 hover:bg-white/75 transition"
                          >
                            <ChevronRight className="w-4 h-4 text-gray-700" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.Title}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-blue-600">
                          {`${formatCurrency(product.Price)}`}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* {data &&
                data.slice(0, 4).map((items) => (
                  <div
                    className="flex flex-col items-center text-center gap-4"
                    key={items.id}
                  >
                    <Link href="/" className="flex flex-col items-center gap-4">
                      <div className="logo overflow-hidden rounded-lg">
                        <img
                          src={require(`../assets/img/${items.ImagesCategory}`)}
                          alt="Camping"
                          className="w-full max-w-[10em] h-auto transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <span className="font-bold text-blue-600 hover:underline transition-all duration-300">
                        {items.TitleCategory}
                      </span>
                    </Link>
                  </div>
                ))} */}
          </div>

          <BaoHanh />
          <Brand />
          <div className="product">
            <div className="title-product p-[15px] flex justify-center text-[43px]">
              Sản Phẩm Nổi Bật
            </div>

            <div className=" flex h-full flex-row justify-center">
              {dataLoai &&
                dataLoai
                  .filter(
                    (itemSanPham) => itemSanPham.loaisanpham === "BanChay"
                  )
                  .sort(() => 0.5 - Math.random()) // Xáo trộn mảng
                  .slice(0, 5)
                  .map((itemSanPham, index) => (
                    <div
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
                      key={index}
                    >
                      <div className="card border border-gray-300 shadow-lg rounded-lg flex flex-col items-center">
                        <div className="cardImg w-full h-48 md:h-60 lg:h-72">
                          <Link to={`/SanPham/${itemSanPham.id}`}>
                            <img
                              className="w-full h-full object-cover rounded-t-lg"
                              src={`${
                                process.env.REACT_APP_SERVER_URL
                              }/src/uploads/avatarProducts/${
                                itemSanPham.HinhAnh
                                  ? itemSanPham.HinhAnh.split(",")[0]
                                  : "default-image.jpg"
                              }`}
                              alt={itemSanPham.Title}
                              onClick={() => handleProductClick(itemSanPham.id)}
                            />
                          </Link>
                        </div>
                        <div className="cardContent p-4 flex flex-col items-center">
                          <h1 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                            {itemSanPham.Title}
                          </h1>
                          <p className="text-red-600 text-xl font-bold mb-4">
                            {`${formatCurrency(itemSanPham.Price)}`}
                          </p>

                          {cartData.indexOf(itemSanPham) !== -1 ? (
                            <span className="text-green-600">
                              Sản phẩm đã có trong giỏ
                            </span>
                          ) : (
                            <button
                              className="bg-cyan-900 text-white px-4 py-2 rounded-md hover:bg-cyan-800 transition w-full"
                              onClick={() => cartToChange(itemSanPham)}
                            >
                              ADD to Cart
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <section className="N-slider">
            <h3 className="Slider-heading">Sản Phẩm Mới</h3>
            <div className="slider-btns">
              <button aria-label="Previous" className="glider-prev">
                <span>{"<"}</span>
              </button>
              <button aria-label="Next" className="glider-next">
                <span>{">"}</span>
              </button>
            </div>

            <div className="glider-contain">
              <div className="glider flex gap-4">
                {dataLoai &&
                  dataLoai
                    .filter((itemSanPham) => itemSanPham.loaisanpham === "new") // Lọc chỉ sản phẩm "new"
                    .slice(0, 10) // Lấy tối đa 10 sản phẩm
                    .map((itemSanPham, index) => (
                      <div className="box-new" key={index}>
                        <div
                          className="relative w-full h-72 overflow-hidden group"
                          onClick={() => handleProductClick(itemSanPham.id)}
                        >
                          <Link
                            to={`/SanPham/${itemSanPham.id}`}
                            className="block"
                          >
                            <img
                              src={`${
                                process.env.REACT_APP_SERVER_URL
                              }/src/uploads/avatarProducts/${
                                itemSanPham.HinhAnh
                                  ? itemSanPham.HinhAnh.split(",")[0]
                                  : "default-image.jpg"
                              }`}
                              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                              alt="ảnh"
                            />
                            <img
                              src={`${
                                process.env.REACT_APP_SERVER_URL
                              }/src/uploads/avatarProducts/${
                                itemSanPham.HinhAnh
                                  ? itemSanPham.HinhAnh.split(",")[1]
                                  : "default-image.jpg"
                              }`}
                              className="w-full h-full object-cover transition-transform duration-300 ease-in-out absolute top-0 left-0 opacity-0 group-hover:opacity-100"
                              alt="ảnh"
                            />
                          </Link>
                        </div>
                        <div className="p-4">
                          <div className="pro-category">
                            <span className="text-sm font-semibold">
                              {itemSanPham.Title}
                            </span>
                          </div>
                          <Link
                            to={`/SanPham/${itemSanPham.id}`}
                            className="pro-title text-lg font-medium line-clamp-2"
                            onClick={() => handleProductClick(itemSanPham.id)}
                          >
                            {itemSanPham.Description}
                          </Link>
                          <div className="price-buy flex items-center justify-between mt-2">
                            <span className="p-price text-lg font-bold">
                              {`${formatCurrency(itemSanPham.Price)}`}
                            </span>
                            <button
                              className="p-buy-btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                              onClick={() => cartToChange(itemSanPham)}
                            >
                              Buy Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </section>
          <Sale />
          <div className="text-[43px] font-semibold">
            <Blog />
          </div>
          <div className="text-[43px] font-semibold">
            <CreatePost />
          </div>
        </body>
      </div>
      <div>
        <GioiThieu />
      </div>
      <div className="title-img-nav flex justify-center text-[43px]">
        Địa Điểm Tuyệt Vời
      </div>
      <div className="img-nav" style={{ height: "500px" }}>
        <div className="title-midle"></div>
      </div>
      <div className="h-96 w-full"></div>
    </>
  );
}
export default Home;
