//functions
DELIMITER $$
CREATE FUNCTION GetBookAvailability(listing_id INT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
  DECLARE status VARCHAR(20);
  DECLARE qty INT;

  SELECT quantity INTO qty
  FROM Listings
  WHERE listing_id = GetBookAvailability.listing_id;

  IF qty > 0 THEN
    SET status = 'Available';
  ELSE
    SET status = 'Out of Stock';
  END IF;

  RETURN status;
END$$
DELIMITER ;

DELIMITER $$
CREATE FUNCTION GetSellerRating(seller_id INT)
RETURNS DECIMAL(3,2)
DETERMINISTIC
BEGIN
  DECLARE avg_rating DECIMAL(3,2);

  SELECT AVG(rating)
  INTO avg_rating
  FROM Reviews
  WHERE seller_id = GetSellerRating.seller_id;

  RETURN IFNULL(avg_rating, 0);
END$$
DELIMITER ;

//Triggers
DELIMITER $$
CREATE TRIGGER after_order_insert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
  UPDATE Listings
  SET quantity = quantity - NEW.quantity
  WHERE listing_id = NEW.listing_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER after_listing_update
AFTER UPDATE ON Listings
FOR EACH ROW
BEGIN
  IF NEW.quantity <= 0 THEN
    UPDATE Listings
    SET status = 'Sold Out'
    WHERE listing_id = NEW.listing_id;
  END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER before_listing_update
BEFORE UPDATE ON Listings
FOR EACH ROW
BEGIN
  SET NEW.last_modified = NOW();
END$$
DELIMITER ;


//Stored Procedures
DELIMITER $$
CREATE PROCEDURE AddListing(
  IN p_user_id INT,
  IN p_book_id INT,
  IN p_price DECIMAL(10,2),
  IN p_condition VARCHAR(50),
  IN p_quantity INT
)
BEGIN
  INSERT INTO Listings(user_id, book_id, price, book_condition, quantity, created_at)
  VALUES (p_user_id, p_book_id, p_price, p_condition, p_quantity, NOW());
END$$
DELIMITER ;


DELIMITER $$
CREATE PROCEDURE PlaceOrder(IN p_user_id INT)
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE c_listing_id INT;
  DECLARE c_quantity INT;
  DECLARE cur CURSOR FOR
    SELECT listing_id, quantity FROM Cart WHERE user_id = p_user_id;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO c_listing_id, c_quantity;
    IF done THEN
      LEAVE read_loop;
    END IF;

    INSERT INTO Orders(user_id, listing_id, quantity, order_date)
    VALUES (p_user_id, c_listing_id, c_quantity, NOW());

    UPDATE Listings
    SET quantity = quantity - c_quantity
    WHERE listing_id = c_listing_id;
  END LOOP;

  CLOSE cur;
  DELETE FROM Cart WHERE user_id = p_user_id;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE GetBooksByDept(IN p_dept_id INT)
BEGIN
  SELECT b.book_id, b.title, l.price, l.book_condition, u.name AS seller
  FROM Books b
  JOIN Listings l ON b.book_id = l.book_id
  JOIN Users u ON u.user_id = l.user_id
  WHERE b.dept_id = p_dept_id AND l.quantity > 0;
END$$
DELIMITER ;
