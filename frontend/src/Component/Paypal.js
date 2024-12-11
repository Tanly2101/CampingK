import React, { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const ButtonWrapper = ({ currency, amount, onSuccess, onError }) => {
  const [{ isPending, isInitial, isRejected }] = usePayPalScriptReducer();
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (isRejected) {
      setError(
        "PayPal SDK failed to load. Please check your internet connection."
      );
    }
  }, [isRejected]);

  if (isPending || isInitial) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        <span className="ml-2">Loading PayPal buttons...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 bg-red-100 rounded">{error}</div>;
  }

  return (
    <>
      <PayPalButtons
        style={{
          layout: "vertical",
          shape: "rect",
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                  currency_code: currency,
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const details = await actions.order.capture();

            // Tạo object chứa thông tin thanh toán
            const paymentInfo = {
              status: details.status,
              email: details.payer.email_address,
              transactionId: details.id,
              amount: details.purchase_units[0].amount.value,
              payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
              paymentTime: details.create_time,
              orderID: data.orderID,
              payerID: data.payerID,
              // Thêm thông tin shipping nếu có
              shippingAddress: details.purchase_units[0].shipping?.address,
            };

            setPaymentStatus(paymentInfo);
            onSuccess?.(paymentInfo);

            // Log để debug
            console.log("Payment Details:", details);
            return details;
          } catch (err) {
            setError("Payment failed. Please try again.");
            onError?.(err);
            throw err;
          }
        }}
        onError={(err) => {
          setError("An error occurred during payment. Please try again later.");
          onError?.(err);
        }}
      />

      {/* Hiển thị thông tin thanh toán khi thành công */}
      {paymentStatus && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            Thanh toán thành công!
          </h3>
          <div className="space-y-2 text-sm text-green-600">
            <p>Trạng thái: {paymentStatus.status}</p>
            <p>Email: {paymentStatus.email}</p>
            <p>Mã giao dịch: {paymentStatus.transactionId}</p>
            <p>
              Số tiền: {paymentStatus.amount} {currency}
            </p>
            <p>Người thanh toán: {paymentStatus.payerName}</p>
            <p>
              Thời gian: {new Date(paymentStatus.paymentTime).toLocaleString()}
            </p>
            <p>
              Và Hãy ấn{" "}
              <span class="text-red-500 font-bold underline hover:text-red-700 transition duration-300 ease-in-out transform hover:scale-110">
                Hoàn Tất Hóa Đơn
              </span>{" "}
              Để Chúng Tôi Có Thể Ghi Nhận Lại Đơn Hàng Của Bạn Một Cách Tốt
              Nhất
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const Paypal = ({
  amount = "10.00",
  currency = "USD",
  clientId,
  onSuccess,
  onError,
}) => {
  // Validate amount
  const validateAmount = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return "0.00";
    }
    return numAmount.toFixed(2);
  };

  if (!clientId) {
    return (
      <div className="p-4 text-red-500 bg-red-100 rounded">
        Error: Missing PayPal Client ID
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-4">
      <PayPalScriptProvider
        options={{
          "client-id": clientId,
          currency: currency,
          components: "buttons",
        }}
      >
        <ButtonWrapper
          currency={currency}
          amount={validateAmount(amount)}
          onSuccess={(paymentInfo) => {
            // console.log("Thanh toán thành công:", paymentInfo);
            // Bạn có thể gọi API để lưu thông tin thanh toán vào database ở đây
            onSuccess?.(paymentInfo);
          }}
          onError={(error) => {
            // console.error("Lỗi thanh toán:", error);
            onError?.(error);
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default Paypal;
