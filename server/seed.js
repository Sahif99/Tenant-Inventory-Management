import mongoose from "mongoose";
import dotenv from "dotenv";

import Tenant from "./src/models/Tenant.model.js";
import User from "./src/models/User.model.js";
import Product from "./src/models/Product.model.js";
import Supplier from "./src/models/Supplier.model.js";
import Order from "./src/models/Order.model.js"
import PurchaseOrder from "./src/models/PurchaseOrder.model.js"
import Stock from "./src/models/StockMovement.model.js"

dotenv.config();

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
};

const seed = async () => {
    try {
        await connectDB();

        console.log("Clearing existing data...");
        await Promise.all([
            Tenant.deleteMany(),
            User.deleteMany(),
            Product.deleteMany(),
            Supplier.deleteMany(),
            Order.deleteMany(),
            PurchaseOrder.deleteMany(),
            Stock.deleteMany(),
        ]);

        /* tenant 1 */
        const tenant1 = await Tenant.create({ name: "Alpha Traders" });

        const tenant1Users = [
            {
                tenantId: tenant1._id,
                name: "Alpha Owner",
                email: "owner@alpha.com",
                password: "owner123",
                role: "OWNER",
            },
            {
                tenantId: tenant1._id,
                name: "Alpha Manager",
                email: "manager@alpha.com",
                password: "manager123",
                role: "MANAGER",
            },
            {
                tenantId: tenant1._id,
                name: "Alpha Staff",
                email: "staff@alpha.com",
                password: "staff123",
                role: "STAFF",
            },
        ];

        for (const user of tenant1Users) {
            await User.create(user);
        }


        await Product.create([
            {
                tenantId: tenant1._id,
                name: "Men Shirt",
                description: "Cotton casual shirts",
                variants: [
                    {
                        sku: "SHIRT-M-L",
                        price: 499,
                        stock: 50,
                        reorderLevel: 10,
                        attributes: { size: "L", color: "Blue" },
                    },
                    {
                        sku: "SHIRT-M-M",
                        price: 479,
                        stock: 40,
                        reorderLevel: 10,
                        attributes: { size: "M", color: "White" },
                    },
                ],
            },
            {
                tenantId: tenant1._id,
                name: "Men Jeans",
                description: "Slim fit jeans",
                variants: [
                    {
                        sku: "JEANS-M-32",
                        price: 1299,
                        stock: 30,
                        reorderLevel: 5,
                        attributes: { size: "32", color: "Black" },
                    },
                    {
                        sku: "JEANS-M-34",
                        price: 1299,
                        stock: 25,
                        reorderLevel: 5,
                        attributes: { size: "34", color: "Blue" },
                    },
                ],
            },
        ]);

        await Supplier.create([
            {
                tenantId: tenant1._id,
                name: "Alpha Textiles",
                contactEmail: "alpha-textiles@mail.com",
                phone: "9000000001",
            },
            {
                tenantId: tenant1._id,
                name: "Urban Denim Co",
                contactEmail: "urban-denim@mail.com",
                phone: "9000000002",
            },
        ]);

        /* tenant 2 */
        const tenant2 = await Tenant.create({ name: "Beta Stores" });

        const tenant2Users = [
            {
                tenantId: tenant2._id,
                name: "Beta Owner",
                email: "owner@beta.com",
                password: "owner123",
                role: "OWNER",
            },
            {
                tenantId: tenant2._id,
                name: "Beta Manager",
                email: "manager@beta.com",
                password: "manager123",
                role: "MANAGER",
            },
            {
                tenantId: tenant2._id,
                name: "Beta Staff",
                email: "staff@beta.com",
                password: "staff123",
                role: "STAFF",
            },
        ];

        for (const user of tenant2Users) {
            await User.create(user);
        }


        await Product.create([
            {
                tenantId: tenant2._id,
                name: "Women Top",
                description: "Summer tops",
                variants: [
                    {
                        sku: "TOP-W-S",
                        price: 399,
                        stock: 60,
                        reorderLevel: 10,
                        attributes: { size: "S", color: "Pink" },
                    },
                    {
                        sku: "TOP-W-M",
                        price: 399,
                        stock: 55,
                        reorderLevel: 10,
                        attributes: { size: "M", color: "Yellow" },
                    },
                ],
            },
            {
                tenantId: tenant2._id,
                name: "Women Jeans",
                description: "High waist jeans",
                variants: [
                    {
                        sku: "JEANS-W-28",
                        price: 1499,
                        stock: 20,
                        reorderLevel: 5,
                        attributes: { size: "28", color: "Blue" },
                    },
                    {
                        sku: "JEANS-W-30",
                        price: 1499,
                        stock: 18,
                        reorderLevel: 5,
                        attributes: { size: "30", color: "Black" },
                    },
                ],
            },
        ]);

        await Supplier.create([
            {
                tenantId: tenant2._id,
                name: "Beta Fashion Hub",
                contactEmail: "beta-fashion@mail.com",
                phone: "8478864747",
            },
            {
                tenantId: tenant2._id,
                name: "Style Wholesale",
                contactEmail: "style-wholesale@mail.com",
                phone: "9000000004",
            },
        ]);

        console.log("Database seeded successfully");
        process.exit(0);
    } catch (err) {
        console.error("Seed failed:", err);
        process.exit(1);
    }
};

seed();
