import productRouter from "./product";
import userRouter from "./user";
import categoryRouter from "./categoryRoutes";
import filterRouter from "./filterRoutes";
import commentsRouter from "./commentsRoutes";
import PostRouter from "./PostNew";
import uploadRouter from "./uploadRoutes";
import cartRouter from "./Cart";
import orderRouter from "./order";
import SaleRouter from "./Sale";
import AnalystRouter from "./analyst";

const initRoutes = (app) => {
  // app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1", userRouter);
  app.use("/api/v1", categoryRouter);
  app.use("/api/v1/filter", filterRouter);
  app.use("/api/v1", commentsRouter);
  app.use("/api/v1", PostRouter);
  app.use("/api/v1", uploadRouter);
  app.use("/api/v1/cart", cartRouter);
  app.use("/api/v1/sale", SaleRouter);
  app.use("/api/v1/analyst", AnalystRouter);
  app.use("/api/v1/order", orderRouter);

  return app.use("/", (req, res) => {
    res.send("sever on ..");
  });
};
export default initRoutes;
