import fs from "fs";
import path from "path";
import { createUser } from "../models/user.js";

const usersFile = path.join("./data", "users.json");

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  return JSON.parse(fs.readFileSync(usersFile, "utf-8") || "[]");
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export function getAllUsers() {
  return readUsers();
}

export function addUser(userData) {
  const users = readUsers();
  const newUser = createUser({ id: Date.now(), ...userData });
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

export function findUserByEmail(email) {
  const users = readUsers();
  return users.find(u => u.email === email);
}

export function getUserById(id) {
  const users = getAllUsers();
  return users.find((user) => String(user.id) === String(id)) || null;
}