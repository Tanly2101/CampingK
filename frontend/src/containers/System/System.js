import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./";
const System = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login"); // Redirect to the login page if user is not found in localStorage
    }
  }, [navigate]);
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar - 20% */}
        <div className="w-[20%] bg-[#e1e1e1] shadow-md">
          <div className="sticky top-0">
            <Sidebar />
          </div>
        </div>

        {/* Main Content - 80% */}
        <div className="w-[80%] p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default System;
