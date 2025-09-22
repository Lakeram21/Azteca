import * as UserService from "../services/userService.js";

// Get all users (for testing)
export function getAllUsers(req, res) {
  const users = UserService.getAllUsers();
  res.json(users);
}

// Add new user (signup)
export function signup(req, res) {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = UserService.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = UserService.addUser({ name, email, password, phone });
  res.json(user);
}

// Login user
export function login(req, res) {
  const { email, password } = req.body;

  const user = UserService.findUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // For now, we just return user info (no JWT yet)
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
