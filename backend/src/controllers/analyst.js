const analystService = require("../services/analystService");
import moment from "moment";

export const findTotalOrderSale = async (req, res, next) => {
  try {
    const tongsanpham = await analystService.findTotalOrderSale();
    res.status(200).json(tongsanpham);
  } catch (error) {
    console.error("Error fetching total delivered products:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy tổng số sản phẩm đã giao." });
  }
};
export const findTotalOrder = async (req, res, next) => {
  try {
    const tongDon = await analystService.findTotalOrder();
    res.status(200).json(tongDon);
  } catch (error) {
    console.error("Error fetching total delivered products:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy tổng số sản phẩm đã giao." });
  }
};
export const findRevenueMonth = async (req, res, next) => {
  try {
    const revenue = await analystService.findRevenueMonth();
    res.status(200).json(revenue);
  } catch (error) {
    console.error("Error fetching total delivered products:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy tổng số sản phẩm đã giao." });
  }
};
export const getDailyRevenue = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.params;
    const formattedStartDate = moment(startDate, "YYYY-MM-DD");
    const formattedEndDate = moment(endDate, "YYYY-MM-DD");

    const results = [];

    let currentDate = formattedStartDate.clone();
    while (currentDate.isSameOrBefore(formattedEndDate)) {
      const dateStr = currentDate.format("YYYY-MM-DD");

      const total = await analystService.sumOrderInDay(dateStr);
      const ngayFormatted = moment(total?.ngay || dateStr).format("YYYY-MM-DD");

      results.push({
        ngay: ngayFormatted,
        tongtien: total?.tongtien || 0,
      });

      currentDate.add(1, "days");
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Đã xảy ra lỗi:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy doanh thu theo ngày." });
  }
};
export const findAllRevenue = async (req, res, next) => {
  try {
    const allrevenue = await analystService.findAllRevenue();
    res.status(200).json(allrevenue);
  } catch (error) {
    console.error("Error fetching total delivered products:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi lấy tổng số sản phẩm đã giao." });
  }
};
