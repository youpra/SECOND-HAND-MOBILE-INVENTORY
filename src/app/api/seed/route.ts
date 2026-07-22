import { getPayload } from "payload";
import config from "@/payload.config";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const mockCategories = [
  { name: "Mobile Phones", icon: "Smartphone", description: "Smartphones and cellular devices" },
  { name: "Laptops", icon: "Laptop", description: "Portable personal computers" },
  { name: "Tablets", icon: "Tablet", description: "Tablet computers and slates" },
  { name: "Smart Watches", icon: "Watch", description: "Wearables and smartwatches" },
  { name: "Earbuds", icon: "Headphones", description: "Wireless earbuds and headphones" },
  { name: "Gaming Consoles", icon: "Gamepad", description: "Home and handheld gaming consoles" },
  { name: "Cameras", icon: "Camera", description: "Digital cameras and lenses" },
  { name: "Accessories", icon: "Tv", description: "Chargers, cables, cases, and more" },
];

const mockBrands = [
  { name: "Apple", description: "Apple iOS and macOS products" },
  { name: "Samsung", description: "Samsung Android and Windows devices" },
  { name: "Google", description: "Google Pixel smartphones and accessories" },
  { name: "OnePlus", description: "OnePlus Android phones" },
  { name: "Sony", description: "Sony PlayStation, cameras, and audio gear" },
  { name: "Nintendo", description: "Nintendo Switch and handheld accessories" },
  { name: "Nothing", description: "Nothing Phone and Ear devices" },
];

export async function GET(request: NextRequest) {
  try {
    console.log("Seeding database via API...");
    const payload = await getPayload({ config });

    // 1. Seed Admin User
    const existingUsers = await payload.find({
      collection: "users",
      limit: 1,
    });

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: "users",
        data: {
          email: "admin@inventory.com",
          password: "password123",
        },
      });
      console.log("-> Created default admin: admin@inventory.com / password123");
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
      const existing = await payload.find({
        collection: "categories",
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        const created = await payload.create({
          collection: "categories",
          data: {
            name: cat.name,
            slug,
            icon: cat.icon,
            description: cat.description,
            image: mediaId,
            active: true,
          },
        });
        categoryMap[slug] = created.id as string;
      } else {
        categoryMap[slug] = existing.docs[0].id as string;
      }
    }

    // 4. Seed Brands
    const brandMap: { [key: string]: string } = {};
    for (const brand of mockBrands) {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existing = await payload.find({
        collection: "brands",
        where: { slug: { equals: slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
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
      } else {
        brandMap[slug] = existing.docs[0].id as string;
      }
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
        price: 649,
        originalLaunchPrice: 1099,
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
        price: 799,
        originalLaunchPrice: 1379,
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
        price: 720,
        originalLaunchPrice: 999,
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
      {
        title: 'MacBook Pro 14" M2 Pro - 16GB / 512GB',
        slug: "macbook-pro-14-m2-pro-16gb-512gb",
        brand: brandMap["apple"],
        model: 'MacBook Pro 14"',
        category: categoryMap["laptops"],
        status: "available",
        price: 1450,
        originalLaunchPrice: 1999,
        ram: "16 GB",
        storage: "512 GB",
        condition: "excellent",
        batteryHealth: 93,
        operatingSystem: "macOS Sonoma",
        color: "Space Gray",
        yearReleased: 2023,
        warrantyOption: "store-warranty",
        warrantyDuration: "6 Months",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: true,
          originalCable: true,
        },
        mainImage: mediaId,
        customFeatures: [
          { name: "Processor", value: "Apple M2 Pro (10-Core CPU, 16-Core GPU)", icon: "Cpu", enabled: true },
          { name: "Display Size", value: "14.2 Inch Liquid Retina XDR", icon: "Monitor", enabled: true },
          { name: "Battery Capacity", value: "70 Watt-hour Lithium Polymer", icon: "Battery", enabled: true },
        ],
        knownIssues: [
          {
            title: "Tiny Bottom Case Dent",
            severity: "light",
            description: "Microscopic cosmetic indentation on the base aluminum cover, strictly cosmetic.",
            icon: "AlertTriangle",
          },
        ],
        viewCount: 110,
        whatsappClickCount: 18,
        callClickCount: 3,
      },
      {
        title: "Sony Alpha 7 IV - Mirrorless Camera (Body Only)",
        slug: "sony-alpha-7-iv-mirrorless-camera-body-only",
        brand: brandMap["sony"],
        model: "Alpha 7 IV",
        category: categoryMap["cameras"],
        status: "coming-soon",
        price: 1899,
        originalLaunchPrice: 2499,
        condition: "like-new",
        color: "Black",
        yearReleased: 2021,
        warrantyOption: "seller-warranty",
        warrantyDuration: "30 Days",
        boxAndAccessories: {
          invoiceAvailable: true,
          boxAvailable: true,
          originalCharger: true,
          originalCable: true,
          accessoriesIncluded: "Original neck strap, camera body cap, 1x battery",
        },
        mainImage: mediaId,
        customFeatures: [
          { name: "Sensor", value: "33 MP Full-Frame Exmor R CMOS", icon: "Camera", enabled: true },
          { name: "Stabilization", value: "5-axis In-body Image Stabilization", icon: "Activity", enabled: true },
          { name: "Auto Focus", value: "Real-time Eye AF for Humans/Animals", icon: "Eye", enabled: true },
        ],
        knownIssues: [],
        viewCount: 88,
        whatsappClickCount: 5,
        callClickCount: 0,
      },
    ];

    for (const prod of products) {
      const existing = await payload.find({
        collection: "products",
        where: { slug: { equals: prod.slug } },
        limit: 1,
      });

      if (existing.docs.length === 0) {
        await payload.create({
          collection: "products",
          data: prod,
        });
        console.log(`-> Created product: ${prod.title}`);
      }
    }

    // 6. Seed Global Settings
    const settings = await payload.findGlobal({
      slug: "settings",
    });

    if (!settings.whatsappNumber) {
      await payload.updateGlobal({
        slug: "settings",
        data: {
          siteName: "SecondHand Electronics",
          whatsappNumber: "+919876543210",
          contactPhoneNumber: "+919876543210",
          seoTitle: "Modern Second-Hand Electronics Inventory",
          seoDescription: "Browse available, reserved, and sold used mobile phones, laptops, and tablets directly.",
          logo: mediaId,
        },
      });
      console.log("-> Seeded default global Settings.");
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (err: any) {
    console.error("Seeding API failed: ", err);
    return NextResponse.json({ success: false, error: err?.message || err }, { status: 500 });
  }
}
