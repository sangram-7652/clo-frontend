import { useState } from "react";
import axios from "axios";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter an Order ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `https://api.clo.co.in/api/v1/orders/track/${orderId}`,
      );

      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f2eb] px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 md:p-10">
        <div className="mb-10 text-center">
          <h1 className="clo-page-title text-gray-900">Track Your Order</h1>

          <p className="mt-2 text-gray-500">
            Enter your order ID to track your shipment
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-5">
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-300 px-4 py-4 outline-none focus:border-black"
          />

          <div className="flex justify-center">
            <button
              onClick={handleTrackOrder}
              disabled={loading}
              className="w-fit bg-black px-8 py-3 text-lg font-medium text-white transition duration-300 hover:bg-gray-800 disabled:opacity-50">
              {loading ? "Tracking..." : "Track Your Order"}
            </button>
          </div>

          {error && <p className="text-center text-red-500">{error}</p>}
        </div>

        {order && (
          <div className="mx-auto mt-10 max-w-3xl border border-gray-200 p-5 sm:p-8 md:mt-14">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Number</p>
                <h2 className="clo-card-title">{order.order_number}</h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <h2 className="clo-card-title">{order.estimated_delivery}</h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <h2 className="clo-card-title text-green-600">
                  {order.status}
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
