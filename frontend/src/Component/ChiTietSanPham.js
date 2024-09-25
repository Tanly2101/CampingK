import { React, useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Star } from "lucide-react";
// import Slider from 'react-slick';
import "../App.css";
import { CiClock2, CiSignpostL1 } from "react-icons/ci";
import { BiLike } from "react-icons/bi";
import { SiAdguard } from "react-icons/si";
import { ProDuctInFor, SelectQuantity } from ".";
import { formatMoney, formatPrice } from "../ultis/helpers";
import { useParams } from "react-router-dom";
import { useProductContext } from "../Context/ProductContext";
import { Link } from "react-router-dom";
import { Rating } from "@material-tailwind/react";
import { useCart } from "../Context/CartContext";
const ChiTietSanPham = () => {
  const { id } = useParams();
  const { cartData, cartToChange } = useCart();
  const { selectedProduct, selectProduct } = useProductContext();
  const [quantity, setQuantity] = useState(1);
  const [data, setData] = useState();
  const [dataloai, setDataLoai] = useState();
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const reviewSectionRef = useRef(null);
  const [averageRating, setAverageRating] = useState(0);
  const [formData, setFormData] = useState({
    ContentComments: "",
    LastName: "",
    PhoneComments: "",
    idsanpham: "",
    SaoDanhGia: 0, // Default rating of 0 stars
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleStarRatingChange = (star) => {
    setFormData((prevData) => ({
      ...prevData,
      SaoDanhGia: star,
    }));
  };
  const handleScrollToReview = () => {
    if (reviewSectionRef.current) {
      reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  /////////////////////////////////////////////////////

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   if (selectedProduct && selectedProduct.id === parseInt(id)) {
  //     setData(selectedProduct);
  //   } else {
  //     fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/product/${id}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // console.log(data);
  //         setData(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }
  // }, [id, selectedProduct]);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (selectedProduct && selectedProduct.id === parseInt(id)) {
      setData(selectedProduct);
      setFormData((prevData) => ({
        ...prevData,
        idsanpham: selectedProduct.id,
      }));
    } else {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/v1/product/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setFormData((prevData) => ({
            ...prevData,
            idsanpham: data.id,
          }));
          console.log("Fetched Data:", data);
          selectProduct(data); // Lưu sản phẩm đã lấy vào context
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [id, selectedProduct, selectProduct]);
  ///////////////////////////////////////////////////////////
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/v1/product`)
      .then((response) => {
        setDataLoai(response.data);
      })
      .catch((error) => {});
  }, []);
  ////////////////////////////////////////
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/commentsAll/${id}`
        );
        const fetchedComments = response.data;
        setComments(fetchedComments);

        // Calculate average rating
        if (fetchedComments.length > 0) {
          const totalRating = fetchedComments.reduce(
            (acc, comment) => acc + comment.SaoDanhGia,
            0
          );
          const average = totalRating / fetchedComments.length;
          setAverageRating(average);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);
  /////////////////////////////////////////
  const handleQuantity = useCallback((number) => {
    if (!Number(number) || Number(number) < 1) {
      return;
    } else {
      setQuantity(number);
    }
  }, []);
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };
  const handleChangeQuantity = useCallback(
    (flag) => {
      if (flag === "minus" && quantity === 1) return;
      if (flag === "minus") setQuantity((prev) => +prev - 1);
      if (flag === "plus") setQuantity((prev) => +prev + 1);
    },
    [quantity]
  );
  ///////////////////////////////////////
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // console.log("formData:", JSON.stringify(formData));
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.ContentComments.trim() ||
      !formData.LastName.trim() ||
      !formData.PhoneComments.trim() ||
      formData.SaoDanhGia === 0
    ) {
      alert("Vui lòng điền đầy đủ thông tin và đánh giá sao.");
      return;
    }

    try {
      console.log("Đang gửi request...");

      // Send a POST request to the server
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/comments`,
        formData
      );

      console.log("Đã nhận response:", response.data);
      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      if (error.response) {
        console.error("Dữ liệu lỗi:", error.response.data);
        alert("Đã có lỗi xảy ra khi gửi đánh giá.");
      } else if (error.request) {
        console.error("Không nhận được response:", error.request);
        alert("Không nhận được phản hồi từ máy chủ.");
      } else {
        console.error("Lỗi:", error.message);
        alert("Đã xảy ra lỗi khi gửi yêu cầu.");
      }
    }

    // Close the modal after submission
    handleCloseModal();
  };

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  // };

  const AverageRating = parseFloat(data?.DiemDanhGiaTrungBinh) || 0;
  const totalReviews = data?.SoLuongDanhGia || 0;
  const recommendPercentage = totalReviews
    ? Math.round(
        ((parseInt(data?.SoLuong5Sao) + parseInt(data?.SoLuong4Sao)) /
          totalReviews) *
          100
      )
    : 0;

  const ratingBreakdown = [
    { stars: 5, count: parseInt(data?.SoLuong5Sao) || 0 },
    { stars: 4, count: parseInt(data?.SoLuong4Sao) || 0 },
    { stars: 3, count: parseInt(data?.SoLuong3Sao) || 0 },
    { stars: 2, count: parseInt(data?.SoLuong2Sao) || 0 },
    { stars: 1, count: parseInt(data?.SoLuong1Sao) || 0 },
  ];

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex">
        {[...Array(totalStars)].map((_, index) => (
          <svg
            key={index}
            className={`w-6 h-6 ${
              index < filledStars ? "text-yellow-700" : "text-gray-300"
            } ${index === filledStars && hasHalfStar ? "text-yellow-600" : ""}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d={
                index < filledStars || (index === filledStars && hasHalfStar)
                  ? "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  : "M12 5.27l1.165 2.357.051.102.112.031 2.541.228c.393.036.543.519.266.777l-1.996 1.877.612 2.593c.083.353-.305.617-.597.447l-2.253-1.557-2.253 1.557c-.292.17-.68-.094-.597-.447l.612-2.593-1.996-1.877c-.277-.258-.127-.741.266-.777l2.541-.228.112-.031.051-.102L12 5.27z"
              }
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };
  const handleAddToCart = () => {
    const productWithQuantity = {
      ...data,
      amount: quantity, // Include selected quantity in the cart
    };

    cartToChange(data, quantity); // Add product with selected quantity to the cart
  };
  return (
    <div className="w-full m-auto flex flex-col gap-6">
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-[1050px]">
          <h3>Chi Tiết Sản Phẩm</h3>
        </div>
      </div>
      {data && (
        <div>
          <div className="w-[1050px] m-auto mt-4 flex sm:w-full gap-4 ">
            <div className="flex flex-col gap-4 w-3/5">
              <div className="h-[458px] w-full border object-cover">
                {/* <ReactImageMagnify {...{
              smallImage: {
                alt: 'Wristwatch by Ted Baker London',
                isFluidWidth: true,
                src: require("../assets/img/bepga.jpg")
              },
              largeImage: {
                src: require("../assets/img/bepga.jpg"),
                width: 1200,
                height: 1800
              }/
            }} /> */}
              </div>
              {/* <div className="w-[458px]">
            <Slider {...settings} className="image-slider bg-gray-400">
              <div>
                <img src={require("../assets/img/bepga.jpg")} alt="sanpham" />
              </div>
              <div>
                <img src={require("../assets/img/bepga.jpg")} alt="sanpham" />
              </div>
              <div>
                <img src={require("../assets/img/bepga.jpg")} alt="sanpham" />
              </div>
            </Slider>
          </div> */}
            </div>
            <div className="flex flex-col  w-2/5 ">
              <div className="w-full flex flex-col gap-6 border p-4 bg-[#efefec] rounded-t-lg">
                <div className="flex items-center justify-between">
                  <h2 className="text-[30px] font-semibold">{data.Title}</h2>
                  <span className="text-sm text-[#c7370f]">
                    Kho: {data.sold}
                  </span>
                </div>
                <div className="flex  mt-4 gap-2 flex-col">
                  Đánh Giá
                  <span className="text-sm text-[#c7370f] italic">
                    (Lựa Chọn Tuyệt vời đã có {data.daban} sản phẩm được bán.)
                  </span>
                </div>
                <h3 className="text-[30px] font-semibold text-[#c7370f]">
                  {`${formatCurrency(data.Price)}`} VND
                </h3>
                <ul className="text-base list-square pl-5 text-gray-500">
                  <li className="leading-6">{data.Description}</li>
                </ul>
                <div>
                  <SelectQuantity
                    quantity={quantity}
                    handleQuantity={handleQuantity}
                    handleChangeQuantity={handleChangeQuantity}
                  />
                </div>
                <div>
                  <button
                    className="w-full px-4 py-2 rounded-md text-white bg-red-400 font-semibold my-2"
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-around text-[11px] w-full h-12 p-2 bg-[#aead9d] rounded-b-lg">
                <div>
                  <CiClock2 className="items-center w-full" />
                  <span>SHIPS IN 24 HRS</span>
                </div>
                <div>
                  <BiLike className="items-center w-full" />
                  <span>EASY RETURNS</span>
                </div>
                <div>
                  <SiAdguard className="items-center w-full" />
                  <span>LIFETIME WARRANTY*</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1050px] m-auto mt-4 sm:w-full sm:h-full">
            <ProDuctInFor productId={id} />
          </div>
        </div>
      )}

      <div className="w-[1050px] m-auto mt-4 flex flex-col sm:w-full gap-4">
        {/* Rating Section */}
        <div className="w-full max-w-4xl mx-auto p-4">
          <h2 className="text-2xl font-bold text-center mb-6">
            Customer Ratings and Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center">
                <span className="text-5xl font-bold">
                  {recommendPercentage}%
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  of reviewers would recommend this product
                </p>
              </div>
              <div className="flex items-center justify-center mt-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`w-6 h-6 ${
                      index < Math.floor(AverageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center mt-2">{totalReviews} Reviews</p>
              <button
                onClick={handleScrollToReview}
                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Ratings Breakdown</h3>
              {ratingBreakdown.map(({ stars, count }) => (
                <div key={stars} className="flex items-center mb-2">
                  <span className="w-16 text-sm">{stars} Stars</span>
                  <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(count / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-sm text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-[#EFEFEC] border-2 rounded-md p-4 mb-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="w-full mb-4">
                {/* Name and Date */}
                <div className="flex justify-between">
                  <div className="font-bold text-[16px]">
                    {comment.LastName}
                  </div>
                  <div className="text-[11px] text-[#313022]">
                    {new Date(comment.CreateAtComments).toLocaleDateString()}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mt-2">
                  <span className="text-[14px]">Rating: </span>
                  {renderStars(comment.SaoDanhGia)}
                </div>

                {/* Comment Content */}
                <div className="mt-2 text-[14px] text-[#313022]">
                  {comment.ContentComments}
                </div>

                {/* Divider */}
                <div className="border-b border-gray-300 mt-4"></div>
              </div>
            ))
          ) : (
            <div>No comments available for this product.</div>
          )}
        </div>

        {/* Review Form */}
        <div ref={reviewSectionRef}>
          <h2>Hãy Nhập đánh giá của bạn</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="ContentComments">Nội dung mô tả</label>
            <textarea
              id="ContentComments"
              cols="30"
              rows="10"
              className="w-full rounded-md outline-none border border-gray-300"
              value={formData.ContentComments}
              onChange={handleInputChange}
            ></textarea>

            {/* Star Rating Section */}
            <div className="flex items-center gap-2 mt-4">
              <label className="block mb-1">Đánh giá sao:</label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer">
                    <input
                      type="radio"
                      name="SaoDanhGia"
                      value={star}
                      checked={formData.SaoDanhGia === star}
                      onChange={() => handleStarRatingChange(star)}
                      className="hidden"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={
                        formData.SaoDanhGia >= star ? "currentColor" : "none"
                      }
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className={`w-6 h-6 ${
                        formData.SaoDanhGia >= star
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.372 1.24.588 1.81l-3.966 2.878a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.966-2.878a1 1 0 00-1.176 0l-3.966 2.878c-.784.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.99 9.102c-.784-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z"
                      />
                    </svg>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative inline-block group mt-4">
              <button
                className={`w-full border-2 rounded-md text-2xl p-4 transition duration-300 ease-in-out ${
                  formData.ContentComments.trim()
                    ? "text-gray-200 border-deep-orange-700 bg-deep-orange-700 hover:bg-deep-orange-800"
                    : "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
                }`}
                onClick={handleOpenModal}
                disabled={!formData.ContentComments.trim()}
              >
                DONE
              </button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                {formData.ContentComments.trim()
                  ? "Gửi đánh giá của bạn"
                  : "Vui lòng nhập nội dung đánh giá"}
              </span>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-white p-6 rounded-lg w-96 relative ">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  X
                </button>
                <h2 className="text-xl font-bold mb-4">Thông tin bổ sung</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="LastName" className="block mb-1">
                      Họ:
                    </label>
                    <input
                      id="LastName"
                      type="text"
                      value={formData.LastName}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="PhoneComments" className="block mb-1">
                      Số điện thoại:
                    </label>
                    <input
                      id="PhoneComments"
                      type="tel"
                      value={formData.PhoneComments}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-deep-orange-700 text-white py-2 px-4 rounded-md hover:bg-deep-orange-800"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <marquee className="text-[34px] bg-blue-800 text-white">
          Chào mừng bạn đến với Tui là tất cả cuộc đời bạn
        </marquee>
      </div>
      <div className="w-full mt-4 border-b-2 border-red-500">
        <h3 className=" w-[1050px] text-[40px] m-auto font-somibold py-[15px] sm:w-full">
          OrTher Customer ALSO Like
        </h3>
      </div>
      <div className="h-full flex flex-row justify-center gap-4">
        {dataloai &&
          dataloai
            .filter((itemSanPham) => itemSanPham.loaisanpham === "BanChay")
            .sort(() => 0.5 - Math.random()) // Xáo trộn mảng
            .slice(0, 4) // Lấy 4 sản phẩm đầu tiên sau khi xáo trộn
            .map((itemSanPham, index) => (
              <div className="flex flex-row " key={index}>
                <div className="card">
                  <Link
                    to={`/SanPham/${itemSanPham.id}`}
                    // onClick={() => selectProduct(itemSanPham)}
                    onClick={(e) => {
                      selectProduct(itemSanPham);
                      window.location.href = `/SanPham/${itemSanPham.id}`;
                    }}
                  >
                    <div className="w-[397px] h-[397px] sm:w-full sm:h-full">
                      <img
                        src={`/img/${itemSanPham.Images}`}
                        className="h-full"
                        alt="sanpham"
                      />
                    </div>
                    <div className="cardContent">
                      <h1>{itemSanPham.Title}</h1>
                      <p>{itemSanPham.Description}</p>
                      <button className="border border-cyan-900 hover:bg-deep-orange-500 rounded-md w-full h-[40px]">
                        ADD to Card
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
      </div>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default ChiTietSanPham;
