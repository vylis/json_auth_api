import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verifyToken(req, res, next) {
  const token = req.query.token || req.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.tokenDecoded = decoded;

  next();
}

export default verifyToken;
