import mongoose from "mongoose";
import { config } from "dotenv";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const download = (url: string, filename: string) => {
    const dest = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) return; // skip if already good
    try {
        execSync(`curl -sL "${url}" -o "${dest}"`, { timeout: 15000 });
    } catch {
        console.warn(`  ⚠ Failed: ${filename}`);
    }
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=400&h=500&fit=crop`;

const products = [
    // Men
    { name: "Classic Oxford Shirt",      price: 1299, stock: 45, category: "men",         img: img("1620012253295-c15cc3e65df4") },
    { name: "Slim Fit Chinos",            price: 1899, stock: 30, category: "men",         img: img("1544441893-675973e31985") },
    { name: "Casual Linen Blazer",        price: 3499, stock: 15, category: "men",         img: img("1617137968427-85924c800a22") },
    { name: "Graphic Print Tee",          price:  699, stock: 80, category: "men",         img: img("1527719327859-c6ce80353573") },
    { name: "Denim Jacket",               price: 2799, stock: 20, category: "men",         img: img("1591047139829-d91aecb6caea") },

    // Women
    { name: "Floral Wrap Dress",          price: 1599, stock: 35, category: "women",       img: img("1515372039744-b8f02a3ae446") },
    { name: "High-Waist Trousers",        price: 1799, stock: 25, category: "women",       img: img("1506629082955-511b1aa562c8") },
    { name: "Crop Knit Sweater",          price: 1199, stock: 40, category: "women",       img: img("1434389677669-e08b4cac3105") },
    { name: "Pleated Midi Skirt",         price: 1099, stock: 50, category: "women",       img: img("1577900232427-18219b9166a0") },
    { name: "Oversized Blazer",           price: 3299, stock: 12, category: "women",       img: img("1555069519-127aadedf1ee") },

    // Kids
    { name: "Dinosaur Print Tee",         price:  499, stock: 60, category: "kids",        img: img("1476234251651-f353703a034d") },
    { name: "Denim Dungarees",            price:  899, stock: 40, category: "kids",        img: img("1518831959646-742c3a14ebf7") },
    { name: "Hooded Sweatshirt",          price:  749, stock: 55, category: "kids",        img: img("1522771930-78848d9293e8") },

    // Ethnic
    { name: "Embroidered Kurta",          price: 1499, stock: 30, category: "ethnic",      img: img("1596755094514-f87e34085b2c") },
    { name: "Banarasi Silk Saree",        price: 4999, stock:  8, category: "ethnic",      img: img("1610030469983-98e550d6193c") },
    { name: "Anarkali Suit Set",          price: 2999, stock: 18, category: "ethnic",      img: img("1617627143750-d86bc21e42bb") },
    { name: "Men's Nehru Jacket",         price: 1899, stock: 22, category: "ethnic",      img: img("1512436991641-6745cdb1723f") },

    // Western
    { name: "Distressed Skinny Jeans",    price: 1999, stock: 35, category: "western",     img: img("1475178626620-a4d074967452") },
    { name: "Ribbed Tank Top",            price:  599, stock: 70, category: "western",     img: img("1521572163474-6864f9cf17ab") },
    { name: "Leather Biker Jacket",       price: 5499, stock:  6, category: "western",     img: img("1521223890158-f9f7c3d5d504") },

    // Accessories
    { name: "Woven Tote Bag",             price:  899, stock: 50, category: "accessories", img: img("1548036328-c9fa89d128fa") },
    { name: "Tortoise Sunglasses",        price:  799, stock: 40, category: "accessories", img: img("1572635196237-14b3f281503f") },
    { name: "Leather Belt",              price:  649, stock: 60, category: "accessories", img: img("1624222247344-550fb60583dc") },

    // Footwear
    { name: "White Leather Sneakers",     price: 2299, stock: 25, category: "footwear",    img: img("1460353581641-37baddab0fa2") },
    { name: "Block Heel Sandals",         price: 1599, stock: 20, category: "footwear",    img: img("1543163521-1bf539c55dd2") },
    { name: "Chelsea Boots",              price: 3299, stock: 10, category: "footwear",    img: img("1516762689617-e1cffcef479d") },

    // Sale
    { name: "Summer Linen Shirt",         price:  799, stock: 90, category: "sale",        img: img("1617019114583-affb34d1b3cd") },
    { name: "Printed Maxi Dress",         price:  999, stock: 45, category: "sale",        img: img("1596783074918-c84cb06531ca") },
    { name: "Classic Polo Tee",           price:  549, stock:100, category: "sale",        img: img("1562157873-818bc0726f68") },
];

const { Product } = await import("./models/product.js");

await mongoose.connect(process.env.MONGO_URI!);
console.log("✓ Connected to MongoDB");

const existing = await Product.countDocuments();
if (existing > 0) {
    console.log(`  Clearing ${existing} existing products...`);
    await Product.deleteMany({});
}

console.log(`⬇  Downloading ${products.length} images...`);
const docs = products.map((p, i) => {
    const filename = `seed-${p.category}-${i + 1}.jpg`;
    download(p.img, filename);
    const size = fs.existsSync(path.join(UPLOADS_DIR, filename))
        ? fs.statSync(path.join(UPLOADS_DIR, filename)).size
        : 0;
    process.stdout.write(size > 1000 ? "✓" : "✗");
    return {
        name:         p.name,
        price:        p.price,
        stock:        p.stock,
        category:     p.category,
        photo:        `uploads/${filename}`,
        ratings:      0,
        numOfReviews: 0,
        reviews:      [],
    };
});

process.stdout.write("\n");

await Product.insertMany(docs);
console.log(`✓ Inserted ${docs.length} products`);

await mongoose.disconnect();
console.log("✓ Done! Start the backend with: npm run dev");
process.exit(0);
