import { NextResponse } from "next/server";
// import nodemailer from "nodemailer"; // npm install nodemailer

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

    // 1. Server-side Log (Terminal'den takibi kolaylaştırır)
    console.log("--- YENİ RANDEVU TALEBİ ---");
    console.log(`Müşteri: ${firstName} ${lastName}`);
    console.log(`İletişim: ${clientEmail} | ${phone}`);
    console.log(`Bölge: ${city} ${company ? `(${company})` : ""}`);
    console.log(`Hizmet: ${department} > ${subCategory}`);
    console.log(`Not: ${note}`);
    console.log("---------------------------");

    /**
     * GMAIL WORKSPACE ENTEGRASYONU İÇİN ÖRNEL YAPI
     * 
     * Not: Bu kodun çalışması için terminalde 'npm install nodemailer' çalıştırmalısınız.
     * Ayrıca .env dosyanızda GMAIL_USER ve GMAIL_PASS (Uygulama Şifresi) tanımlı olmalıdır.
     * 
     * const transporter = nodemailer.createTransport({
     *   service: "gmail",
     *   auth: {
     *     user: process.env.GMAIL_USER, // e.g. randevu@deqoin.com
     *     pass: process.env.GMAIL_PASS, // Google Uygulama Şifresi (App Password)
     *   },
     * });
     * 
     * const mailOptions = {
     *   from: '"Deqoin Web Form" <' + process.env.GMAIL_USER + '>',
     *   to: "randevu@deqoin.com",
     *   subject: `Yeni Randevu Talebi: ${firstName} ${lastName}`,
     *   html: `
     *     <div style="font-family: sans-serif; max-width: 600px;">
     *       <h2 style="color: #cca883;">Yeni Randevu Talebi</h2>
     *       <p><b>Ad Soyad:</b> ${firstName} ${lastName}</p>
     *       <p><b>E-Posta:</b> ${clientEmail}</p>
     *       <p><b>Telefon:</b> ${phone}</p>
     *       <p><b>Şehir:</b> ${city}</p>
     *       ${company ? `<p><b>Şirket:</b> ${company}</p>` : ""}
     *       <p><b>Departman:</b> ${department}</p>
     *       <p><b>Alt Dal:</b> ${subCategory}</p>
     *       <p><b>Not:</b></p>
     *       <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${note}</div>
     *     </div>
     *   `,
     * };
     * 
     * // UNCOMMENT TO ENABLE MAIL SENDING:
     * // await transporter.sendMail(mailOptions);
     * 
     */

    return NextResponse.json(
      { success: true, message: "Randevu talebiniz başarıyla alındı." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Appointment API Error:", error);
    return NextResponse.json(
      { success: false, message: "Talebiniz alınamadı, teknik bir hata oluştu." },
      { status: 500 }
    );
  }
}
