import React, { useState } from "react";

const GioiThieu = () => {
  const [currentRotation, setCurrentRotation] = useState(0);

  const handleRotate = () => {
    setCurrentRotation((prev) => (prev + 120) % 360);
  };
  const imageDataTest = [
    {
      src: require("../assets/img/rainwear.png"),
      title: "Tận hưởng trời mưa",
      description: "Sân nhà nhỏ",
    },
    {
      src: require("../assets/img/Tramchim.jpg"),
      title: "Vườn Quốc Gia Tràm Chim",
      description: "Đồng Tháp",
    },
    {
      src: require("../assets/img/XeDap.jpg"),
      title: "Cuộc đua xe đạp",
      description: "Vùng địa hình",
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div
        className="relative h-[500px] w-64"
        style={{ perspective: "1500px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500 ease-in-out cursor-pointer"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${currentRotation}deg)`,
          }}
          onClick={handleRotate}
        >
          {imageDataTest.map((image, index) => (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 w-96 h-96 group"
              style={{
                transform: `translate(-50%, -50%) rotateY(${
                  index * 120
                }deg) translateZ(12rem)`,
                backfaceVisibility: "hidden",
              }}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full rounded-md object-cover shadow-lg transition-transform duration-300"
              />
              {/* Overlay với nền mờ và mô tả */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm 
                             p-3 rounded-b-md text-white transform transition-transform duration-300"
              >
                <h3 className="text-lg font-semibold">{image.title}</h3>
                <p className="text-sm text-gray-200">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GioiThieu;
