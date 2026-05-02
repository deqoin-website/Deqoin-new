import mongoose from "mongoose";
import { productSeeds } from "./material-catalog-seed.mjs";

const MONGODB_URI = process.env.MONGODB_URI;

const departmentSeeds = {
  mobilya: {
    title: "Mobilya",
    sideLabel: "Bespoke Furniture",
    description: "Tasarlanan mekanın ruhuna uygun, malzeme ve formun kusursuz uyumuyla üretilen özel mobilya koleksiyonumuz.",
    image: "/images/projects/gallery_1.png",
    sliderImages: [
      "/images/projects/gallery_1.png",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "SALON GRUBU", value: "salon-grubu" },
      { label: "YATAK ODASI", value: "yatak-odasi" },
    ],
  },
  aydinlatma: {
    title: "Aydınlatma",
    sideLabel: "Light Atmosphere",
    description: "Mekanın hiyerarşisini ve derinliğini yöneten, atmosferik ve heykelsi aydınlatma tasarımları.",
    image: "/images/projects/gallery_4.png",
    sliderImages: [
      "/images/projects/gallery_4.png",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "TEKNİK AYDINLATMA", value: "teknik" },
      { label: "MİMARİ AYDINLATMA", value: "mimari-isik" },
    ],
  },
  "italyan-sivalar": {
    title: "İtalyan Sıvalar",
    sideLabel: "High-End Texture",
    description: "Duvarları birer sanat eserine dönüştüren, dokulu ve derinlikli İtalyan sıva uygulamaları.",
    image: "/images/projects/gallery_1.png",
    sliderImages: [
      "/images/projects/gallery_1.png",
      "https://images.unsplash.com/photo-1518193005634-9343360b37cd?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "BETON DOKULU", value: "beton" },
      { label: "METALİK YÜZEYLER", value: "metalik" },
    ],
  },
  "dekoratif-boyalar": {
    title: "Dekoratif Boyalar",
    sideLabel: "Paint & Mood",
    description: "Mekanın karakterini belirleyen, derin tonlu ve yüksek kaliteli dekoratif boya sistemleri.",
    image: "/images/projects/gallery_2.png",
    sliderImages: [
      "/images/projects/gallery_2.png",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "MATTE FINISH", value: "matte" },
      { label: "SATEN DOKU", value: "satin" },
    ],
  },
  "mikro-cimento": {
    title: "Mikro Çimento",
    sideLabel: "Seamless Surface",
    description: "Derzsiz, modern ve dayanıklı yüzeylerle kesintisiz mekan deneyimi sunan mikro çimento çözümleri.",
    image: "/images/projects/gallery_3.png",
    sliderImages: [
      "/images/projects/gallery_3.png",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
    ],
    categories: [
      { label: "DUŞ ALANI", value: "dus" },
      { label: "ZEMİN", value: "zemin" },
    ],
  },
  "sanatsal-calismalar": {
    title: "Sanatsal Çalışmalar",
    sideLabel: "Creative Soul",
    description: "Projelerimize özel olarak kurgulanan resim, heykel ve enstalasyon gibi sanatsal dokunuşlar.",
    image: "/images/about_interior.png",
    sliderImages: [
      "/images/about_interior.png",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "RESİM & TUVAL", value: "resim" },
      { label: "HEYKEL & FORM", value: "heykel" },
    ],
  },
  "tugla-ve-tas": {
    title: "Tuğla ve Taş",
    sideLabel: "Timeless Earth",
    description: "Doğanın ham gücünü modern mimarlığa entegre eden, karakter sahibi tuğla ve doğal taş seçkilerimiz.",
    image: "/images/projects/gallery_1.png",
    sliderImages: [
      "/images/projects/gallery_1.png",
      "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
    ],
    categories: [
      { label: "DOĞAL TAŞ", value: "dogal-tas" },
      { label: "ANTİK TUĞLA", value: "antik-tugla" },
    ],
  },
};

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }

  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const collection = mongoose.connection.db.collection("departments");

  for (const [slug, products] of Object.entries(productSeeds)) {
    const meta = departmentSeeds[slug] || {
      title: slug,
      sideLabel: "Material Studio",
      description: "",
      image: "",
      sliderImages: [],
      categories: [],
    };

    const normalizedProducts = products.map((product) => ({
      ...product,
      categorySlug: slug,
    }));

    const existing = await collection.findOne({ slug });
    if (existing) {
      await collection.updateOne(
        { slug },
        {
          $set: {
            products: normalizedProducts,
            updatedAt: new Date(),
          },
        },
      );
    } else {
      await collection.insertOne({
        slug,
        title: meta.title,
        sideLabel: meta.sideLabel,
        description: meta.description,
        image: meta.image,
        mediaType: "image",
        heroBlur: 0,
        heroOverlay: 30,
        sliderImages: meta.sliderImages,
        process: [],
        focusAreas: [],
        categories: meta.categories,
        products: normalizedProducts,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log(`MIGRATED ${slug} ${normalizedProducts.length}`);
  }

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
