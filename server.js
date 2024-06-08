const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Initialize the cart with total value and items array
let cart = { total: 0, items: [] };

// Endpoint to handle adding items to the cart
app.post('/add-to-cart', (req, res) => {
  const { itemId, price, quantity } = req.body;

  // Validate request body
  if (!itemId || typeof price !== 'number' || typeof quantity !== 'number' || price <= 0 || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid item details'});
  }

  let itemExists = false;

  // Update item if it already exists in the cart
  cart.items = cart.items.map((item) => {
    if (item.itemId === itemId) {
      itemExists = true;
      item.quantity += quantity;
      item.totalPrice += price * quantity;
      return item;
    }
    return item;
  });

  // If item does not exist, add it to the cart
  if (!itemExists) {
    const totalPrice = price * quantity;
    cart.items.push({ itemId, price, quantity, totalPrice });
  }

  // Recalculate the total value of the cart
  cart.total = cart.items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  // Respond with the updated cart details
  res.status(200).json({ message: 'Item added to cart', cart });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = { app, server };
