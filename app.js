import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

//swagger
import basicAuth from "express-basic-auth";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

//routes
import authRoutes from "./routes/auth/auth.js";

dotenv.config({ path: "./env" });

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("build"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5000mb" }));

app.use("/", authRoutes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "auth",
      version: "v1.0",
      description: "",
    },
    servers: [
      {
        url: "",
        description: "auth",
      },
    ],
  },
  apis: ["./app.js", "./routes/auth/auth.js"],
};

const specs = swaggerJsDoc(options);

app.use(
  "/docs",
  basicAuth({ users: { auth: "auth" }, challenge: true }),
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
