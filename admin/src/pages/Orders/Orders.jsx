import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + '/api/order/list');
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error fetching orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error');
    }
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + '/api/order/status', {
      orderId,
      status: event.target.value,
    });
    if (response.data.success) {
      toast.success('Order status updated');
      fetchAllOrders();
    } else {
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="orders-page">
      <h3 className="orders-title">All Orders</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div className="order-card" key={index}>
              <div className="order-header">
                <img src={assets.parcel_icon} alt="Parcel Icon" />
                <div>
                  <p className="order-items">
                    {order.items.map((item, i) =>
                      i === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    )}
                  </p>
                  <p className="order-name">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <div className="order-address">
                    <p>{order.address.street},</p>
                    <p>
                      {order.address.city}, {order.address.state},{' '}
                      {order.address.country}, {order.address.zipcode}
                    </p>
                  </div>
                  <p className="order-phone">{order.address.phone}</p>
                </div>
              </div>

              <div className="order-footer">
                <p>
                  <b>Items:</b> {order.items.length}
                </p>
                <p>
                  <b>Amount:</b> ${order.amount}
                </p>
                <select
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                  className="order-status"
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
