import { Client, Storage, ID } from "appwrite";
import express from "express";
// @ts-ignore
import cors from "cors";
import fs from "fs";
// @ts-ignore
import client from "../DB/index.js";

const client = new Client()
  .setEndpoint("https://frankfut.cloud.appwrite.io/v1")
  .setProject("68e554eb0037254efc47");

const storage = new Storage(client);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/upload", async (req, res) => {
  try {
    const filePath = req.body.filePath;
    if (!filePath) return res.status(400).json({ error: "filePath required" });
    const fileBuffer = fs.readFileSync(filePath);

    const file = await storage.createFile(
      "68e555160033172c9e6c",
      ID.unique(),
      fileBuffer as any 
    );

    res.status(200).json({ message: "File uploaded", file });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
