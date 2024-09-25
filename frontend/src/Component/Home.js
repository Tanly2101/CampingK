import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Glider from "glider-js";
import { Blog } from "../Component";
import { CreatePost, Sale, Brand, BaoHanh } from "../Component";
import "../App.css";
import { useCart } from "../Context/CartContext";
import axios from "axios";

export function Home() {
  const [data, setData] = useState([]);
  const [datacate, setDatacate] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  // const { cartData, cartToChange } = useContext(CartContext);
  const { cartData, cartToChange } = useCart();
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
        console.log(dataLoai);
        setDataLoai(response.data);
      })
      .catch((error) => {});
  }, []);
  const getSubcategoriesForCategory = (id) => {
    return datacate.filter((subcategory) => subcategory.idloaisanpham === id);
  };
  useEffect(() => {
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
  }, []);

  return (
    <>
      <nav className="bg-black">
        <div className="max-w-7xl flex items-center mx-auto relative">
          <ul className="flex font-semibold">
            <li className="group">
              <Link
                className="menu-item group-hover:border-white"
                to="/SanPham"
              >
                Shop All
              </Link>
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
                        <div className=" ">
                          <li className="flex justify-between" key={item.id}>
                            <Link to="" className="mega-sub-item">
                              {item.title}
                            </Link>
                          </li>
                        </div>
                      ))}
                    </ul>
                  ))}
                <ul className="p-2 ">
                  <img
                    src={require("../assets/img/nav.png")}
                    className="h-full"
                  ></img>
                </ul>
                <ul></ul>
              </div>
            </li>
            <li className="group">
              <Link className="menu-item group-hover:border-white">MORE</Link>

              <div
                className="grid grid-cols-4 w-full p-5 absolute top-full left-0 bg-white text-white mt-10 opacity-0 invisible  group-hover:opacity-100 group-hover:visible group-hover:top-10 group-hover:mt-0
                transition-all duration-500 "
              >
                <ul className="p-2">
                  <li>
                    <Link to="" className="mega-sub-item-title">
                      Product category
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                </ul>
                <ul className="p-2">
                  <li>
                    <Link to="" className="mega-sub-item-title">
                      Product category
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                </ul>
                <ul className="p-2">
                  <li>
                    <Link to="" className="mega-sub-item-title">
                      Product category
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                </ul>
                <ul className="p-2">
                  <li>
                    <Link to="" className="mega-sub-item-title">
                      Product category
                    </Link>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                  <li className="flex justify-between">
                    <Link to="" className="mega-sub-item">
                      Sub category
                    </Link>
                    <button className="text-black">{">"}</button>
                  </li>
                </ul>

                <ul></ul>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <div class="carousel">
        <div class="list">
          <div class="item">
            <img src={require("../assets/img/img1.jpg")} />
            <div class="SupContent">
              <div class="author">LUNDEV</div>
              <div class="titleau">DESIGN</div>
              <div class="topic">ANIMAL</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img2.jpg")} />
            <div class="SupContent">
              <div class="author">LUNDEV</div>
              <div class="titleau">DESIGN</div>
              <div class="topic">ANIMAL</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img3.jpg")} />
            <div class="SupContent">
              <div class="author">LUNDEV</div>
              <div class="titleau">DESIGN</div>
              <div class="topic">ANIMAL</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img4.jpg")} />
            <div class="SupContent">
              <div class="author">LUNDEV</div>
              <div class="titleau">DESIGN</div>
              <div class="topic">ANIMAL</div>
              <div class="des">
                Nội dung chỉ đơn Giản là giới thiệu về các địa điểm cấm trại
                thôi
              </div>
              <div class="buttons">
                <button>SEE MORE</button>
                <button>SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>

        <div class="thumbnail">
          <div class="item">
            <img src={require("../assets/img/img1.jpg")} />
            <div class="SupContent">
              <div class="titleau">Name Slider</div>
              <div class="description">Description</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img2.jpg")} />
            <div class="SupContent">
              <div class="titleau">Name Slider</div>
              <div class="description">Description</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img3.jpg")} />
            <div class="SupContent">
              <div class="titleau">Name Slider</div>
              <div class="description">Description</div>
            </div>
          </div>
          <div class="item">
            <img src={require("../assets/img/img4.jpg")} />
            <div class="SupContent">
              <div class="titleau">Name Slider</div>
              <div class="description">Description</div>
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
            <div className="text-[43px]">Mua Sắm Các Danh Mục Hàng Đầu</div>
            <div className="grid grid-cols-4 gap-5 p-5">
              {data &&
                data.slice(0, 4).map((items) => (
                  <div
                    className="flex flex-col items-center text-center gap-4"
                    key={items.id}
                  >
                    <Link href="/" className="flex flex-col items-center gap-4">
                      <div className="logo overflow-hidden rounded-lg">
                        <img
                          src={require("../assets/img/camping.png")}
                          alt="Camping"
                          className="w-full max-w-[10em] h-auto transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <span className="font-bold text-blue-600 hover:underline transition-all duration-300">
                        {items.TitleCategory}
                      </span>
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          <BaoHanh />
          <Brand />
          <div className="product">
            <div className="title-product p-[15px] flex justify-center text-[43px]">
              Sản Phẩm Nổi Bật
            </div>
            <div className=" flex h-full  flex-row justify-center">
              {dataLoai &&
                dataLoai
                  .filter(
                    (itemSanPham) => itemSanPham.loaisanpham === "BanChay"
                  )
                  .sort(() => 0.5 - Math.random()) // Xáo trộn mảng
                  .slice(0, 5) // Lấy 5 sản phẩm đầu tiên sau khi xáo trộn
                  .map((itemSanPham, index) => (
                    <div
                      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
                      key={index}
                    >
                      <div className="card border border-gray-300 shadow-lg rounded-lg flex flex-col items-center">
                        <div className="cardImg w-full h-48 md:h-60 lg:h-72">
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
                          />
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
              <button aria-label="Previous" class="glider-prev">
                <span>{"<"}</span>
              </button>
              <button aria-label="Next" class="glider-next">
                <span>{">"}</span>
              </button>
            </div>

            <div class="glider-contain">
              <div class="glider flex gap-4">
                {dataLoai &&
                  dataLoai.map((itemSanPham, index) => {
                    if (itemSanPham.loaisanpham !== "new" || index >= 7) {
                      return null; // Bỏ qua nếu không phải "BanChay" hoặc đã hiển thị quá 4 sản phẩm
                    }
                    return (
                      <div className="box-new ">
                        <div className="p-img-container" key={index}>
                          <div className="p-img">
                            <Link to="/">
                              <img
                                src={require("../assets/img/fishing.png")}
                                className="p-img-front"
                                alt="ảnh"
                              ></img>
                              <img
                                src={require("../assets/img/divingandspearfishing.png")}
                                className="p-img-back"
                                alt="ảnh"
                              ></img>
                            </Link>
                          </div>
                          <div className="p-box-text">
                            <div className="pro-category">
                              <span>{itemSanPham.Title}</span>
                            </div>
                            <Link to="/" className="pro-title">
                              {itemSanPham.Description}
                            </Link>
                            <div className="price-buy">
                              <span className="p-price">
                                {" "}
                                {`${formatCurrency(itemSanPham.Price)}`}
                              </span>
                              <button
                                className="p-buy-btn"
                                onClick={() => cartToChange(itemSanPham)}
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
      <div className="title-img-nav flex justify-center text-[43px]">
        Địa Điểm Tuyệt Vời
      </div>
      <div className="img-nav" style={{ height: "500px" }}>
        <div className="title-midle"></div>
      </div>
      <div className="contact h-96 w-full">
        <div className="">
          <div className="contact-box bg-cyan-300  flex justify-evenly h-48 items-center">
            <div className="text-2xl w-[410px]">
              <span className="text-white font-bold">
                THAM GIA CÂU LẠC BỘ PHIÊU LƯU{" "}
              </span>
              Nhận giảm giá Câu lạc bộ, tham dự các sự kiện độc quyền và hơn thế
              nữa
            </div>
            <div>
              <button className="rounded-full py-[10px] px-[50px] border-2 m-[20px] flex bg-white">
                Đăng Ký Miên Phí
                <span className="pl-5">{">"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
