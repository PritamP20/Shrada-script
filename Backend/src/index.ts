import express from "express";
// @ts-ignore
import cors from "cors";
import fs from "fs";

import { Role, PurchaseType } from "../types/types.ts"; 
import { PrismaClient } from "@prisma/client";
import { Client as AppwriteClient, Storage, ID } from "appwrite";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const appwriteClient = new AppwriteClient()
  .setEndpoint("https://frankfut.cloud.appwrite.io/v1")
  .setProject("68e554eb0037254efc47");

const storage = new Storage(appwriteClient);

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

app.post("/users", async (req, res) => {
  try {
    const { email, name, role } = req.body;
    const user = await prisma.user.create({
      data: { email, name, role: role || Role.USER },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/assign-admin", async (req, res) => {
  try {
    const { superAdminId, adminId } = req.body;
    const assignment = await prisma.adminAssignment.create({
      data: { superAdminId, adminId },
    });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/assignments", async (_, res) => {
  const assignments = await prisma.adminAssignment.findMany({
    include: { superAdmin: true, admin: true },
  });
  res.json(assignments);
});

app.post("/documents", async (req, res) => {
  try {
    const { title, description, fileUrl, price, isForRent, addedById } = req.body;
    const doc = await prisma.document.create({
      data: { title, description, fileUrl, price, isForRent, addedById },
    });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/documents", async (_, res) => {
  const docs = await prisma.document.findMany({ include: { addedBy: true } });
  res.json(docs);
});

app.post("/purchase", async (req, res) => {
  try {
    const { userId, documentId, type, expiresAt } = req.body;
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        documentId,
        type: type || PurchaseType.BUY,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.get("/purchases", async (_, res) => {
  const purchases = await prisma.purchase.findMany({
    include: { user: true, document: true },
  });
  res.json(purchases);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
