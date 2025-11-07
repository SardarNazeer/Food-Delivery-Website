import React, { useContext, useEffect } from 'react';
import './Verify.css';
import { useSearchParams, useNavigate } from 'react-router-dom'; // ✅ FIXED import
import axios from 'axios'; // ✅ you missed this
import { StoreContext } from '../../Context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate(); // ✅ now works correctly

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}api/order/verify`, {
        orderId,
        success,
      });

      if (response.data.success) {
        console.log("✅ Payment Verified:", response.data.message);
        navigate("/myorders");
      } else {
        console.warn("❌ Payment Failed:", response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("⚠️ Error verifying payment:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // ✅ added dependency array

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
