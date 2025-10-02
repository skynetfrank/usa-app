import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import userRouter from "./routers/userRouter.js";
import clienteRouter from "./routers/clienteRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const localdb = "mongodb://127.0.0.1/losfrailesv2db";
//process.env.MONGODB_URI;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("CONECTADO A MONGODB"))
  .catch((e) => console.log(e.message));

app.use("/api/users", userRouter);
app.use("/api/clientes", clienteRouter);

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "/frontend/dist/index.html")));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("servidor ok escuchando en http://localhost");
});
