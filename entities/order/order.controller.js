const Cart = require("../user/cart/cart.model");
const Order = require("./order.model");

const checkoutCart = async (req, res, next) => {
  try {
    const { userId } = req;

    const cart = await Cart.findOne({ userId, active: true });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    const newOrder = new Order({
      userId: cart.userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
    });

    await newOrder.save();

    cart.active = false;
    await cart.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (
      !["Confirmed", "Preparing", "In Transit", "Completed"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const { userId } = req;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getAllOrdersByStatus = async (req, res, next) => {
  try {
    const { status } = req.query;

    const validStatuses = ["Confirmed", "Preparing", "In Transit", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" });
    }

    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: 1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkoutCart,
  updateOrderStatus,
  getOrderDetails,
  getUserOrders,
  getAllOrdersByStatus,
};
