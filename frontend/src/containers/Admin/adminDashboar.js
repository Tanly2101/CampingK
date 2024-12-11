import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Breadcrumbs,
} from "@material-tailwind/react";

import {
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
const adminDashboar = () => {
  return (
    <>
      <div className="bg-gray-50 min-h-screen flex flex-col justify-center items-center">
        {/* Header */}
        <header className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-16">
          <h1 className="text-5xl font-extrabold">
            Chào mừng đến với CampingK
          </h1>
        </header>

        {/* Main Section */}
        <div className="flex flex-col items-center justify-center px-4 py-16 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Tổng Quan</h2>
            <p className="mt-4 text-gray-600">
              Đây là tổng quan về hoạt động của bạn.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 w-96 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Bắt Đầu</h2>
            <p className="mt-4 text-gray-600">
              Nhấn nút dưới đây để bắt đầu khám phá.
            </p>
            <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300">
              Bắt Đầu Ngay
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-gray-800 text-white text-center py-4 mt-16">
          <p>&copy; 2024 Dashboard. Bảo lưu mọi quyền.</p>
        </footer>
      </div>
    </>
  );
};

export default adminDashboar;
