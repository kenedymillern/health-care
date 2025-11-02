import bcrypt from "bcryptjs";
import { connectToDatabase } from "../mongodb";

async function createAdmin() {
  const db = await connectToDatabase();

  const email = "office@eutrivhealth.com";
  const plainPassword = "KENNEDYmillern1234@@";

  const hash = await bcrypt.hash(plainPassword, 10);

  await db.collection("admins").insertOne({ email, password: hash });

  console.log("✅ Admin created successfully");
}

createAdmin();
