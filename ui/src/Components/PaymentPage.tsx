import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [totalAmount, setTotalAmount] = useState(1000); // Example amount in INR (1000 INR)

  const handlePayment = async () => {
    try {
      // Create the order on the backend (to get the Razorpay order ID)
      const response = await axios.post("http://localhost:5000/create-order", {
        amount: totalAmount,
      });

      const { orderId } = response.data; // Extract the orderId from the response

      // Razorpay checkout options
      const options = {
        key: "rzp_test_ZglqkhKmjt7KLv", // Your Razorpay Key ID
        amount: totalAmount * 100, // Amount in paise (1 INR = 100 paise)
        currency: "INR",
        name: "Your Company Name",
        description: "Test Payment",
        order_id: orderId, // Pass the Razorpay order ID here
        handler: function (response:any) {
          alert("Payment Successful");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#61dafb", // Theme color for the payment form
        },
      };

      // Open the Razorpay checkout window
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Error creating order");
    }
  };

  return (
    <div>
      <h2>Proceed to Checkout</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;
