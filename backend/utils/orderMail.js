const sendEmail = require("./sendEmail");

const sendOrderEmail = async (order) => {
  const subject = `Order Confirmation - ${order._id}`;
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Thank you for your order!</h2>
      <p>Order ID: <b>${order._id}</b></p>
      <p>Total: <b>₹${order.totalPrice}</b></p>
      <p>Status: <b>${order.status}</b></p>
      <h3>Items:</h3>
      <ul>
        ${order.items
          .map(
            (i) => `<li>${i.product.name} x ${i.quantity} - ₹${i.price}</li>`
          )
          .join("")}
      </ul>
      <p>We will notify you when your order is shipped.</p>
    </div>
  `;
  return await sendEmail(order.user.email, subject, html);
};

module.exports = sendOrderEmail;
