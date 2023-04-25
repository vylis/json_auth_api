// middleware function to find user by username in db
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export async function findUserByUsername(req, res, next) {
  const db = JSON.parse(fs.readFileSync("./config/db.json"));
  const searchUser = db.find((user) => user.username === req.body.username);
  if (!searchUser) {
    res.status(400).json({ msg: "User not found" });
    next();
  } else {
    // Add user_id and searchUser to the req object
    req.userId = searchUser.id;
    req.searchUser = searchUser;
    next();
  }
}

export default findUserByUsername;
