// middleware function to assign user id to req.userId
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export async function assignUserId(req, res, next) {
  const dbData = JSON.parse(fs.readFileSync("./config/db.json"));

  // Add user_id to the req object
  req.userId = dbData.length;
  next();
}

export default assignUserId;
