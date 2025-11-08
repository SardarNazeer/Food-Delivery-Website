import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place user order from frontend
 const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5174";

  try {

    const newOrder = new orderModel({
userId: req.user?.id || req.user,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address,
    });

    await newOrder.save();

    // clear user cart after placing order
await userModel.findByIdAndUpdate(req.user?.id || req.user, { cartData: {} });

    const line_items = req.body.items.map((item)=>({
        price_data:{
            currency:"usd",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
        },
        quantity:item.quantity
    }))

    line_items.push({
        price_data:{
            currency:"usd",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:2*100*80
        },
        quantity:1
    })

    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    })

    res.json({ success: true,session_url:session.url });

  } catch (error) {
    console.error("Error placing order:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
        const { orderId, success } = req.body;
  try {
    if (success === "true") {
      // ✅ Update order status to "confirmed"
      await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Order Placed" });

      return res.json({ success: true, message: "Payment verified and order placed successfully." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed, order deleted." });
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    res.json({ success: false, message: "Server error while verifying order" });
  }
};

// user order for frontend 
const userOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user; // token se user nikal lo
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
    console.log("🔑 userId from token:", req.user);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error listing orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// api for updating order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log("Error updating status:", error);
    res.json({ success: false, message: "Error updating status" });
  }
};


export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus }