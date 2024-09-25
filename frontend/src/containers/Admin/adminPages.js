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
  return (
    <div className="min-h-screen">
      <div className="flex w-full flex-auto min-h-screen">
        <div className="bg-[#e1e1e1]">
          <AdminSidebar />
        </div>
        <div className="flex-auto w-full min-h-screen p-4">
          <div className="w-full min-h-screen">
            <div className="h-[45px] flex align-items justify-end">User</div>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
