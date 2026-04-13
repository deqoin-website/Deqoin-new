import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email: clientEmail, 
      phone, 
      company, 
      city, 
      department, 
      subCategory, 
      note 
    } = body;

    // 1. Veritabanına Kayıt (CMS Admin Paneli İçin)
    await connectToDatabase();
    
    // Frontend'den gelen form alanlarını veritabanı modeline uygun haritalıyoruz
    const dbData = {
      name: firstName,
      surname: lastName,
      email: clientEmail,
      phone: phone,
      city: `${city} ${company ? `(${company})` : ""}`.trim(),
      interestedDepartment: `${department} - ${subCategory}`,
      projectDetails: note,
      status: "Yeni"
    };

    const newAppointment = await Appointment.create(dbData);
    
    console.log("--- YENİ RANDEVU TALEBİ CMS'E KAYDEDİLDİ ---", newAppointment._id);

    // 2. E-Posta Gönderim Hazırlığı (Nodemailer)
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("KRİTİK HATA: .env dosyasında GMAIL_USER veya GMAIL_PASS tanımlı değil!");
      throw new Error("E-posta sunucu yapılandırması (.env) eksik.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // 3. Bağlantıyı doğrula (isteğe bağlı ama hata ayıklama için iyi)
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("SMTP Connection Error:", verifyError);
      throw new Error("SMTP sunucusuna bağlanılamadı. Lütfen .env ayarlarını kontrol edin.");
    }

    const mailOptions = {
      from: `"Deqoin Web Form" <randevu@deqoin.com>`,
      to: "randevu@deqoin.com",
      replyTo: clientEmail,
      subject: `Yeni Randevu Talebi: ${firstName} ${lastName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Yeni Randevu Talebi</h2>
          <p style="margin: 10px 0;"><b>Müşteri:</b> ${firstName} ${lastName}</p>
          <p style="margin: 10px 0;"><b>E-Posta:</b> <a href="mailto:${clientEmail}">${clientEmail}</a></p>
          <p style="margin: 10px 0;"><b>Telefon:</b> <a href="tel:${phone}">${phone}</a></p>
          <p style="margin: 10px 0;"><b>Lokasyon:</b> ${city} ${company ? `(${company})` : ""}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="margin: 10px 0;"><b>Departman:</b> ${department}</p>
          <p style="margin: 10px 0;"><b>Alt Dal:</b> ${subCategory}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #000;">
            <p style="margin: 0; font-weight: bold; margin-bottom: 10px;">Müşteri Notu:</p>
            <p style="margin: 0; line-height: 1.6;">${note}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999;">Bu email Deqoin Web Sitesi randevu formu aracılığıyla otomatik olarak gönderilmiştir.</p>
        </div>
      `,
    };

    // E-postayı gönder
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Randevu talebiniz başarıyla alındı." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Appointment API Error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Talebiniz alınamadı, teknik bir hata oluştu. Lütfen randevu@deqoin.com üzerinden bizimle iletişime geçiniz." 
      },
      { status: 500 }
    );
  }
}
