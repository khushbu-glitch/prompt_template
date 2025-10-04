export const initRazorpayCheckout = (options: any) => {
  return new Promise((resolve) => {
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
    rzp.on('payment.failed', (response: any) => {
      resolve({ success: false, response });
    });
    rzp.on('payment.success', (response: any) => {
      resolve({ success: true, response });
    });
  });
};
