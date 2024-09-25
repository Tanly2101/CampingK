import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Breadcrumbs,
} from "@material-tailwind/react";
import Chart from "react-apexcharts";
import {
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
export default function RevenueManage() {
  const [total, setTotal] = useState([]);
  const [all, setAll] = useState([]);
  const [now, setNow] = useState([]);
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0))
  );
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    getTotal();
  }, []);

  const getTotal = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/analyst/TotalOrders`
      );
      const sale = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/analyst/totalsale`
      );
      const revenue = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/analyst/AllRevenue`
      );
      const nowmonth = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/v1/analyst/RevenueMonth`
      );
      setTotal(response.data);
      setSales(sale.data);
      console.log(all);
      setAll(revenue.data);
      setNow(nowmonth.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (startDate && endDate) {
      fetchRevenueData(
        moment(startDate).format("YYYY-MM-DD"),
        moment(endDate).format("YYYY-MM-DD")
      );
    }
  }, [startDate, endDate]);
  const fetchRevenueData = async () => {
    try {
      // Chuyển đổi startDate và endDate thành định dạng "YYYY-MM-DD"
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
      console.log(formattedStartDate);
      console.log(formattedEndDate);

      const response = await axios.get(
        `http://localhost:5000/api/v1/analyst/Revenue/${formattedStartDate}/${formattedEndDate}`
      );

      console.log("API Response:", response.data); // Kiểm tra dữ liệu nhận được

      // Đảm bảo response.data là mảng
      if (Array.isArray(response.data)) {
        const formattedData = response.data.map((item) => ({
          ngay: moment(item.ngay, "YYYY-MM-DD").format("DD/MM/YYYY"), // Định dạng ngày
          tongtien: item.tongtien,
        }));
        setRevenueData(formattedData); // Cập nhật trạng thái với dữ liệu đã định dạng
      } else {
        console.error("Data is not an array:", response.data);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    }
  };

  const lineChartConfig = {
    type: "line",
    height: 240,
    series: [
      {
        name: "Sales",
        data: all.map((item) => item.revenue),
      },
      {
        name: "Order",
        data: all.map((item) => item.sodonhang),
      },
      {
        name: "Profit",
        data: all.map((item) => item.profit),
      },
      {
        name: "Expense",
        data: all.map((item) => item.expense),
      },
    ],
    options: {
      colors: ["#437fdf", "#8e31b9", "#1ded81", "#f16e6e"],
      yaxis: {
        labels: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
    },
  };

  const barChartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Profit",
        data: all.map((item) => item.profit),
      },
    ],
    options: {
      colors: ["#34ef8e"],
      yaxis: {
        labels: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
    },
  };

  const columnChartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Revenue",
        data: all.map((item) => item.revenue),
      },
      {
        name: "Expense",
        data: all.map((item) => item.expense),
      },
    ],
    options: {
      colors: ["#3bff34", "#F44336"],
      yaxis: {
        labels: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value) => {
            return new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
          },
        },
      },
    },
  };

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
    },
    xaxis: {
      categories: revenueData.map((item) => item.ngay), // Dates on X-axis
      title: {
        text: "Ngày",
      },
    },
    yaxis: {
      title: {
        text: "Doanh thu",
      },
      labels: {
        formatter: (value) => {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);
        },
      },
    },
    colors: ["#8884d8"],
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Doanh thu theo thời gian",
      align: "left",
    },
    legend: {
      position: "top",
    },
  };
  const series = [
    {
      name: "Doanh thu",
      data: revenueData.map((item) => item.tongtien), // tongtien used for revenue data
    },
  ];
  return (
    <div className="w-full mx-auto mt-10 p-6 space-y-8">
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Total Order */}
        <Card className="w-72 border border-gray-300 h-44 rounded-lg shadow-lg bg-white">
          <CardHeader className="flex flex-col gap-3 items-center p-4">
            <div className="rounded-full bg-indigo-500 p-3 text-white">
              <ShoppingBagIcon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <Typography variant="small" color="gray" className="font-medium">
                Total Orders
              </Typography>
              <Typography variant="h3" color="blue-gray">
                {total.tongDon !== undefined
                  ? total.tongDon
                  : "Chưa có dữ liệu"}
              </Typography>
            </div>
          </CardHeader>
        </Card>

        {/* Sold Products */}
        <Card className="w-72 border border-gray-300 h-44 rounded-lg shadow-lg bg-white">
          <CardHeader className="flex flex-col gap-3 items-center p-4">
            <div className="rounded-full bg-green-500 p-3 text-white">
              <CreditCardIcon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <Typography variant="small" color="gray" className="font-medium">
                Sold Products
              </Typography>
              <Typography variant="h3" color="blue-gray">
                {sales.tongsanpham !== undefined
                  ? sales.tongsanpham
                  : "Chưa có dữ liệu"}
              </Typography>
            </div>
          </CardHeader>
        </Card>

        {/* Total Revenue */}
        <Card className="w-72 border border-gray-300 h-56 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105">
          <CardHeader className="flex flex-col gap-3 items-center p-4">
            <div className="rounded-full bg-blue-500 p-3 text-white shadow-lg">
              <ChartBarIcon className="h-8 w-8" />
            </div>
            <div className="text-center">
              <Typography variant="small" color="gray" className="font-medium">
                This Month's Revenue
              </Typography>
              <div className="text-blue-gray-900 mt-2">
                {now && now.revenue !== undefined ? (
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Month:{" "}
                      <span className="text-blue-500">{now.month_number}</span>
                    </p>
                    <p className="font-semibold">
                      Revenue:{" "}
                      <span className="text-green-500">
                        {now.revenue.toLocaleString()}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Profit:{" "}
                      <span className="text-green-500">
                        {now.profit.toLocaleString()}
                      </span>
                    </p>
                    <p className="font-semibold">
                      Shipping Cost:{" "}
                      <span className="text-red-500">
                        {now.shipping_cost.toLocaleString()}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-red-500">
                    No revenue data available for this month
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-col gap-4 mt-4 relative">
        <div className="flex gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="border border-gray-300 rounded p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            popperProps={{
              placement: "bottom",
            }}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="border border-gray-300 rounded p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            popperProps={{
              placement: "bottom",
            }}
          />
        </div>

        {/* Today's Revenue */}
        <Card className="w-full border border-gray-300 rounded-lg shadow-lg bg-white mt-4">
          <CardHeader className="p-4">
            <Typography variant="h6" color="blue-gray" className="text-center">
              Doanh thu cửa hàng
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Chart
              options={chartOptions}
              series={series}
              type="line"
              height={350}
            />
          </CardBody>
        </Card>
      </div>
      {/* Monthly Revenue and Profit Charts */}
      <div className="flex w-full flex-wrap gap-8">
        {/* Monthly Revenue */}
        <Card className="flex-1 border w-full border-gray-300 rounded-lg shadow-lg bg-white">
          <CardHeader className="p-4 text-center">
            <Typography variant="h6" color="blue-gray">
              Monthly Revenue
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Detailed Analysis Chart
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Chart {...lineChartConfig} />
          </CardBody>
        </Card>
      </div>
      <div className="flex w-full flex-wrap gap-8">
        {/* Profit */}
        <Card className="flex-1 border w-full border-gray-300 rounded-lg shadow-lg bg-white">
          <CardHeader className="p-4 text-center">
            <Typography variant="h6" color="blue-gray">
              Profit
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Profit of Otis Watch
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Chart {...barChartConfig} />
          </CardBody>
        </Card>
      </div>

      {/* Sales vs Expense */}
      <div className="shadow-lg">
        <Card className="w-full border border-gray-300 rounded-lg shadow-lg bg-white">
          <CardHeader className="p-4 text-center">
            <Typography variant="h6" color="blue-gray">
              Sales vs Expense
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              Sales and Expense Comparison
            </Typography>
          </CardHeader>
          <CardBody className="p-4">
            <Chart {...columnChartConfig} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
