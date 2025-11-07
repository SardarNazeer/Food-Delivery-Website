import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: "Food Processing", // other statuses: Out for Delivery, Delivered, Cancelled
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  payment: {
    type: Boolean,
    required: false, // e.g. "COD" or "Online"
  },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
