const saleService = require("../services/SaleProducts");
const cron = require("node-cron");

export const fetchAllSaleRecords = async (req, res) => {
  try {
    // Call the service function to get all sale records
    const saleRecords = await saleService.getAllSaleRecords();

    // Respond with the fetched sale records
    res.json(saleRecords);
  } catch (error) {
    // Handle errors
    res.status(500).json({
      message: "Error fetching sale records",
      error: error.message,
    });
  }
};

export const refreshSaleProducts = async (req, res) => {
  try {
    await saleService.addSaleProducts();
    res.json({ message: "Sale products refreshed successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error refreshing sale products",
      error: error.message,
    });
  }
};

export const updateSales = async () => {
  try {
    await saleService.addSaleProducts();
    console.log("Sale products and timer updated successfully.");
  } catch (error) {
    console.error("Error updating sale products and timer:", error);
  }
};

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("Running the scheduled task...");
  updateSales();
});
