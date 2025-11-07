import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // ✅ Fetch food list from backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data && Array.isArray(response.data.data)) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      console.error("⚠️ Error fetching food list:", error.message);
    }
  };

  // ✅ Add to Cart
  const addToCart = async (itemId) => {
    if (!itemId) return;
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (token) {
      try {
        await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("⚠️ Backend addToCart failed:", error?.response?.data || error.message);
      }
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (itemId) => {
    if (!itemId) return;
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) updated[itemId] -= 1;
      else delete updated[itemId];
      return updated;
    });

    if (token) {
      try {
        await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
      } catch (error) {
        console.error("⚠️ Backend removeFromCart failed:", error?.response?.data || error.message);
      }
    }
  };

  // ✅ Load cart data from backend
  const loadCartData = async (tokenParam) => {
    try {
      const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token: tokenParam } });
      const cart = response?.data?.cartData;
      if (cart && typeof cart === "object") setCartItems(cart);
      else setCartItems({});
    } catch (err) {
      console.error("Error loading cart data:", err?.response?.data || err.message);
      setCartItems({});
    }
  };

  // ✅ Total Cart Amount
  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const item = food_list.find((f) => f._id === id);
      return item ? total + item.price * qty : total;
    }, 0);
  };

  // ✅ Delivery Fee
  const getDeliveryFee = () => {
    const total = getTotalCartAmount();
    return total > 0 ? 5 : 0; // Example: flat delivery fee
  };

  // ✅ Final Total
  const getFinalTotal = () => {
    return getTotalCartAmount() + getDeliveryFee();
  };

  // ✅ On Mount — load data
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  // ✅ Context value
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getDeliveryFee,
    getFinalTotal,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
