import db from '../config/db.js';

export async function checkout(req, res) {
  try {
    const { user_id, shipping_address, shipping_method } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'User ID required' });
    }

    // Get cart items
    const [cartItems] = await db.query(
      `SELECT c.listing_id, c.quantity, l.price, l.seller_id, b.title
       FROM Cart c
       JOIN Listings l ON c.listing_id = l.listing_id
       JOIN Books b ON l.book_id = b.book_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const orders = [];
      let totalAmount = 0;

      // Create orders for each listing
      for (const item of cartItems) {
        // Check if listing still has quantity
        const [listing] = await connection.query(
          'SELECT quantity FROM Listings WHERE listing_id = ?',
          [item.listing_id]
        );

        if (listing.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for ${item.title}`);
        }

        // Create order
        const [orderResult] = await connection.query(
          `INSERT INTO Orders (buyer_id, listing_id, quantity, status, order_date)
           VALUES (?, ?, ?, 'Completed', NOW())`,
          [user_id, item.listing_id, item.quantity]
        );

        // Update listing quantity
        await connection.query(
          'UPDATE Listings SET quantity = quantity - ? WHERE listing_id = ?',
          [item.quantity, item.listing_id]
        );

        // If quantity becomes 0, mark as sold
        await connection.query(
          `UPDATE Listings SET status = 'Sold' WHERE listing_id = ? AND quantity = 0`,
          [item.listing_id]
        );

        totalAmount += item.price * item.quantity;

        orders.push({
          order_id: orderResult.insertId,
          listing_id: item.listing_id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        });
      }

      // Clear cart
      await connection.query('DELETE FROM Cart WHERE user_id = ?', [user_id]);

      await connection.commit();
      connection.release();

      const shippingCost = shipping_method === 'express' ? 15.00 : 5.00;
      const tax = totalAmount * 0.08; // 8% tax

      res.json({
        ok: true,
        message: 'Checkout successful',
        order_summary: {
          orders,
          subtotal: totalAmount,
          shipping: shippingCost,
          tax: tax,
          total: totalAmount + shippingCost + tax,
          shipping_address,
          shipping_method,
          order_date: new Date(),
        },
      });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed', message: error.message });
  }
}

export async function getOrders(req, res) {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        o.order_id,
        o.buyer_id,
        o.listing_id,
        o.quantity,
        o.status,
        o.order_date,
        b.title,
        b.author,
        l.price,
        u.name as seller_name
      FROM Orders o
      JOIN Listings l ON o.listing_id = l.listing_id
      JOIN Books b ON l.book_id = b.book_id
      JOIN Users u ON l.seller_id = u.user_id
      WHERE o.buyer_id = ?
      ORDER BY o.order_date DESC
    `;

    const [orders] = await db.query(query, [userId]);
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}

export async function getSellingOrders(req, res) {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        o.order_id,
        o.buyer_id,
        o.listing_id,
        o.quantity,
        o.status,
        o.order_date,
        b.title,
        l.price,
        buyer.name as buyer_name,
        buyer.email as buyer_email
      FROM Orders o
      JOIN Listings l ON o.listing_id = l.listing_id
      JOIN Books b ON l.book_id = b.book_id
      JOIN Users buyer ON o.buyer_id = buyer.user_id
      WHERE l.seller_id = ?
      ORDER BY o.order_date DESC
    `;

    const [orders] = await db.query(query, [userId]);
    res.json(orders);
  } catch (error) {
    console.error('Get selling orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}
