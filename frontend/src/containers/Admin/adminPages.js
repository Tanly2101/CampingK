import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";
import AdminSidebar from "./adminSidebar";
import { useAuth } from "../../Context/AuthContext";

export default function AdminPages() {
  const { user } = useAuth();
  const [contactInfo, setContactInfo] = useState("");
  useEffect(() => {
    if (user) {
      setContactInfo(user.nameTK);
    }
  }, [user]);
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Main container */}
      <div className="flex w-full min-h-screen">
        {/* Sidebar - 30% */}
        <div className="w-[20%] bg-gradient-to-b from-gray-200 via-gray-100 to-white text-gray-800 p-4 shadow-md">
          <div className="sticky top-4">
            <AdminSidebar />
          </div>
        </div>

        {/* Main Content - 70% */}
        <div className="w-[80%] bg-white shadow-md m-4 p-6 rounded-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-xl font-bold text-gray-700">Quản Lý</h1>
            <div className="text-sm font-medium text-gray-600">
              {contactInfo}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow flex items-start justify-center bg-gray-50 rounded-lg shadow-inner p-4">
            <div className="w-full  mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
