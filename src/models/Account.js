import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String, // यहाँ हम Encrypted Password रखेंगे
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);