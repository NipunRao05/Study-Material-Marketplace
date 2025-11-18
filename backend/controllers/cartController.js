import db from '../config/db.js';

export async function getCart(req, res) {
  try {
    const { userId } = req.params;

    const query = `
      SELECT 
        c.CartID as cart_id,
        c.UserID as UserID,
        c.ListingID as listing_id,
        c.Quantity as quantity,
        l.Price as price,
        l.Condition as condition,
        l.Quantity as available_quantity,
        b.Title as title,
        b.Author as author,
        b.Edition as edition,
        u.Name as seller_name
      FROM Cart c
      JOIN Listings l ON c.ListingID = l.ListingID
      JOIN Books b ON l.BookID = b.BookID
      JOIN users u ON l.SellerID = u.UserID
      WHERE c.UserID = ?
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
    const userId = req.body.userID || req.body.UserID;
    const listingId = req.body.listingID || req.body.listing_id;
    const quantity = req.body.quantity;

    // Validation
    if (!userId || !listingId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if listing exists and has quantity
    const [listings] = await db.query(
      'SELECT Quantity FROM Listings WHERE ListingID = ? AND Status = "Available"',
      [listingId]
    );

    if (listings.length === 0) {
      return res.status(404).json({ error: 'Listing not available' });
    }

    if (listings[0].Quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }

    // Check if already in cart
    const [existing] = await db.query(
      'SELECT CartID FROM Cart WHERE UserID = ? AND ListingID = ?',
      [userId, listingId]
    );

    if (existing.length > 0) {
      // Update quantity
      await db.query(
        'UPDATE Cart SET Quantity = Quantity + ? WHERE UserID = ? AND ListingID = ?',
        [quantity, userId, listingId]
      );
    } else {
      // Insert new cart item
      await db.query(
        'INSERT INTO Cart (UserID, ListingID, Quantity) VALUES (?, ?, ?)',
        [userId, listingId, quantity]
      );
    }

    // Return updated cart
    const [cartItems] = await db.query(
      `SELECT c.CartID as cart_id, c.ListingID as listing_id, c.Quantity as quantity, l.Price as price, b.Title as title, u.Name as seller_name
      FROM Cart c
      JOIN Listings l ON c.ListingID = l.ListingID
      JOIN Books b ON l.BookID = b.BookID
      JOIN users u ON l.SellerID = u.UserID
       WHERE c.UserID = ?`,
      [userId]
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
    const userId = req.body.userID || req.body.UserID;
    const listingId = req.body.listingID || req.body.listing_id;

    if (!userId || !listingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.query(
      'DELETE FROM Cart WHERE UserID = ? AND ListingID = ?',
      [userId, listingId]
    );

    // Return updated cart
    const [cartItems] = await db.query(
      `SELECT c.CartID as cart_id, c.ListingID as listing_id, c.Quantity as quantity, l.Price as price, b.Title as title
       FROM Cart c
       JOIN Listings l ON c.ListingID = l.ListingID
       JOIN Books b ON l.BookID = b.BookID
       WHERE c.UserID = ?`,
      [userId]
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
