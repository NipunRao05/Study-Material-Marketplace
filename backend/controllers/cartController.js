import db from '../config/db.js';

export async function getCart(req, res) {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        c.cart_id,
        c.user_id,
        c.listing_id,
        c.quantity,
        l.price,
        l.condition,
        l.quantity as available_quantity,
        b.title,
        b.author,
        b.edition,
        u.name as seller_name
      FROM Cart c
      JOIN Listings l ON c.listing_id = l.listing_id
      JOIN Books b ON l.book_id = b.book_id
      JOIN Users u ON l.seller_id = u.user_id
      WHERE c.user_id = ?
    `;

    const [cartItems] = await db.query(query, [userId]);
    res.json(cartItems);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart', message: error.message });
  }
}

export async function addToCart(req, res) {
  try {
    const { user_id, listing_id, quantity } = req.body;

    // Validation
    if (!user_id || !listing_id || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if listing exists and has quantity
    const [listings] = await db.query(
      'SELECT quantity FROM Listings WHERE listing_id = ? AND status = "Available"',
      [listing_id]
    );

    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not available' });
    }

    if (listings.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }

    // Check if already in cart
    const [existing] = await db.query(
      'SELECT cart_id FROM Cart WHERE user_id = ? AND listing_id = ?',
      [user_id, listing_id]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE Cart SET quantity = quantity + ? WHERE user_id = ? AND listing_id = ?',
        [quantity, user_id, listing_id]
      );
    } else {
      // Insert new cart item
      await db.query(
        'INSERT INTO Cart (user_id, listing_id, quantity) VALUES (?, ?, ?)',
        [user_id, listing_id, quantity]
      );
    }

    // Return updated cart
    const [cartItems] = await db.query(
      `SELECT c.cart_id, c.listing_id, c.quantity, l.price, b.title, u.name as seller_name
       FROM Cart c
       JOIN Listings l ON c.listing_id = l.listing_id
       JOIN Books b ON l.book_id = b.book_id
       JOIN Users u ON l.seller_id = u.user_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    res.json({
      ok: true,
      message: 'Added to cart',
      cart: cartItems,
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart', message: error.message });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { user_id, listing_id } = req.body;

    if (!user_id || !listing_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      'DELETE FROM Cart WHERE user_id = ? AND listing_id = ?',
      [user_id, listing_id]
    );

    // Return updated cart
    const [cartItems] = await db.query(
      `SELECT c.cart_id, c.listing_id, c.quantity, l.price, b.title
       FROM Cart c
       JOIN Listings l ON c.listing_id = l.listing_id
       JOIN Books b ON l.book_id = b.book_id
       WHERE c.user_id = ?`,
      [user_id]
    );

    res.json({
      ok: true,
      message: 'Removed from cart',
      cart: cartItems,
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove from cart', message: error.message });
  }
}
