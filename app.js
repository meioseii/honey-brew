const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./utils/errorHandler");
const cors = require("cors");
const userRoutes = require("./entities/user/user.routes");
const menuRoutes = require("./entities/menu/menu.routes");
const categoryRoutes = require("./entities/menu/category/category.routes");
const cartRoutes = require("./entities/user/cart/cart.routes");
const orderRoutes = require("./entities/order/order.routes");

dotenv.config();

const connectToDataBase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

connectToDataBase();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
