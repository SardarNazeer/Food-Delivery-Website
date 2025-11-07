import React, { useContext, useEffect, useState, useNavigate } from "react";
import "./PlaceOrder.css";
import  axios  from "axios";
import { StoreContext } from "../../Context/StoreContext";

const PlaceOrder = () => {
  const {getTotalCartAmount,getDeliveryFee,getFinalTotal,token,food_list,cartItems,url} = useContext(StoreContext);

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
  event.preventDefault();
  console.log("🧾 Place order clicked!"); // check button works

  let orderItems = [];
  food_list.forEach((item) => {
    if (cartItems[item._id] > 0) {
      let itemInfo = { ...item, quantity: cartItems[item._id] }; // ✅ copy object safely
      orderItems.push(itemInfo);
    }
  });

  console.log("🛍️ Order Items:", orderItems); // check what’s inside

  let orderData = {
    address: data,
    items: orderItems,
    amount: getTotalCartAmount() + 2,
  };

  try {
   const response = await axios.post(`${url}/api/order/place`, orderData, {
  headers: {
    token: localStorage.getItem("token"),
  },
});


    console.log(" Response:", response.data);

    if (response.data.success) {
      const { session_url } = response.data;
      window.location.replace(session_url);
    } else {
      alert("Failed to place order");
    }
  } catch (error) {
    console.error(" Error placing order:", error);
  }
};

const navigate = useNavigate();

useEffect(()=>{
  if (!token) {
    navigate('/cart')
  }else if (getTotalCartAmount()===0) {
    navigate('/cart')
  }
},[token])


  const subtotal = getTotalCartAmount();
  const deliveryFee = getDeliveryFee();
  const total = getFinalTotal();

  return (
    <div className="place-order">
      {/* LEFT SIDE: Delivery Form */}
      <div className="place-order-left">
        <p className="delivery-information">Delivery Information</p>
        <form onSubmit={placeOrder}>
          <div className="multi-fields">
            <input name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" required />
            <input name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" required />
          </div>

          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email Address" required />
          <input name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" required />

          <div className="multi-fields">
            <input name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" required />
            <input name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" required />
          </div>

          <div className="multi-fields">
            <input name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip Code" required />
            <input name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" required />
          </div>

          <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" required />

          <button type='submit' className="place-order-btn">
            Place Order
          </button>
        </form>
      </div>

      {/* RIGHT SIDE: Cart Summary */}
      <div className="place-order-right">
        <div className="cart-summary">
          <h3>Cart Summary</h3>

          <div className="cart-summary-details">
            <p>Subtotal:</p>
            <p>Rs {subtotal.toFixed(2)}</p>
          </div>

          <div className="cart-summary-details">
            <p>Delivery Fee:</p>
            <p>Rs {deliveryFee.toFixed(2)}</p>
          </div>

          <div className="cart-summary-details total">
            <p>Total:</p>
            <p>Rs {total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
