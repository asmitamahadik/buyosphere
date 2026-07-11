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

const products = [
    // Men
    { name: "Classic Oxford Shirt",      price: 1299, stock: 45, category: "men",         img: "https://picsum.photos/seed/men1/400/500" },
    { name: "Slim Fit Chinos",            price: 1899, stock: 30, category: "men",         img: "https://picsum.photos/seed/men2/400/500" },
    { name: "Casual Linen Blazer",        price: 3499, stock: 15, category: "men",         img: "https://picsum.photos/seed/men3/400/500" },
    { name: "Graphic Print Tee",          price:  699, stock: 80, category: "men",         img: "https://picsum.photos/seed/men4/400/500" },
    { name: "Denim Jacket",               price: 2799, stock: 20, category: "men",         img: "https://picsum.photos/seed/men5/400/500" },

    // Women
    { name: "Floral Wrap Dress",          price: 1599, stock: 35, category: "women",       img: "https://picsum.photos/seed/women1/400/500" },
    { name: "High-Waist Trousers",        price: 1799, stock: 25, category: "women",       img: "https://picsum.photos/seed/women2/400/500" },
    { name: "Crop Knit Sweater",          price: 1199, stock: 40, category: "women",       img: "https://picsum.photos/seed/women3/400/500" },
    { name: "Pleated Midi Skirt",         price: 1099, stock: 50, category: "women",       img: "https://picsum.photos/seed/women4/400/500" },
    { name: "Oversized Blazer",           price: 3299, stock: 12, category: "women",       img: "https://picsum.photos/seed/women5/400/500" },

    // Kids
    { name: "Dinosaur Print Tee",         price:  499, stock: 60, category: "kids",        img: "https://picsum.photos/seed/kids1/400/500" },
    { name: "Denim Dungarees",            price:  899, stock: 40, category: "kids",        img: "https://picsum.photos/seed/kids2/400/500" },
    { name: "Hooded Sweatshirt",          price:  749, stock: 55, category: "kids",        img: "https://picsum.photos/seed/kids3/400/500" },

    // Ethnic
    { name: "Embroidered Kurta",          price: 1499, stock: 30, category: "ethnic",      img: "https://picsum.photos/seed/ethnic1/400/500" },
    { name: "Banarasi Silk Saree",        price: 4999, stock:  8, category: "ethnic",      img: "https://picsum.photos/seed/ethnic2/400/500" },
    { name: "Anarkali Suit Set",          price: 2999, stock: 18, category: "ethnic",      img: "https://picsum.photos/seed/ethnic3/400/500" },
    { name: "Men's Nehru Jacket",         price: 1899, stock: 22, category: "ethnic",      img: "https://picsum.photos/seed/ethnic4/400/500" },

    // Western
    { name: "Distressed Skinny Jeans",    price: 1999, stock: 35, category: "western",     img: "https://picsum.photos/seed/west1/400/500" },
    { name: "Ribbed Tank Top",            price:  599, stock: 70, category: "western",     img: "https://picsum.photos/seed/west2/400/500" },
    { name: "Leather Biker Jacket",       price: 5499, stock:  6, category: "western",     img: "https://picsum.photos/seed/west3/400/500" },

    // Accessories
    { name: "Woven Tote Bag",             price:  899, stock: 50, category: "accessories", img: "https://picsum.photos/seed/acc1/400/500" },
    { name: "Tortoise Sunglasses",        price:  799, stock: 40, category: "accessories", img: "https://picsum.photos/seed/acc2/400/500" },
    { name: "Leather Belt",              price:  649, stock: 60, category: "accessories", img: "https://picsum.photos/seed/acc3/400/500" },

    // Footwear
    { name: "White Leather Sneakers",     price: 2299, stock: 25, category: "footwear",    img: "https://picsum.photos/seed/foot1/400/500" },
    { name: "Block Heel Sandals",         price: 1599, stock: 20, category: "footwear",    img: "https://picsum.photos/seed/foot2/400/500" },
    { name: "Chelsea Boots",              price: 3299, stock: 10, category: "footwear",    img: "https://picsum.photos/seed/foot3/400/500" },

    // Sale
    { name: "Summer Linen Shirt",         price:  799, stock: 90, category: "sale",        img: "https://picsum.photos/seed/sale1/400/500" },
    { name: "Printed Maxi Dress",         price:  999, stock: 45, category: "sale",        img: "https://picsum.photos/seed/sale2/400/500" },
    { name: "Classic Polo Tee",           price:  549, stock:100, category: "sale",        img: "https://picsum.photos/seed/sale3/400/500" },
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
