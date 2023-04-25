import express from "express";
import fs from "fs";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

//validator
import { validator, validatorLogin } from "./validator.js";

//middleware
import assignUserId from "../../middleware/assignUserId.js";
import signToken from "../../middleware/signToken.js";
import findUserByUsername from "../../middleware/findUserByUsername.js";
import verifyToken from "../../middleware/verifyToken.js";

dotenv.config();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: The ID of the newly registered user
 *                 token:
 *                   type: string
 *                   description: The authentication token for the user
 *       400:
 *         description: Invalid request body or user already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   description: The ID of the logged in user
 *                 token:
 *                   type: string
 *                   description: The authentication token for the user
 *       400:
 *         description: Invalid credentials or user does not exist
 *       500:
 *         description: Internal server error
 */

router.post("/register", validator, assignUserId, signToken, async (req, res, next) => {
  const dbData = JSON.parse(fs.readFileSync("./config/db.json"));

  // Get token from req object
  const { token } = req;

  let salt = await bcrypt.genSalt(10);

  try {
    let hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = {
      id: req.userId,
      username: req.body.username,
      password: hashedPassword,
    };

    dbData.push(newUser);
    fs.writeFileSync("./config/db.json", JSON.stringify(dbData));

    // Send the token as a response
    res.status(200).json({ user_id: newUser.id, token: token });
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
    next(e);
  }
});

router.post(
  "/login",
  validatorLogin,
  findUserByUsername,
  signToken,
  verifyToken,
  async (req, res, next) => {
    try {
      // Get token and searchUser from req object
      const { searchUser, token } = req;

      if (!bcrypt.compareSync(req.body.password, searchUser.password)) {
        res.status(400).json({ msg: "Credentials not matching in database" });
      } else {
        req.tokenDecoded
          ? res.status(200).json({ user_id: req.tokenDecoded.user_id, token: token })
          : res.status(400).json({ msg: "Something went wrong" });
      }
    } catch (e) {
      res.status(500).json({ msg: "Internal server error" });
      next(e);
    }
  },
);

export default router;
