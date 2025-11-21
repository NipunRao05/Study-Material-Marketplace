// import db from '../config/db.js';

// export async function getAllListings(req, res) {
//   try {
//     const { search, course_id, DepartmentID, minPrice, maxPrice, condition } = req.query;

//     let query = `
//       SELECT 
//         l.listing_id, 
//         l.seller_id, 
//         l.book_id,
//         b.title, 
//         b.author, 
//         b.edition,
//         c.code as course_code,
//         c.title as course_title,
//         d.name as department_name,
//         l.price, 
//         l.condition, 
//         l.quantity, 
//         l.status,
//         u.name as seller_name
//       FROM Listings l
//       JOIN Books b ON l.book_id = b.book_id
//       JOIN Courses c ON b.course_id = c.course_id
//       JOIN Departments d ON c.DepartmentID = d.DepartmentID
//       JOIN Users u ON l.seller_id = u.UserID
//       WHERE l.status = 'Available'
//     `;

//     const params = [];

//     if (search) {
//       query += ' AND (b.title LIKE ? OR b.author LIKE ? OR c.code LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (course_id) {
//       query += ' AND b.course_id = ?';
//       params.push(course_id);
//     }

//     if (DepartmentID) {
//       query += ' AND c.DepartmentID = ?';
//       params.push(DepartmentID);
//     }

//     if (minPrice) {
//       query += ' AND l.price >= ?';
//       params.push(minPrice);
//     }

//     if (maxPrice) {
//       query += ' AND l.price <= ?';
//       params.push(maxPrice);
//     }

//     if (condition) {
//       query += ' AND l.condition = ?';
//       params.push(condition);
//     }

//     query += ' ORDER BY l.listing_id DESC LIMIT 100';

//     const [listings] = await db.query(query, params);
//     res.json(listings);
//   } catch (error) {
//     console.error('Get listings error:', error);
//     res.status(500).json({ error: 'Failed to fetch listings', message: error.message });
//   }
// }

// export async function getListingById(req, res) {
//   try {
//     const { id } = req.params;

//     const query = `
//   SELECT 
//     l.ListingID, 
//     l.SellerID, 
//     l.BookID,
//     b.Title, 
//     b.Author,
//     c.Code AS CourseCode,
//     c.Title AS CourseTitle,
//     d.Name AS DepartmentName,
//     l.Price, 
//     l.Condition, 
//     l.Quantity, 
//     l.Status,
//     u.Name AS SellerName
//   FROM listings l
//   JOIN books b ON l.BookID = b.BookID
//   JOIN courses c ON b.CourseID = c.CourseID
//   JOIN departments d ON c.DepartmentID = d.DepartmentID
//   JOIN users u ON l.SellerID = u.UserID
//   WHERE l.Status = 'Available'
//   ORDER BY l.ListingID DESC
//   LIMIT 100;



//     `;

//     const [listings] = await db.query(query, [id]);

//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     res.json(listings);
//   } catch (error) {
//     console.error('Get listing by ID error:', error);
//     res.status(500).json({ error: 'Failed to fetch listing', message: error.message });
//   }
// }

// export async function createListing(req, res) {
//   try {
//     const { seller_id, book_id, price, condition, quantity } = req.body;

//     // Validation
//     if (!seller_id || !book_id || !price || !condition || !quantity) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     if (quantity <= 0) {
//       return res.status(400).json({ error: 'Quantity must be greater than 0' });
//     }

//     // Insert listing
//     const [result] = await db.query(
//       `INSERT INTO Listings (seller_id, book_id, price, condition, quantity, status) 
//        VALUES (?, ?, ?, ?, ?, 'Available')`,
//       [seller_id, book_id, price, condition, quantity]
//     );

//     res.status(201).json({
//       ok: true,
//       message: 'Listing created successfully',
//       listing_id: result.insertId,
//     });
//   } catch (error) {
//     console.error('Create listing error:', error);
//     res.status(500).json({ error: 'Failed to create listing', message: error.message });
//   }
// }

// export async function updateListing(req, res) {
//   try {
//     const { id } = req.params;
//     const { seller_id, price, condition, quantity, status } = req.body;

//     // Check if listing exists and seller is owner
//     const [listings] = await db.query('SELECT seller_id FROM Listings WHERE listing_id = ?', [id]);
//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     if (listings.seller_id !== seller_id) {
//       return res.status(403).json({ error: 'Unauthorized: You cannot edit this listing' });
//     }

