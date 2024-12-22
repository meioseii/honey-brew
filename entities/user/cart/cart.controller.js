const Cart = require("./cart.model");
const Product = require("../../menu/menu.model");

const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity, name, price, size, brewType } = req.body;
    const { userId } = req;
    let cart = await Cart.findOne({ userId, active: true });

    if (cart) {
      let itemIndex = cart.products.findIndex(
        (p) =>
          p.productId == productId &&
          String(p.size) === String(size) &&
          String(p.brewType) === String(brewType)
      );

      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity += quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({
          productId,
          quantity,
          name,
          price,
          size,
          brewType,
        });
      }
      cart.totalPrice = cart.products.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      );
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      const newCart = new Cart({
        userId: req.userId,
        products: [{ productId, quantity, name, price, size, brewType }],
      });
      newCart.totalPrice = newCart.products.reduce(
        (total, product) => total + product.quantity * product.price,
        0
      );

      await newCart.save();

      return res.status(201).send(newCart);
    }
  } catch (error) {
    next(error);
  }
};

const getUserCartItems = async (req, res, next) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const cart = await Cart.findOne({ userId, active: true });

    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ message: "Cart is empty or not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const updateProductQuantityInCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { action } = req.body;
    const userId = req.userId;

    if (!["add", "deduct"].includes(action)) {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'add' or 'deduct'" });
    }

    const cart = await Cart.findOne({ userId, active: true });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const product = cart.products.find(
      (product) => product.productId.toString() === productId.toString()
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (action === "add") {
      product.quantity += 1;
    } else if (action === "deduct") {
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        cart.products = cart.products.filter(
          (product) => product.productId.toString() !== productId.toString()
        );
      }
    }

    cart.totalPrice = cart.products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

const deleteItemFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    let cart = await Cart.findOne({ userId, active: true });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialProductCount = cart.products.length;

    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId.toString()
    );

    if (cart.products.length === initialProductCount) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.totalPrice = cart.products.reduce(
      (total, product) => total + product.quantity * product.price,
      0
    );

    await cart.save();

    return res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addItemToCart,
  getUserCartItems,
  updateProductQuantityInCart,
  deleteItemFromCart,
};
