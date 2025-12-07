import dbConnect from "@/lib/db";
import Account from "@/models/Account";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_PIN = process.env.ADMIN_PIN; // .env se PIN uthaya

// --- SECURITY CHECK FUNCTION ---
const isAuthorized = (request) => {
  // Header se PIN check karenge
  const authHeader = request.headers.get("x-vault-pin");
  return authHeader === ADMIN_PIN;
};

// 1. GET Request
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Access Denied: Wrong PIN" }, { status: 401 });
  }

  await dbConnect();
  try {
    const accounts = await Account.find({});
    const decryptedAccounts = accounts.map(acc => {
      const bytes = CryptoJS.AES.decrypt(acc.password, SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
      return { ...acc._doc, password: originalPassword };
    });
    return NextResponse.json({ success: true, data: decryptedAccounts });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// 2. POST Request
export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Access Denied" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const encryptedPassword = CryptoJS.AES.encrypt(body.password, SECRET_KEY).toString();
    const account = await Account.create({
        platform: body.platform,
        username: body.username,
        password: encryptedPassword
    });
    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// 3. DELETE Request
export async function DELETE(request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: "Access Denied" }, { status: 401 });
    }
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if(id) {
        await Account.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    }
    return NextResponse.json({ message: "ID missing" }, { status: 400 });
}

// 4. PUT Request
export async function PUT(request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ message: "Access Denied" }, { status: 401 });
    }
    await dbConnect();
    try {
      const body = await request.json();
      const { id, platform, username, password } = body;
      const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
      const updatedAccount = await Account.findByIdAndUpdate(
        id,
        { platform, username, password: encryptedPassword },
        { new: true }
      );
      return NextResponse.json({ success: true, data: updatedAccount });
    } catch (error) {
    // Ye line add karo taki terminal me error dikhe
    console.error("SERVER ERROR AA GAYA BHAI:", error); 
    
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
  }