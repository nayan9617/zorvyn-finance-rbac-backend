const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const { connectDb } = require("../src/config/db");
const User = require("../src/models/User");
const FinancialRecord = require("../src/models/FinancialRecord");
const { ROLES, USER_STATUSES } = require("../src/constants/roles");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required in .env to run seed script");
  }

  // Reset the database so the seeded data stays deterministic for reviewers.
  await connectDb(process.env.MONGODB_URI);

  await Promise.all([User.deleteMany({}), FinancialRecord.deleteMany({})]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@zorvyn.local",
    password: "Admin@12345",
    role: ROLES.ADMIN,
    status: USER_STATUSES.ACTIVE,
  });

  const analyst = await User.create({
    name: "Analyst User",
    email: "analyst@zorvyn.local",
    password: "Analyst@12345",
    role: ROLES.ANALYST,
    status: USER_STATUSES.ACTIVE,
  });

  const viewer = await User.create({
    name: "Viewer User",
    email: "viewer@zorvyn.local",
    password: "Viewer@12345",
    role: ROLES.VIEWER,
    status: USER_STATUSES.ACTIVE,
  });

  const now = new Date();
  const day = 24 * 60 * 60 * 1000;

  // Sample records cover both income and expense flows across recent dates.
  await FinancialRecord.insertMany([
    {
      amount: 250000,
      type: "income",
      category: "Salary",
      date: new Date(now.getTime() - 28 * day),
      notes: "Monthly salary credited",
      createdBy: admin._id,
    },
    {
      amount: 18000,
      type: "expense",
      category: "Rent",
      date: new Date(now.getTime() - 27 * day),
      notes: "Apartment rent",
      createdBy: admin._id,
    },
    {
      amount: 4500,
      type: "expense",
      category: "Internet",
      date: new Date(now.getTime() - 20 * day),
      notes: "Broadband and mobile bills",
      createdBy: analyst._id,
    },
    {
      amount: 9500,
      type: "income",
      category: "Freelance",
      date: new Date(now.getTime() - 12 * day),
      notes: "Consulting project payout",
      createdBy: admin._id,
    },
    {
      amount: 6200,
      type: "expense",
      category: "Groceries",
      date: new Date(now.getTime() - 5 * day),
      notes: "Household purchases",
      createdBy: analyst._id,
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: admin@zorvyn.local / Admin@12345");
  console.log("Analyst login: analyst@zorvyn.local / Analyst@12345");
  console.log("Viewer login: viewer@zorvyn.local / Viewer@12345");
};

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
