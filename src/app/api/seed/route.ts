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
];

export async function GET(request: NextRequest) {
  try {
    console.log("Seeding database via API...");
    const payload = await getPayload({ config });

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

    // 2. Seed Media Placeholder
    const existingMedia = await payload.find({
      collection: "media",
      where: {
        alt: { equals: "Placeholder Image" },
      },
      limit: 1,
    });

    let mediaId: string;
    if (existingMedia.docs.length === 0) {
      const filePath = path.resolve(process.cwd(), "public/media/placeholder.jpg");
      const fileBuffer = fs.readFileSync(filePath);

      const media = await payload.create({
        collection: "media",
        data: {
          alt: "Placeholder Image",
        },
        file: {
          data: fileBuffer,
          name: "placeholder.jpg",
          mimetype: "image/jpeg",
          size: fileBuffer.length,
        },
      });
      mediaId = media.id as string;
      console.log("-> Created default media placeholder.");
    } else {
      mediaId = existingMedia.docs[0].id as string;
    }

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
          image: mediaId,
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
          logo: mediaId,
          featured: true,
        },
      });
      brandMap[slug] = created.id as string;
      console.log(`-> Created brand: ${brand.name}`);
    }

    // 5. Seed Products
    const products = [
      {
        title: "iPhone 13 Pro Max - 256GB - Sierra Blue",
        slug: "iphone-13-pro-max-256gb-sierra-blue",
        brand: brandMap["apple"],
        model: "iPhone 13 Pro Max",
        category: categoryMap["mobile-phones"],
        status: "available",
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
        mainImage: mediaId,
        customFeatures: [
          { name: "Screen Size", value: "6.7 Inches", icon: "Maximize2", enabled: true },
          { name: "Refresh Rate", value: "120 Hz ProMotion", icon: "Activity", enabled: true },
          { name: "Connector", value: "Lightning Port", icon: "Zap", enabled: true },
        ],
        knownIssues: [
          {
            title: "Hairline Scratch",
            severity: "light",
            description: "Minor hairline scratch on top bezel, invisible with screen protector.",
            icon: "AlertTriangle",
          },
          {
            title: "Slight Battery Drain",
            severity: "light",
            description: "Battery health is at 87%. Holds charge for full day, but drains slightly quicker under gaming.",
            icon: "Battery",
          },
        ],
        viewCount: 125,
        whatsappClickCount: 14,
        callClickCount: 2,
      },
      {
        title: "Samsung Galaxy S23 Ultra - 512GB - Phantom Black",
        slug: "samsung-galaxy-s23-ultra-512gb-phantom-black",
        brand: brandMap["samsung"],
        model: "Galaxy S23 Ultra",
        category: categoryMap["mobile-phones"],
        status: "reserved",
        price: 67000,
        originalLaunchPrice: 124000,
        ram: "12 GB",
        storage: "512 GB",
        condition: "like-new",
        batteryHealth: 95,
        operatingSystem: "Android 14",
        color: "Phantom Black",
        networkLock: "factory-unlocked",
        dualSim: true,
        is5g: true,
        yearReleased: 2023,
        warrantyOption: "manufacturer-warranty",
        warrantyDuration: "4 Months remaining",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: true,
          originalCable: true,
          accessoriesIncluded: "Original S-Pen",
        },
        mainImage: mediaId,
        customFeatures: [
          { name: "Screen Size", value: "6.8 Inches Dynamic AMOLED", icon: "Maximize2", enabled: true },
          { name: "Camera Megapixels", value: "200 MP Main Camera", icon: "Camera", enabled: true },
          { name: "Stylus Support", value: "Embedded S-Pen with remote controls", icon: "Wrench", enabled: true },
        ],
        knownIssues: [],
        viewCount: 245,
        whatsappClickCount: 45,
        callClickCount: 8,
      },
      {
        title: "iPhone 14 Pro - 128GB - Space Black",
        slug: "iphone-14-pro-128gb-space-black",
        brand: brandMap["apple"],
        model: "iPhone 14 Pro",
        category: categoryMap["mobile-phones"],
        status: "sold",
        price: 61000,
        originalLaunchPrice: 119000,
        ram: "6 GB",
        storage: "128 GB",
        condition: "good",
        batteryHealth: 83,
        operatingSystem: "iOS 17",
        color: "Space Black",
        networkLock: "unlocked",
        dualSim: false,
        is5g: true,
        yearReleased: 2022,
        warrantyOption: "no-warranty",
        boxAndAccessories: {
          invoiceAvailable: false,
          boxAvailable: true,
          originalCharger: false,
          originalCable: false,
          accessoriesIncluded: "Black protective cover",
        },
        mainImage: mediaId,
        customFeatures: [
          { name: "Screen Size", value: "6.1 Inches Super Retina XDR", icon: "Maximize2", enabled: true },
          { name: "Dynamic Island", value: "Interactive punch-hole alerts", icon: "Smartphone", enabled: true },
        ],
        knownIssues: [
          {
            title: "Minor Scratch on Screen",
            severity: "medium",
            description: "Two small surface scratches on the screen, not deep, hidden completely under a screen protector.",
            icon: "AlertTriangle",
          },
        ],
        viewCount: 420,
        whatsappClickCount: 89,
        callClickCount: 15,
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
        siteName: "Mobile Repairing & Inventory",
        whatsappNumber: "+919876543210",
        contactPhoneNumber: "+919876543210",
        seoTitle: "Second-Hand Mobiles & Expert Repairing",
        seoDescription: "Browse verified pre-owned smartphones and book high-quality repairing services online.",
        logo: mediaId,
      },
    });
    console.log("-> Updated global settings.");

    return NextResponse.json({
      success: true,
      message: "Database wiped and seeded with Mobile Phones only successfully!",
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
