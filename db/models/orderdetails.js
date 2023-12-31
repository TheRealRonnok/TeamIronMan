const client = require("../client");

module.exports = {
  createOrderDetail,
  getAllOrderDetails,
  removeItemFromOrder,
};

// Add an item to the order
async function createOrderDetail({ orderId, productId, quantity, price }) {
  try {
    console.log("Inside createOrderDetail.");
    const {
      rows: [orderDetail],
    } = await client.query(
      `
        INSERT INTO orderdetails(orderId, productId, quantity, price) 
        VALUES($1, $2, $3, $4)
        ON CONFLICT (orderId, productId) DO NOTHING
        RETURNING *;
      `,
      [orderId, productId, quantity, price]
    );

    return orderDetail;
  } catch (error) {
    console.log("Error adding detail to order.");
    throw error;
  }
}

// Return all the order details
async function getAllOrderDetails() {
  try {
    const { rows: orderdetails } = await client.query(`
      SELECT * FROM orderdetails;
    `);

    return orderdetails;
  } catch (error) {
    throw error;
  }
}

// Delete item from order
async function removeItemFromOrder(orderID, productID) {
  console.log("Inside deleteGuestCartItem.");

  try {
    await client.query(`
          DELETE FROM orderdetails
          WHERE orderId = ${orderID}
          AND productId = ${productID};
        `);

    console.log("Successfully deleted Order-Detail for: ", orderID, productID);

    return;
  } catch (error) {
    console.log("Error deleting guest's cart item.");
    throw error;
  }
}
