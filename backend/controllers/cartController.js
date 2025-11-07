import userModel from "../models/userModels.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart", cartData });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item removed", cartData });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user;
    const userData = await userModel.findById(userId);
    res.json({ success: true, cartData: userData.cartData || {} });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, getCart };