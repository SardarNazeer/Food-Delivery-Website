import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    getDeliveryFee,
    getFinalTotal,url,
  } = useContext(StoreContext);

  const subtotal = getTotalCartAmount();
  const deliveryFee = getDeliveryFee();
  const total = getFinalTotal();

      const navigate = useNavigate()

  return (
    <div className="cart">
      <div className="cart-item">
        <div className="cart-item-titles">
          <p>Item</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr />

{/* 🧾 Cart Items List */}
{food_list && food_list.length > 0 ? (
  food_list.map((item) => {
    const quantity = cartItems?.[item._id] || 0; // 👈 safe lookup
    if (quantity > 0) {
      return (
        <div key={item._id} className="cart-item-row">
          <img
            src={url + "/images/" + item.image}
            alt={item.name}
            className="cart-item-img"
          />
          <p>{item.name}</p>
          <p>${item.price}</p>
          <p>{quantity}</p>
          <p>${(item.price * quantity).toFixed(2)}</p>
          <p
            className="cart-remove"
            onClick={() => removeFromCart(item._id)}
          >
            ❌
          </p>
        </div>
      );
    }
    return null;
  })
) : (
  <p>Loading cart...</p>
)}


        <hr />
      </div>

      {/* 🧮 Cart Bottom Section */}
      <div className="cart-bottom">
        <div className="cart-summary">
          <h3>Cart Summary</h3>

          <div className="cart-summary-details">
            <p>Subtotal:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          <div className="cart-summary-details">
            <p>Delivery Fee:</p>
            <p>${deliveryFee.toFixed(2)}</p>
          </div>

          <hr />

          <div className="cart-summary-details total">
            <p><strong>Total:</strong></p>
            <p><strong>${total.toFixed(2)}</strong></p>
          </div>

          <button onClick={()=> navigate("/order")} className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