//     // Update listing
//     await db.query(
//       'UPDATE Listings SET price = ?, condition = ?, quantity = ?, status = ? WHERE listing_id = ?',
//       [price, condition, quantity, status || 'Available', id]
//     );

//     res.json({ ok: true, message: 'Listing updated successfully' });
//   } catch (error) {
//     console.error('Update listing error:', error);
//     res.status(500).json({ error: 'Failed to update listing', message: error.message });
//   }
// }

// export async function deleteListing(req, res) {
//   try {
//     const { id } = req.params;
//     const { seller_id } = req.body;

//     // Check if listing exists and seller is owner
//     const [listings] = await db.query('SELECT seller_id FROM Listings WHERE listing_id = ?', [id]);
//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     if (listings.seller_id !== seller_id) {
//       return res.status(403).json({ error: 'Unauthorized: You cannot delete this listing' });
//     }

//     // Delete listing
//     await db.query('DELETE FROM Listings WHERE listing_id = ?', [id]);

//     res.json({ ok: true, message: 'Listing deleted successfully' });
//   } catch (error) {
//     console.error('Delete listing error:', error);
//     res.status(500).json({ error: 'Failed to delete listing', message: error.message });
//   }
// }

// import db from '../config/db.js';

// export async function getAllListings(req, res) {
//   try {
//     const { search, course_id, DepartmentID, minPrice, maxPrice, condition } = req.query;

//     let query = `
//       SELECT 
//         l.ListingID, 
//         l.SellerID, 
//         l.BookID,
//         b.Title, 
//         b.Author, 
//         c.Code as course_code,
//         c.Title as course_title,
//         d.Name as department_name,
//         l.Price, 
//         l.Condition, 
//         l.Quantity, 
//         l.Status,
//         u.Name as seller_name
//       FROM listings l
//       JOIN books b ON l.BookID = b.BookID
//       JOIN courses c ON b.CourseID = c.CourseID
//       JOIN departments d ON c.DepartmentID = d.DepartmentID
//       JOIN users u ON l.SellerID = u.UserID
//       WHERE l.Status = 'Available'
//     `;

//     const params = [];

//     if (search) {
//       query += ' AND (b.Title LIKE ? OR b.Author LIKE ? OR c.Code LIKE ?)';
//       const searchTerm = `%${search}%`;
//       params.push(searchTerm, searchTerm, searchTerm);
//     }

//     if (course_id) {
//       query += ' AND b.CourseID = ?';
//       params.push(course_id);
//     }

//     if (DepartmentID) {
//       query += ' AND c.DepartmentID = ?';
//       params.push(DepartmentID);
//     }

//     if (minPrice) {
//       query += ' AND l.Price >= ?';
//       params.push(minPrice);
//     }

//     if (maxPrice) {
//       query += ' AND l.Price <= ?';
//       params.push(maxPrice);
//     }

//     if (condition) {
//       query += ' AND l.Condition = ?';
//       params.push(condition);
//     }

//     query += ' ORDER BY l.ListingID DESC LIMIT 100';

//     const [listings] = await db.query(query, params);
//     res.json(listings);
//   } catch (error) {
//     console.error('Get listings error:', error);
//     res.status(500).json({ error: 'Failed to fetch listings', message: error.message });
//   }
// }

// export async function getListingById(req, res) {
//   try {
//     const { id } = req.params;

//     const query = `
//   SELECT 
//     l.ListingID, 
//     l.SellerID, 
//     l.BookID,
//     b.Title, 
//     b.Author,
//     c.Code AS CourseCode,
//     c.Title AS CourseTitle,
//     d.Name AS DepartmentName,
//     l.Price, 
//     l.Condition, 
//     l.Quantity, 
//     l.Status,
//     u.Name AS SellerName
//   FROM listings l
//   JOIN books b ON l.BookID = b.BookID
//   JOIN courses c ON b.CourseID = c.CourseID
//   JOIN departments d ON c.DepartmentID = d.DepartmentID
//   JOIN users u ON l.SellerID = u.UserID
//   WHERE l.Status = 'Available'
//   ORDER BY l.ListingID DESC
//   LIMIT 100;



//     `;

//     const [listings] = await db.query(query, [id]);

//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     res.json(listings);
//   } catch (error) {
//     console.error('Get listing by ID error:', error);
//     res.status(500).json({ error: 'Failed to fetch listing', message: error.message });
//   }
// }

