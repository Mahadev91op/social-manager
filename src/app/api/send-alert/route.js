import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userAgent, time, locationData, photo, intruderName, intruderEmail } = body;

    // Location Data
    const city = locationData?.city || "Unknown";
    const country = locationData?.country_name || "Unknown";
    const ip = locationData?.ip || "Unknown";
    const mapsLink = `https://www.google.com/maps?q=${locationData?.latitude},${locationData?.longitude}`;

    // --- PHOTO ATTACHMENT LOGIC ---
    let attachments = [];
    if (photo) {
        const base64Data = photo.split("base64,")[1];
        attachments.push({
            filename: 'intruder_face.png',
            content: base64Data,
            encoding: 'base64'
        });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false }
    });

    // --- EMAIL HTML ---
    const mailOptions = {
      from: `"DevSamp Security" <${process.env.EMAIL_USER}>`,
      to: process.env.ALERT_RECEIVER,
      subject: `🚨 INTRUDER IDENTITY: ${intruderName || "Unknown"}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #333; border-radius: 8px; overflow: hidden; background: #000; color: #fff;">
          <div style="background-color: #d32f2f; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🚨 Intruder Details Captured</h1>
          </div>
          
          <div style="padding: 20px;">
            <h3 style="color: #ff4444;">👤 IDENTITY REVEALED:</h3>
            <table style="width: 100%; border-collapse: collapse; color: #ddd;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #444;"><strong>Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #444; font-size: 18px; font-weight: bold; color: #fff;">${intruderName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #444;"><strong>Email:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #444; color: #4dabf7;">${intruderEmail}</td>
              </tr>
            </table>

            <h3 style="color: #ff4444; margin-top: 20px;">📍 TECHNICAL DATA:</h3>
            <table style="width: 100%; border-collapse: collapse; color: #ddd;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #444;">Location:</td>
                <td style="padding: 8px; border-bottom: 1px solid #444;">${city}, ${country}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #444;">IP Address:</td>
                <td style="padding: 8px; border-bottom: 1px solid #444;">${ip}</td>
              </tr>
               <tr>
                <td style="padding: 8px; border-bottom: 1px solid #444;">Time:</td>
                <td style="padding: 8px; border-bottom: 1px solid #444;">${time}</td>
              </tr>
            </table>

            <div style="margin-top: 25px; text-align: center;">
               <a href="${mapsLink}" style="background-color: #d32f2f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">See Location on Map</a>
            </div>
          </div>
        </div>
      `,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}