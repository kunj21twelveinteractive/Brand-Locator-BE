import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./src/router/router";

import path from "path";
import { log } from "console";
import { parseCsvFile } from "./cvsToDatabase";

const app = express();
app.use(express.json());

app.use(cors());
console.log("hello ");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/Brand-Logo", express.static(path.join(__dirname, "Brand-Logo")));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Loco-Shop");
});

app.use("/api", router);

mongoose
//.connect("mongodb://localhost:27017/Loco-Shop",{
  .connect("mongodb+srv://jash21twelve_test:jash21twelve_test@cluster0.yg7pskb.mongodb.net/Loco-Shop", {

  })
  .then(() => {
    const PORT: number = parseInt(process.env.PORT || "3030", 10); // Ensure PORT is a number and provide a default value
    app.listen(PORT, () => {
      console.log(`Listening on *:${PORT}`);
    });
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

//runSeeder();
//generateFakeBrands();
//parseCsvFile();
