const Menu = require("./menu.model");
const Category = require("./category/category.model");

const addMenuProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      category,
      isDrink,
      drinkType,
      sizes,
      price,
    } = req.body;

    const categories = await Category.find({ name: { $in: category } });

    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ error: "One or more categories not found" });
    }

    const categoryIds = categories.map((category) => category._id);

    let variations = [];
    if (isDrink && sizes) {
      variations = sizes.map((size) => ({
        size: size.size,
        priceHot: size.priceHot || null,
        priceIced: size.priceIced || null,
      }));
    }

    const menu = new Menu({
      name,
      description,
      price: isDrink ? undefined : price,
      image,
      category: categoryIds,
      isDrink,
      drinkType: isDrink ? drinkType : undefined,
      variations: isDrink ? variations : [],
    });

    const savedMenu = await menu.save();

    await Promise.all(
      categories.map(async (category) => {
        category.product.push(savedMenu._id);
        await category.save();
      })
    );

    res
      .status(201)
      .json({ message: "Menu item added successfully", menu: savedMenu });
  } catch (error) {
    next(error);
  }
};

const getMenuProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const normalizedCategory = category.replace(/-/g, " ");

    const matchedCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${normalizedCategory}$`, "i") },
    });

    if (!matchedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const menu = await Menu.find({ category: matchedCategory._id })
      .populate("category")
      .exec();

    if (!menu || menu.length === 0) {
      return res
        .status(404)
        .json({ error: "No menu items found for this category." });
    }

    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

const getMenuProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id).populate("category").exec();

    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

const getAllMenuProducts = async (req, res, next) => {
  try {
    const menu = await Menu.find();

    res.status(200).json(menu);
  } catch (error) {
    next(error);
  }
};

const deleteMenuProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const menu = await Menu.findByIdAndDelete(id);

    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const categories = await Category.find({ _id: { $in: menu.category } });

    await Promise.all(
      categories.map(async (category) => {
        category.product = category.product.filter(
          (productId) => productId.toString() !== id
        );
        await category.save();
      })
    );

    res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateMenuProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      image,
      category,
      isDrink,
      drinkType,
      sizes,
      price,
    } = req.body;

    let updateData = { name, description, image };

    if (category) {
      const categories = await Category.find({ name: { $in: category } });

      if (!categories || categories.length === 0) {
        return res
          .status(404)
          .json({ error: "One or more categories not found" });
      }

      const categoryIds = categories.map((category) => category._id);
      updateData.category = categoryIds;
    }

    let variations = [];
    if (isDrink) {
      updateData.isDrink = isDrink;
      updateData.drinkType = drinkType || undefined;

      if (sizes && sizes.length > 0) {
        variations = sizes.map((size) => ({
          size: size.size,
          priceHot: size.priceHot || null,
          priceIced: size.priceIced || null,
        }));
      }

      updateData.variations = variations;
      updateData.price = undefined;
    } else {
      updateData.isDrink = false;
      updateData.price = price;
      updateData.variations = [];
      updateData.drinkType = undefined;
    }

    const menu = await Menu.findByIdAndUpdate(id, updateData, { new: true });

    if (!menu) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    if (category) {
      await Promise.all(
        category.map(async (categoryName) => {
          const categoryDoc = await Category.findOne({ name: categoryName });
          if (categoryDoc && !categoryDoc.product.includes(id)) {
            categoryDoc.product.push(id);
            await categoryDoc.save();
          }
        })
      );
    }

    res.status(200).json({ message: "Menu item updated successfully", menu });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMenuProduct,
  getMenuProductsByCategory,
  getMenuProductById,
  getAllMenuProducts,
  deleteMenuProduct,
  updateMenuProduct,
};
