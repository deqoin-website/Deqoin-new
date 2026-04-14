import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import StudioCard from "@/models/StudioCard";

// Expected types: 'design', 'material', 'execution'
const DEFAULT_CARDS = [
  { 
    studioType: 'design', 
    title: 'Design Studio', 
    description: 'Mimari Tasarım', 
    icon: 'PenTool', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs', 
    order: 0 
  },
  { 
    studioType: 'material', 
    title: 'Material Studio', 
    description: 'Ürün ve Malzeme', 
    icon: 'Layers', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU', 
    order: 1 
  },
  { 
    studioType: 'execution', 
    title: 'Execution Studio', 
    description: 'Uygulama Hizmetleri', 
    icon: 'Hammer', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY', 
    order: 2 
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let cards = await StudioCard.find().sort({ order: 1 });
    
    // Seed if empty
    if (cards.length === 0) {
      cards = await StudioCard.insertMany(DEFAULT_CARDS);
    }

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Studio Cards GET error:", error);
    return NextResponse.json({ error: "Failed to fetch studio cards" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json(); // Expected an array of 3 cards or specific map

    // Batch update logic
    if (Array.isArray(data)) {
      const promises = data.map(card => 
        StudioCard.findOneAndUpdate(
          { studioType: card.studioType }, 
          card, 
          { upsert: true, new: true }
        )
      );
      const updated = await Promise.all(promises);
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  } catch (error) {
    console.error("Studio Cards PUT error:", error);
    return NextResponse.json({ error: "Failed to update studio cards" }, { status: 500 });
  }
}