// export async function createListing(req, res) {
//   try {
//     const {
//       seller_id,
//       book_id,
//       price,
//       condition,
//       quantity,
//       // optional book fields
//       title,
//       author,
//       edition,
//       course_code,
//       description,
//     } = req.body;

//     // Basic validation
//     if (!seller_id || !price || !condition || !quantity) {
//       return res.status(400).json({ error: 'Missing required listing fields' });
//     }

//     if (quantity <= 0) {
//       return res.status(400).json({ error: 'Quantity must be greater than 0' });
//     }

//     let finalBookId = book_id;

//     // If book_id not provided, try to create or find a book using provided book fields
//     if (!finalBookId) {
//       if (!title || !author) {
//         return res.status(400).json({ error: 'book_id or title+author required' });
//       }

//       // Try to find existing book by title+author (and edition if provided)
//       const findParams = [title, author];
//       let findQuery = 'SELECT book_id FROM books WHERE title = ? AND author = ?';
//       if (edition) {
//         findQuery += ' AND edition = ?';
//         findParams.push(edition);
//       }

//       const [found] = await db.query(findQuery, findParams);
//       if (found.length > 0) {
//         finalBookId = found[0].book_id;
//       } else {
//         // If course_code provided, try to resolve CourseID
//         let courseId = null;
//         if (course_code) {
//           const [courses] = await db.query('SELECT course_id FROM courses WHERE code = ? LIMIT 1', [course_code]);
//           if (courses.length > 0) courseId = courses[0].course_id;
//         }

//         const [insertRes] = await db.query(
//           `INSERT INTO books (title, author, edition, course_id, description)
//            VALUES (?, ?, ?, ?, ?)`,
//           [title, author, edition || null, courseId, description || null]
//         );
//         finalBookId = insertRes.insertId;
//       }
//     }

//     // Insert listing
//     const [result] = await db.query(
//       `INSERT INTO listings (seller_id, book_id, price, condition, quantity, status) 
//        VALUES (?, ?, ?, ?, ?, 'Available')`,
//       [seller_id, finalBookId, price, condition, quantity]
//     );

//     res.status(201).json({
//       ok: true,
//       message: 'Listing created successfully',
//       listing_id: result.insertId,
//     });
//   } catch (error) {
//     console.error('Create listing error:', error);
//     res.status(500).json({ error: 'Failed to create listing', message: error.message });
//   }
// }

// export async function updateListing(req, res) {
//   try {
//     const { id } = req.params;
//     const { seller_id, price, condition, quantity, status } = req.body;

//     // Check if listing exists and seller is owner
//     const [listings] = await db.query('SELECT seller_id FROM listings WHERE listing_id = ?', [id]);
//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     if (listings.seller_id !== seller_id) {
//       return res.status(403).json({ error: 'Unauthorized: You cannot edit this listing' });
//     }

//     // Update listing
//     await db.query(
//       'UPDATE listings SET price = ?, condition = ?, quantity = ?, status = ? WHERE listing_id = ?',
//       [price, condition, quantity, status || 'Available', id]
//     );

//     res.json({ ok: true, message: 'Listing updated successfully' });
//   } catch (error) {
//     console.error('Update listing error:', error);
//     res.status(500).json({ error: 'Failed to update listing', message: error.message });
//   }
// }

// export async function deleteListing(req, res) {
//   try {
//     const { id } = req.params;
//     const { seller_id } = req.body;

//     // Check if listing exists and seller is owner
//     const [listings] = await db.query('SELECT seller_id FROM listings WHERE listing_id = ?', [id]);
//     if (listings.length === 0) {
//       return res.status(404).json({ error: 'Listing not found' });
//     }

//     if (listings.seller_id !== seller_id) {
//       return res.status(403).json({ error: 'Unauthorized: You cannot delete this listing' });
//     }

//     // Delete listing
//     await db.query('DELETE FROM listings WHERE listing_id = ?', [id]);

//     res.json({ ok: true, message: 'Listing deleted successfully' });
//   } catch (error) {
//     console.error('Delete listing error:', error);
//     res.status(500).json({ error: 'Failed to delete listing', message: error.message });
//   }
// }
//new code inserted by sharavnaa
// backend/controllers/listingController.js
import db from "../config/db.js";

/**
 * GET /api/listings
 * Returns all active listings
 */
