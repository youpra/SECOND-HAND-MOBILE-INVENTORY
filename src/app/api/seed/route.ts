import { getPayload } from "payload";
import config from "@/payload.config";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const mockCategories = [
  { name: "Mobile Phones", icon: "Smartphone", description: "Smartphones and cellular devices" },
];

const mockBrands = [
  { name: "Apple", description: "Apple iOS devices" },
  { name: "Samsung", description: "Samsung Android devices" },
  { name: "Google", description: "Google Pixel smartphones" },
  { name: "OnePlus", description: "OnePlus Android phones" },
  { name: "Nothing", description: "Nothing Phone devices" },
  { name: "Vivo", description: "Vivo smartphones" },
];

export async function GET(request: NextRequest) {
  try {
    console.log("Seeding database via API...");
    const payload = await getPayload({ config });

    // Ensure youtube_shorts_url column exists in the database
    try {
      console.log("Running dynamic DB schema alignment for youtube_shorts_url...");
      const db = payload.db as any;
      if (db.pool) {
        await db.pool.query('ALTER TABLE "products" add column if not exists "youtube_shorts_url" text;');
        console.log("-> Synced schema column using Pool.");
      } else if (db.drizzle) {
        await db.drizzle.execute('ALTER TABLE "products" add column if not exists "youtube_shorts_url" text;');
        console.log("-> Synced schema column using Drizzle.");
      }
    } catch (dbErr) {
      console.warn("Schema alignment warning (might already exist):", dbErr);
    }

    // 0. WIPE OLD DATA FOR RE-SEEDING (to enforce mobile-only constraint)
    console.log("Wiping existing products, categories, and brands...");
    await payload.delete({
      collection: "products",
      where: { id: { exists: true } },
    });
    await payload.delete({
      collection: "categories",
      where: { id: { exists: true } },
    });
    await payload.delete({
      collection: "brands",
      where: { id: { exists: true } },
    });

    // 1. Seed Admin User
    const existingAdmin = await payload.find({
      collection: "users",
      where: {
        email: { equals: "admin@inventory.com" },
      },
      limit: 1,
    });

    if (existingAdmin.docs.length === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: "admin@inventory.com",
          password: "password123",
        },
      });
      console.log("-> Created default admin: admin@inventory.com / password123");
    } else {
      await payload.update({
        collection: "users",
        id: existingAdmin.docs[0].id,
        data: {
          password: "password123",
        },
      });
      console.log("-> Reset default admin password to password123");
    }

    // 2. Helper to Seed Media files
    const uploadMedia = async (fileName: string, altText: string) => {
      const existing = await payload.find({
        collection: "media",
        where: {
          alt: { equals: altText },
        },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        return existing.docs[0].id as string;
      }

      const filePath = path.resolve(process.cwd(), `public/media/${fileName}`);
      if (!fs.existsSync(filePath)) {
        // Fallback to placeholder if file doesn't exist
        const fallbackPath = path.resolve(process.cwd(), "public/media/placeholder.jpg");
        const fileBuffer = fs.readFileSync(fallbackPath);
        const media = await payload.create({
          collection: "media",
          data: { alt: altText },
          file: {
            data: fileBuffer,
            name: "placeholder.jpg",
            mimetype: "image/jpeg",
            size: fileBuffer.length,
          },
        });
        return media.id as string;
      }

      const fileBuffer = fs.readFileSync(filePath);
      const media = await payload.create({
        collection: "media",
        data: { alt: altText },
        file: {
          data: fileBuffer,
          name: fileName,
          mimetype: "image/jpeg",
          size: fileBuffer.length,
        },
      });
      return media.id as string;
    };

    // Upload specific images
    const vivoT5xId = await uploadMedia("vivo_t5x_5g.jpg", "Vivo T5x 5G Image");
    const iphone15ProId = await uploadMedia("iphone_15_pro.jpg", "iPhone 15 Pro Image");
    const samsungS24UltraId = await uploadMedia("samsung_s24_ultra.jpg", "Samsung S24 Ultra Image");
    const placeholderId = await uploadMedia("placeholder.jpg", "Placeholder Image");
    const logoId = await uploadMedia("logo.png", "RITCHIE STREET Logo");

    // 3. Seed Categories
    const categoryMap: { [key: string]: string } = {};
    for (const cat of mockCategories) {
      const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await payload.create({
        collection: "categories",
        data: {
          name: cat.name,
          slug,
          icon: cat.icon,
          description: cat.description,
          image: placeholderId,
        },
      });
      categoryMap[slug] = created.id as string;
      console.log(`-> Created category: ${cat.name}`);
    }

    // 4. Seed Brands
    const brandMap: { [key: string]: string } = {};
    for (const brand of mockBrands) {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const created = await payload.create({
        collection: "brands",
        data: {
          name: brand.name,
          slug,
          description: brand.description,
          logo: placeholderId,
          featured: true,
        },
      });
      brandMap[slug] = created.id as string;
      console.log(`-> Created brand: ${brand.name}`);
    }

    // 5. Seed Products
    const products = [
      {
        title: "Vivo T5x 5G - 128GB - Olive Green",
        slug: "vivo-t5x-5g-128gb-olive-green",
        brand: brandMap["vivo"],
        model: "T5x 5G",
        category: categoryMap["mobile-phones"],
        status: "available",
        price: 12499,
        originalLaunchPrice: 17999,
        ram: "6 GB",
        storage: "128 GB",
        condition: "like-new",
        batteryHealth: 98,
        operatingSystem: "Android 14",
        color: "Olive Green",
        networkLock: "unlocked",
        dualSim: true,
        is5g: true,
        yearReleased: 2024,
        warrantyOption: "manufacturer-warranty",
        warrantyDuration: "8 Months remaining",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: true,
          originalCable: true,
          accessoriesIncluded: "Original retail box, protective gel case",
        },
        mainImage: vivoT5xId,
        customFeatures: [
          { name: "Battery Capacity", value: "7200 mAh Biggest Battery", icon: "Battery", enabled: true },
          { name: "Dust & Water", value: "IP68/IP69+ Resistance", icon: "Shield", enabled: true },
          { name: "Processor", value: "Snapdragon 6 Gen 1", icon: "Cpu", enabled: true },
        ],
        knownIssues: [],
        viewCount: 524,
        whatsappClickCount: 122,
        callClickCount: 18,
      },
      {
        title: "iPhone 15 Pro - 256GB - Natural Titanium",
        slug: "iphone-15-pro-256gb-natural-titanium",
        brand: brandMap["apple"],
        model: "iPhone 15 Pro",
        category: categoryMap["mobile-phones"],
        status: "available",
        price: 94000,
        originalLaunchPrice: 134900,
        ram: "8 GB",
        storage: "256 GB",
        condition: "excellent",
        batteryHealth: 91,
        operatingSystem: "iOS 17",
        color: "Natural Titanium",
        networkLock: "unlocked",
        dualSim: false,
        is5g: true,
        yearReleased: 2023,
        warrantyOption: "store-warranty",
        warrantyDuration: "6 Months",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: false,
          originalCable: true,
        },
        mainImage: iphone15ProId,
        customFeatures: [
          { name: "Processor", value: "Apple A17 Pro (3nm)", icon: "Cpu", enabled: true },
          { name: "Material", value: "Aerospace-grade Titanium design", icon: "Shield", enabled: true },
          { name: "Connector", value: "USB-C charging connector", icon: "Zap", enabled: true },
        ],
        knownIssues: [
          {
            title: "Micro Scratches on Frame",
            severity: "light",
            description: "A few minor cosmetic scuffs on the lower titanium bezel, invisible in daily use.",
            icon: "AlertTriangle",
          },
        ],
        viewCount: 185,
        whatsappClickCount: 39,
        callClickCount: 5,
      },
      {
        title: "Samsung Galaxy S24 Ultra - 512GB - Titanium Yellow",
        slug: "samsung-galaxy-s24-ultra-512gb-titanium-yellow",
        brand: brandMap["samsung"],
        model: "Galaxy S24 Ultra",
        category: categoryMap["mobile-phones"],
        status: "reserved",
        price: 88000,
        originalLaunchPrice: 139900,
        ram: "12 GB",
        storage: "512 GB",
        condition: "like-new",
        batteryHealth: 99,
        operatingSystem: "Android 14",
        color: "Titanium Yellow",
        networkLock: "factory-unlocked",
        dualSim: true,
        is5g: true,
        yearReleased: 2024,
        warrantyOption: "manufacturer-warranty",
        warrantyDuration: "10 Months remaining",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: true,
          originalCable: true,
          accessoriesIncluded: "Original S-Pen",
        },
        mainImage: samsungS24UltraId,
        customFeatures: [
          { name: "AI Features", value: "Galaxy AI translation & edit", icon: "Sparkles", enabled: true },
          { name: "Stylus", value: "Embedded S-Pen stylus included", icon: "Wrench", enabled: true },
        ],
        knownIssues: [],
        viewCount: 312,
        whatsappClickCount: 68,
        callClickCount: 9,
      },
      {
        title: "iPhone 13 Pro Max - 256GB - Sierra Blue",
        slug: "iphone-13-pro-max-256gb-sierra-blue",
        brand: brandMap["apple"],
        model: "iPhone 13 Pro Max",
        category: categoryMap["mobile-phones"],
        status: "sold",
        price: 54000,
        originalLaunchPrice: 129000,
        ram: "6 GB",
        storage: "256 GB",
        condition: "excellent",
        batteryHealth: 87,
        operatingSystem: "iOS 17",
        color: "Sierra Blue",
        networkLock: "unlocked",
        dualSim: false,
        is5g: true,
        yearReleased: 2021,
        warrantyOption: "store-warranty",
        warrantyDuration: "3 Months",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: false,
          originalCable: true,
          accessoriesIncluded: "Tempered glass pre-applied, transparent case",
        },
        mainImage: placeholderId,
        customFeatures: [
          { name: "Screen Size", value: "6.7 Inches", icon: "Maximize2", enabled: true },
          { name: "Refresh Rate", value: "120 Hz ProMotion", icon: "Activity", enabled: true },
        ],
        knownIssues: [
          {
            title: "Hairline Scratch",
            severity: "light",
            description: "Minor hairline scratch on top bezel, invisible with screen protector.",
            icon: "AlertTriangle",
          },
        ],
        viewCount: 125,
        whatsappClickCount: 14,
        callClickCount: 2,
      },
    ];

    for (const prod of products) {
      await payload.create({
        collection: "products",
        data: prod,
      });
      console.log(`-> Created product: ${prod.title}`);
    }

    // 6. Seed Global Settings
    await payload.updateGlobal({
      slug: "settings",
      data: {
        siteName: "RITCHIE STREET",
        whatsappNumber: "+919876543210",
        contactPhoneNumber: "+919876543210",
        seoTitle: "Ritchie Street - Second-Hand Mobiles & Repairs",
        seoDescription: "Ritchie Street is your trusted destination for verified pre-owned smartphones and premium repairing services.",
        logo: logoId,
      },
    });
    console.log("-> Updated global settings.");

    return NextResponse.json({
      success: true,
      message: "Database wiped and seeded with Mobile Phones and real images successfully!",
    });
  } catch (err: any) {
    console.error("Seeding failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || err,
      },
      { status: 500 }
    );
  }
}
