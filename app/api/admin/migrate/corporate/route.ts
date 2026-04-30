import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import CorporateContent from "@/models/CorporateContent";

const initialData = {
  page: 'about',
  title: "TASARIMDAN ÖTE:\nBÜTÜNSEL BİR DENEYİM",
  subtitle: "BİZ KİMİZ",
  description: "Bizler sadece fiziksel yapılar inşa etmiyor; tüm değerlerinizi ortaya koyan bütünsel bir deneyim kurguluyoruz. Tasarımın sadece estetik bir form değil, yaşam biçimini şekillendiren bir disiplin olduğuna inanıyoruz.",
  image: "/images/workflow/hakkimizda-home.png",
  stats: [
    { label: "DENEYİM", value: "10+ YIL" },
    { label: "TESLİM EDİLEN", value: "+240 PROJE" },
    { label: "UZMAN EKİP", value: "40+ KİŞİ" }
  ],
  sections: [
    {
      title: "KEŞİF VE ANALİZ",
      content: "Projenin ruhunu ve ihtiyaçlarını anlamak için derinlemesine bir analiz süreci yürütüyoruz."
    },
    {
      title: "KONSEPT TASARIM",
      content: "Analizlerden yola çıkarak, markanıza veya yaşam tarzınıza özel özgün konseptler geliştiriyoruz."
    },
    {
      title: "MİMARİ GELİŞTİRME",
      content: "Onaylanan konsepti, teknik disiplinler ve estetik detaylarla harmanlayarak projelendiriyoruz."
    },
    {
      title: "UYGULAMA VE TESLİM",
      content: "Yüksek kalite standartlarında, anahtar teslim uygulama süreci ile hayallerinizi gerçeğe dönüştürüyoruz."
    }
  ]
};

export async function GET() {
  try {
    await connectToDatabase();
    
    // Always upsert the initial data for 'about' page to ensure workflow is there
    const updated = await CorporateContent.findOneAndUpdate(
      { page: 'about' },
      { ...initialData, 'metadata.updatedAt': new Date() },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "About/Workflow data migrated successfully", 
      data: updated 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