export async function getAllListings(req, res) {
  try {
    const query = `
      SELECT 
        l.ListingID,
        l.SellerID,
        l.BookID,
        b.Title,
        b.Author,
        c.Code AS course_code,
        c.Title AS course_title,
        d.Name AS department_name,
        l.Price,
        l.Condition,
        l.Quantity,
        l.Status,
        u.Name AS seller_name
      FROM listings l
      JOIN books b ON l.BookID = b.BookID
      JOIN courses c ON b.CourseID = c.CourseID
      JOIN departments d ON c.DepartmentID = d.DepartmentID
      JOIN users u ON l.SellerID = u.UserID
      WHERE l.Status = 'Available'
      ORDER BY l.ListingID DESC
    `;

    const [rows] = await db.query(query);
    return res.json(rows);

  } catch (error) {
    console.error("Get listings error:", error);
    return res.status(500).json({ error: "Failed to fetch listings", message: error.message });
  }
}

/**
 * GET /api/listings/:id
 */
export async function getListingById(req, res) {
  try {
    const { id } = req.params;

    const query = `
      SELECT 
        l.ListingID AS listing_id,
        l.SellerID AS seller_id,
        l.BookID AS book_id,
        b.Title AS title,
        b.Author AS author,
        c.Code AS course_code,
        c.Title AS course_title,
        d.Name AS department_name,
        u.Name AS seller_name,
        l.Price AS price,
        l.Condition AS item_condition,
        l.Quantity AS quantity,
        l.Status AS status
      FROM listings l
      JOIN books b ON l.BookID = b.BookID
      JOIN courses c ON b.CourseID = c.CourseID
      JOIN departments d ON c.DepartmentID = d.DepartmentID
      JOIN users u ON l.SellerID = u.UserID
      WHERE l.ListingID = ?
    `;

    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json(rows[0]);

  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({ error: "Failed to fetch listing", message: error.message });
  }
}


/**
 * POST /api/listings
 */
export async function createListing(req, res) {
  try {
    //ADDED BY SHARAVANA
    console.log("REQ BODY =", req.body);

    const {
      seller_id,
      title,
      author,
      edition,   // This is optional because DB does not have Edition column
      course_code,
      price,
      condition,
      quantity,
      description  // ALSO optional (DB has no description column)
    } = req.body;

    if (!seller_id || !title || !author || !price || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate course code
    const [course] = await db.query(
      "SELECT CourseID, DepartmentID FROM courses WHERE Code = ?",
      [course_code]
    );

    if (course.length === 0) {
      return res.status(400).json({ error: "Invalid course code" });
    }

    const CourseID = course[0].CourseID;

    // Create Book record (Edition ignored because table does NOT have Edition column)
    const [bookResult] = await db.query(
      `INSERT INTO books (Title, Author, CourseID)
       VALUES (?, ?, ?)`,
      [title, author, CourseID]
    );

    const newBookID = bookResult.insertId;

    // Create Listing CHANGED BY SHARAVANA 
    const [listingResult] = await db.query(
  `INSERT INTO listings (\`SellerID\`, \`BookID\`, \`Price\`, \`Condition\`, \`Quantity\`, \`Status\`)
   VALUES (?, ?, ?, ?, ?, 'Available')`,
  [seller_id, newBookID, price, condition, quantity]
);


    return res.json({
      ok: true,
      message: "Listing created successfully",
      listing_id: listingResult.insertId
    });

  } catch (error) {
    console.error("Create listing error:", error);
    return res.status(500).json({ error: "Failed to create listing", message: error.message });
  }
}

/**
 * PUT /api/listings/:id
 */
export async function updateListing(req, res) {
  try {
    const { id } = req.params;
    const { price, condition, quantity, status } = req.body;

    await db.query(
      `UPDATE listings
       SET Price = ?, Condition = ?, Quantity = ?, Status = ?
       WHERE ListingID = ?`,
      [price, condition, quantity, status, id]
    );

    return res.json({ ok: true, message: "Listing updated" });

  } catch (error) {
    console.error("Update listing error:", error);
    return res.status(500).json({ error: "Failed to update listing", message: error.message });
  }
}

/**
 * DELETE /api/listings/:id
 */
export async function deleteListing(req, res) {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM listings WHERE ListingID = ?", [id]);

    return res.json({ ok: true, message: "Listing deleted" });

  } catch (error) {
    console.error("Delete listing error:", error);
    return res.status(500).json({ error: "Failed to delete listing", message: error.message });
  }
}
