import db from '../config/db.js';
import bcrypt from 'bcrypt';

export async function register(req, res) {
  try {
    const { name, email, password, department_id } = req.body;

    // Validation
    if (!name || !email || !password || !department_id) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists
    const [existingUser] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO Users (name, email, password_hash, department_id) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, department_id]
    );

    const user = {
      user_id: result.insertId,
      name,
      email,
      department_id,
    };

    res.json({
      ok: true,
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users;

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const response = {
      ok: true,
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        department_id: user.department_id,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
}
