import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cvClientRoutes from "./routes/cvClientRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (_request, response) => {
  response.json({ message: "Smart CV API is running." });
});

app.use("/api/cv-clients", cvClientRoutes);
app.use(notFound);
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
